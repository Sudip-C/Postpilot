import express from "express";
import {env} from './config/env.js'

const app = express();

const PORT = env.PORT || 3000;

app.use(express.json());

app.get("/health",(req, res) => {
  res.status(200).json({
    status: "ok",
    service: "PostPilot",
  });
});

app.listen(PORT, () => {
  console.log(`PostPilot server running on port ${PORT}`);
});