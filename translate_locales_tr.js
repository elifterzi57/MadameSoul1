import fs from 'fs';
import yaml from 'yaml';

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

function run() {
    let yamlData = {};
    try {
        yamlData = yaml.parse(fs.readFileSync(`src/locales/tr.yaml`, 'utf8')) || {};
    } catch(e) {}
    
    let translatedCards = {};
    for (const card of cardsToProcess) {
        translatedCards[card.id] = {
            name: card.name,
            general: card.general_description || '',
            upright: card.upright_meaning || '',
            reversed: card.reversed_meaning || ''
        };
    }
    
    yamlData.cards = translatedCards;
    fs.writeFileSync(`src/locales/tr.yaml`, yaml.stringify(yamlData));
    console.log(`Saved tr.yaml\n`);
}

run();
