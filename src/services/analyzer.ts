import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeProduct(
  profile: UserProfile,
  imageFile?: File,
  productText?: string
): Promise<AnalysisResult> {
  const parts: any[] = [];

  const promptText = `
당신은 세계 최고의 보건/의학 전문 AI입니다.
사용자의 건강 상태는 다음과 같습니다: [${profile.conditions.join(", ")}].

사용자가 입력한 제품(사진 또는 이름)의 성분을 분석하고, 이 사용자에게 얼마나 위험한지 평가해주세요.
결과는 반드시 JSON 형식으로 반환해야 합니다.

- level: 'SAFE' (안전), 'CAUTION' (주의), 'DANGER' (위험) 중 하나
- summary: 핵심 주의사항을 1~2줄로 요약 (예: '당류가 높아 당뇨 환자에게 위험합니다.')
- details: 상세한 이유 (왜 위험한지, 어떤 성분이 문제인지)
- ingredients: 식별된 주요 성분 목록 (문자열 배열)

제품 정보: ${productText ? productText : "첨부된 이미지 참조"}
`;

  parts.push({ text: promptText });

  if (imageFile) {
    const base64Data = await fileToBase64(imageFile);
    parts.push({
      inlineData: {
        data: base64Data.split(",")[1],
        mimeType: imageFile.type,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          level: {
            type: Type.STRING,
            description: "SAFE, CAUTION, or DANGER",
          },
          summary: {
            type: Type.STRING,
            description: "1-2 line summary of the risk",
          },
          details: {
            type: Type.STRING,
            description: "Detailed explanation of the risk",
          },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
            description: "List of identified ingredients",
          },
        },
        required: ["level", "summary", "details", "ingredients"],
      },
    },
  });

  const jsonStr = response.text?.trim() || "{}";
  try {
    return JSON.parse(jsonStr) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    throw new Error("분석 결과를 처리하는 데 실패했습니다.");
  }
}

export async function askFollowUpQuestion(
  profile: UserProfile,
  result: AnalysisResult,
  question: string
): Promise<string> {
  const promptText = `
당신은 보건/의학 전문 AI입니다.
사용자의 건강 상태: [${profile.conditions.join(", ")}].

최근 분석한 제품의 결과:
- 위험도: ${result.level}
- 요약: ${result.summary}
- 상세: ${result.details}
- 주요 성분: ${result.ingredients.join(", ")}

사용자의 추가 질문: "${question}"

위 정보를 바탕으로 사용자의 질문에 친절하고 이해하기 쉽게 답변해주세요.
답변은 3~4문장 내외로 간결하게 작성해주세요.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: promptText,
  });

  return response.text || "답변을 생성하지 못했습니다.";
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
