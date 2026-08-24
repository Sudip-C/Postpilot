import { generateWithNemotron } from "../src/services/nvidia.service.js";

async function testNvidiaConnection() {
  try {
    console.log("Testing NVIDIA Nemotron connection...");

    const response = await generateWithNemotron([
      {
        role: "user",
        content:
          "Reply with a very short message confirming that the API connection works.",
      },
    ]);

    console.log("\nNVIDIA response:");
    console.log(response);

    console.log("\nNVIDIA connection test: OK");
  } catch (error) {
    console.error("\nNVIDIA connection test: FAILED");
    console.error(error.message);

    process.exit(1);
  }
}

testNvidiaConnection();