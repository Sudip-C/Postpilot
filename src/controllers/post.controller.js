import { generateLinkedInPost } from "../services/postGenerator.service.js";
import { publishLinkedInTextPost } from "../services/linkedinApi.service.js";

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

export async function publishPost(req, res) {
  try {
    const { content } = req.body;

    if (
      !content ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "Valid post content is required.",
      });
    }

    const result = await publishLinkedInTextPost(
      content.trim()
    );

    return res.status(201).json({
      success: true,
      message: "LinkedIn post published successfully.",
      data: {
        postId: result.postId,
      },
    });
  } catch (error) {
    console.error(
      "LinkedIn publishing failed:",
      error.message
    );

    return res.status(500).json({
      success: false,
      error: "Failed to publish LinkedIn post.",
    });
  }
}