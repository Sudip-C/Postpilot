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