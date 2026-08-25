import { postTypes } from "../src/config/postTypes.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function testPostTypes() {
  try {
    assert(
      Array.isArray(postTypes),
      "Post types must be an array."
    );

    assert(
      postTypes.length > 0,
      "At least one post type is required."
    );

    const ids = new Set();

    for (const postType of postTypes) {
      assert(
        postType.id,
        "Every post type must have an id."
      );

      assert(
        postType.name,
        `Post type "${postType.id}" must have a name.`
      );

      assert(
        postType.description,
        `Post type "${postType.id}" must have a description.`
      );

      assert(
        !ids.has(postType.id),
        `Duplicate post type id found: ${postType.id}`
      );

      ids.add(postType.id);
    }

    console.log("Post types:\n");

    for (const postType of postTypes) {
      console.log(`${postType.name} (${postType.id})`);
    }

    console.log(`\nTotal post types: ${postTypes.length}`);
    console.log("\nPost types test: OK");
  } catch (error) {
    console.error("\nPost types test: FAILED");
    console.error(error.message);

    process.exit(1);
  }
}

testPostTypes();