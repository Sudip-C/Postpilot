import express from "express";
import {env} from './config/env.js'
import cookieParser from "cookie-parser";
import linkedinAuthRoutes from "./routes/linkedinAuth.routes.js";
import postRoutes from "./routes/post.routes.js";
import jobRoutes from "./routes/job.routes.js";

const app = express();

const PORT = env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/posts", postRoutes);
app.use("/auth/linkedin", linkedinAuthRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/health",(req, res) => {
  res.status(200).json({
    status: "ok",
    service: "PostPilot",
  });
});

app.listen(PORT, () => {
  console.log(`PostPilot server running on port ${PORT}`);
});