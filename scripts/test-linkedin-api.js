import { getLinkedInUserInfo } from "../src/services/linkedinApi.service.js";

async function testLinkedInApi() {
  try {
    console.log("Testing LinkedIn API connection...\n");

    const user = await getLinkedInUserInfo();

    if (!user) {
      throw new Error(
        "LinkedIn API returned an empty response."
      );
    }

    if (!user.sub) {
      throw new Error(
        "LinkedIn user info does not contain a subject ID."
      );
    }

    console.log("LinkedIn user info received.");

    console.log(`Subject ID: ${user.sub}`);

    if (user.name) {
      console.log(`Name: ${user.name}`);
    }

    console.log(
      "\nLinkedIn API connection test: OK"
    );
  } catch (error) {
    console.error(
      "\nLinkedIn API connection test: FAILED"
    );

    console.error(error.message);

    process.exit(1);
  }
}

testLinkedInApi();