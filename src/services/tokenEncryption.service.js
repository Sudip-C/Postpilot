import crypto from "crypto";
import { env } from "../config/env.js";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey() {
  if (!env.linkedinTokenEncryptionKey) {
    throw new Error(
      "LINKEDIN_TOKEN_ENCRYPTION_KEY is not configured."
    );
  }

  const key = Buffer.from(
    env.linkedinTokenEncryptionKey,
    "hex"
  );

  if (key.length !== 32) {
    throw new Error(
      "LINKEDIN_TOKEN_ENCRYPTION_KEY must be a 32-byte hex key."
    );
  }

  return key;
}

export function encryptToken(token) {
  if (!token) {
    throw new Error("Token is required for encryption.");
  }

  const key = getEncryptionKey();

  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    key,
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    encryptedToken: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

export function decryptToken({
  encryptedToken,
  iv,
  authTag,
}) {
  const key = getEncryptionKey();

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, "base64")
  );

  decipher.setAuthTag(
    Buffer.from(authTag, "base64")
  );

  const decrypted = Buffer.concat([
    decipher.update(
      Buffer.from(encryptedToken, "base64")
    ),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}