import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { db, auth } from './lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Login } from './components/Login';
import { KatinaMoon } from './components/KatinaMoon';
import en from './locales/en.yaml';
import tr from './locales/tr.yaml';
import es from './locales/es.yaml';
import fr from './locales/fr.yaml';
import zh from './locales/zh.yaml';
import ko from './locales/ko.yaml';
import { Sparkles, Star, RefreshCw, ChevronRight, Download, Globe, ArrowLeft, Share2, X, Plus, Copy, Check, ShoppingBag, LogOut, Loader2 } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const KATINA_DECK = [
  { id: "Afyon", locKey: "afyon", name: "Afyon", desc: "Bağımlılıklar, göz boyama, illüzyonlar ve toksik bağlar." },
  { id: "Agac", locKey: "agac", name: "Ağaç", desc: "Köklenme, sağlık, büyüme, aile soyu ve uzun ömür." },
  { id: "Alyans", locKey: "alyans", name: "Alyans", desc: "Bağlılık, evlilik, ortaklık, ciddi bir tamamlanma." },
  { id: "Anahtar", locKey: "anahtar", name: "Anahtar", desc: "Çözüm ve yeni başlangıçlar. Sırların açığa çıkması." },
  { id: "Ay", locKey: "ay", name: "Ay", desc: "Sezgiler, romantizm, melankoli ve değişken ruh halleri." },
  { id: "Bahceler", locKey: "bahceler", name: "Bahçeler", desc: "Sosyalleşme, çevre, kalabalıklar ve toplum içindeki yeriniz." },
  { id: "Balik", locKey: "balik", name: "Balık", desc: "Maddi kazanç, bolluk ve şansın simgesidir." },
  { id: "Baykus", locKey: "baykus", name: "Baykuş", desc: "Bilgelik, gece gelen haberler veya etrafı gözlemleme zamanı." },
  { id: "Bulutlar", locKey: "bulutlar", name: "Bulutlar", desc: "Kafa karışıklığı, belirsizlik veya geçici sıkıntılar." },
  { id: "Capa", locKey: "Capa", name: "Çapa", desc: "Güven, sadakat, bir yere veya kişiye bağlılık, umut." },
  { id: "Cicekler", locKey: "Cicekler", name: "Çiçekler", desc: "Mutluluk, güzellik, armağanlar ve hoş sürprizler." },
  { id: "Dag", locKey: "dag", name: "Dağ", desc: "Engeller, aşılması zor durumlar, gecikmeler ve sınanmalar." },
  { id: "Dervis", locKey: "dervis", name: "Derviş", desc: "Bilgelik, yalnızlık, sabır ve manevi rehberlik." },
  { id: "Deve", locKey: "deve", name: "Deve", desc: "Finansal konularda sabır, inatçılık veya uzun bir yolculuk." },
  { id: "Ev", locKey: "ev", name: "Ev", desc: "Huzur, güvenlik, aile yaşantısı ve köklerin olduğu yer." },
  { id: "Fareler", locKey: "fareler", name: "Fareler", desc: "Kayıplar, içten içe kemiren endişe ve stres." },
  { id: "Gunes", locKey: "gunes", name: "Güneş", desc: "Büyük şans, mutluluk, aydınlanma ve başarı." },
  { id: "Hac", locKey: "hac", name: "Haç", desc: "Kaderin bir cilvesi, zorunluluklar veya acı ama gerekli tecrübeler." },
  { id: "Kale", locKey: "kale", name: "Kale", desc: "Güvenlik, sağlam yapı, dış etkenlere karşı korunaklı olma." },
  { id: "Kalp", locKey: "kalp", name: "Kalp", desc: "Büyük aşk, sevgi, şefkat ve duygusal mutluluk." },
  { id: "Kapi", locKey: "kapi", name: "Kapı", desc: "Fırsatlar, açılan yeni yollar veya verilmesi gereken bir karar." },
  { id: "Kitap", locKey: "kitap", name: "Kitap", desc: "Sırlar, eğitim, öğrenilmesi gereken şaşırtıcı bir gerçek." },
  { id: "Kopek", locKey: "kopek", name: "Köpek", desc: "Sadakat, dürüst bir dostluk veya güvenilir destek." },
  { id: "KizCocugu", locKey: "kizCocugu", name: "Kız Çocuğu", desc: "Masumiyet, yeni başlangıçlar veya genç bir enerji." },
  { id: "Mektup", locKey: "mektup", name: "Mektup", desc: "Haberler, beklenen bir mesaj veya önemli bir iletişim." },
  { id: "Mezar", locKey: "mezar", name: "Mezar", desc: "Bitişler, büyük değişim, bir devrin kapanıp yenisinin başlaması." },
  { id: "Nil Nehri", locKey: "nil_nehri", name: "Nil Nehri", desc: "Bereketi, akışı, uzun ve verimli bir süreci temsil eder." },
  { id: "Samyeli", locKey: "samyeli", name: "Samyeli", desc: "Beklenmedik olaylar, ani değişimler veya geçici rüzgarlar." },
  { id: "Supurge", locKey: "supurge", name: "Süpürge", desc: "Temizlenme, kavga, hayatından bir şeyleri çıkarma gerekliliği." },
  { id: "Tilki", locKey: "tilki", name: "Tilki", desc: "Kurnazlık, dikkatli olunması gereken bir fırsatçılık." },
  { id: "Yatagan", locKey: "yatagan", name: "Yatağan", desc: "Keskin kararlar, güç, savunma veya yaklaşan bir tehlike." },
  { id: "Yelkenli", locKey: "yelkenli", name: "Yelkenli", desc: "Yolculuklar, akışta kalmak veya uzaktan gelecek bir haber." },
  { id: "Yol", locKey: "yol", name: "Yol", desc: "Seçimler, ayrılıklar ya da yeni bir hayata doğru atılan adım." },
  { id: "Yilan", locKey: "yilan", name: "Yılan", desc: "İhanet, gizli düşmanlık, kıskançlık veya sinsilik." },
  { id: "Yildizlar", locKey: "yildizlar", name: "Yıldızlar", desc: "Umut, ilham, hayallerin gerçekleşmesi, ruhsal rehberlik." }
];

