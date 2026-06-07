import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, UserProfile, RiskLevel } from "../types";

import { Language } from "../translations";
import { PRODUCTS, INGREDIENT_HAZARDS, CONDITION_MAP } from "./localDb";

const apiKey = (typeof process !== "undefined" ? process.env?.GEMINI_API_KEY : "") || "";
const ai = new GoogleGenAI({ apiKey });

const DEFAULT_MODEL = "gemini-3.1-flash-lite";
const apiModel = (typeof process !== "undefined" ? process.env?.GEMINI_API_MODEL : "") || DEFAULT_MODEL;

// 이미지를 서버로 보내기 전, 아주 빠르게 크기를 줄여서 전송 속도를 극대화합니다.
async function fastResize(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 512; // Further optimized for speed while maintaining text legibility
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Quality reduced to 0.4 for lightning-fast transmission
        resolve(canvas.toDataURL("image/jpeg", 0.4).split(",")[1]);
      };
      img.onerror = () => reject(new Error("Image load error"));
    };
    reader.onerror = () => reject(new Error("File read error"));
  });
}

export async function analyzeProduct(
  profile: UserProfile,
  imageFile?: File,
  productText?: string,
  language: Language = 'ko'
): Promise<AnalysisResult> {
  // 1. Perform offline local search first if productText is provided
  if (productText) {
    const textToMatch = productText.trim().toLowerCase();

    // Try to find a product in the local database that matches the name
    const matchedProduct = PRODUCTS.find((p) =>
      p.names.some((name) => {
        const n = name.toLowerCase();
        return textToMatch.includes(n) || n.includes(textToMatch);
      })
    );

    // Identify hazards and detect ingredients
    const detectedIngredients: string[] = [];
    const matchedHazards: {
      ingredient: string;
      level: 'SAFE' | 'CAUTION' | 'DANGER';
      warning: { summary: string; details: string };
    }[] = [];

    for (const ingredientHazard of INGREDIENT_HAZARDS) {
      const isNameMatched = ingredientHazard.names.some((alias) => {
        const a = alias.toLowerCase();
        if (textToMatch.includes(a)) return true;
        if (
          matchedProduct &&
          matchedProduct.ingredients.some((ing) => {
            const i = ing.toLowerCase();
            return i.includes(a) || a.includes(i);
          })
        ) {
          return true;
        }
        return false;
      });

      if (isNameMatched) {
        // Resolve a display name for the ingredient in the current language
        const displayName =
          language === "ko"
            ? ingredientHazard.names.find((n) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(n)) ||
              ingredientHazard.names[0]
            : ingredientHazard.names.find((n) => !/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(n)) ||
              ingredientHazard.names[0];

        if (!detectedIngredients.includes(displayName)) {
          detectedIngredients.push(displayName);
        }

        for (const hazard of ingredientHazard.hazards) {
          const matchesUserCondition = profile.conditions.some((userCond) => {
            const synonyms = CONDITION_MAP[hazard.condition] || [];
            const normalizedUserCond = userCond.toLowerCase().trim();
            return synonyms.some((syn) => {
              const s = syn.toLowerCase();
              return normalizedUserCond.includes(s) || s.includes(normalizedUserCond);
            });
          });

          if (matchesUserCondition) {
            matchedHazards.push({
              ingredient: displayName,
              level: hazard.level,
              warning: hazard.warnings[language],
            });
          }
        }
      }
    }

    // A local match is found if we matched a product, or if we detected any hazardous ingredients in the text
    const hasLocalMatch = !!matchedProduct || detectedIngredients.length > 0;

    if (hasLocalMatch) {
      // Determine overall risk level based on hazards matched against user conditions
      let finalLevel: RiskLevel = 'SAFE';
      if (matchedHazards.some((h) => h.level === 'DANGER')) {
        finalLevel = 'DANGER';
      } else if (matchedHazards.some((h) => h.level === 'CAUTION')) {
        finalLevel = 'CAUTION';
      }

      // Generate summary and details in the appropriate language
      let summary = "";
      let details = "";

      if (matchedHazards.length > 0) {
        summary = matchedHazards.map((h) => h.warning.summary).join(" / ");
        details = matchedHazards
          .map((h) => `${h.ingredient}: ${h.warning.details}`)
          .join("\n\n");
      } else {
        if (language === "ko") {
          summary = "안전: 사용자의 건강 상태와 충돌하는 성분이 발견되지 않았습니다.";
          details = "본 제품의 성분을 분석한 결과, 등록하신 건강 상태에 저해되는 유해 물질이 검출되지 않았습니다. 안심하고 사용하셔도 좋습니다.";
        } else {
          summary = "Safe: No ingredients matching your health conditions were detected.";
          details = "Analysis of this product shows no hazardous ingredients that conflict with your registered health profile. You can use it safely.";
        }
      }

      // Prepare list of ingredients
      let ingredientsList: string[] = [];
      if (matchedProduct) {
        ingredientsList = matchedProduct.ingredients.filter((ing) => {
          const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(ing);
          return language === "ko" ? hasKorean : !hasKorean;
        });
      } else {
        ingredientsList = detectedIngredients;
      }

      return {
        level: finalLevel,
        summary,
        details,
        ingredients: ingredientsList,
      };
    }
  }

  // 2. Fall back to the Gemini API call if no local match is found
  let base64Image: string | undefined = undefined;
  let mimeType: string | undefined = undefined;

  if (imageFile) {
    try {
      base64Image = await fastResize(imageFile);
      mimeType = "image/jpeg";
    } catch (error) {
      console.error("Resize failed, using original", error);
      const original = await fileToBase64(imageFile);
      base64Image = original.split(",")[1];
      mimeType = imageFile.type;
    }
  }

  // If local API key is set, use it directly (useful for direct local testing)
  if (apiKey) {
    const parts: any[] = [];
    const langText = language === 'ko' ? 'Korean' : 'English';
    const promptText = `
당신은 세계 최고의 보건/의학 전문 AI입니다.
사용자의 건강 상태는 다음과 같습니다: [${profile.conditions.join(", ")}].

사용자가 입력한 대상(식품, 의약품, 화장품, 생활용품 등)의 성분이나 특성을 분석하고, 이 사용자에게 얼마나 위험한지 평가해주세요.
결과는 반드시 JSON 형식으로 반환해야 합니다. 모든 텍스트 값(요약, 상세 이유 등)은 반드시 **${langText}**로 작성하세요.

**CRITICAL REQUIREMENT: REAL-TIME CITATIONS**
- level: 'SAFE', 'CAUTION', 'DANGER'
- summary: 핵심 주의사항을 1~2줄로 요약
- details: 상세한 이유. **반드시** 식약처(MFDS), 세계보건기구(WHO), FDA 등 공신력 있는 기관의 기준이나 과학적 근거를 명시하여 신뢰도를 높이세요.
- ingredients: 식별된 주요 성분 목록

제품 정보: ${productText ? productText : "첨부된 이미지 참조"}
`;

    parts.push({ text: promptText });
    if (base64Image && mimeType) {
      parts.push({
        inlineData: {
          data: base64Image,
          mimeType,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: apiModel,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING },
            summary: { type: Type.STRING },
            details: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["level", "summary", "details", "ingredients"],
        },
      },
    });

    try {
      return JSON.parse(response.text || "{}") as AnalysisResult;
    } catch (e) {
      throw new Error(language === 'ko' ? "분석 실패" : "Analysis failed");
    }
  }

  // Otherwise, use the secure Cloudflare Pages Function Proxy
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      profile,
      image: base64Image,
      mimeType,
      productText,
      language,
    }),
  });

  if (!res.ok) {
    const err = await res.json() as any;
    throw new Error(err.error || (language === 'ko' ? "분석 실패" : "Analysis failed"));
  }

  return await res.json() as AnalysisResult;
}

