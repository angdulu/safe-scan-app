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
      result: { level: string; summary: string; details: string };
      question: string;
      language?: string;
      history?: { role: string; content: string }[];
    };

    const { profile, result, question, language = "ko", history = [] } = body;
    const langText = language === "ko" ? "Korean" : "English";
    
    const historyText = history
      .map((m) => `${m.role === "user" ? (language === "ko" ? "질문" : "Question") : (language === "ko" ? "답변" : "Answer")}: ${m.content}`)
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

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
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

    return new Response(JSON.stringify({ text: responseText }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred during chat proxy execution." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
