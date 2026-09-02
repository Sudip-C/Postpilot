import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 3000,

  dailyJobSecret: process.env.DAILY_JOB_SECRET,

  nvidiaApiKey: process.env.NVIDIA_API_KEY,
  nvidiaApiUrl:
    process.env.NVIDIA_API_URL ||
    "https://integrate.api.nvidia.com/v1/chat/completions",
  nvidiaModel:
    process.env.NVIDIA_MODEL || "nvidia/nemotron-3-super-120b-a12b",

  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiApiUrl:
    process.env.GEMINI_API_URL ||
    "https://generativelanguage.googleapis.com/v1beta",
  geminiModel:
    process.env.GEMINI_MODEL || "gemini-3.5-flash",

  supabaseUrl: process.env.SUPABASE_URL,
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,

  linkedinClientId: process.env.LINKEDIN_CLIENT_ID,
  linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  linkedinRedirectUri: process.env.LINKEDIN_REDIRECT_URI,
  linkedinTokenEncryptionKey:
    process.env.LINKEDIN_TOKEN_ENCRYPTION_KEY,
  linkedinApiVersion:
    process.env.LINKEDIN_API_VERSION || "202608",
};
