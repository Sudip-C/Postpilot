import { Router } from "express";
import { loginWithLinkedIn } from "../controllers/linkedinAuth.controller.js";

const router = Router();

router.get("/", loginWithLinkedIn);

export default router;