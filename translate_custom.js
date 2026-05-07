import fs from 'fs';
import yaml from 'yaml';
import https from 'https';

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
    { code: 'tr', to: 'tr' },
    { code: 'en', to: 'en' },
    { code: 'es', to: 'es' },
    { code: 'fr', to: 'fr' },
    { code: 'zh', to: 'zh-CN' },
    { code: 'ko', to: 'ko' }
];

async function translateText(text, targetLang) {
    if (!text) return '';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Status ${res.statusCode}: ${data.substring(0, 50)}`));
                    return;
                }
                try {
                    const parsed = JSON.parse(data);
                    const translated = parsed[0].map(item => item[0]).join('');
                    resolve(translated);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function run() {
    const deckInfo = cardsToProcess.map(c => ({id: c.id, name: c.name}));
    fs.writeFileSync('src/data/deck_info.json', JSON.stringify(deckInfo, null, 2));
    
    for (const lang of langs) {
        console.log(`Processing ${lang.code}...`);
        let yamlData = {};
        try {
            yamlData = yaml.parse(fs.readFileSync(`src/locales/${lang.code}.yaml`, 'utf8')) || {};
        } catch(e) {}
        
        let translatedCards = {};
        
        for (let i = 0; i < cardsToProcess.length; i++) {
            const card = cardsToProcess[i];
            
            if (lang.code === 'tr') {
                translatedCards[card.id] = {
                    name: card.name,
                    general: card.general_description || '',
                    upright: card.upright_meaning || '',
                    reversed: card.reversed_meaning || ''
                };
            } else {
                try {
                    const name = await translateText(card.name, lang.to);
                    const general = await translateText(card.general_description || '', lang.to);
                    const upright = await translateText(card.upright_meaning || '', lang.to);
                    const reversed = await translateText(card.reversed_meaning || '', lang.to);
                    
                    translatedCards[card.id] = {
                        name,
                        general,
                        upright,
                        reversed
                    };
                    process.stdout.write('.');
                    await delay(50);
                } catch(e) {
                    console.error(`\nFailed on card ${card.id} for ${lang.code}:`, e.message);
                    translatedCards[card.id] = {
                        name: card.name,
                        general: card.general_description || '',
                        upright: card.upright_meaning || '',
                        reversed: card.reversed_meaning || ''
                    };
                    await delay(1000);
                }
            }
        }
        console.log();
        yamlData.cards = translatedCards;
        fs.writeFileSync(`src/locales/${lang.code}.yaml`, yaml.stringify(yamlData));
        console.log(`Done ${lang.code}`);
    }
}

run();