type Language = 'tr' | 'en' | 'es' | 'fr' | 'zh' | 'ko';

type UserInfo = {
  name: string;
  dob: string;
  birthplace: string;
  relationship: string;
  language: Language;
};

type Card = { id: string; locKey: string; name: string; desc: string };

const locales: Record<Language, any> = { en, tr, es, fr, zh, ko };

const t: Record<string, Record<Language, string>> = new Proxy({} as any, {
  get: (_, key: string) => {
    return new Proxy({} as any, {
      get: (_, lang: string) => {
        return locales[lang as Language]?.[key];
      }
    });
  }
});

const STATUS_KEYS = ['single', 'relationship', 'married', 'engaged', 'complicated', 'breakup'] as const;

const storeTranslations: Record<string, Record<Language, string>> = {
  storeTitle: { en: "Madame's Store", tr: "Madam'ın Mağazası", es: "La Tienda", fr: "La Boutique", zh: "商店", ko: "마담의 상점" },
  buyMoons: { en: "Buy Katina Moons", tr: "Katina Moon Satın Al", es: "Comprar Lunas Katina", fr: "Acheter des Lunes Katina", zh: "购买 Katina 月亮", ko: "카티나 문 구매하기" },
  moons: { en: "Katina Moon", tr: "Katina Moon", es: "Katina Luna", fr: "Katina Lune", zh: "Katina 月亮", ko: "카티나 문" },
  popular: { en: "POPULAR", tr: "POPÜLER", es: "POPULAR", fr: "POPULAIRE", zh: "热门", ko: "인기" },
  buy: { en: "Buy", tr: "Satın Al", es: "Comprar", fr: "Acheter", zh: "购买", ko: "구매" },
  paymentPending: { en: "Payment integration coming soon...", tr: "Ödeme sistemi entegrasyonu yakında...", es: "Pronto el sistema de pago...", fr: "Le système de paiement arrivera bientôt...", zh: "支付系统即将推出...", ko: "결제 시스템 준비 중..." },
  logout: { en: "Log Out", tr: "Çıkış", es: "Salir", fr: "Sortir", zh: "登出", ko: "로그아웃" },
  noMoons: { en: "Not enough Katina Moons!", tr: "Yeterli Katina Moon'unuz yok!", es: "¡No hay suficientes lunas!", fr: "Pas assez de lunes !", zh: "Katina 月亮不足！", ko: "카티나 문이 부족합니다!" }
};

const bannerTranslations: Record<string, Record<Language, string>> = {
  sponsored: { en: "Sponsored", tr: "Sponsorlu", es: "Patrocinado", fr: "Sponsorisé", zh: "赞助", ko: "스폰서" },
  promoText: { en: "Get 20% off Katina Tarot Cards on Amazon!", tr: "Amazon'da Katina Tarot Kartlarını %20 indirimli alın!", es: "¡Obtenga un 20% de descuento en Cartas de Tarot Katina en Amazon!", fr: "Obtenez 20 % de réduction sur les cartes de tarot Katina sur Amazon !", zh: "在亚马逊上购买 Katina 塔罗牌可享受 20% 折扣！", ko: "아마존에서 카티나 타로 카드를 20% 할인 받으세요!" },
  promoCode: { en: "Use Code:", tr: "Kod:", es: "Código:", fr: "Code :", zh: "代码：", ko: "코드:" },
  copyCode: { en: "Copy", tr: "Kopyala", es: "Copiar", fr: "Copier", zh: "复制", ko: "복사" },
  copied: { en: "Copied!", tr: "Kopyalandı!", es: "¡Copiado!", fr: "Copié !", zh: "已复制！", ko: "복사됨!" },
  shopNow: { en: "Shop Now", tr: "Hemen Al", es: "Comprar ahora", fr: "Acheter maintenant", zh: "立即购买", ko: "지금 쇼핑" }
};

