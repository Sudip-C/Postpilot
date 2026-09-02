import {
  runWithProviderFallback,
  shouldFallbackFromNvidia,
} from "../src/services/aiGeneration.service.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  console.log("Testing AI provider failover router...\n");

  assert(
    shouldFallbackFromNvidia({ status: 503 }) === true,
    "503 should trigger Gemini fallback.",
  );
  assert(
    shouldFallbackFromNvidia({ status: 429 }) === true,
    "429 should trigger Gemini fallback.",
  );
  assert(
    shouldFallbackFromNvidia({ code: "NVIDIA_TIMEOUT" }) === true,
    "NVIDIA timeout should trigger Gemini fallback.",
  );
  assert(
    shouldFallbackFromNvidia({ status: 410 }) === false,
    "410 should fail fast instead of falling back.",
  );
  assert(
    shouldFallbackFromNvidia({ status: 401 }) === false,
    "401 should fail fast instead of falling back.",
  );

  let fallbackCalled = false;
  const fallbackResult = await runWithProviderFallback({
    primary: async () => {
      const error = new Error("Service temporarily overloaded");
      error.status = 503;
      throw error;
    },
    fallback: async () => {
      fallbackCalled = true;
      return "gemini-ok";
    },
  });

  assert(fallbackCalled, "Fallback provider was not called for 503.");
  assert(fallbackResult === "gemini-ok", "Fallback result was not returned.");

  let permanentFallbackCalled = false;

  try {
    await runWithProviderFallback({
      primary: async () => {
        const error = new Error("Model retired");
        error.status = 410;
        throw error;
      },
      fallback: async () => {
        permanentFallbackCalled = true;
        return "should-not-run";
      },
    });

    throw new Error("Permanent NVIDIA error should have been rethrown.");
  } catch (error) {
    assert(error.status === 410, "Expected original 410 error to be rethrown.");
  }

  assert(
    permanentFallbackCalled === false,
    "Fallback should not run for permanent NVIDIA errors.",
  );

  console.log("AI failover router test: OK");
}

main().catch((error) => {
  console.error("AI failover router test: FAILED");
  console.error(error.message);
  process.exit(1);
});
