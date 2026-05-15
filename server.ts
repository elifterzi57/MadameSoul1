import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

async function startServer() {
  console.log("Starting server implementation...");
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route for Gemini
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.error("GEMINI_API_KEY is not set correctly in the environment (value: " + (apiKey ? "masked" : "undefined") + ")");
        return res.status(500).json({ error: "Gemini API key is not configured. Please set it in the Secrets panel." });
      }

      // Safe debug log: only length and presence
      console.log(`Gemini API Key detected. Length: ${apiKey.length}`);

      const genAI = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Using gemini-flash-latest as per recent updates and user's curl example
      const response = await genAI.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
      });

      if (!response.text) {
        console.error("Gemini API returned an empty response", response);
        throw new Error("Empty response from AI model");
      }

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error Detail:", {
        message: error.message,
        status: error.status,
        code: error.code,
        details: error.details
      });
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  if (process.env.NODE_ENV === "production") {
    // In production, server.cjs is likely inside dist/
    // We try to find dist/ relative to cwd first, then fallback to __dirname
    let distPath = path.join(process.cwd(), "dist");
    
    // Check if we are running FROM the dist folder
    if (distPath.endsWith("dist/dist")) {
        distPath = process.cwd();
    }
    
    console.log(`Production mode: serving static files from ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.log("Development mode: loading Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
