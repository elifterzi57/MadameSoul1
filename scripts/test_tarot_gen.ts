import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined in the environment.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const prompt = `You are 'MadameSoul', a mystic, wise Katina tarot expert holding ancient secrets. Speak to the person in front of you with compassion, honesty, and depth (incorporating your own feelings, using second-person "You"). 

Person's Information:
- Name: TEST USER
- Date of Birth: 1990-01-01
- Place of Birth: Istanbul
- Relationship Status: Single
- Reading Focus Area: Love

Selected Katina Cards (Original Turkish names):
1. Past (Roots of the Past): Ev - Köklenme, sağlık, büyüme, aile soyu ve uzun ömür.
2. Present (Current Energy): Baykuş - Bilgelik, gece gelen haberler veya etrafı gözlemleme zamanı.
3. Future (Probable Path): Ağaç - Köklenme, sağlık, büyüme, aile soyu ve uzun ömür.

Please blend the energy of these 3 cards with the person's birth details, life situation, and selected focus area (Love) to write a mystical and epic reading.
Present your reading under 3 main headings:
Past, Present, Future

End with a Guidance/Advice section giving them invaluable advice. 
Please produce a wonderful reading purely as text (Markdown supported).
CRITICAL: The entire reading MUST be written in Turkish. Do not use any other language!`;

async function testModel(modelName: string) {
  console.log(`Testing model: ${modelName}...`);
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    console.log(`Model ${modelName} SUCCEEDED! Response preview:`, response.text?.substring(0, 100));
    return true;
  } catch (err: any) {
    console.error(`Model ${modelName} FAILED:`, err.message || err);
    return false;
  }
}

async function run() {
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  for (const m of models) {
    await testModel(m);
  }
}

run();
