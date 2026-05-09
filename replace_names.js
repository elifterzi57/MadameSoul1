import fs from 'fs';
let content = fs.readFileSync('src/locales/en.yaml', 'utf-8');

content = content.replaceAll('Selçukassa', 'Selcukassa');
content = content.replaceAll('Zümrüdün', 'Emerald');
content = content.replaceAll('Zümrüd', 'Emerald');
content = content.replaceAll('Zümrüt', 'Emerald');
content = content.replaceAll('İsfahan', 'Isfahan');
content = content.replaceAll('Yatağan', 'Yataghan');
content = content.replaceAll('Bahçeler', 'Gardens');

fs.writeFileSync('src/locales/en.yaml', content);
console.log('Replaced Turkish card names in en.yaml');
