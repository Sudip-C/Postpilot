import { supabase } from "../src/config/supabase.js";

async function testPostsTable() {
  try {
    console.log("Testing posts table...");

    const { data, error } = await supabase
      .from("posts")
      .select("id, topic, content, status, created_at")
      .limit(1);

    if (error) {
      throw error;
    }

    console.log(
      `Posts table responded successfully. Rows returned: ${data.length}`
    );

    console.log("\nPosts table test: OK");
  } catch (error) {
    console.error("\nPosts table test: FAILED");
    console.error(error.message);

    process.exit(1);
  }
}

testPostsTable();