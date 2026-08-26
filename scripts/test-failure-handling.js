import { supabase } from "../src/config/supabase.js";

import {
  savePost,
  markPostFailed,
} from "../src/services/postDatabase.service.js";

async function testFailureHandling() {
  let testPostId = null;

  try {
    console.log("Testing post failure handling...\n");

    // Create temporary draft
    const post = await savePost({
      topic: "PostPilot failure handling test",
      content:
        "This temporary post verifies that failed publishing attempts are recorded correctly in Supabase.",
      pillarId: "ai",
      postTypeId: "technical-tip",
      status: "draft",
    });

    testPostId = post.id;

    console.log(`Draft created: ${testPostId}`);

    // Simulate a publishing failure
    const simulatedError =
      "Simulated LinkedIn publishing failure.";

    const failedPost = await markPostFailed(
      testPostId,
      simulatedError
    );

    if (failedPost.status !== "failed") {
      throw new Error(
        `Expected status "failed", received "${failedPost.status}".`
      );
    }

    if (
      failedPost.error_message !== simulatedError
    ) {
      throw new Error(
        "Stored error message does not match simulated error."
      );
    }

    console.log("Post status changed to failed.");
    console.log(
      `Stored error: ${failedPost.error_message}`
    );

    console.log(
      "\nFailure handling test: OK"
    );
  } catch (error) {
    console.error(
      "\nFailure handling test: FAILED"
    );

    console.error(error.message);

    process.exitCode = 1;
  } finally {
    if (testPostId) {
      console.log("\nCleaning up test post...");

      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", testPostId);

      if (error) {
        console.error(
          `Cleanup failed: ${error.message}`
        );

        process.exitCode = 1;
      } else {
        console.log("Test post removed.");
      }
    }
  }
}

testFailureHandling();