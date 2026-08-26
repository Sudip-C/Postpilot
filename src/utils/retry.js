function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry(
  operation,
  {
    attempts = 3,
    delayMs = 1500,
    label = "operation",
  } = {}
) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      console.error(
        `${label} failed on attempt ${attempt}/${attempts}: ${error.message}`
      );

      if (attempt < attempts) {
        await sleep(delayMs * attempt);
      }
    }
  }

  throw lastError;
}