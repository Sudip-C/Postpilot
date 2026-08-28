import { Router } from "express";
import {
  generatePost,
  publishPost,
  runDailyPost,
} from "../controllers/post.controller.js";
import { requireJobSecret } from "../middleware/jobAuth.middleware.js";

const router = Router();

router.post("/publish",requireJobSecret, publishPost);
router.post("/generate",requireJobSecret, generatePost);
router.post("/daily", requireJobSecret, runDailyPost);

export default router;
