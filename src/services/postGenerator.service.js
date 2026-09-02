import { buildLinkedInPostPrompt } from "../prompts/linkedinPost.prompt.js";
import { generateWithAI } from "./aiGeneration.service.js";

export async function generateLinkedInPost({ topic, audience }) {
  if (!topic || typeof topic !== "string" || !topic.trim()) {
    throw new Error("A valid topic is required to generate a LinkedIn post.");
  }

  const cleanTopic = topic.trim();

  const prompt = buildLinkedInPostPrompt({
    topic: cleanTopic,
    audience,
  });

  // Pass 1: Generate the post
  const draft = await generateWithAI(
    [
      {
        role: "system",
        content:
          "You write professional LinkedIn posts based only on the supplied topic and broadly applicable technical reasoning. Never invent personal experiences, career history, statistics, survey results, market trends, hiring trends, recruiter behavior, employer behavior, job-market claims, or claims about what companies are doing. Do not present predictions or trends as established facts. Focus primarily on practical technical reasoning. Return only the finished LinkedIn post.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    {
      temperature: 0.7,
      maxTokens: 1000,
      enableThinking: false,
    },
  );

  if (!draft || !draft.trim()) {
    throw new Error("Generated LinkedIn post is empty.");
  }

  // Pass 2: Proofread the generated post
  const polishedContent = await generateWithAI(
    [
      {
        role: "system",
        content:
          "You are a strict final copy editor. Proofread the entire LinkedIn post character by character. Fix spelling, grammar, punctuation, spacing, missing spaces between accidentally joined words, and malformed compound words. Examples of errors to fix include 'howto' → 'how to', 'promptsand' → 'prompts and', and 'production-gradereliability' → 'production-grade reliability'. Do not add new facts, statistics, personal experiences, claims, examples, or ideas. Preserve the original meaning, paragraph structure, and hashtags. Return only the corrected publication-ready LinkedIn post.",
      },
      {
        role: "user",
        content: draft.trim(),
      },
    ],
    {
      temperature: 0,
      maxTokens: 1000,
      enableThinking: false,
    },
  );

  if (!polishedContent || !polishedContent.trim()) {
    throw new Error("Polished LinkedIn post is empty.");
  }

  return {
    topic: cleanTopic,
    content: polishedContent.trim(),
  };
}
