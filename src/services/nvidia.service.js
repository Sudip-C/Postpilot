import { env } from "../config/env.js";

export async function generateWithNemotron(
  messages,
  {
    temperature = 0.7,
    maxTokens = 1000,
    enableThinking = false,
    timeoutMs = 60000,
  } = {}
) {
  if (!env.nvidiaApiKey) {
    throw new Error("NVIDIA_API_KEY is not configured.");
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(env.nvidiaApiUrl, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${env.nvidiaApiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      signal: controller.signal,

      body: JSON.stringify({
        model: env.nvidiaModel,
        messages,
        temperature,
        max_tokens: maxTokens,

        chat_template_kwargs: {
          enable_thinking: enableThinking,
        },
      }),
    });

    const responseText = await response.text();

    if (!responseText.trim()) {
      throw new Error(
        `NVIDIA API returned an empty response body (HTTP ${response.status}).`
      );
    }

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        `NVIDIA API returned invalid JSON (HTTP ${response.status}): ${responseText.slice(
          0,
          300
        )}`
      );
    }

    if (!response.ok) {
      throw new Error(
        `NVIDIA API request failed (${response.status}): ${JSON.stringify(
          data
        )}`
      );
    }

    const content =
      data?.choices?.[0]?.message?.content;

    if (!content || !content.trim()) {
      throw new Error(
        "NVIDIA API returned an empty response."
      );
    }

    return content.trim();
  } catch (error) {
    if (
      error.name === "AbortError" ||
      controller.signal.aborted
    ) {
      throw new Error(
        `NVIDIA API request timed out after ${timeoutMs / 1000} seconds.`
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}