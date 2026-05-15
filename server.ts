import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

async function startServer() {
  console.log("[Server] Starting MadameSoul server...");
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check - MUST be early
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route for Gemini
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.error("[Server] GEMINI_API_KEY is not configured");
        return res.status(500).json({ error: "Gemini API key is not configured. Please set it in the Secrets panel." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      if (!response.text) {
        throw new Error("Empty response from AI model");
      }

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("[Server] Gemini API Error:", error.message);
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  // Serve static files
  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(process.cwd(), "dist");
    console.log(`[Server] Production mode: serving from ${distPath}`);
    
    // Safety check for index.html
    const indexPath = path.join(distPath, "index.html");
    if (!fs.existsSync(indexPath)) {
       console.warn(`[Server] WARNING: index.html not found at ${indexPath}`);
    }

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`[Server] Error sending index.html:`, err);
          res.status(500).send("Error loading application");
        }
      });
    });
  } else {
    console.log("[Server] Development mode: loading Vite...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] MadameSoul running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Server] CRITICAL: Failed to start server:", err);
  process.exit(1);
});
