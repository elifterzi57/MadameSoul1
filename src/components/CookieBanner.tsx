import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';

interface CookieBannerProps {
  language: string;
  t: (key: string) => string;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ language, t }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted');
    if (!accepted) {
      // 1.5 seconds delay before showing the banner for premium feel
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const getTexts = (): { text: string; button: string } => {
    if (language === 'tr') {
      return {
        text: "Gezinti deneyiminizi geliştirmek, kişiselleştirilmiş içerik sunmak ve fal analizlerinizi güvenle kaydetmek için çerezleri kullanıyoruz.",
        button: "Kabul Et"
      };
    }
    return {
      text: "We use cookies to improve your browsing experience, deliver personalized content, and securely store your destiny readings.",
      button: "Accept All"
    };
  };

  const texts = getTexts();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="fixed bottom-6 left-6 right-6 md:left-6 md:right-auto md:max-w-md z-40 bg-[#0a0512]/90 backdrop-blur-md border border-[#ecd8a6]/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(236,216,166,0.1)] overflow-hidden"
        >
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-sans text-[#ecd8a6]/80 leading-relaxed text-justify">
                {texts.text}
              </p>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-[#ecd8a6]/40 hover:text-[#ecd8a6] transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAccept}
                className="flex items-center gap-2 bg-[#ecd8a6] hover:bg-[#fff] text-[#0a0512] font-serif tracking-widest text-[10px] uppercase font-bold px-5 py-2.5 rounded-lg shadow-md transition-all active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                {texts.button}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
