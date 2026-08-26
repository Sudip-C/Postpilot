import { supabase } from "../src/config/supabase.js";

import {
  saveLinkedInToken,
  getLinkedInAccessToken,
} from "../src/services/linkedinToken.service.js";

async function testTokenStorage() {
  const fakeToken =
    "postpilot-test-linkedin-token";

  try {
    console.log(
      "Testing LinkedIn token storage...\n"
    );

    await saveLinkedInToken({
      accessToken: fakeToken,
      expiresIn: 3600,
    });

    const { data, error } = await supabase
      .from("linkedin_tokens")
      .select(
        "encrypted_access_token, access_token_iv, access_token_auth_tag"
      )
      .eq("provider", "linkedin")
      .single();

    if (error) {
      throw error;
    }

    if (
      data.encrypted_access_token === fakeToken
    ) {
      throw new Error(
        "Token was stored as plaintext."
      );
    }

    const decryptedToken =
      await getLinkedInAccessToken();

    if (decryptedToken !== fakeToken) {
      throw new Error(
        "Decrypted token does not match original token."
      );
    }

    console.log(
      "Token encrypted successfully."
    );

    console.log(
      "Token decrypted successfully."
    );

    console.log(
      "\nLinkedIn token storage test: OK"
    );
  } catch (error) {
    console.error(
      "\nLinkedIn token storage test: FAILED"
    );

    console.error(error.message);

    process.exitCode = 1;
  } finally {
    console.log(
      "\nCleaning up test token..."
    );

    const { error } = await supabase
      .from("linkedin_tokens")
      .delete()
      .eq("provider", "linkedin");

    if (error) {
      console.error(
        `Cleanup failed: ${error.message}`
      );

      process.exitCode = 1;
    } else {
      console.log("Test token removed.");
    }
  }
}

testTokenStorage();