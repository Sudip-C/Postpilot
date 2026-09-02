import { env } from "../config/env.js";

function buildGeminiPayload(
  messages,
  { maxTokens, thinkingLevel, temperature },
) {
  const systemText = messages
    .filter((message) => message?.role === "system")
    .map((message) => String(message.content || "").trim())
    .filter(Boolean)
    .join("\n\n");

  const contents = messages
    .filter((message) => message?.role !== "system")
    .map((message) => ({
      role: message?.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: String(message?.content || "").trim(),
        },
      ],
    }))
    .filter((message) => message.parts[0].text);

  if (contents.length === 0) {
    throw new Error("Gemini requires at least one non-empty user message.");
  }

  return {
    ...(systemText
      ? {
          systemInstruction: {
            parts: [{ text: systemText }],
          },
        }
      : {}),
    contents,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature,
      thinkingConfig: {
        thinkingLevel,
      },
    },
  };
}

export async function generateWithGemini(
  messages,
  {
    temperature = 0.7,
    maxTokens = 1000,
    thinkingLevel = "minimal",
    timeoutMs = 30000,
  } = {},
) {
  if (!env.geminiApiKey) {
    const error = new Error("GEMINI_API_KEY is not configured.");
    error.provider = "gemini";
    error.code = "GEMINI_NOT_CONFIGURED";
    throw error;
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Gemini messages are required.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const endpoint = `${env.geminiApiUrl}/models/${encodeURIComponent(
    env.geminiModel,
  )}:generateContent`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-goog-api-key": env.geminiApiKey,
      },
      signal: controller.signal,
      body: JSON.stringify(
        buildGeminiPayload(messages, {
          maxTokens,
          thinkingLevel,
          temperature,
        }),
      ),
    });

    const responseText = await response.text();

    if (!responseText.trim()) {
      const error = new Error(
        `Gemini API returned an empty response body (HTTP ${response.status}).`,
      );
      error.provider = "gemini";
      error.status = response.status;
      throw error;
    }

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      const error = new Error(
        `Gemini API returned invalid JSON (HTTP ${response.status}): ${responseText.slice(
          0,
          300,
        )}`,
      );
      error.provider = "gemini";
      error.status = response.status;
      throw error;
    }

    if (!response.ok) {
      const error = new Error(
        `Gemini API request failed (${response.status}): ${JSON.stringify(data)}`,
      );
      error.provider = "gemini";
      error.status = response.status;
      throw error;
    }

    const content = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("")
      .trim();

    if (!content) {
      const error = new Error("Gemini API returned an empty response.");
      error.provider = "gemini";
      throw error;
    }

    return content;
  } catch (error) {
    if (error.name === "AbortError" || controller.signal.aborted) {
      const timeoutError = new Error(
        `Gemini API request timed out after ${timeoutMs / 1000} seconds.`,
      );
      timeoutError.provider = "gemini";
      timeoutError.code = "GEMINI_TIMEOUT";
      throw timeoutError;
    }

    if (!error.provider) {
      error.provider = "gemini";
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
