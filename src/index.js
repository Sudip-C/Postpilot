import express from "express";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import postRoutes from "./routes/post.routes.js";
import linkedinAuthRoutes from "./routes/linkedinAuth.routes.js";
import jobRoutes from "./routes/job.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/posts", postRoutes);
app.use("/auth/linkedin", linkedinAuthRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "PostPilot",
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(env.port, () => {
    console.log(
      `PostPilot server running on port ${env.port}`
    );
  });
}

export default app;