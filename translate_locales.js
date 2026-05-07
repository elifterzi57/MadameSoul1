import fs from 'fs';
import yaml from 'yaml';
import translate from 'google-translate-api-x';

const cardsData = JSON.parse(fs.readFileSync('./src/data/katina_cards.json', 'utf8'));

// create IDs
const cardsToProcess = cardsData.map((card, idx) => {
    let id = card.name.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]/g, '')
                      .replace(/([A-Z])/g, (m, g1) => '_' + g1.toLowerCase())
                      .replace(/^_/, '')
                      .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
                      .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
                      .replace(/Ç/g, 'C').replace(/Ğ/g, 'G').replace(/İ/g, 'I')
                      .replace(/Ö/g, 'O').replace(/Ş/g, 'S').replace(/Ü/g, 'U');
    if(!id) id = 'card_' + idx;
    return { ...card, id };
});

const langs = [
    { code: 'en', to: 'en' },
    { code: 'es', to: 'es' },
    { code: 'fr', to: 'fr' },
    { code: 'zh', to: 'zh-CN' },
    { code: 'ko', to: 'ko' }
];

async function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function run() {
    for (const lang of langs) {
        console.log(`Processing ${lang.code}...`);
        
        let yamlData = {};
        try {
            yamlData = yaml.parse(fs.readFileSync(`src/locales/${lang.code}.yaml`, 'utf8')) || {};
        } catch(e) {}
        
        let translatedCards = {};
        
        // chunk sizes of 10 cards to prevent payload too large or errors
        const chunkSize = 10;
        for (let i = 0; i < cardsToProcess.length; i += chunkSize) {
            const batch = cardsToProcess.slice(i, i + chunkSize);
            
            // Build flat array of texts
            const texts = [];
            for (const card of batch) {
                texts.push(card.name);
                texts.push(card.general_description || '');
                texts.push(card.upright_meaning || '');
                texts.push(card.reversed_meaning || '');
            }
            
            try {
                const res = await translate(texts, { to: lang.to });
                // res is an array of objects when sending an array
                const translatedStrings = res.map(r => r.text);
                
                let textIndex = 0;
                for (const card of batch) {
                    translatedCards[card.id] = {
                        name: translatedStrings[textIndex++],
                        general: translatedStrings[textIndex++],
                        upright: translatedStrings[textIndex++],
                        reversed: translatedStrings[textIndex++]
                    };
                }
                
                process.stdout.write('.');
                await delay(1000); // 1 second delay between requests
            } catch (error) {
                console.error(`\nError in batch starting at ${i} for ${lang.code}:`, error.message);
                // Assign TR values on error
                for (const card of batch) {
                    translatedCards[card.id] = {
                        name: card.name,
                        general: card.general_description || '',
                        upright: card.upright_meaning || '',
                        reversed: card.reversed_meaning || ''
                    };
                }
                await delay(5000); // 5 sec penalty
            }
        }
        console.log();
        
        yamlData.cards = translatedCards;
        fs.writeFileSync(`src/locales/${lang.code}.yaml`, yaml.stringify(yamlData));
        console.log(`Saved ${lang.code}.yaml\n`);
    }
}

run();
