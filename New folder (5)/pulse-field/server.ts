import express from "express";
import cors from "cors";

export function createServer() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  // Basic API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  
  return app;
}