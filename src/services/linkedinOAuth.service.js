import crypto from "crypto";
import { env } from "../config/env.js";

export function createLinkedInAuthorizationUrl() {
  if (!env.linkedinClientId) {
    throw new Error("LINKEDIN_CLIENT_ID is not configured.");
  }

  if (!env.linkedinRedirectUri) {
    throw new Error("LINKEDIN_REDIRECT_URI is not configured.");
  }

  const state = crypto.randomBytes(24).toString("hex");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.linkedinClientId,
    redirect_uri: env.linkedinRedirectUri,
    state,
    scope: "w_member_social",
  });

  const authorizationUrl =
    `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;

  return {
    authorizationUrl,
    state,
  };
}