import { generateWithNemotron } from "./nvidia.service.js";
import { generateWithGemini } from "./gemini.service.js";

export function shouldFallbackFromNvidia(error) {
  if (!error) return false;

  if (error.code === "NVIDIA_TIMEOUT") {
    return true;
  }

  const status = Number(error.status);

  return status === 429 || (status >= 500 && status <= 599);
}

export async function runWithProviderFallback({
  primary,
  fallback,
  primaryLabel = "NVIDIA",
  fallbackLabel = "Gemini",
}) {
  try {
    return await primary();
  } catch (error) {
    if (!shouldFallbackFromNvidia(error)) {
      throw error;
    }

    console.warn(
      `${primaryLabel} temporarily unavailable (${error.status || error.code || "unknown"}). Falling back to ${fallbackLabel}.`,
    );

    return fallback();
  }
}

export async function generateWithAI(
  messages,
  {
    temperature = 0.7,
    maxTokens = 1000,
    enableThinking = false,
    timeoutMs = 60000,
  } = {},
) {
  return runWithProviderFallback({
    primary: () =>
      generateWithNemotron(messages, {
        temperature,
        maxTokens,
        enableThinking,
        timeoutMs,
      }),
    fallback: () =>
      generateWithGemini(messages, {
        temperature,
        maxTokens,
        thinkingLevel: enableThinking ? "low" : "minimal",
        timeoutMs: Math.min(timeoutMs, 30000),
      }),
  });
}
