import { env } from "../config/env.js";

export async function generateWithNemotron(
  messages,
  {
    temperature = 0.7,
    maxTokens = 1000,
    enableThinking = false,
  } = {}
) {
  if (!env.nvidiaApiKey) {
    throw new Error("NVIDIA_API_KEY is not configured.");
  }

  const response = await fetch(env.nvidiaApiUrl, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${env.nvidiaApiKey}`,
      "Content-Type": "application/json",
    },

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `NVIDIA API request failed (${response.status}): ${JSON.stringify(data)}`
    );
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content || !content.trim()) {
    throw new Error("NVIDIA API returned an empty response.");
  }

  return content.trim();
}