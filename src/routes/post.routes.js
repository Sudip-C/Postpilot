import { Router } from "express";
import { generatePost } from "../controllers/post.controller.js";

const router = Router();

router.post("/generate", generatePost);

export default router;