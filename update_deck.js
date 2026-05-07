import fs from 'fs';
const cardsData = JSON.parse(fs.readFileSync('./src/data/katina_cards.json', 'utf8'));

const cardsToProcess = cardsData.map((card, idx) => {
    let id = card.name.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]/g, '')
                      .replace(/([A-Z])/g, (m, g1) => '_' + g1.toLowerCase())
                      .replace(/^_/, '')
                      .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
                      .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
                      .replace(/Ç/g, 'C').replace(/Ğ/g, 'G').replace(/İ/g, 'I')
                      .replace(/Ö/g, 'O').replace(/Ş/g, 'S').replace(/Ü/g, 'U');
    if(!id) id = 'card_' + idx;
    return { id, name: card.name, desc: card.general_description || '' };
});

fs.writeFileSync('src/data/deck_info.json', JSON.stringify(cardsToProcess, null, 2));
console.log("deck_info.json updated!");
