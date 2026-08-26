import { generateWithNemotron } from "./nvidia.service.js";

export async function generateDailyTopic({
  pillar,
  postType,
  recentPosts = [],
}) {
  if (!pillar?.name) {
    throw new Error("A valid content pillar is required.");
  }

  if (!postType?.name) {
    throw new Error("A valid post type is required.");
  }

  const recentTopics = recentPosts
    .slice(0, 20)
    .map((post, index) => `${index + 1}. ${post.topic}`)
    .join("\n");

  const prompt = `
Create exactly one topic for a professional LinkedIn post.

Content pillar:
${pillar.name}

Pillar description:
${pillar.description}

Post type:
${postType.name}

Post type description:
${postType.description}

Recent topics that must not be repeated or closely copied:
${recentTopics || "None"}

Requirements:
- The topic must be specific enough to produce a useful technical LinkedIn post.
- Prefer practical software engineering, web development, AI engineering, project-building, or developer-learning angles.
- Avoid unsupported hiring, salary, recruiter, or market claims.
- Do not invent personal experiences.
- Avoid topics substantially similar to the recent topics above.
- Return only one topic.
- Do not prefix it with "Topic:".
- Do not use quotes.
- Keep it under 160 characters.
`.trim();

  const result = await generateWithNemotron(
    [
      {
        role: "system",
        content:
          "Generate one concise technical LinkedIn topic. Return only the topic and nothing else.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    {
      temperature: 0.7,
      maxTokens: 100,
      enableThinking: false,
    }
  );

  const topic = result
    .trim()
    .replace(/^topic:\s*/i, "")
    .replace(/^["']|["']$/g, "")
    .split("\n")[0]
    .trim();

  if (!topic) {
    throw new Error("Generated daily topic is empty.");
  }

  if (topic.length > 160) {
    throw new Error(
      `Generated topic is too long: ${topic.length} characters.`
    );
  }

  return topic;
}