import { Router } from "express";
import {
  generatePost,
  publishPost,
} from "../controllers/post.controller.js";

const router = Router();

router.post("/publish", publishPost);
router.post("/generate", generatePost);

export default router;