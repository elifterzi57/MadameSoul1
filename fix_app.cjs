const fs = require('fs');

const getLocKey = (name) => {
    let id = name.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]/g, '')
                 .replace(/([A-Z])/g, (m, g1) => '_' + g1.toLowerCase())
                 .replace(/^_/, '')
                 .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
                 .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
                 .replace(/Ç/g, 'C').replace(/Ğ/g, 'G').replace(/İ/g, 'I')
                 .replace(/Ö/g, 'O').replace(/Ş/g, 'S').replace(/Ü/g, 'U');
    return id;
}

let code = fs.readFileSync('src/App.tsx', 'utf8');

// replace { id: "Afyon", name: "Afyon", desc: "..." }
// with { id: "Afyon", locKey: "afyon", name: "Afyon", desc: "..." }

code = code.replace(/\{ id: "([^"]+)", name: "([^"]+)", desc: "([^"]+)" \}/g, (match, id, name, desc) => {
    return `{ id: "${id}", locKey: "${getLocKey(name)}", name: "${name}", desc: "${desc}" }`;
});

// Update the result rendering part
code = code.replace(
    /\{t\.cards\?\.\[drawnCards\[index\]\?\.id\]\?\.name \|\| drawnCards\[index\]\?\.name\}/g,
    '{t.cards?.[drawnCards[index]?.locKey]?.name || drawnCards[index]?.name}'
);
code = code.replace(
    /\{t\.cards\?\.\[drawnCards\[index\]\?\.id\]\?\.desc \|\| drawnCards\[index\]\?\.desc\}/g,
    '{t.cards?.[drawnCards[index]?.locKey]?.general || drawnCards[index]?.desc}'
);

fs.writeFileSync('src/App.tsx', code);
