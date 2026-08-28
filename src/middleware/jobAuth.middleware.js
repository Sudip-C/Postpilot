import crypto from "crypto";
import { env } from "../config/env.js";

function safeCompare(a, b) {
  const first = Buffer.from(a || "");
  const second = Buffer.from(b || "");

  if (first.length !== second.length) {
    return false;
  }

  return crypto.timingSafeEqual(first, second);
}

export function requireJobSecret(req, res, next) {
  if (!env.dailyJobSecret) {
    console.error("DAILY_JOB_SECRET is not configured.");

    return res.status(500).json({
      success: false,
      error: "Job authentication is not configured.",
    });
  }

  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized.",
    });
  }

  const providedSecret = authorization.slice(7).trim();

  if (!safeCompare(providedSecret, env.dailyJobSecret)) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized.",
    });
  }

  next();
}