import fs from 'fs';
import yaml from 'yaml';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const KATINA_DECK = [
  { id: "Afyon", name: "Afyon", desc: "Bağımlılıklar, göz boyama, illüzyonlar ve toksik bağlar." },
  { id: "Ağaç", name: "Ağaç", desc: "Köklenme, sağlık, büyüme, aile soyu ve uzun ömür." },
  { id: "Alyans", name: "Alyans", desc: "Bağlılık, evlilik, ortaklık, ciddi bir tamamlanma." },
  { id: "Anahtar", name: "Anahtar", desc: "Çözüm ve yeni başlangıçlar. Sırların açığa çıkması." },
  { id: "Ay", name: "Ay", desc: "Sezgiler, romantizm, melankoli ve değişken ruh halleri." },
  { id: "Bahçeler", name: "Bahçeler", desc: "Sosyalleşme, çevre, kalabalıklar ve toplum içindeki yeriniz." },
  { id: "Balık", name: "Balık", desc: "Maddi kazanç, bolluk ve şansın simgesidir." },
  { id: "Baykuş", name: "Baykuş", desc: "Bilgelik, gece gelen haberler veya etrafı gözlemleme zamanı." },
  { id: "Bulutlar", name: "Bulutlar", desc: "Kafa karışıklığı, belirsizlik veya geçici sıkıntılar." },
  { id: "Çapa", name: "Çapa", desc: "Güven, sadakat, bir yere veya kişiye bağlılık, umut." },
  { id: "Çiçekler", name: "Çiçekler", desc: "Mutluluk, güzellik, armağanlar ve hoş sürprizler." },
  { id: "Dağ", name: "Dağ", desc: "Engeller, aşılması zor durumlar, gecikmeler ve sınanmalar." },
  { id: "Derviş", name: "Derviş", desc: "Bilgelik, yalnızlık, sabır ve manevi rehberlik." },
  { id: "Deve", name: "Deve", desc: "Finansal konularda sabır, inatçılık veya uzun bir yolculuk." },
  { id: "Ev", name: "Ev", desc: "Huzur, güvenlik, aile yaşantısı ve köklerin olduğu yer." },
  { id: "Fareler", name: "Fareler", desc: "Kayıplar, içten içe kemiren endişe ve stres." },
  { id: "Güneş", name: "Güneş", desc: "Büyük şans, mutluluk, aydınlanma ve başarı." },
  { id: "Haç", name: "Haç", desc: "Kaderin bir cilvesi, zorunluluklar veya acı ama gerekli tecrübeler." },
  { id: "Kale", name: "Kale", desc: "Güvenlik, sağlam yapı, dış etkenlere karşı korunaklı olma." },
  { id: "Kalp", name: "Kalp", desc: "Büyük aşk, sevgi, şefkat ve duygusal mutluluk." },
  { id: "Kapı", name: "Kapı", desc: "Fırsatlar, açılan yeni yollar veya verilmesi gereken bir karar." },
  { id: "Kitap", name: "Kitap", desc: "Sırlar, eğitim, öğrenilmesi gereken şaşırtıcı bir gerçek." },
  { id: "Köpek", name: "Köpek", desc: "Sadakat, dürüst bir dostluk veya güvenilir destek." },
  { id: "KızÇocuğu", name: "Kız Çocuğu", desc: "Masumiyet, yeni başlangıçlar veya genç bir enerji." },
  { id: "Mektup", name: "Mektup", desc: "Haberler, beklenen bir mesaj veya önemli bir iletişim." },
  { id: "Mezar", name: "Mezar", desc: "Bitişler, büyük değişim, bir devrin kapanıp yenisinin başlaması." },
  { id: "NilNehri", name: "Nil Nehri", desc: "Bereketi, akışı, uzun ve verimli bir süreci temsil eder." },
  { id: "Samyeli", name: "Samyeli", desc: "Beklenmedik olaylar, ani değişimler veya geçici rüzgarlar." },
  { id: "Süpürge", name: "Süpürge", desc: "Temizlenme, kavga, hayatından bir şeyleri çıkarma gerekliliği." },
  { id: "Tilki", name: "Tilki", desc: "Kurnazlık, dikkatli olunması gereken bir fırsatçılık." },
  { id: "Yatağan", name: "Yatağan", desc: "Keskin kararlar, güç, savunma veya yaklaşan bir tehlike." },
  { id: "Yelkenli", name: "Yelkenli", desc: "Yolculuklar, akışta kalmak veya uzaktan gelecek bir haber." },
  { id: "Yol", name: "Yol", desc: "Seçimler, ayrılıklar ya da yeni bir hayata doğru atılan adım." },
  { id: "Yılan", name: "Yılan", desc: "İhanet, gizli düşmanlık, kıskançlık veya sinsilik." },
  { id: "Yıldızlar", name: "Yıldızlar", desc: "Umut, ilham, hayallerin gerçekleşmesi, ruhsal rehberlik." }
];

const langs = [
  { code: 'en', name: 'English' },
  { code: 'tr', name: 'Turkish' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' }
];

async function translate() {
    for(const lang of langs) {
        if(lang.code === 'tr') {
            const trFile = fs.readFileSync('src/locales/tr.yaml', 'utf8');
            const data = yaml.parse(trFile);
            data.cards = {};
            for(const card of KATINA_DECK) {
                data.cards[card.id] = { name: card.name, desc: card.desc };
            }
            fs.writeFileSync('src/locales/tr.yaml', yaml.stringify(data));
            continue;
        }
        
        console.log(`Translating to ${lang.name}...`);
        
        const prompt = `Translate the following array of cards from Turkish to ${lang.name}. Keep the JSON format exactly, with id, name, and desc. Respond with ONLY valid JSON array and no markdown blocks.

${JSON.stringify(KATINA_DECK, null, 2)}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });

        let result = response.text.trim();
        if(result.startsWith('\`\`\`json')) result = result.replace(/^\`\`\`json\n?/, '').replace(/\n?\`\`\`$/, '');
        else if(result.startsWith('\`\`\`')) result = result.replace(/^\`\`\`\n?/, '').replace(/\n?\`\`\`$/, '');

        const translated = JSON.parse(result);

        const yamlContent = fs.readFileSync(`src/locales/${lang.code}.yaml`, 'utf8');
        const data = yaml.parse(yamlContent);
        data.cards = {};
        for(const card of translated) {
            data.cards[card.id] = { name: card.name, desc: card.desc };
        }
        fs.writeFileSync(`src/locales/${lang.code}.yaml`, yaml.stringify(data));
    }
}
translate();
