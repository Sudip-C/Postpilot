import { Router } from "express";
import {
  loginWithLinkedIn,
  linkedinCallback,
} from "../controllers/linkedinAuth.controller.js";

const router = Router();

router.get("/callback", linkedinCallback);
router.get("/", loginWithLinkedIn);

export default router;