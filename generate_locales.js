import fs from 'fs';
import yaml from 'yaml';
import translate from 'translate-google';

const cardsData = JSON.parse(fs.readFileSync('./src/data/katina_cards.json', 'utf8'));

// create IDs for cards
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
    { code: 'tr', to: 'tr' },
    { code: 'en', to: 'en' },
    { code: 'es', to: 'es' },
    { code: 'fr', to: 'fr' },
    { code: 'zh', to: 'zh-cn' },
    { code: 'ko', to: 'ko' }
];

async function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function run() {
    // Generate deck info first
    const deckInfo = cardsToProcess.map(c => ({id: c.id, name: c.name}));
    fs.writeFileSync('src/data/deck_info.json', JSON.stringify(deckInfo, null, 2));
    
    for (const lang of langs) {
        console.log(`Processing ${lang.code}...`);
        let yamlData = {};
        try {
            yamlData = yaml.parse(fs.readFileSync(`src/locales/${lang.code}.yaml`, 'utf8')) || {};
        } catch(e) {}
        
        let translatedCards = {};
        
        if (lang.code === 'tr') {
            for (const card of cardsToProcess) {
                translatedCards[card.id] = {
                    name: card.name,
                    general: card.general_description || '',
                    upright: card.upright_meaning || '',
                    reversed: card.reversed_meaning || ''
                };
            }
        } else {
            // translate them in batches of 5
            for (let i = 0; i < cardsToProcess.length; i += 5) {
                const batch = cardsToProcess.slice(i, i + 5);
                const toTranslate = {};
                for(const card of batch) {
                    toTranslate[card.id] = {
                        name: card.name,
                        general: card.general_description || '',
                        upright: card.upright_meaning || '',
                        reversed: card.reversed_meaning || ''
                    };
                }
                
                try {
                    const res = await translate(toTranslate, { to: lang.to });
                    Object.assign(translatedCards, res);
                    await delay(500); // 0.5s between batches
                } catch(e) {
                    console.error(`Error translating batch in ${lang.code}:`, e.message);
                }
            }
        }
        
        yamlData.cards = translatedCards;
        fs.writeFileSync(`src/locales/${lang.code}.yaml`, yaml.stringify(yamlData));
        console.log(`Done ${lang.code}`);
    }
}

run();
