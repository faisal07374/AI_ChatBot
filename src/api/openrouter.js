import skills from "../agent/skills";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const isCodeRequest = (messages) => {
  const last = messages?.[messages.length - 1]?.content?.toLowerCase() || "";

  const keywords = [
    "build",
    "create",
    "make",
    "design",
    "ui",
    "component",
    "dashboard",
    "form",
    "page",
    "layout",
    "navbar",
  ];

  return keywords.some((k) => last.includes(k));
};

export async function sendMessage(messages, controller, onChunk) {
  const codeMode = isCodeRequest(messages);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "AI Code Generator",
    },
    signal: controller?.signal,
    body: JSON.stringify({
      model:
        import.meta.env.VITE_OPENROUTER_MODEL ||
        "openai/gpt-3.5-turbo",

      messages: [
        {
          role: "system",
          content: codeMode
            ? skills
            : "You are a helpful assistant. Be concise.",
        },
        ...messages,
      ],

      temperature: 0.7,
      max_tokens: 1200,
      stream: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "API Error");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (let line of lines) {
      line = line.trim();
      if (!line.startsWith("data:")) continue;

      const data = line.replace("data: ", "").trim();

      if (data === "[DONE]") return fullText;

      try {
        const json = JSON.parse(data);
        const token = json?.choices?.[0]?.delta?.content;

        if (token) {
          fullText += token;
          onChunk?.(token);
        }
      } catch {
        // ignore broken chunks
      }
    }
  }

  return fullText;
}