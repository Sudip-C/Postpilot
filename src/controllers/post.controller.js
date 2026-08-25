import { generateLinkedInPost } from "../services/postGenerator.service.js";

export async function generatePost(req, res) {
  try {
    const { topic, audience } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({
        success: false,
        error: "A valid topic is required.",
      });
    }

    const post = await generateLinkedInPost({
      topic,
      audience,
    });

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Post generation failed:", error.message);

    return res.status(500).json({
      success: false,
      error: "Failed to generate LinkedIn post.",
    });
  }
}