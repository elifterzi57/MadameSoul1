import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Sparkles, Moon, Star, RefreshCw, ChevronRight, Download, Globe, ArrowLeft, Share2 } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const KATINA_DECK = [
  { name: "Derviş", desc: "Bilgelik, yalnızlık, sabır ve manevi rehberlik." },
  { name: "Sfenks", desc: "Sırlar, çözülmesi gereken gizemler, bilinmezlik." },
  { name: "Tılsım", desc: "Korunma, şans, maddi kazanç veya uğurlu bir eşya." },
  { name: "Yakut Valide", desc: "Tutku, ateş elementi, güçlü ve otoriter bir kadın." },
  { name: "Zümrüt Bey", desc: "Su elementi, duygusal, romantik ve anlayışlı bir erkek." },
  { name: "Elmas Hanım", desc: "Toprak elementi, pratik, güvenilir ve maddiyata önem veren bir kadın." },
  { name: "Abanoz Paşa", desc: "Hava elementi, zeki, iletişimci ama bazen mesafeli bir erkek." },
  { name: "Çapa", desc: "Güven, sadakat, bir yere veya kişiye bağlılık, umut." },
  { name: "Süpürge", desc: "Temizlenme, kavga, hayatından bir şeyleri çıkarma gerekliliği." },
  { name: "Yılan", desc: "İhanet, gizli düşmanlık, kıskançlık veya sinsilik." },
  { name: "Güneş", desc: "Büyük şans, mutluluk, aydınlanma ve başarı." },
  { name: "Ay", desc: "Sezgiler, romantizm, melankoli ve değişken ruh halleri." },
  { name: "Yıldız", desc: "Umut, ilham, hayallerin gerçekleşmesi, ruhsal rehberlik." },
  { name: "Kitap", desc: "Sırlar, eğitim, öğrenilmesi gereken şaşırtıcı bir gerçek." },
  { name: "Mektup", desc: "Haberler, beklenen bir mesaj veya önemli bir iletişim." },
  { name: "Kalp", desc: "Büyük aşk, sevgi, şefkat ve duygusal mutluluk." },
  { name: "Yüzük", desc: "Bağlılık, evlilik, ortaklık, ciddi bir tamamlanma." },
  { name: "Ağaç", desc: "Köklenme, sağlık, büyüme, aile soyu ve uzun ömür." },
  { name: "Dağ", desc: "Engeller, aşılması zor durumlar, gecikmeler ve sınanmalar." },
  { name: "Yol", desc: "Seçimler, ayrılıklar ya da yeni bir hayata doğru atılan adım." },
  { name: "Fareler", desc: "Kayıplar, içten içe kemiren endişe ve stres." },
  { name: "Tilki", desc: "Kurnazlık, dikkatli olunması gereken bir fırsatçılık." },
  { name: "Bahçe", desc: "Sosyalleşme, çevre, kalabalıklar ve toplum içindeki yeriniz." },
  { name: "Tabut", desc: "Bitişler, büyük değişim, bir devrin kapanıp yenisinin başlaması." },
  { name: "Baykuş", desc: "Bilgelik, gece gelen haberler veya etrafı gözlemleme zamanı." },
  { name: "Nil Nehri", desc: "Bereketi, akışı, uzun ve verimli bir süreci temsil eder." },
  { name: "Çöl", desc: "Yalnızlık, kuraklık, sabır gerektiren boşluk dönemi." },
  { name: "Kapı", desc: "Fırsatlar, açılan yeni yollar veya verilmesi gereken bir karar." },
  { name: "Kale", desc: "Güvenlik, sağlam yapı, dış etkenlere karşı korunaklı olma." },
  { name: "Afyon", desc: "Bağımlılıklar, göz boyama, illüzyonlar ve toksik bağlar." } // 30 cards total
];

type Language = 'tr' | 'en' | 'es' | 'fr' | 'zh' | 'ko';

type UserInfo = {
  name: string;
  dob: string;
  birthplace: string;
  relationship: string;
  language: Language;
};

type Card = { name: string; desc: string };

