import { createLinkedInAuthorizationUrl } from "../services/linkedinOAuth.service.js";

export function loginWithLinkedIn(req, res) {
  try {
    const { authorizationUrl, state } =
      createLinkedInAuthorizationUrl();

    // Temporary for local MVP.
    // We will improve state storage later.
    res.cookie("linkedin_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
    });

    return res.redirect(authorizationUrl);
  } catch (error) {
    console.error("LinkedIn OAuth login failed:", error.message);

    return res.status(500).json({
      success: false,
      error: "Failed to start LinkedIn authentication.",
    });
  }
}