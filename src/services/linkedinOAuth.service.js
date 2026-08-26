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
export async function exchangeLinkedInCode(code) {
  if (!code) {
    throw new Error("LinkedIn authorization code is required.");
  }

  if (!env.linkedinClientId) {
    throw new Error("LINKEDIN_CLIENT_ID is not configured.");
  }

  if (!env.linkedinClientSecret) {
    throw new Error("LINKEDIN_CLIENT_SECRET is not configured.");
  }

  if (!env.linkedinRedirectUri) {
    throw new Error("LINKEDIN_REDIRECT_URI is not configured.");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: env.linkedinRedirectUri,
    client_id: env.linkedinClientId,
    client_secret: env.linkedinClientSecret,
  });

  const response = await fetch(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `LinkedIn token exchange failed (${response.status}): ${JSON.stringify(data)}`
    );
  }

  if (!data.access_token) {
    throw new Error("LinkedIn did not return an access token.");
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token || null,
    refreshTokenExpiresIn: data.refresh_token_expires_in || null,
  };
}