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
    process.env.NVIDIA_MODEL || "nvidia/nemotron-3.5-lightning-30b-a3b",

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
