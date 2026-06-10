import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;
console.log("Using API Key:", apiKey ? `${apiKey.substring(0, 10)}...` : "UNDEFINED");

if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined in the environment.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function run() {
  try {
    console.log("Calling Gemini API...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello, this is a test. Reply with one word: 'OK'.",
    });
    console.log("Success! Response:", response.text);
  } catch (err: any) {
    console.error("Failed to generate content:", err);
  }
}

run();
