import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, UserProfile } from "../types";

import { Language } from "../translations";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
        const MAX_SIZE = 640; // 분석에 충분하면서도 아주 가벼운 크기
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
        
        // 용량을 1/10 이하로 줄여서 즉시 업로드되게 합니다.
        resolve(canvas.toDataURL("image/jpeg", 0.5).split(",")[1]);
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
  const parts: any[] = [];
  const langText = language === 'ko' ? 'Korean' : 'English';

  const promptText = `
당신은 세계 최고의 보건/의학 전문 AI입니다.
사용자의 건강 상태는 다음과 같습니다: [${profile.conditions.join(", ")}].

사용자가 입력한 대상(식품, 의약품, 화장품, 생활용품 등)의 성분이나 특성을 분석하고, 이 사용자에게 얼마나 위험한지 평가해주세요.
결과는 반드시 JSON 형식으로 반환해야 합니다. 모든 텍스트 값(요약, 상세 이유 등)은 반드시 **${langText}**로 작성하세요.

- level: 'SAFE' (안전), 'CAUTION' (주의), 'DANGER' (위험) 중 하나
- summary: 핵심 주의사항을 1~2줄로 요약 (사용자의 건강을 최우선으로 고려)
- details: 상세한 이유 (왜 위험한지, 어떤 성분이 문제인지, 식약처/WHO 등 공신력 있는 기준 포함)
- ingredients: 식별된 주요 성분 목록 (문자열 배열)

제품 정보: ${productText ? productText : "첨부된 이미지 참조"}
`;

  parts.push({ text: promptText });

  if (imageFile) {
    try {
      const base64Data = await fastResize(imageFile);
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      });
    } catch (error) {
      console.error("Resize failed, using original", error);
      const original = await fileToBase64(imageFile);
      parts.push({ inlineData: { data: original.split(",")[1], mimeType: imageFile.type } });
    }
  }

  const response = await ai.models.generateContent({
    model: "gemini-flash-lite-latest", // 가장 빠른 응답 속도를 가진 모델
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

export async function askFollowUpQuestion(
  profile: UserProfile,
  result: AnalysisResult,
  question: string,
  language: Language = 'ko',
  history: { role: string; content: string }[] = []
): Promise<string> {
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
    model: "gemini-flash-lite-latest",
    contents: prompt,
  });
  return response.text || (language === 'ko' ? "답변 실패" : "Failed to answer");
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
