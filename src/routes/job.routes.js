import { Router } from "express";

import { requireJobSecret } from "../middleware/jobAuth.middleware.js";
import { runDailyPost } from "../controllers/job.controller.js";

const router = Router();

router.post(
  "/daily-post",
  requireJobSecret,
  runDailyPost
);

export default router;