const t: Record<string, Record<Language, string>> = {
  returnToStart: { tr: 'Giriş Ekranına Dön', en: 'Return to Start', es: 'Volver al Inicio', fr: 'Retour au Début', zh: '返回开始', ko: '시작으로 돌아가기' },
  subtitle: { 
    tr: 'Geçmişin aynası, bugünün ateşi ve geleceğin pusulası... Katina destesi sana ne fısıldıyor?', 
    en: 'Mirror of the past, fire of the present, and compass of the future... What does the Katina deck whisper to you?', 
    es: 'Espejo del pasado, fuego del presente, y brújula del futuro... ¿Qué te susurra la baraja Katina?', 
    fr: 'Miroir du passé, feu du présent, et boussole du futur... Que vous murmure le jeu Katina ?',
    zh: '过去的镜子，现在的火焰，未来的指南针…… 卡提娜牌组在向你低语什么？',
    ko: '과거의 거울, 현재의 불꽃, 미래의 나침반... 카티나 덱이 당신에게 무엇을 속삭이나요?'
  },
  splashText: { 
    tr: 'Kehanetler senin için aralanıyor...', 
    en: 'The prophecies are unwrapping for you...', 
    es: 'Las profecías se despliegan para ti...', 
    fr: 'Les prophéties se dévoilent pour vous...',
    zh: '预言正在为你展开...',
    ko: '예언이 당신을 위해 펼쳐지고 있습니다...'
  },
  startButton: { tr: 'Falına Başla', en: 'Start Your Reading', es: 'Comenzar Tu Lectura', fr: 'Commencer Votre Lecture', zh: '开始占卜', ko: '운세 읽기 시작' },
  nameLabel: { tr: 'İsmin', en: 'Name', es: 'Nombre', fr: 'Nom', zh: '姓名', ko: '이름' },
  namePlaceholder: { tr: 'Adın nedir?', en: 'What is your name?', es: '¿Cuál es tu nombre?', fr: 'Quel est votre nom ?', zh: '你的名字是什么？', ko: '이름이 무엇인가요?' },
  dobLabel: { tr: 'Doğum Tarihin', en: 'Date of Birth', es: 'Fecha de Nacimiento', fr: 'Date de Naissance', zh: '出生日期', ko: '생년월일' },
  pobLabel: { tr: 'Doğum Yerin', en: 'Place of Birth', es: 'Lugar de Nacimiento', fr: 'Lieu de Naissance', zh: '出生地', ko: '출생지' },
  pobPlaceholder: { tr: 'Şehir, Ülke', en: 'City, Country', es: 'Ciudad, País', fr: 'Ville, Pays', zh: '城市, 国家', ko: '도시, 국가' },
  statusLabel: { tr: 'İlişki Durumun', en: 'Relationship Status', es: 'Estado Civil', fr: 'Situation Amoureuse', zh: '感情状况', ko: '연애 상태' },
  submitButton: { tr: 'Kartları Seç ve Falıma Bak', en: 'Select Cards & Read My Fortune', es: 'Seleccionar Cartas y Leer mi Fortuna', fr: 'Sélectionner des Cartes et Lire ma Fortune', zh: '选择卡牌并占卜', ko: '카드 선택 및 운세 보기' },
  past: { tr: 'Geçmiş', en: 'Past', es: 'Pasado', fr: 'Passé', zh: '过去', ko: '과거' },
  present: { tr: 'Şimdi', en: 'Present', es: 'Presente', fr: 'Présent', zh: '现在', ko: '현재' },
  future: { tr: 'Gelecek', en: 'Future', es: 'Futuro', fr: 'Futur', zh: '未来', ko: '미래' },
  loading: { 
    tr: 'Ruhlar fısıldıyor... Kartların enerjisi okunuyor...', 
    en: 'The spirits are whispering... Reading the cards\' energy...', 
    es: 'Los espíritus susurran... Leyendo la energía de las cartas...', 
    fr: 'Les esprits murmurent... Lecture de l\'énergie des cartes...',
    zh: '灵体在低语... 正在读取卡牌的能量...',
    ko: '영혼들이 속삭이고 있습니다... 카드의 에너지를 읽는 중...'
  },
  downloadBtn: { tr: 'Falı İndir (PDF)', en: 'Download Reading (PDF)', es: 'Descargar Lectura (PDF)', fr: 'Télécharger la Lecture (PDF)', zh: '下载占卜 (PDF)', ko: '운세 다운로드 (PDF)' },
  shareBtn: { tr: 'Paylaş', en: 'Share', es: 'Compartir', fr: 'Partager', zh: '分享', ko: '공유' },
  restartBtn: { tr: 'Yeni Bir Yolculuğa Çık', en: 'Start a New Journey', es: 'Comenzar un Nuevo Viaje', fr: 'Commencer un Nouveau Voyage', zh: '开始新的旅程', ko: '새로운 여정 시작' },
  errorSilent: { 
    tr: 'Ruhlar şu an sessiz, lütfen daha sonra tekrar dene.', 
    en: 'The spirits are silent right now, please try again later.', 
    es: 'Los espíritus están en silencio en este momento, por favor inténtalo de nuevo más tarde.', 
    fr: 'Les esprits sont silencieux pour le moment, veuillez réessayer plus tard.',
    zh: '灵体此刻沉默不语，请稍后再试。',
    ko: '영혼들이 지금은 침묵하고 있습니다. 나중에 다시 시도해주세요.'
  },
  errorInterrupted: { 
    tr: 'Mistik bir enerji akışı kesintiye uğradı. (Hata oluştu)', 
    en: 'A mystical energy flow was interrupted. (An error occurred)', 
    es: 'Un flujo de energía mística fue interrumpido. (Ocurrió un error)', 
    fr: "Un flux d'énergie mystique a été interrompu. (Une erreur s'est produite)",
    zh: '神秘的能量流被中断了。（发生错误）',
    ko: '신비한 에너지의 흐름이 끊겼습니다. (오류 발생)'
  },
  copiedMsg: { tr: 'Fal metni panoya kopyalandı!', en: 'Reading copied to clipboard!', es: '¡Lectura copiada al portapapeles!', fr: 'Lecture copiée dans le presse-papiers !', zh: '占卜内容已复制到剪贴板！', ko: '운세 결과가 클립보드에 복사되었습니다!' }
};