export async function askFollowUpQuestion(
  profile: UserProfile,
  result: AnalysisResult,
  question: string,
  language: Language = 'ko',
  history: { role: string; content: string }[] = []
): Promise<string> {
  // If local API key is set, use it directly
  if (apiKey) {
    const langText = language === 'ko' ? 'Korean' : 'English';
    const historyText = history
      .map((m) => `${m.role === "user" ? (language === 'ko' ? "질문" : "Question") : (language === 'ko' ? "답변" : "Answer")}: ${m.content}`)
      .join("\n");

    const prompt = `
사용자 상태: ${profile.conditions.join(", ")}
제품 분석 결과: ${result.summary} (${result.level})
상세 내용: ${result.details}

이전 대화 내용:
${historyText}

새 질문: ${question}

위 정보를 바탕으로 3문장 내외로 친절하게 **${langText}**로 답변해주세요. 
전문적인 정보나 수치 언급 시 식약처, 세계보건기구(WHO) 등 공신력 있는 출처를 함께 제시하여 신뢰도를 높여주세요.
`;

    const response = await ai.models.generateContent({
      model: apiModel,
      contents: prompt,
    });
    return response.text || (language === 'ko' ? "답변 실패" : "Failed to answer");
  }

  // Otherwise, use the secure Cloudflare Pages Function Proxy
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      profile,
      result,
      question,
      language,
      history,
    }),
  });

  if (!res.ok) {
    const err = await res.json() as any;
    throw new Error(err.error || (language === 'ko' ? "답변 실패" : "Failed to answer"));
  }

  const data = await res.json() as { text: string };
  return data.text;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
