import { validatePost } from "../src/services/postValidator.service.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function testPostValidator() {
  try {
    console.log("Testing post validator...\n");

    const validPost = `
AI integration becomes much easier when you treat the model as one component of a larger software system.

The surrounding engineering still matters: input validation, retries, logging, failure handling, and clear boundaries around what the model is allowed to do.

The strongest AI applications combine probabilistic model behavior with deterministic application architecture.

#AI #SoftwareEngineering #Development
`.trim();

    const validResult = validatePost(validPost);

    console.log("Valid post result:");
    console.log(validResult);

    assert(
      validResult.valid === true,
      `Expected valid post to pass. Issues: ${validResult.issues.join(", ")}`
    );

    assert(
      validResult.score === 100,
      `Expected valid post score 100, received ${validResult.score}.`
    );

    assert(
      validResult.metadata.hashtagCount === 3,
      "Expected exactly 3 hashtags."
    );

    const invalidPost = `
Here's a thinking process.

In my career, recruiters are filtering candidates based on AI skills.

Read more at https://example.com

#AI #Coding #Career #Jobs #Tech
`.trim();

    const invalidResult = validatePost(invalidPost);

    console.log("\nInvalid post result:");
    console.log(invalidResult);

    assert(
      invalidResult.valid === false,
      "Expected invalid post to fail validation."
    );

    assert(
      invalidResult.issues.length > 0,
      "Expected invalid post to contain validation issues."
    );

    assert(
      invalidResult.metadata.hashtagCount === 5,
      "Expected validator to detect 5 hashtags."
    );

    console.log("\nPost validator test: OK");
  } catch (error) {
    console.error("\nPost validator test: FAILED");
    console.error(error.message);

    process.exit(1);
  }
}

testPostValidator();