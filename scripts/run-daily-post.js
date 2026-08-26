import { runDailyPostJob } from "../src/jobs/dailyPost.job.js";

async function run() {
  try {
    console.log(
      "Running complete daily posting pipeline...\n"
    );

    const result =
      await runDailyPostJob();

    console.log(
      "\nDaily posting pipeline completed."
    );

    console.log(
      `Pillar: ${result.plan.pillar}`
    );

    console.log(
      `Post type: ${result.plan.postType}`
    );

    console.log(
      `Topic: ${result.topic}`
    );

    console.log(
      `Validation score: ${result.validation.score}`
    );

    console.log(
      `Database post ID: ${result.databasePostId}`
    );

    console.log(
      `LinkedIn post ID: ${result.linkedinPostId}`
    );

    console.log(
      "\nDaily posting job test: OK"
    );
  } catch (error) {
    console.error(
      "\nDaily posting job test: FAILED"
    );

    console.error(error.message);

    process.exit(1);
  }
}

run();