const STATUS_OPTIONS: Array<{value: string} & Record<Language, string>> = STATUS_KEYS.map(key => {
  const opt: any = { value: key };
  Object.keys(locales).forEach(l => {
    opt[l as Language] = locales[l as Language]?.statusOptions?.[key];
  });
  return opt;
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [step, setStep] = useState<'SPLASH' | 'FORM' | 'DRAWING' | 'RESULT'>('SPLASH');
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', dob: '', birthplace: '', relationship: 'single', language: 'tr' });
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [reading, setReading] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  
  // Moons / Payment State
  const [moonsCount, setMoonsCount] = useState<number>(0);
  const [isMoonsLoading, setIsMoonsLoading] = useState(true);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ fullName: '', email: '', subject: '', message: '' });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [bannerCopied, setBannerCopied] = useState(false);

  // Firestore Error Handler
  const handleFirestoreError = (error: unknown, operationType: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  useEffect(() => {
    let unsubscribeMoons: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setIsAuthLoading(false);

      if (u) {
        // Sync moons from Firestore
        const moonRef = doc(db, 'user_moons', u.uid);
        
        unsubscribeMoons = onSnapshot(moonRef, (docSnap) => {
          if (docSnap.exists()) {
            setMoonsCount(docSnap.data().balance || 0);
          } else {
            // New user seed
            setDoc(moonRef, {
              userId: u.uid,
              balance: 5,
              updatedAt: serverTimestamp()
            });
            setMoonsCount(5);
          }
          setIsMoonsLoading(false);
        }, (error) => {
          handleFirestoreError(error, 'get', `user_moons/${u.uid}`);
        });
      } else {
        setMoonsCount(0);
        setIsMoonsLoading(true);
        if (unsubscribeMoons) unsubscribeMoons();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeMoons) unsubscribeMoons();
    };
  }, []);

  const drawRancomCards = async () => {
    if (moonsCount <= 0) {
      alert(storeTranslations.noMoons[userInfo.language]);
      setIsStoreOpen(true);
      return;
    }

    const deck = [...KATINA_DECK];
    const drawn: Card[] = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      drawn.push(deck.splice(randomIndex, 1)[0]);
    }
    setDrawnCards(drawn);
    setStep('DRAWING');
  };

  useEffect(() => {
    if (step === 'DRAWING' && drawnCards.length === 3) {
      generateReading(drawnCards);
    }
  }, [step, drawnCards]);

  const generateReading = async (cards: Card[]) => {
    setIsGenerating(true);
    setStep('RESULT');

    const statusText = STATUS_OPTIONS.find(o => o.value === userInfo.relationship)?.[userInfo.language as keyof typeof STATUS_OPTIONS[0]] || userInfo.relationship;

    const promptText = `You are 'MadameSoul', a mystic, wise Katina tarot expert holding ancient secrets. Speak to the person in front of you with compassion, honesty, and depth (incorporating your own feelings, using second-person "You"). 

Person's Information:
- Name: ${userInfo.name}
- Date of Birth: ${userInfo.dob}
- Place of Birth: ${userInfo.birthplace}
- Relationship Status: ${statusText}

Selected Katina Cards (Original Turkish names):
1. Past (Roots of the Past): ${cards[0].name} - ${cards[0].desc}
2. Present (Current Energy): ${cards[1].name} - ${cards[1].desc}
3. Future (Probable Path): ${cards[2].name} - ${cards[2].desc}

Please blend the energy of these 3 cards with the person's birth details and life situation to write a mystical and epic reading.
Present your reading under 3 main headings:
${t.headings[userInfo.language]}

End with a Guidance/Advice section giving them invaluable advice. 
Please produce a wonderful reading purely as text (Markdown supported).
CRITICAL: The entire reading MUST be written in ${t.languageName[userInfo.language]}. Do not use any other language!`;

    try {
      if (!user) return;

      // Deduct Moon and Log
      const moonRef = doc(db, 'user_moons', user.uid);
      await updateDoc(moonRef, {
        balance: increment(-1),
        updatedAt: serverTimestamp()
      });

      await addDoc(collection(db, 'moon_transactions'), {
        userId: user.uid,
        amount: -1,
        type: 'spend',
        description: `Reading with cards: ${cards.map(c => c.name).join(', ')}`,
        createdAt: serverTimestamp()
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: promptText,
      });
      setReading(response.text || t.errorSilent[userInfo.language]);
    } catch (error) {
      console.error("Reading generation error:", error);
      setReading(t.errorInterrupted[userInfo.language]);
    } finally {
      setIsGenerating(false);
    }
  };

  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleDownload = async () => {
    if (!reading || isExportingPDF) return;
    setIsExportingPDF(true);

    try {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.style.left = '0';
      container.style.width = '800px';
      container.style.zIndex = '-9999';
      
      const dateStr = new Date().toLocaleDateString(userInfo.language === 'en' ? 'en-US' : userInfo.language === 'tr' ? 'tr-TR' : undefined);
      
      const formatReading = (text: string) => {
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        formatted = formatted.replace(/^### (.*$)/gim, '<h3 style="margin: 20px 0 10px; color: #ecd8a6; font-family: \'Playfair Display\', serif;">$1</h3>');
        formatted = formatted.replace(/^## (.*$)/gim, '<h2 style="margin: 25px 0 12px; color: #ecd8a6; font-family: \'Playfair Display\', serif;">$1</h2>');
        formatted = formatted.replace(/^# (.*$)/gim, '<h1 style="margin: 30px 0 15px; color: #ecd8a6; font-family: \'Playfair Display\', serif;">$1</h1>');
        
        let paragraphs = formatted.split(/\n\s*\n/);
        return paragraphs.map(p => {
          if (p.trim().startsWith('<h')) return p;
          
          let pFormatted = p.split('\n').map(l => {
             if (l.trim().startsWith('- ') || l.trim().startsWith('* ')) {
                 return `<div style="margin-left: 20px; display: block;">&bull; ${l.trim().substring(2)}</div>`;
             }
             return l;
          }).join(' '); // Join single newlines with space to prevent broken lines
          
          return `<p style="margin: 0 0 15px 0; line-height: 1.6;">${pFormatted}</p>`;
        }).join('');
      };
      
      const cleanReading = formatReading(reading);

      const cardsHtml = `
        <div style="display: flex; justify-content: center; gap: 40px; margin: 50px 0 60px 0; position: relative;">
          ${drawnCards.map(c => `
            <div style="text-align: center; width: 160px; position: relative; z-index: 2;">
              <div style="border-radius: 12px; overflow: hidden; border: 2px solid rgba(236,216,166,0.4); box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(236,216,166,0.15); background-color: #1a1025; height: 240px; display: flex; align-items: center; justify-content: center;">
                 <img src="${window.location.origin}/cards/${c.id}.png" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
              </div>
              <div style="margin-top: 16px; font-family: 'Playfair Display', serif; font-size: 16px; color: #ecd8a6; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                ${locales[userInfo.language].cards?.[c.locKey]?.name || c.name}
              </div>
            </div>
          `).join('')}
        </div>
      `;

      const bannerHtml = `
        <div style="margin-top: 80px; padding: 40px; border-radius: 20px; text-align: center; position: relative; overflow: hidden; border: 1px solid rgba(236,216,166,0.3); background: linear-gradient(135deg, rgba(236,216,166,0.05) 0%, rgba(10,5,18,0.8) 100%);">
           <h3 style="margin: 0 0 15px 0; color: #ecd8a6; font-family: 'Playfair Display', serif; text-transform: uppercase; letter-spacing: 4px; font-size: 14px; opacity: 0.8;">✦ ${bannerTranslations.sponsored[userInfo.language]} ✦</h3>
           <p style="margin: 0 0 25px 0; color: #f5eedc; font-size: 20px; font-family: 'Playfair Display', serif; font-weight: bold;">${bannerTranslations.promoText[userInfo.language]}</p>
           
           <div style="display: inline-block; background-color: #05000a; padding: 16px 32px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: bold; color: #ecd8a6; border: 1px dashed rgba(236,216,166,0.5); margin-bottom: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
             KATINA20
           </div>
           <br/>
           <div style="display: inline-block; color: #ecd8a6; font-family: 'Playfair Display', serif; font-size: 15px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid rgba(236,216,166,0.4); padding-bottom: 4px;">${bannerTranslations.shopNow[userInfo.language]} on Amazon</div>
        </div>
      `;

      container.innerHTML = `
        <div style="padding: 20px; background-color: #05000a; min-height: 1000px; box-sizing: border-box;">
          <div style="border: 1px solid rgba(236,216,166,0.2); border-radius: 24px; padding: 60px 80px; background: radial-gradient(circle at top center, rgba(30,19,50,0.4) 0%, rgba(5,0,10,1) 50%); position: relative; overflow: hidden;">
            
            <!-- Corner Decorations -->
            <div style="position: absolute; top: 30px; left: 30px; width: 40px; height: 40px; border-top: 2px solid rgba(236,216,166,0.4); border-left: 2px solid rgba(236,216,166,0.4);"></div>
            <div style="position: absolute; top: 30px; right: 30px; width: 40px; height: 40px; border-top: 2px solid rgba(236,216,166,0.4); border-right: 2px solid rgba(236,216,166,0.4);"></div>
            <div style="position: absolute; bottom: 30px; left: 30px; width: 40px; height: 40px; border-bottom: 2px solid rgba(236,216,166,0.4); border-left: 2px solid rgba(236,216,166,0.4);"></div>
            <div style="position: absolute; bottom: 30px; right: 30px; width: 40px; height: 40px; border-bottom: 2px solid rgba(236,216,166,0.4); border-right: 2px solid rgba(236,216,166,0.4);"></div>

            <div style="text-align: center; margin-bottom: 50px;">
              <h1 style="font-size: 48px; letter-spacing: 4px; margin: 0 0 10px 0; color: #ecd8a6; font-family: 'Playfair Display', serif; font-weight: bold; text-shadow: 0 4px 20px rgba(236,216,166,0.2);">MADAME SOUL</h1>
              <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                <div style="height: 1px; width: 60px; background: linear-gradient(90deg, transparent, rgba(236,216,166,0.5));"></div>
                <h2 style="font-size: 14px; letter-spacing: 6px; margin: 0; color: rgba(236,216,166,0.8); text-transform: uppercase; font-family: 'Playfair Display', serif;">Destiny Reading</h2>
                <div style="height: 1px; width: 60px; background: linear-gradient(-90deg, transparent, rgba(236,216,166,0.5));"></div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(236,216,166,0.2); border-top: 1px solid rgba(236,216,166,0.2); padding: 15px 0; margin-bottom: 30px; color: rgba(236,216,166,0.7); font-family: sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
              <div>Prepared For: <strong style="color: #ecd8a6;">${userInfo.name}</strong></div>
              <div>Date: <strong style="color: #ecd8a6;">${dateStr}</strong></div>
            </div>
            
            ${cardsHtml}

            <div style="font-size: 18px; line-height: 1.9; font-family: sans-serif; color: rgba(236, 216, 166, 0.95); padding: 0 20px; text-align: justify;">
              ${cleanReading}
            </div>

            ${bannerHtml}
            
            <div style="margin-top: 100px;"></div>
          </div>
        </div>
      `;
      document.body.appendChild(container);
      
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#05000a',
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          // ensure the cloned doc has fonts loaded or wait a bit? 
          // usually fine
        }
      });
      
      document.body.removeChild(container);
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.setFillColor('#05000a');
      pdf.rect(0, 0, canvas.width, canvas.height, 'F');
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      pdf.setDrawColor(236, 216, 166);
      pdf.setLineWidth(1);
      pdf.line(canvas.width / 2 - 200, canvas.height - 150, canvas.width / 2 + 200, canvas.height - 150);
      
      pdf.setFontSize(20);
      pdf.setTextColor(236, 216, 166);
      
      const t1 = "Instagram: @madamesoulstudio";
      const w1 = pdf.getTextWidth(t1);
      pdf.text(t1, (canvas.width - w1) / 2, canvas.height - 100);
      pdf.link((canvas.width - w1) / 2, canvas.height - 120, w1, 24, { url: 'https://www.instagram.com/madamesoulstudio/' });

      const t2 = "Etsy: madamesoulstudio";
      const w2 = pdf.getTextWidth(t2);
      pdf.text(t2, (canvas.width - w2) / 2, canvas.height - 70);
      pdf.link((canvas.width - w2) / 2, canvas.height - 90, w2, 24, { url: 'https://www.etsy.com/shop/MadameSoulStudio?ref=sh-carousel-1' });

      pdf.save(`Katina_Reading_${userInfo.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF Export Error:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleShare = async () => {
    if (!reading) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `MadameSoul - ${userInfo.name}`,
          text: reading,
          url: window.location.href,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(reading);
        alert(t.copiedMsg[userInfo.language]);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const handleStartOver = () => {
    setStep('SPLASH');
    setDrawnCards([]);
    setReading(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#05000a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ecd8a6] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Login 
        onLogin={() => {}} 
        language={userInfo.language} 
        onLanguageChange={(lang) => setUserInfo(prev => ({ ...prev, language: lang }))}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#05000a] text-[#ecd8a6] font-sans selection:bg-purple-900/50 overflow-x-hidden relative">
      {/* Background decoration - Deep velvet space vibe */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-fuchsia-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
        
        {/* Subtle star particles background */}
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #ecd8a6 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Top Header - Moons / Store */}
      {step === 'SPLASH' && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 right-0 w-full p-4 sm:p-6 flex justify-end items-center gap-2 sm:gap-3 z-[40]"
        >
          <div 
            onClick={() => setIsStoreOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 bg-[#0a0512]/80 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-[#120a1c]/90 rounded-full border border-[#ecd8a6]/30 shadow-lg cursor-pointer transition-all hover:border-[#ecd8a6]/60 group"
          >
            <KatinaMoon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ecd8a6] group-hover:scale-110 transition-transform" />
            <span className="font-serif tracking-widest text-[#ecd8a6] text-xs sm:text-base font-semibold">{moonsCount}</span>
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#ecd8a6]/10 flex items-center justify-center ml-0.5 sm:ml-1 group-hover:bg-[#ecd8a6]/20 transition-colors">
              <Plus className="w-2.5 h-2.5 sm:w-3 h-3 text-[#ecd8a6]" />
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="flex items-center gap-1.5 sm:gap-2 pl-3 pr-2.5 py-1.5 sm:py-2 bg-red-950/20 backdrop-blur-md rounded-full border border-red-900/30 text-red-200/60 hover:text-red-200 hover:border-red-900/60 transition-all group"
            title="Sign Out"
          >
            <span className="text-[9px] sm:text-[10px] font-serif tracking-widest uppercase inline-block">
              {storeTranslations.logout[userInfo.language]}
            </span>
            <LogOut className="w-3.5 h-3.5 sm:w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      )}

      {/* Store Modal */}
      <AnimatePresence>
        {isStoreOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/30 overflow-hidden shadow-[0_0_50px_rgba(236,216,166,0.1)] relative max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-4 right-4 z-10">
                <button onClick={() => setIsStoreOpen(false)} className="p-2 bg-black/50 hover:bg-[#ecd8a6]/10 rounded-full text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 text-center pb-6 border-b border-[#ecd8a6]/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#ecd8a6]/10 to-transparent" />
                <KatinaMoon className="w-12 h-12 text-[#ecd8a6] mx-auto mb-4" />
                <h2 className="text-2xl font-serif text-[#ecd8a6] tracking-widest uppercase">{storeTranslations.storeTitle[userInfo.language] || "Madame's Store"}</h2>
              </div>
              
              <div className="p-6 flex flex-col gap-4">
                {[
                  { amount: 3, price: "$2.99", bonus: null },
                  { amount: 10, price: "$8.99", bonus: "1 Free Katina Moon", popular: true },
                  { amount: 25, price: "$19.99", bonus: "5 Free Katina Moons" }
                ].map((pack) => (
                  <div key={pack.amount} className={`relative flex items-center justify-between p-4 rounded-xl border ${pack.popular ? 'border-[#ecd8a6] bg-[#ecd8a6]/5' : 'border-[#ecd8a6]/20 bg-[#ffffff]/5'} hover:bg-[#ecd8a6]/10 transition-colors cursor-pointer group`} onClick={async () => {
                        alert(storeTranslations.paymentPending[userInfo.language]);
                        if (user) {
                          try {
                            const moonRef = doc(db, 'user_moons', user.uid);
                            await updateDoc(moonRef, {
                              balance: increment(pack.amount),
                              updatedAt: serverTimestamp()
                            });
                            await addDoc(collection(db, 'moon_transactions'), {
                              userId: user.uid,
                              amount: pack.amount,
                              type: 'buy',
                              description: `Demo purchase of ${pack.amount} Katina Moons`,
                              createdAt: serverTimestamp()
                            });
                          } catch (error) {
                            handleFirestoreError(error, 'update', `user_moons/${user.uid}`);
                          }
                        }
                        setIsStoreOpen(false);
                      }}>
                    
                    {pack.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ecd8a6] text-[#0a0512] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                        {storeTranslations.popular[userInfo.language]}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0a0512] border border-[#ecd8a6]/30 flex items-center justify-center group-hover:border-[#ecd8a6] transition-colors">
                        <KatinaMoon className="w-5 h-5 text-[#ecd8a6]" />
                      </div>
                      <div className="text-left">
                        <div className="text-[#ecd8a6] font-serif flex items-baseline gap-1">
                          <span className="text-xl font-bold">{pack.amount}</span>
                          <span className="text-sm opacity-80">{storeTranslations.moons[userInfo.language]}</span>
                        </div>
                        {pack.bonus && (
                          <div className="text-xs text-amber-500/90 font-medium">✨ {pack.bonus}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col items-end">
                      <div className="text-[#ecd8a6] font-medium tracking-wide bg-[#0a0512] px-4 py-1.5 rounded-lg border border-[#ecd8a6]/20">
                        {pack.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/30 overflow-hidden shadow-[0_0_50px_rgba(236,216,166,0.1)] relative max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-4 right-4 z-10">
                <button onClick={() => { setIsContactOpen(false); setContactSuccess(false); }} className="p-2 bg-black/50 hover:bg-[#ecd8a6]/10 rounded-full text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 pb-4 border-b border-[#ecd8a6]/10 relative overflow-hidden">
                <h2 className="text-2xl font-serif text-[#ecd8a6] tracking-widest uppercase mb-2">{locales[userInfo.language].contact?.title || 'Bize Ulaşın'}</h2>
                <p className="text-[#ecd8a6]/70 text-sm">{locales[userInfo.language].contact?.subtitle || 'Bizimle iletişime geçmek için aşağıdaki formu doldurabilirsiniz.'}</p>
              </div>
              
              <div className="p-6">
                {contactSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#ecd8a6]/10 flex items-center justify-center mx-auto mb-4 text-[#ecd8a6]">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-serif text-[#ecd8a6] mb-2 uppercase tracking-wide">{locales[userInfo.language].contact?.successTitle || 'Mesajınız Alındı'}</h3>
                    <p className="text-[#ecd8a6]/70">{locales[userInfo.language].contact?.successSubtitle || 'En kısa sürede size dönüş yapacağız.'}</p>
                  </div>
                ) : (
                  <form className="flex flex-col gap-4" onSubmit={async (e) => {
                    e.preventDefault();
                    setIsContactSubmitting(true);
                    try {
                      await addDoc(collection(db, `messages_${userInfo.language}`), {
                        ...contactForm,
                        createdAt: serverTimestamp()
                      });
                      setContactSuccess(true);
                      setContactForm({ fullName: '', email: '', subject: '', message: '' });
                    } catch (error) {
                      handleFirestoreError(error, 'create', `messages_${userInfo.language}`);
                    } finally {
                      setIsContactSubmitting(false);
                    }
                  }}>
                    <div>
                      <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-1 uppercase">{locales[userInfo.language].contact?.fullName || 'Ad Soyad'}</label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.fullName}
                        onChange={(e) => setContactForm(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full bg-[#120a1c] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-1 uppercase">{locales[userInfo.language].contact?.email || 'E-posta'}</label>
                      <input 
                        type="email" 
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-[#120a1c] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-1 uppercase">{locales[userInfo.language].contact?.subject || 'Konu'}</label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full bg-[#120a1c] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-1 uppercase">{locales[userInfo.language].contact?.message || 'Mesaj'}</label>
                      <textarea 
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full bg-[#120a1c] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/60 transition-colors resize-none"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isContactSubmitting}
                      className="w-full mt-2 bg-gradient-to-br from-[#1e1332] to-[#05000a] text-[#ecd8a6] font-serif tracking-widest uppercase py-4 rounded-xl border border-[#ecd8a6]/40 hover:border-[#ecd8a6]/80 shadow-[0_0_15px_rgba(236,216,166,0.1)] hover:shadow-[0_0_25px_rgba(236,216,166,0.2)] transition-all flex justify-center items-center gap-2 group disabled:opacity-50"
                    >
                      {isContactSubmitting ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span className="font-bold">{locales[userInfo.language].contact?.send || 'Gönder'}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step !== 'SPLASH' && step !== 'FORM' && (
          <motion.button
            initial={{ opacity: 0, x: -20, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: 0 }}
            onClick={handleStartOver}
            className="absolute z-20 top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors bg-[#0a0512]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#ecd8a6]/20 hover:border-[#ecd8a6]/50 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">
              {t.returnToStart[userInfo.language]}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20 flex flex-col items-center">
        
        {/* Header */}
        {step !== 'SPLASH' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 flex flex-col items-center"
          >
            <div className="flex items-center justify-center mb-2 mt-16 sm:mt-0 relative">
              <div className="absolute inset-0 bg-[#ecd8a6]/10 blur-xl rounded-full" />
              <h1 
                onClick={() => setStep('SPLASH')}
                className="text-4xl md:text-5xl font-serif tracking-widest text-[#ecd8a6] uppercase drop-shadow-md z-10 font-bold cursor-pointer hover:opacity-80 transition-opacity" 
                style={{ textShadow: "0 2px 10px rgba(236, 216, 166, 0.3)" }}
              >
                MADAME SOUL
              </h1>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Sparkles className="w-4 h-4 text-[#ecd8a6]/60" />
              <p className="text-[#ecd8a6]/80 text-sm tracking-[0.3em] uppercase">Katina Readings</p>
              <Sparkles className="w-4 h-4 text-[#ecd8a6]/60" />
            </div>
            <p className="text-[#ecd8a6]/70 max-w-lg mx-auto font-sans italic">
              {t.subtitle[userInfo.language]}
            </p>
          </motion.div>
        )}

        {/* Screens */}
        <AnimatePresence mode="wait">
          {step === 'SPLASH' && (
            <motion.div 
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              className="w-full flex-1 flex flex-col items-center justify-center min-h-[70vh] relative pt-20 sm:pt-10"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                {/* Intricate glowing astrolabe/tarot circle effect */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-[#ecd8a6]/20 border-dashed"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-[340px] h-[340px] md:w-[540px] md:h-[540px] rounded-full border border-[#ecd8a6]/10 border-dotted"
                />
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex items-center justify-center mb-8"
              >
                <div className="absolute inset-0 bg-[#ecd8a6]/10 blur-[60px] rounded-full" />
                <KatinaMoon className="w-16 h-16 md:w-20 md:h-20 text-[#ecd8a6] relative z-10" />
              </motion.div>

              <div className="text-center relative z-10 mb-2">
                <h1 className="text-4xl sm:text-5xl md:text-8xl font-serif tracking-widest text-[#ecd8a6] uppercase leading-tight font-bold" style={{ textShadow: "0 2px 20px rgba(236, 216, 166, 0.4)" }}>
                  MADAME<br/>
                  SOUL
                </h1>
              </div>
              
              <div className="flex items-center justify-center w-full max-w-md gap-3 sm:gap-4 mb-4 relative z-10">
                <div className="hidden sm:block h-px w-12 bg-[#ecd8a6]/40 flex-1" />
                <p className="text-[#ecd8a6]/80 text-xs sm:text-sm md:text-base tracking-[0.3em] sm:tracking-[0.4em] uppercase font-serif text-center w-full sm:w-auto">Katina Readings</p>
                <div className="hidden sm:block h-px w-12 bg-[#ecd8a6]/40 flex-1" />
              </div>

              <p className="text-[#ecd8a6]/70 text-base md:text-xl font-sans italic mb-10 text-center max-w-md relative z-10 mt-6 px-4">
                {t.splashText[userInfo.language]}
              </p>

              <div className="flex flex-col items-center gap-6 relative z-10 w-full px-4">
                <button
                  onClick={() => setStep('FORM')}
                  className="group w-full sm:w-auto max-w-[320px] sm:max-w-none justify-center relative px-10 sm:px-14 py-4 sm:py-5 flex items-center gap-4 bg-gradient-to-br from-[#1e1332] to-[#05000a] overflow-hidden border border-[#ecd8a6]/40 text-[#ecd8a6] font-serif tracking-widest uppercase rounded-full shadow-[0_0_30px_rgba(236,216,166,0.15)] hover:shadow-[0_0_50px_rgba(236,216,166,0.3)] hover:border-[#ecd8a6]/80 transition-all duration-500 scale-105 hover:scale-110 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ecd8a6]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  <KatinaMoon className="w-6 h-6 text-[#ecd8a6] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 relative z-10" />
                  <span className="relative z-10 text-base sm:text-lg font-bold">{t.startButton[userInfo.language]}</span>
                </button>

                {/* Ad Banner 1: Amazon */}
                <div className="w-full max-w-sm md:max-w-md mt-4 relative bg-[#0a0512]/60 backdrop-blur-md border border-[#ecd8a6]/20 rounded-2xl overflow-hidden group hover:border-[#ecd8a6]/40 transition-colors">
                  <div className="absolute top-0 right-0 bg-[#ecd8a6] text-[#0a0512] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider z-10">
                    {bannerTranslations.sponsored[userInfo.language]}
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <div className="text-center md:text-left">
                      <p className="text-[#ecd8a6] text-sm md:text-base font-serif leading-relaxed">
                        {bannerTranslations.promoText[userInfo.language]}
                      </p>
                    </div>
                    <div className="bg-black/40 rounded-xl p-3 flex items-center justify-between border border-[#ecd8a6]/10">
                      <div className="flex items-center gap-3">
                        <span className="text-[#ecd8a6]/60 text-[10px] font-serif uppercase tracking-widest">{bannerTranslations.promoCode[userInfo.language]}</span>
                        <span className="text-[#ecd8a6] text-sm font-mono font-bold tracking-[0.2em]">KATINA20</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          navigator.clipboard.writeText('KATINA20');
                          setBannerCopied(true);
                          setTimeout(() => setBannerCopied(false), 2000);
                        }}
                        className="p-1.5 hover:bg-[#ecd8a6]/10 rounded-md transition-colors text-[#ecd8a6]"
                        title={bannerTranslations.copyCode[userInfo.language]}
                      >
                        {bannerCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 opacity-60" />}
                      </button>
                    </div>
                    <a 
                      href="https://www.amazon.com/s?k=katina+tarot" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#ecd8a6]/10 hover:bg-[#ecd8a6]/20 text-[#ecd8a6] py-3 rounded-xl text-xs font-serif uppercase tracking-widest transition-all font-medium border border-[#ecd8a6]/20"
                    >
                      {bannerTranslations.shopNow[userInfo.language]}
                    </a>
                  </div>
                </div>

                {/* Ad Banner 2: Etsy Live Reading */}
                <div className="w-full max-w-sm md:max-w-md mt-4 relative bg-[#0a0512]/60 backdrop-blur-md border border-[#ecd8a6]/20 rounded-2xl overflow-hidden group hover:border-[#ecd8a6]/40 transition-colors">
                  <div className="absolute top-0 right-0 bg-[#ecd8a6] text-[#0a0512] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider z-10">
                    {bannerTranslations.sponsored[userInfo.language]}
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <div className="text-center md:text-left">
                      <p className="text-[#ecd8a6]/60 text-[10px] font-serif uppercase tracking-widest mb-1">
                        {locales[userInfo.language]?.promo?.live?.liveReadingTitle || "Live Session"}
                      </p>
                      <p className="text-[#ecd8a6] text-sm md:text-base font-serif leading-relaxed whitespace-pre-line">
                        {locales[userInfo.language]?.promo?.live?.liveReadingText || 'Visit our Etsy shop for live readings.'}
                      </p>
                    </div>

                    {/* Video Demo */}
                    <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-[#ecd8a6]/10 bg-black/40 shadow-inner group-hover:border-[#ecd8a6]/30 transition-colors">
                      <video 
                        src="/ads/Govde.mp4" 
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        className="w-full h-full object-cover grayscale-[0.2] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                      />
                    </div>

                    <a 
                      href="https://www.etsy.com/shop/MadameSoulStudio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#ecd8a6]/10 hover:bg-[#ecd8a6]/20 text-[#ecd8a6] py-3 rounded-xl text-xs font-serif uppercase tracking-widest transition-all font-medium border border-[#ecd8a6]/20"
                    >
                      {locales[userInfo.language]?.promo?.live?.shopOnEtsy || 'Shop on Etsy'}
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {step === 'FORM' && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              className="w-full max-w-md bg-[#0a0512]/60 backdrop-blur-xl rounded-2xl border border-[#ecd8a6]/20 p-6 sm:p-8 shadow-[0_0_40px_rgba(236,216,166,0.05)] relative mx-4"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#ecd8a6]/50 to-transparent" />
              <form 
                onSubmit={(e) => { e.preventDefault(); drawRancomCards(); }}
                className="space-y-6 relative z-10"
              >
                <div>
                  <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-2 uppercase">{t.nameLabel[userInfo.language]}</label>
                  <input 
                    required
                    type="text"
                    value={userInfo.name}
                    onChange={e => setUserInfo(prev => ({...prev, name: e.target.value}))}
                    className="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg px-4 py-3 outline-none focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60 transition-all text-[#ecd8a6] placeholder:text-[#ecd8a6]/30 font-serif"
                    placeholder={t.namePlaceholder[userInfo.language]}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-2 uppercase">{t.dobLabel[userInfo.language]}</label>
                  <input 
                    required
                    type="date"
                    value={userInfo.dob}
                    onChange={e => setUserInfo(prev => ({...prev, dob: e.target.value}))}
                    className="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg px-4 py-3 outline-none focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60 transition-all text-[#ecd8a6] custom-date-picker font-sans [color-scheme:dark]"
                  />
                  <style>{`
                    .custom-date-picker::-webkit-calendar-picker-indicator {
                      filter: invert(1) brightness(0.8) sepia(1) hue-rotate(5deg) saturate(3);
                    }
                  `}</style>
                </div>

                <div>
                  <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-2 uppercase">{t.pobLabel[userInfo.language]}</label>
                  <input 
                    required
                    type="text"
                    value={userInfo.birthplace}
                    onChange={e => setUserInfo(prev => ({...prev, birthplace: e.target.value}))}
                    className="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg px-4 py-3 outline-none focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60 transition-all text-[#ecd8a6] placeholder:text-[#ecd8a6]/30 font-serif"
                    placeholder={t.pobPlaceholder[userInfo.language]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-2 uppercase">{t.statusLabel[userInfo.language]}</label>
                  <select 
                    value={userInfo.relationship}
                    onChange={e => setUserInfo(prev => ({...prev, relationship: e.target.value}))}
                    className="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg px-4 py-3 outline-none focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60 transition-all appearance-none text-[#ecd8a6] font-serif"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-[#0a0512]">
                        {opt[userInfo.language as keyof typeof opt]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-br from-[#1e1332] to-[#0a0512] border border-[#ecd8a6]/40 hover:border-[#ecd8a6]/80 text-[#ecd8a6] font-serif tracking-widest uppercase py-4 rounded-lg shadow-[0_0_15px_rgba(236,216,166,0.1)] hover:shadow-[0_0_25px_rgba(236,216,166,0.2)] flex items-center justify-center transition-all duration-300"
                  >
                    {t.submitButton[userInfo.language]}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'RESULT' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[t.past[userInfo.language], t.present[userInfo.language], t.future[userInfo.language]].map((label, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.8, type: "spring" }}
                    className="relative group perspective h-full"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-[#1e1332] to-[#0a0512] rounded-2xl border border-[#ecd8a6]/30 shadow-[0_0_30px_rgba(236,216,166,0.05)] flex flex-col items-center justify-between p-6 text-center transform transition-transform duration-500 group-hover:scale-105 group-hover:border-[#ecd8a6]/60 relative overflow-hidden">
                      <div className="absolute inset-0 bg-transparent border-[4px] border-double border-[#ecd8a6]/10 m-2 rounded-xl pointer-events-none" />
                      
                      {/* Top Label */}
                      <div className="relative z-10 w-full flex flex-col items-center justify-start mt-2">
                        <div className="text-xs font-serif tracking-widest text-[#ecd8a6]/70 uppercase mb-4">
                          {label}
                        </div>
                        <div className="w-8 h-px bg-[#ecd8a6]/30 mb-4" />
                      </div>
                      
                      {/* Image Area */}
                      <div className="flex w-full items-center justify-center my-4 relative group/img">
                        {!imageError[drawnCards[index]?.id] ? (
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                            className="relative w-full max-w-[140px] sm:max-w-[160px] aspect-[2/3] mx-auto rounded-md overflow-hidden border border-[#ecd8a6]/30 shadow-[0_5px_15px_rgba(0,0,0,0.5)] group-hover/img:shadow-[0_0_35px_rgba(236,216,166,0.25)] group-hover/img:border-[#ecd8a6]/60 transition-all duration-500 ease-out"
                          >
                            <img 
                              src={`/cards/${drawnCards[index]?.id}.png`} 
                              alt={locales[userInfo.language].cards?.[drawnCards[index]?.locKey]?.name || drawnCards[index]?.name}
                              onError={() => setImageError(prev => ({...prev, [drawnCards[index]?.id]: true}))}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ecd8a6]/10 to-transparent -translate-x-full group-hover/img:translate-x-full transition-transform duration-1000 ease-in-out z-20 pointer-events-none" />
                          </motion.div>
                        ) : (
                          <div className="flex flex-col mx-auto items-center justify-center w-full max-w-[140px] sm:max-w-[160px] aspect-[2/3] rounded-md border border-dashed border-[#ecd8a6]/20 bg-[#ecd8a6]/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                            <Sparkles className="w-8 h-8 text-[#ecd8a6]/30 mb-2 animate-pulse" />
                            <span className="text-[10px] text-[#ecd8a6]/40 uppercase tracking-widest font-serif">{locales[userInfo.language].cards?.[drawnCards[index]?.locKey]?.name || drawnCards[index]?.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Text Area */}
                      <div className="w-full relative z-10 mt-auto min-h-[96px] flex flex-col justify-center">
                        <h3 className="text-xl font-serif text-[#ecd8a6] mb-3">{locales[userInfo.language].cards?.[drawnCards[index]?.locKey]?.name || drawnCards[index]?.name}</h3>
                        <p className="text-xs text-[#ecd8a6]/60 font-sans italic leading-relaxed line-clamp-4 px-2">{locales[userInfo.language].cards?.[drawnCards[index]?.locKey]?.general || drawnCards[index]?.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="w-full max-w-3xl mx-auto bg-[#0a0512]/80 backdrop-blur-xl rounded-2xl border border-[#ecd8a6]/20 p-6 sm:p-8 md:p-12 shadow-[0_0_50px_rgba(236,216,166,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[#ecd8a6]/40 to-transparent"></div>
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#ecd8a6]/40"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#ecd8a6]/40"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#ecd8a6]/40"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#ecd8a6]/40"></div>
                
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-6">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-[#ecd8a6]/20 blur-[20px] rounded-full" />
                      <RefreshCw className="w-10 h-10 text-[#ecd8a6] relative z-10" />
                    </motion.div>
                    <p className="text-[#ecd8a6]/80 font-serif animate-pulse text-lg tracking-widest uppercase text-center">
                      {t.loading[userInfo.language]}
                    </p>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="prose prose-invert prose-amber max-w-none font-sans leading-[2] tracking-wide"
                  >
                    <div className="markdown-body text-[#ecd8a6]/90">
                      <Markdown>{reading || ""}</Markdown>
                    </div>
                  </motion.div>
                )}
              </div>

              {!isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 sm:mt-16 flex flex-col w-full sm:flex-row justify-center items-center gap-4 sm:gap-6 flex-wrap relative z-20"
                >
                  <button 
                    onClick={handleDownload}
                    disabled={isExportingPDF}
                    className="w-full sm:w-auto text-[#ecd8a6] hover:text-[#fff] flex items-center justify-center gap-3 border border-[#ecd8a6]/30 hover:border-[#ecd8a6]/60 px-6 sm:px-8 py-4 sm:py-3 rounded-full transition-all bg-[#120a1c]/80 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExportingPDF ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span className="font-serif tracking-widest text-xs uppercase">{isExportingPDF ? 'Exporting...' : t.downloadBtn[userInfo.language]}</span>
                  </button>

                  <button 
                    onClick={handleShare}
                    className="w-full sm:w-auto text-[#ecd8a6] hover:text-[#fff] flex items-center justify-center gap-3 border border-[#ecd8a6]/30 hover:border-[#ecd8a6]/60 px-6 sm:px-8 py-4 sm:py-3 rounded-full transition-all bg-[#120a1c]/80 backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="font-serif tracking-widest text-xs uppercase">{t.shareBtn[userInfo.language]}</span>
                  </button>

                  <button 
                    onClick={handleStartOver}
                    className="w-full sm:w-auto text-[#ecd8a6] hover:text-[#fff] flex items-center justify-center gap-3 border border-[#ecd8a6]/30 hover:border-[#ecd8a6]/60 px-6 sm:px-8 py-4 sm:py-3 rounded-full transition-all bg-[#120a1c]/80 backdrop-blur-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="font-serif tracking-widest text-xs uppercase">{t.restartBtn[userInfo.language]}</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full relative z-10 border-t border-[#ecd8a6]/10 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <button
            onClick={() => setIsContactOpen(true)}
            className="text-[#ecd8a6] hover:text-[#fff] text-xs font-serif tracking-widest uppercase hover:underline underline-offset-4 opacity-70 hover:opacity-100 transition-all"
          >
            {locales[userInfo.language].contact?.footerText || 'Bize Ulaşın'}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;

