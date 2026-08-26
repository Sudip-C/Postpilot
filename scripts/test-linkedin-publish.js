import { publishLinkedInTextPost } from "../src/services/linkedinApi.service.js";

async function testLinkedInPublish() {
  try {
    console.log(
      "Publishing first PostPilot LinkedIn post...\n"
    );

    const content = `Building an automated LinkedIn publishing workflow has been a useful exercise in OAuth, token security, API integration, and backend automation.

Today I connected another important piece: publishing a text post directly through LinkedIn's API.

The approach is simple—build it incrementally:

Generate → Validate → Store → Publish → Automate

Each layer is tested before moving to the next one.

#NodeJS #Automation #BuildInPublic`;

    const result =
      await publishLinkedInTextPost(content);

    if (!result.postId) {
      throw new Error(
        "LinkedIn did not return a post ID."
      );
    }

    console.log(
      "LinkedIn post published successfully."
    );

    console.log("\nPost ID:");
    console.log(result.postId);

    console.log(
      "\nLinkedIn publishing test: OK"
    );
  } catch (error) {
    console.error(
      "\nLinkedIn publishing test: FAILED"
    );

    console.error(error.message);

    process.exit(1);
  }
}

testLinkedInPublish();