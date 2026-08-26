import { withRetry } from "../src/utils/retry.js";

async function testRetry() {
  try {
    console.log("Testing retry utility...\n");

    let attempts = 0;

    const result = await withRetry(
      async () => {
        attempts++;

        if (attempts < 3) {
          throw new Error(
            `Simulated failure ${attempts}`
          );
        }

        return "success";
      },
      {
        attempts: 3,
        delayMs: 100,
        label: "Simulated operation",
      }
    );

    if (result !== "success") {
      throw new Error(
        "Retry utility returned unexpected result."
      );
    }

    if (attempts !== 3) {
      throw new Error(
        `Expected 3 attempts, received ${attempts}.`
      );
    }

    console.log(`Attempts used: ${attempts}`);
    console.log(`Result: ${result}`);

    console.log("\nRetry utility test: OK");
  } catch (error) {
    console.error(
      "\nRetry utility test: FAILED"
    );

    console.error(error.message);

    process.exit(1);
  }
}

testRetry();