import { supabase } from "../config/supabase.js";

export async function savePost({
  topic,
  content,
  pillarId = null,
  postTypeId = null,
  status = "draft",
}) {
  if (!topic || typeof topic !== "string" || !topic.trim()) {
    throw new Error("A valid topic is required.");
  }

  if (!content || typeof content !== "string" || !content.trim()) {
    throw new Error("Valid post content is required.");
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      topic: topic.trim(),
      content: content.trim(),
      pillar_id: pillarId,
      post_type_id: postTypeId,
      status,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save post: ${error.message}`);
  }

  return data;
}
export async function getRecentPosts(limit = 30) {
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error("Recent posts limit must be a positive integer.");
  }

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, topic, pillar_id, post_type_id, content, status, created_at, published_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to retrieve recent posts: ${error.message}`);
  }

  return data;
}
export async function getPublishedPostForToday() {
  // Determine today's calendar date in India.
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());

  const year = parts.find(
    (part) => part.type === "year"
  ).value;

  const month = parts.find(
    (part) => part.type === "month"
  ).value;

  const day = parts.find(
    (part) => part.type === "day"
  ).value;

  const indiaDate = `${year}-${month}-${day}`;

  const start = new Date(
    `${indiaDate}T00:00:00+05:30`
  );

  const end = new Date(
    start.getTime() + 24 * 60 * 60 * 1000
  );

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, topic, status, linkedin_post_id, published_at"
    )
    .eq("status", "published")
    .gte("published_at", start.toISOString())
    .lt("published_at", end.toISOString())
    .order("published_at", {
      ascending: false,
    })
    .limit(1);

  if (error) {
    throw new Error(
      `Failed to check today's published post: ${error.message}`
    );
  }

  return data?.[0] || null;
}
export async function markPostPublished(
  postId,
  linkedinPostId
) {
  if (!postId) {
    throw new Error("Post ID is required.");
  }

  if (!linkedinPostId) {
    throw new Error(
      "LinkedIn post ID is required."
    );
  }

  const { data, error } = await supabase
    .from("posts")
    .update({
      status: "published",
      linkedin_post_id: linkedinPostId,
      published_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to mark post as published: ${error.message}`
    );
  }

  return data;
}
export async function markPostFailed(
  postId,
  errorMessage
) {
  if (!postId) {
    throw new Error("Post ID is required.");
  }

  const { data, error } = await supabase
    .from("posts")
    .update({
      status: "failed",
      error_message:
        errorMessage || "Unknown publishing error.",
    })
    .eq("id", postId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to mark post as failed: ${error.message}`
    );
  }

  return data;
}