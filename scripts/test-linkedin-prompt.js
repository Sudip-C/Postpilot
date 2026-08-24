import { buildLinkedInPostPrompt } from "../src/prompts/linkedinPost.prompt.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function testLinkedInPrompt() {
  try {
    const topic = "Why developers should learn how to build AI-powered applications";

    const prompt = buildLinkedInPostPrompt({
      topic,
    });

    assert(prompt.includes(topic), "Prompt does not contain the topic.");

    assert(
      prompt.includes("Return only the finished LinkedIn post"),
      "Prompt does not enforce final-output-only behavior."
    );

    assert(
      prompt.includes("no more than 3 relevant hashtags"),
      "Prompt does not contain hashtag constraints."
    );

    assert(
      prompt.includes("Do not reveal reasoning"),
      "Prompt does not prevent reasoning output."
    );

    console.log("Generated prompt:\n");
    console.log(prompt);

    console.log("\nLinkedIn prompt test: OK");
  } catch (error) {
    console.error("\nLinkedIn prompt test: FAILED");
    console.error(error.message);

    process.exit(1);
  }
}

testLinkedInPrompt();