import { supabase } from "../src/config/supabase.js";
import { savePost } from "../src/services/postDatabase.service.js";

async function testSavePost() {
  let savedPostId = null;

  try {
    console.log("Testing post save...\n");

    const savedPost = await savePost({
      topic: "Test PostPilot database post",
      content:
        "This is a temporary test post used to verify that PostPilot can save generated content.",
      pillarId: "ai",
      postTypeId: "educational",
    });

    savedPostId = savedPost.id;

    if (!savedPost.id) {
      throw new Error("Saved post does not contain an ID.");
    }

    if (savedPost.topic !== "Test PostPilot database post") {
      throw new Error("Saved topic does not match.");
    }

    if (
      savedPost.content !==
      "This is a temporary test post used to verify that PostPilot can save generated content."
    ) {
      throw new Error("Saved content does not match.");
    }

    if (savedPost.status !== "draft") {
      throw new Error(
        `Expected status "draft", received "${savedPost.status}".`
      );
    }

    if (savedPost.pillar_id !== "ai") {
      throw new Error("Saved pillar ID does not match.");
    }

    if (savedPost.post_type_id !== "educational") {
      throw new Error("Saved post type ID does not match.");
    }

    console.log("Saved post ID:");
    console.log(savedPost.id);

    console.log("\nPost saved successfully.");

    console.log("\nSave post test: OK");
  } catch (error) {
    console.error("\nSave post test: FAILED");
    console.error(error.message);

    process.exitCode = 1;
  } finally {
    if (savedPostId) {
      console.log("\nCleaning up test post...");

      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", savedPostId);

      if (error) {
        console.error(
          `Test cleanup failed: ${error.message}`
        );

        process.exitCode = 1;
      } else {
        console.log("Test post removed.");
      }
    }
  }
}

testSavePost();