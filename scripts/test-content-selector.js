import { getTodayContentPlan } from "../src/services/contentSelector.service.js";
import { contentPillars } from "../src/config/contentPillars.js";
import { postTypes } from "../src/config/postTypes.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function testContentSelector() {
  try {
    const sampleSize = 1000;

    const pillarCounts = {};
    const postTypeCounts = {};

    for (let i = 0; i < sampleSize; i++) {
      const plan = getTodayContentPlan();

      assert(plan.pillar, "Content plan must contain a pillar.");
      assert(plan.postType, "Content plan must contain a post type.");

      const validPillar = contentPillars.some(
        (pillar) => pillar.id === plan.pillar.id
      );

      assert(
        validPillar,
        `Invalid pillar selected: ${plan.pillar.id}`
      );

      const validPostType = postTypes.some(
        (postType) => postType.id === plan.postType.id
      );

      assert(
        validPostType,
        `Invalid post type selected: ${plan.postType.id}`
      );

      pillarCounts[plan.pillar.id] =
        (pillarCounts[plan.pillar.id] || 0) + 1;

      postTypeCounts[plan.postType.id] =
        (postTypeCounts[plan.postType.id] || 0) + 1;
    }

    console.log("Sample content plan:\n");

    console.log(getTodayContentPlan());

    console.log("\nPillar distribution after 1000 selections:\n");

    for (const pillar of contentPillars) {
      console.log(
        `${pillar.name}: ${pillarCounts[pillar.id] || 0}`
      );
    }

    console.log("\nPost type distribution:\n");

    for (const postType of postTypes) {
      console.log(
        `${postType.name}: ${postTypeCounts[postType.id] || 0}`
      );
    }

    console.log("\nContent selector test: OK");
  } catch (error) {
    console.error("\nContent selector test: FAILED");
    console.error(error.message);

    process.exit(1);
  }
}

testContentSelector();