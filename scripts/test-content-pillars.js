import { contentPillars } from "../src/config/contentPillars.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function testContentPillars() {
  try {
    assert(
      Array.isArray(contentPillars),
      "Content pillars must be an array."
    );

    assert(
      contentPillars.length > 0,
      "At least one content pillar is required."
    );

    const ids = new Set();

    for (const pillar of contentPillars) {
      assert(pillar.id, "Every pillar must have an id.");
      assert(pillar.name, "Every pillar must have a name.");
      assert(pillar.description, "Every pillar must have a description.");

      assert(
        typeof pillar.weight === "number" && pillar.weight > 0,
        `${pillar.name} must have a positive weight.`
      );

      assert(
        !ids.has(pillar.id),
        `Duplicate pillar id found: ${pillar.id}`
      );

      ids.add(pillar.id);
    }

    const totalWeight = contentPillars.reduce(
      (sum, pillar) => sum + pillar.weight,
      0
    );

    assert(
      totalWeight === 100,
      `Content pillar weights must total 100. Current total: ${totalWeight}`
    );

    console.log("Content pillars:\n");

    for (const pillar of contentPillars) {
      console.log(
        `${pillar.name} — ${pillar.weight}%`
      );
    }

    console.log(`\nTotal weight: ${totalWeight}%`);
    console.log("\nContent pillars test: OK");
  } catch (error) {
    console.error("\nContent pillars test: FAILED");
    console.error(error.message);

    process.exit(1);
  }
}

testContentPillars();