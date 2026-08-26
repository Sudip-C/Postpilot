import { getLinkedInAccessToken } from "./linkedinToken.service.js";

const LINKEDIN_API_BASE_URL = "https://api.linkedin.com";

async function linkedinRequest(path, options = {}) {
  const accessToken = await getLinkedInAccessToken();

  const response = await fetch(
    `${LINKEDIN_API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  );

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      `LinkedIn API request failed (${response.status}): ${
        typeof data === "string"
          ? data
          : JSON.stringify(data)
      }`
    );
  }

  return data;
}

export async function getLinkedInUserInfo() {
  return linkedinRequest("/v2/userinfo", {
    method: "GET",
  });
}