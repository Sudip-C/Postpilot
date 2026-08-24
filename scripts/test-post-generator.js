import { generateLinkedInPost } from "../src/services/postGenerator.service.js";

async function testPostGenerator() {
  try {
    console.log("Generating test LinkedIn post...\n");

    const result = await generateLinkedInPost({
      topic: "Why developers should learn how to build AI-powered applications",
    });

    if (!result.topic) {
      throw new Error("Generated result does not contain a topic.");
    }

    if (!result.content) {
      throw new Error("Generated result does not contain content.");
    }

    if (result.content.length < 50) {
      throw new Error("Generated LinkedIn post is unexpectedly short.");
    }

    const reasoningPatterns = [
      "here's a thinking process",
      "analyze the request",
      "analyze user input",
      "identify goal",
      "chain-of-thought",
      "reasoning process",
      "i spent the first",
  "in my career",
  "i've spent years",
  "i have spent years",
  "years of my career",
    ];

    const lowerContent = result.content.toLowerCase();

    for (const pattern of reasoningPatterns) {
      if (lowerContent.includes(pattern)) {
        throw new Error(
          `Generated content contains reasoning text: "${pattern}"`,
        );
      }
    }
const unsupportedPersonalPatterns = [
  "developers i know",
  "people i know",
  "my team",
  "my clients",
  "my colleagues",
];
const hashtags = result.content.match(/#[A-Za-z0-9_]+/g) || [];

if (hashtags.length > 3) {
  throw new Error(
    `Generated content contains too many hashtags: ${hashtags.length}`
  );
}
const unsupportedMarketPatterns = [
  "for recruiters",
  "recruiters are",
  "recruiters look",
  "hiring managers",
  "candidate filtering",
  "baseline expectation",
  "hiring trend",
  "job market",
];

for (const pattern of unsupportedMarketPatterns) {
  if (lowerContent.includes(pattern)) {
    throw new Error(
      `Generated content contains unsupported market/recruiting language: "${pattern}"`
    );
  }
}
for (const pattern of unsupportedPersonalPatterns) {
  if (lowerContent.includes(pattern)) {
    throw new Error(
      `Generated content contains unsupported personal context: "${pattern}"`
    );
  }
}
const fabricatedExperiencePatterns = [
  "i spent the first",
  "in my career",
  "i've spent years",
  "i have spent years",
  "years of my career",
];

for (const pattern of fabricatedExperiencePatterns) {
  if (lowerContent.includes(pattern)) {
    throw new Error(
      `Generated content may contain fabricated personal experience: "${pattern}"`
    );
  }
}
    console.log("Topic:");
    console.log(result.topic);

    console.log("\nGenerated LinkedIn post:\n");
    console.log(result.content);

    console.log("\nPost generator test: OK");
  } catch (error) {
    console.error("\nPost generator test: FAILED");
    console.error(error.message);

    process.exit(1);
  }
}

testPostGenerator();
