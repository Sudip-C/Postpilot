import { supabase } from "../src/config/supabase.js";
import {
  savePost,
  getRecentPosts,
} from "../src/services/postDatabase.service.js";

async function testRecentPosts() {
  const testPostIds = [];

  try {
    console.log("Testing recent post retrieval...\n");

    const firstPost = await savePost({
      topic: "PostPilot recent history test 1",
      content: "Temporary history test post number one.",
      pillarId: "ai",
      postTypeId: "educational",
    });

    testPostIds.push(firstPost.id);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const secondPost = await savePost({
      topic: "PostPilot recent history test 2",
      content: "Temporary history test post number two.",
      pillarId: "web-development",
      postTypeId: "technical-tip",
    });

    testPostIds.push(secondPost.id);

    const recentPosts = await getRecentPosts(2);

    if (!Array.isArray(recentPosts)) {
      throw new Error("Recent posts result must be an array.");
    }

    if (recentPosts.length !== 2) {
      throw new Error(
        `Expected 2 recent posts, received ${recentPosts.length}.`
      );
    }

    if (recentPosts[0].id !== secondPost.id) {
      throw new Error("Newest post was not returned first.");
    }

    if (recentPosts[1].id !== firstPost.id) {
      throw new Error("Older post was not returned second.");
    }

    console.log("Recent posts:");

    for (const post of recentPosts) {
      console.log(`- ${post.topic}`);
    }

    console.log("\nRecent posts test: OK");
  } catch (error) {
    console.error("\nRecent posts test: FAILED");
    console.error(error.message);

    process.exitCode = 1;
  } finally {
    if (testPostIds.length > 0) {
      console.log("\nCleaning up test posts...");

      const { error } = await supabase
        .from("posts")
        .delete()
        .in("id", testPostIds);

      if (error) {
        console.error(`Cleanup failed: ${error.message}`);
        process.exitCode = 1;
      } else {
        console.log("Test posts removed.");
      }
    }
  }
}

testRecentPosts();