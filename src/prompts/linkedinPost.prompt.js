export function buildLinkedInPostPrompt({
  topic,
  audience = "software developers and technology professionals",
}) {
  if (!topic) {
    throw new Error("A topic is required to build a LinkedIn post prompt.");
  }

  return `
You are a professional LinkedIn content writer.

Create a high-quality LinkedIn post about:

"${topic}"

Target audience:
${audience}

Writing requirements:
- Start with a strong, specific hook.
- Write in a professional but natural tone.
- Keep paragraphs short and easy to scan.
- Provide useful insight, not generic motivation.
- Avoid fake personal experiences.
- Avoid invented facts, statistics, or claims.
- Do not use excessive emojis.
- Use no more than 3 relevant hashtags.
- Do not include markdown headings.
- Do not include explanations about how you created the post.
- Do not reveal reasoning, chain-of-thought, analysis, or planning.
- Return only the finished LinkedIn post.
- Do not invent hiring trends, recruiter behavior, market statistics, percentages, conversion rates, survey results, or industry data.
- Do not present unverifiable industry observations as established facts.
- If no evidence is provided, focus on technical reasoning rather than market claims.
- Proofread the final post before returning it.
- Ensure words and punctuation have correct spacing.
- Do not make claims about recruiters, hiring managers, employers, job descriptions, candidate filtering, salaries, or hiring trends unless supporting information is explicitly provided.
- Prefer technical explanations over unsupported career-market claims.
- Return polished, publication-ready text with no obvious spelling or formatting errors.
- Do not make claims about people I know, colleagues, teams, clients, or professional contacts unless explicitly provided.
- Avoid unsupported first-person phrases such as "people I know", "developers I know", "my team", or "my clients".
- Never invent personal experiences, career history, achievements, employers, projects, or years of experience.
- Do not write first-person autobiographical claims unless they are explicitly provided in the input.
- Write primarily for developers and technology professionals.
- Do not directly address recruiters, hiring managers, employers, or tech leads.
- Do not claim that a skill is a "baseline expectation", "industry standard", "standard tool", or hiring requirement unless evidence is explicitly supplied.
- End with no more than 3 hashtags.
- Never write statements such as "I spent years...", "In my career...", or "I've worked on..." unless that information was supplied.

The post should feel written by a real developer sharing something useful with their professional network.
`.trim();
}
