import fs from 'fs';
import yaml from 'yaml';
import { GoogleGenAI } from '@google/genai';
import { env } from 'process';

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const langs = [
    { code: 'en', to: 'English' },
    { code: 'es', to: 'Spanish' },
    { code: 'fr', to: 'French' },
    { code: 'zh', to: 'Simplified Chinese' },
    { code: 'ko', to: 'Korean' }
];

async function run() {
    const appCode = fs.readFileSync('src/App.tsx', 'utf8');
    const deckMatches = [...appCode.matchAll(/\{ id: "([^"]+)", locKey: "([^"]+)", name: "([^"]+)", desc: "([^"]+)" \}/g)];
    
    // Create an object of what we want to translate
    const toTranslate = {};
    for (const match of deckMatches) {
        toTranslate[match[2]] = {
            name: match[3],
            desc: match[4]
        };
    }

    for (const lang of langs) {
        console.log(`Translating to ${lang.code}...`);
        try {
            const prompt = `Translate the following JSON object's string values from Turkish to ${lang.to}. Keep the exact same JSON structure and keys, only translate the values of 'name' and 'desc'. Return strictly valid JSON.

JSON:
${JSON.stringify(toTranslate, null, 2)}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const text = response.text;
            const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const translatedObj = JSON.parse(jsonText);

            // Update yaml
            let yamlData = {};
            try {
                yamlData = yaml.parse(fs.readFileSync(`src/locales/${lang.code}.yaml`, 'utf8')) || {};
            } catch(e) {}

            if(!yamlData.cards) yamlData.cards = {};

            for (const key of Object.keys(translatedObj)) {
                if(!yamlData.cards[key]) yamlData.cards[key] = {};
                yamlData.cards[key].name = translatedObj[key].name;
                yamlData.cards[key].general = translatedObj[key].desc; // App.tsx reads .general now!! 
            }

            fs.writeFileSync(`src/locales/${lang.code}.yaml`, yaml.stringify(yamlData));
            console.log(`Done ${lang.code}`);
        } catch (e) {
            console.error(`Error for ${lang.code}:`, e.message);
        }
    }

    // Don't forget tr.yaml!
    console.log(`Processing tr...`);
    let yamlDataTr = {};
    try {
        yamlDataTr = yaml.parse(fs.readFileSync(`src/locales/tr.yaml`, 'utf8')) || {};
    } catch(e) {}
    
    if(!yamlDataTr.cards) yamlDataTr.cards = {};
    for (const key of Object.keys(toTranslate)) {
        if(!yamlDataTr.cards[key]) yamlDataTr.cards[key] = {};
        yamlDataTr.cards[key].name = toTranslate[key].name;
        yamlDataTr.cards[key].general = toTranslate[key].desc;
    }
    fs.writeFileSync(`src/locales/tr.yaml`, yaml.stringify(yamlDataTr));
    console.log(`Done tr`);

}

run();
