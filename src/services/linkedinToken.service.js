import { supabase } from "../config/supabase.js";

import {
  encryptToken,
  decryptToken,
} from "./tokenEncryption.service.js";

export async function saveLinkedInToken({
  accessToken,
  expiresIn,
  refreshToken = null,
  refreshTokenExpiresIn = null,
}) {
  if (!accessToken) {
    throw new Error(
      "LinkedIn access token is required."
    );
  }

  const encryptedAccess =
    encryptToken(accessToken);

  const expiresAt = expiresIn
    ? new Date(
        Date.now() + expiresIn * 1000
      ).toISOString()
    : null;

  let refreshData = {
    encrypted_refresh_token: null,
    refresh_token_iv: null,
    refresh_token_auth_tag: null,
    refresh_token_expires_at: null,
  };

  if (refreshToken) {
    const encryptedRefresh =
      encryptToken(refreshToken);

    refreshData = {
      encrypted_refresh_token:
        encryptedRefresh.encryptedToken,
      refresh_token_iv:
        encryptedRefresh.iv,
      refresh_token_auth_tag:
        encryptedRefresh.authTag,

      refresh_token_expires_at:
        refreshTokenExpiresIn
          ? new Date(
              Date.now() +
                refreshTokenExpiresIn * 1000
            ).toISOString()
          : null,
    };
  }

  const { data, error } = await supabase
    .from("linkedin_tokens")
    .upsert(
      {
        provider: "linkedin",

        encrypted_access_token:
          encryptedAccess.encryptedToken,

        access_token_iv:
          encryptedAccess.iv,

        access_token_auth_tag:
          encryptedAccess.authTag,

        expires_at: expiresAt,

        ...refreshData,

        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "provider",
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to save LinkedIn token: ${error.message}`
    );
  }

  return data;
}

export async function getLinkedInAccessToken() {
  const { data, error } = await supabase
    .from("linkedin_tokens")
    .select(
      "encrypted_access_token, access_token_iv, access_token_auth_tag, expires_at"
    )
    .eq("provider", "linkedin")
    .single();

  if (error) {
    throw new Error(
      `Failed to retrieve LinkedIn token: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      "LinkedIn token has not been stored."
    );
  }

  if (
    data.expires_at &&
    new Date(data.expires_at) <= new Date()
  ) {
    throw new Error(
      "LinkedIn access token has expired."
    );
  }

  return decryptToken({
    encryptedToken:
      data.encrypted_access_token,

    iv:
      data.access_token_iv,

    authTag:
      data.access_token_auth_tag,
  });
}