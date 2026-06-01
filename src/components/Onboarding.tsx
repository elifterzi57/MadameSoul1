import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { KatinaMoon } from './KatinaMoon';

interface OnboardingProps {
  onComplete: () => void;
  language: string;
  t: (key: string, params?: Record<string, string>) => string;
}

const slideImages = [
  "/assets/onboarding/onboarding_welcome.webp",
  "/assets/onboarding/onboarding_discovery.webp",
  "/assets/onboarding/onboarding_journey.webp"
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, language, t }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: t('onboarding.slides.0.title'),
      description: t('onboarding.slides.0.description'),
      icon: (
        <div className="relative">
          <KatinaMoon className="w-20 h-20 text-[#ecd8a6]" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-[#ecd8a6]/20 rounded-full border-dashed"
          />
        </div>
      ),
      tag: "Welcome"
    },
    {
      title: t('onboarding.slides.1.title'),
      description: t('onboarding.slides.1.description'),
      icon: (
        <div className="relative">
          <KatinaMoon className="w-20 h-20 text-[#ecd8a6]" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-[#ecd8a6]/20 rounded-full border-dashed"
          />
        </div>
      ),
      tag: "Discovery"
    },
    {
      title: t('onboarding.slides.2.title'),
      description: t('onboarding.slides.2.description'),
      icon: (
        <div className="relative">
          <KatinaMoon className="w-20 h-20 text-[#ecd8a6]" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-[#ecd8a6]/20 rounded-full border-dashed"
          />
        </div>
      ),
      tag: "Journey"
    }
  ];

  const next = () => {
    if (currentSlide === slides.length - 1) {
      onComplete();
    } else {
      setCurrentSlide(s => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06040a] flex items-center justify-center text-white overflow-hidden font-sans">
      {/* Background with Ambient Light */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentSlide}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={slideImages[currentSlide]} 
            alt="" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[#06040a]/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06040a]/50 to-[#06040a]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: "110%",
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: "-10%",
              opacity: [0, 0.4, 0],
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-[#ecd8a6]/40 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg px-8 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="w-full flex flex-col items-center text-center"
          >
            {/* Tag/Stage */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-[10px] uppercase tracking-[0.5em] text-[#ecd8a6]/60 mb-8 border border-[#ecd8a6]/20 px-4 py-1.5 rounded-full"
            >
              {slides[currentSlide].tag}
            </motion.span>

            {/* Icon/Visual */}
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 12 }}
              className="mb-12 relative"
            >
              <div className="absolute inset-0 bg-[#ecd8a6]/5 blur-3xl rounded-full scale-150 animate-pulse" />
              {slides[currentSlide].icon}
            </motion.div>

            {/* Typography */}
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-tight text-[#ecd8a6]"
            >
              {slides[currentSlide].title}
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[#ecd8a6]/60 leading-relaxed font-light text-sm md:text-base max-w-sm"
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation & Progress */}
        <div className="mt-16 w-full flex flex-col items-center gap-10">
          {/* Progress dots */}
          <div className="flex gap-4">
            {slides.map((_, i) => (
              <div 
                key={i}
                className="relative h-1 w-8 bg-white/5 rounded-full overflow-hidden"
              >
                {i <= currentSlide && (
                  <motion.div 
                    layoutId="progress-fill"
                    className="absolute inset-0 bg-[#ecd8a6]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {i === currentSlide && (
                  <motion.div 
                    className="absolute inset-0 bg-white/40"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between w-full">
            <button
              onClick={onComplete}
              className="text-[10px] uppercase tracking-widest text-white/30 hover:text-[#ecd8a6] transition-colors"
            >
              {t('onboarding.skip')}
            </button>

            <button
              onClick={next}
              className="flex items-center gap-3 bg-[#ecd8a6] text-[#0a0512] px-8 py-3.5 rounded-full font-serif font-medium hover:bg-white transition-all hover:scale-105 active:scale-95 group"
            >
              <span className="tracking-wider uppercase text-[11px]">
                {currentSlide === slides.length - 1 ? t('onboarding.start') : t('onboarding.next')}
              </span>
              {currentSlide === slides.length - 1 ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
