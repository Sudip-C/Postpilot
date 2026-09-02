import { generateWithGemini } from "../src/services/gemini.service.js";

console.log("Testing Gemini connection...\n");

try {
  const result = await generateWithGemini(
    [
      {
        role: "system",
        content: "Follow the user's formatting instruction exactly.",
      },
      {
        role: "user",
        content: "Return exactly this text and nothing else: GEMINI_OK",
      },
    ],
    {
      maxTokens: 40,
      thinkingLevel: "minimal",
      timeoutMs: 30000,
    },
  );

  if (result.trim() !== "GEMINI_OK") {
    throw new Error(`Unexpected Gemini response: ${result}`);
  }

  console.log("Gemini connection test: OK");
} catch (error) {
  console.error("Gemini connection test: FAILED");
  console.error(error.message);
  process.exitCode = 1;
}
