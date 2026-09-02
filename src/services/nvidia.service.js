import { env } from "../config/env.js";

export async function generateWithNemotron(
  messages,
  {
    temperature = 0.7,
    maxTokens = 1000,
    enableThinking = false,
    timeoutMs = 60000,
  } = {},
) {
  if (!env.nvidiaApiKey) {
    const error = new Error("NVIDIA_API_KEY is not configured.");
    error.provider = "nvidia";
    error.code = "NVIDIA_NOT_CONFIGURED";
    throw error;
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
      const error = new Error(
        `NVIDIA API returned an empty response body (HTTP ${response.status}).`,
      );
      error.provider = "nvidia";
      error.status = response.status;
      throw error;
    }

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      const error = new Error(
        `NVIDIA API returned invalid JSON (HTTP ${response.status}): ${responseText.slice(
          0,
          300,
        )}`,
      );
      error.provider = "nvidia";
      error.status = response.status;
      throw error;
    }

    if (!response.ok) {
      const error = new Error(
        `NVIDIA API request failed (${response.status}): ${JSON.stringify(data)}`,
      );
      error.provider = "nvidia";
      error.status = response.status;
      throw error;
    }

    const content = data?.choices?.[0]?.message?.content;

    if (!content || !content.trim()) {
      const error = new Error("NVIDIA API returned an empty response.");
      error.provider = "nvidia";
      throw error;
    }

    return content.trim();
  } catch (error) {
    if (error.name === "AbortError" || controller.signal.aborted) {
      const timeoutError = new Error(
        `NVIDIA API request timed out after ${timeoutMs / 1000} seconds.`,
      );
      timeoutError.provider = "nvidia";
      timeoutError.code = "NVIDIA_TIMEOUT";
      throw timeoutError;
    }

    if (!error.provider) {
      error.provider = "nvidia";
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
