import { supabase } from "../src/config/supabase.js";

async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...");

    const {
      data,
      error,
    } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });

    if (error) {
      throw error;
    }

    console.log(
      `Supabase responded successfully. Users returned: ${
        data?.users?.length ?? 0
      }`
    );

    console.log("\nSupabase connection test: OK");
  } catch (error) {
    console.error("\nSupabase connection test: FAILED");
    console.error(error.message);

    process.exit(1);
  }
}

testSupabaseConnection();