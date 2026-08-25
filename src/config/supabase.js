import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

if (!env.supabaseUrl) {
  throw new Error("SUPABASE_URL is not configured.");
}

if (!env.supabaseSecretKey) {
  throw new Error("SUPABASE_SECRET_KEY is not configured.");
}

export const supabase = createClient(
  env.supabaseUrl,
  env.supabaseSecretKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);