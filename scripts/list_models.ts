import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined in the environment.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function run() {
  try {
    console.log("Listing models...");
    const response = await ai.models.list();
    console.log("Available models:");
    response.models?.forEach(m => {
      console.log(`- Name: ${m.name} | Supported Actions: ${m.supportedGenerationMethods?.join(", ")}`);
    });
  } catch (err: any) {
    console.error("Failed to list models:", err.message || err);
  }
}

run();
