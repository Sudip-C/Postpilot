import {
  createLinkedInAuthorizationUrl,
  exchangeLinkedInCode,
} from "../services/linkedinOAuth.service.js";
import { saveLinkedInToken } from "../services/linkedinToken.service.js";

export function loginWithLinkedIn(req, res) {
  try {
    const { authorizationUrl, state } = createLinkedInAuthorizationUrl();

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

export async function linkedinCallback(req, res) {
  try {
    const { code, state, error, error_description } = req.query;

    if (error) {
      return res.status(400).json({
        success: false,
        error,
        description: error_description || null,
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Missing LinkedIn authorization code.",
      });
    }

    const savedState = req.cookies.linkedin_oauth_state;

    if (!savedState || !state || savedState !== state) {
      return res.status(400).json({
        success: false,
        error: "Invalid OAuth state.",
      });
    }

    res.clearCookie("linkedin_oauth_state");

    const token = await exchangeLinkedInCode(code);

    await saveLinkedInToken({
      accessToken: token.accessToken,
      expiresIn: token.expiresIn,
      refreshToken: token.refreshToken,
      refreshTokenExpiresIn: token.refreshTokenExpiresIn,
    });

    return res.status(200).json({
      success: true,
      message: "LinkedIn authentication successful.",
      tokenReceived: true,
      tokenStored: true,
      expiresIn: token.expiresIn,
      refreshTokenReceived: Boolean(token.refreshToken),
    });
  } catch (error) {
    console.error("LinkedIn OAuth callback failed:", error.message);

    return res.status(500).json({
      success: false,
      error: "LinkedIn authentication failed.",
    });
  }
}
