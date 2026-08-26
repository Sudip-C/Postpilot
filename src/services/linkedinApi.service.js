import { getLinkedInAccessToken } from "./linkedinToken.service.js";
import { env } from "../config/env.js";

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
export async function publishLinkedInTextPost(content) {
  if (
    !content ||
    typeof content !== "string" ||
    !content.trim()
  ) {
    throw new Error(
      "LinkedIn post content is required."
    );
  }

  const accessToken =
    await getLinkedInAccessToken();

  const user =
    await getLinkedInUserInfo();

  if (!user?.sub) {
    throw new Error(
      "LinkedIn member subject ID is unavailable."
    );
  }

  const authorUrn =
    `urn:li:person:${user.sub}`;

  const response = await fetch(
    "https://api.linkedin.com/rest/posts",
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${accessToken}`,

        "Content-Type":
          "application/json",

        "X-Restli-Protocol-Version":
          "2.0.0",

        "LinkedIn-Version":
          env.linkedinApiVersion,
      },

      body: JSON.stringify({
        author: authorUrn,

        commentary: content.trim(),

        visibility: "PUBLIC",

        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },

        lifecycleState: "PUBLISHED",

        isReshareDisabledByAuthor: false,
      }),
    }
  );

  const responseText =
    await response.text();

  let responseData = null;

  if (responseText) {
    try {
      responseData =
        JSON.parse(responseText);
    } catch {
      responseData =
        responseText;
    }
  }

  if (!response.ok) {
    throw new Error(
      `LinkedIn post publishing failed (${response.status}): ${
        typeof responseData === "string"
          ? responseData
          : JSON.stringify(responseData)
      }`
    );
  }

  const postId =
    response.headers.get("x-restli-id");

  if (!postId) {
    throw new Error(
      "LinkedIn published the request but did not return a post ID."
    );
  }

  return {
    postId,
    authorUrn,
  };
}