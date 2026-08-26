import { getTodayContentPlan } from "../services/contentSelector.service.js";
import { generateDailyTopic } from "../services/dailyTopic.service.js";
import { generateLinkedInPost } from "../services/postGenerator.service.js";
import { validatePost } from "../services/postValidator.service.js";
import { publishLinkedInTextPost } from "../services/linkedinApi.service.js";

import {
  getRecentPosts,
  savePost,
  markPostPublished,
} from "../services/postDatabase.service.js";

export async function runDailyPostJob() {
  console.log("Starting PostPilot daily job...\n");

  // 1. Retrieve recent history
  const recentPosts = await getRecentPosts(30);

  console.log(
    `Loaded ${recentPosts.length} recent posts.`
  );

  // 2. Select today's content strategy
  const plan = getTodayContentPlan();

  console.log(
    `Content pillar: ${plan.pillar.name}`
  );

  console.log(
    `Post type: ${plan.postType.name}`
  );

  // 3. Generate a fresh topic
  const topic = await generateDailyTopic({
    pillar: plan.pillar,
    postType: plan.postType,
    recentPosts,
  });

  console.log(`Topic: ${topic}`);

  // 4. Generate post
  const generatedPost =
    await generateLinkedInPost({
      topic,
    });

  // 5. Validate post
  const validation =
    validatePost(generatedPost.content);

  console.log(
    `Validation score: ${validation.score}`
  );

  if (!validation.valid) {
    throw new Error(
      `Generated post failed validation: ${validation.issues.join(
        " | "
      )}`
    );
  }

  // 6. Save draft before publishing
  const savedPost = await savePost({
    topic,
    content: generatedPost.content,
    pillarId: plan.pillar.id,
    postTypeId: plan.postType.id,
    status: "draft",
  });

  console.log(
    `Draft saved: ${savedPost.id}`
  );

  // 7. Publish to LinkedIn
  const publication =
    await publishLinkedInTextPost(
      generatedPost.content
    );

  console.log(
    `LinkedIn post ID: ${publication.postId}`
  );

  // 8. Mark database record published
  const publishedPost =
    await markPostPublished(
      savedPost.id,
      publication.postId
    );

  console.log(
    "Database record marked as published."
  );

  return {
    success: true,

    plan: {
      pillar: plan.pillar.name,
      postType: plan.postType.name,
    },

    topic,

    validation,

    databasePostId: publishedPost.id,

    linkedinPostId:
      publication.postId,
  };
}