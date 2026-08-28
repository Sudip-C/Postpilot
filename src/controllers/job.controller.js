import { runDailyPostJob } from "../jobs/dailyPost.job.js";

export async function runDailyPost(req, res) {
  try {
    const result = await runDailyPostJob();

    return res.status(200).json({
      success: true,
      message: "Daily LinkedIn posting job completed.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Daily posting endpoint failed:",
      error.message
    );

    return res.status(500).json({
      success: false,
      error: "Daily posting job failed.",
    });
  }
}