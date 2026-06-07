interface Env {
  GEMINI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const apiKey = context.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Gemini API key is not configured on the server." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await context.request.json() as {
      profile: { conditions: string[] };
      image?: string; // base64 representation of the image
      mimeType?: string;
      productText?: string;
      language?: string;
    };

    const { profile, image, mimeType, productText, language = "ko" } = body;
    const langText = language === "ko" ? "Korean" : "English";

    const parts: any[] = [];
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

    if (image && mimeType) {
      parts.push({
        inlineData: {
          data: image,
          mimeType: mimeType,
        },
      });
    }

    const payload = {
      contents: [{ parts }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            level: { type: "STRING" },
            summary: { type: "STRING" },
            details: { type: "STRING" },
            ingredients: { type: "ARRAY", items: { type: "STRING" } },
          },
          required: ["level", "summary", "details", "ingredients"],
        },
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${errorText}` }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json() as any;
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    // Return the JSON parsed object from Gemini
    return new Response(responseText, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred during analysis proxy execution." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