const STATUS_OPTIONS: Array<{value: string, tr: string, en: string, es: string, fr: string, zh: string, ko: string}> = [
  { value: 'single', tr: 'Bekar', en: 'Single', es: 'Soltero/a', fr: 'Célibataire', zh: '单身', ko: '싱글' },
  { value: 'relationship', tr: 'İlişkisi Var', en: 'In a Relationship', es: 'En una Relación', fr: 'En Couple', zh: '恋爱中', ko: '연애 중' },
  { value: 'married', tr: 'Evli', en: 'Married', es: 'Casado/a', fr: 'Marié(e)', zh: '已婚', ko: '기혼' },
  { value: 'engaged', tr: 'Nişanlı', en: 'Engaged', es: 'Comprometido/a', fr: 'Fiancé(e)', zh: '已订婚', ko: '약혼' },
  { value: 'complicated', tr: 'Karmaşık', en: 'It\'s Complicated', es: 'Es Complicado', fr: 'C\'est Compliqué', zh: '关系复杂', ko: '복잡함' },
  { value: 'breakup', tr: 'Ayrılık Sürecinde', en: 'Going through a Breakup', es: 'Pasando por una Ruptura', fr: 'En Pleine Rupture', zh: '正在分手', ko: '이별 중' }
];

function App() {
  const [step, setStep] = useState<'SPLASH' | 'FORM' | 'DRAWING' | 'RESULT'>('SPLASH');
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', dob: '', birthplace: '', relationship: 'single', language: 'en' });
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [reading, setReading] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const drawRancomCards = () => {
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

    const languageNames: Record<Language, string> = {
      tr: 'Turkish',
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      zh: 'Chinese',
      ko: 'Korean'
    };

    const headings: Record<Language, string> = {
      tr: `**Geçmişin Yankıları** (geçmiş kartının analizi)\n**Şu Anın Rüzgarı** (şimdi kartının analizi)\n**Geleceğin Fısıltısı** (gelecek kartının analizi)`,
      en: `**Echoes of the Past** (analysis of the past card)\n**Winds of the Present** (analysis of the present card)\n**Whispers of the Future** (analysis of the future card)`,
      es: `**Ecos del Pasado** (análisis de la carta del pasado)\n**Vientos del Presente** (análisis de la carta del presente)\n**Susurros del Futuro** (análisis de la carta del futuro)`,
      fr: `**Échos du Passé** (analyse de la carte du passé)\n**Vents du Présent** (analyse de la carte du présent)\n**Murmures du Futur** (analyse de la carte du futur)`,
      zh: `**过去的余音** (过去卡牌的解析)\n**现在的风向** (现在卡牌的解析)\n**未来的低语** (未来卡牌的解析)`,
      ko: `**과거의 메아리** (과거 카드 분석)\n**현재의 바람** (현재 카드 분석)\n**미래의 속삭임** (미래 카드 분석)`
    };

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
${headings[userInfo.language]}

End with a Guidance/Advice section giving them invaluable advice. 
Please produce a wonderful reading purely as text (Markdown supported).
CRITICAL: The entire reading MUST be written in ${languageNames[userInfo.language]}. Do not use any other language!`;

    try {
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
      
      // Clean up markdown
      const cleanReading = reading.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/###/g, '<br/><br/>').replace(/##/g, '<br/><br/>').replace(/#/g, '');

      container.innerHTML = `
        <div style="padding: 60px; background-color: #05000a; color: #ecd8a6; font-family: 'Playfair Display', serif; min-height: 1000px;">
          <div style="text-align: right; font-family: sans-serif; font-size: 14px; opacity: 0.8; margin-bottom: 20px;">${dateStr}</div>
          <h1 style="text-align: center; font-size: 36px; letter-spacing: 2px; margin-bottom: 15px; color: #ecd8a6;">MADAME SOUL</h1>
          <h2 style="text-align: center; font-size: 16px; letter-spacing: 4px; opacity: 0.7; margin-bottom: 50px; text-transform: uppercase;">Katina Reading</h2>
          
          <div style="font-size: 16px; line-height: 2; white-space: pre-wrap; font-family: sans-serif; color: rgba(236, 216, 166, 0.9); padding-bottom: 20px;">${cleanReading}</div>
        </div>
      `;
      document.body.appendChild(container);
      
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#05000a',
        useCORS: true
      });
      
      document.body.removeChild(container);
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.setFillColor('#05000a');
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.setFillColor('#05000a');
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      let finalY = (imgHeight % pdfHeight === 0 ? pdfHeight : imgHeight % pdfHeight);
      if (finalY + 80 > pdfHeight) {
        pdf.addPage();
        pdf.setFillColor('#05000a');
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
        finalY = 0;
      }

      pdf.setDrawColor(236, 216, 166);
      pdf.setLineWidth(0.5);
      pdf.line(pdfWidth / 2 - 100, finalY + 30, pdfWidth / 2 + 100, finalY + 30);
      
      pdf.setFontSize(10);
      pdf.setTextColor(236, 216, 166);
      
      const t1 = "Instagram: @madamesoulstudio";
      const w1 = pdf.getTextWidth(t1);
      pdf.text(t1, (pdfWidth - w1) / 2, finalY + 50);
      pdf.link((pdfWidth - w1) / 2, finalY + 50 - 10, w1, 12, { url: 'https://www.instagram.com/madamesoulstudio/' });

      const t2 = "Etsy: madamesoulstudio";
      const w2 = pdf.getTextWidth(t2);
      pdf.text(t2, (pdfWidth - w2) / 2, finalY + 65);
      pdf.link((pdfWidth - w2) / 2, finalY + 65 - 10, w2, 12, { url: 'https://www.etsy.com/shop/MadameSoulStudio?ref=sh-carousel-1' });

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

  return (
    <div className="min-h-screen bg-[#05000a] text-[#ecd8a6] font-sans selection:bg-purple-900/50 overflow-x-hidden relative">
      {/* Background decoration - Deep velvet space vibe */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-fuchsia-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
        
        {/* Subtle star particles background */}
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #ecd8a6 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

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
            <div className="flex items-center justify-center mb-2 mt-8 sm:mt-0 relative">
              <div className="absolute inset-0 bg-[#ecd8a6]/10 blur-xl rounded-full" />
              <h1 className="text-4xl md:text-5xl font-serif tracking-widest text-[#ecd8a6] uppercase drop-shadow-md z-10 font-bold" style={{ textShadow: "0 2px 10px rgba(236, 216, 166, 0.3)" }}>
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
              className="w-full flex-1 flex flex-col items-center justify-center min-h-[70vh] relative pt-10"
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
                <Moon className="w-16 h-16 md:w-20 md:h-20 text-[#ecd8a6] relative z-10 drop-shadow-[0_0_15px_rgba(236,216,166,0.6)]" />
              </motion.div>

              <div className="text-center relative z-10 mb-2">
                <h1 className="text-4xl sm:text-5xl md:text-8xl font-serif tracking-widest text-[#ecd8a6] uppercase leading-tight font-bold" style={{ textShadow: "0 2px 20px rgba(236, 216, 166, 0.4)" }}>
                  MADAME<br/>
                  SOUL
                </h1>
              </div>
              
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="h-px w-12 bg-[#ecd8a6]/40" />
                <p className="text-[#ecd8a6]/80 text-sm md:text-base tracking-[0.4em] uppercase font-serif">Katina Readings</p>
                <div className="h-px w-12 bg-[#ecd8a6]/40" />
              </div>

              <p className="text-[#ecd8a6]/70 text-base md:text-xl font-sans italic mb-8 sm:mb-12 text-center max-w-md relative z-10 mt-4 sm:mt-6 px-4">
                {t.splashText[userInfo.language]}
              </p>

              <div className="flex flex-col items-center gap-8 relative z-10 w-full px-4">
                <div className="grid grid-cols-3 md:flex md:flex-wrap justify-center items-center gap-2 bg-[#120a1c]/80 backdrop-blur-sm p-2 rounded-2xl md:rounded-full border border-[#ecd8a6]/20 w-full max-w-sm md:max-w-fit">
                  <button
                    onClick={() => setUserInfo(prev => ({...prev, language: 'en'}))}
                    className={`px-2 sm:px-6 py-2.5 rounded-xl md:rounded-full text-xs sm:text-sm font-medium transition-all flex items-center justify-center whitespace-nowrap ${userInfo.language === 'en' ? 'bg-[#ecd8a6]/15 text-[#ecd8a6] shadow-sm border border-[#ecd8a6]/30' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]/80 border border-transparent'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setUserInfo(prev => ({...prev, language: 'tr'}))}
                    className={`px-2 sm:px-6 py-2.5 rounded-xl md:rounded-full text-xs sm:text-sm font-medium transition-all flex items-center justify-center whitespace-nowrap ${userInfo.language === 'tr' ? 'bg-[#ecd8a6]/15 text-[#ecd8a6] shadow-sm border border-[#ecd8a6]/30' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]/80 border border-transparent'}`}
                  >
                    Türkçe
                  </button>
                  <button
                    onClick={() => setUserInfo(prev => ({...prev, language: 'es'}))}
                    className={`px-2 sm:px-6 py-2.5 rounded-xl md:rounded-full text-xs sm:text-sm font-medium transition-all flex items-center justify-center whitespace-nowrap ${userInfo.language === 'es' ? 'bg-[#ecd8a6]/15 text-[#ecd8a6] shadow-sm border border-[#ecd8a6]/30' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]/80 border border-transparent'}`}
                  >
                    Español
                  </button>
                  <button
                    onClick={() => setUserInfo(prev => ({...prev, language: 'fr'}))}
                    className={`px-2 sm:px-6 py-2.5 rounded-xl md:rounded-full text-xs sm:text-sm font-medium transition-all flex items-center justify-center whitespace-nowrap ${userInfo.language === 'fr' ? 'bg-[#ecd8a6]/15 text-[#ecd8a6] shadow-sm border border-[#ecd8a6]/30' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]/80 border border-transparent'}`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => setUserInfo(prev => ({...prev, language: 'zh'}))}
                    className={`px-2 sm:px-6 py-2.5 rounded-xl md:rounded-full text-xs sm:text-sm font-medium transition-all flex items-center justify-center whitespace-nowrap ${userInfo.language === 'zh' ? 'bg-[#ecd8a6]/15 text-[#ecd8a6] shadow-sm border border-[#ecd8a6]/30' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]/80 border border-transparent'}`}
                  >
                    中文
                  </button>
                  <button
                    onClick={() => setUserInfo(prev => ({...prev, language: 'ko'}))}
                    className={`px-2 sm:px-6 py-2.5 rounded-xl md:rounded-full text-xs sm:text-sm font-medium transition-all flex items-center justify-center whitespace-nowrap ${userInfo.language === 'ko' ? 'bg-[#ecd8a6]/15 text-[#ecd8a6] shadow-sm border border-[#ecd8a6]/30' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]/80 border border-transparent'}`}
                  >
                    한국어
                  </button>
                </div>

                <button
                  onClick={() => setStep('FORM')}
                  className="group w-full sm:w-auto justify-center relative px-8 sm:px-10 py-4 flex items-center gap-3 bg-transparent overflow-hidden border border-[#ecd8a6]/40 text-[#ecd8a6] font-serif tracking-widest uppercase rounded-full shadow-[0_0_20px_rgba(236,216,166,0.1)] hover:shadow-[0_0_30px_rgba(236,216,166,0.3)] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-[#ecd8a6]/5 group-hover:bg-[#ecd8a6]/10 transition-colors" />
                  <Sparkles className="w-5 h-5 group-hover:animate-pulse relative z-10" />
                  <span className="relative z-10">{t.startButton[userInfo.language]}</span>
                </button>
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
                    className="w-full bg-gradient-to-br from-[#1e1332] to-[#0a0512] border border-[#ecd8a6]/40 hover:border-[#ecd8a6]/80 text-[#ecd8a6] font-serif tracking-widest uppercase py-4 rounded-lg shadow-[0_0_15px_rgba(236,216,166,0.1)] hover:shadow-[0_0_25px_rgba(236,216,166,0.2)] flex items-center justify-center gap-3 transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 text-[#ecd8a6]/70" />
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
                    className="relative group perspective"
                  >
                    <div className="w-full aspect-[2/3] bg-gradient-to-br from-[#1e1332] to-[#0a0512] rounded-2xl border border-[#ecd8a6]/30 shadow-[0_0_30px_rgba(236,216,166,0.05)] flex flex-col items-center justify-center p-6 text-center transform transition-transform duration-500 group-hover:scale-105 group-hover:border-[#ecd8a6]/60 relative overflow-hidden">
                      <div className="absolute inset-0 bg-transparent border-[4px] border-double border-[#ecd8a6]/10 m-2 rounded-xl pointer-events-none" />
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-serif tracking-widest text-[#ecd8a6]/70 uppercase">
                        {label}
                      </div>

                      <div className="absolute top-[3.5rem] w-8 h-px bg-[#ecd8a6]/30" />
                      
                      <div className="flex-1 flex items-center justify-center mt-12">
                        <Sparkles className="w-10 h-10 text-[#ecd8a6]/40 mb-2" />
                      </div>

                      <div className="w-full relative z-10 mb-4">
                        <h3 className="text-xl font-serif text-[#ecd8a6] mb-3">{drawnCards[index]?.name}</h3>
                        <p className="text-xs text-[#ecd8a6]/60 font-sans italic leading-relaxed line-clamp-3 px-2">{drawnCards[index]?.desc}</p>
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
                    className="prose prose-invert prose-amber max-w-none font-serif leading-[2] tracking-wide"
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
    </div>
  );
}

export default App;

