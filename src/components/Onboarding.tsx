import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Play } from 'lucide-react';
import { KatinaMoon } from './KatinaMoon';

interface OnboardingProps {
  onComplete: () => void;
  language: string;
  t: (key: string, params?: Record<string, string>) => string;
}

const slideIcons = [
  <KatinaMoon className="w-20 h-20" />,
  <KatinaMoon className="w-16 h-16 text-amber-400" />,
  <KatinaMoon className="w-16 h-16 text-amber-400" />,
  <KatinaMoon className="w-16 h-16 text-amber-400" />
];

const slideImages = [
  "https://images.unsplash.com/photo-1635832793132-ec4008a6b107?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1512411993420-19a9307cedf3?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1549468057-5b7fb2744492?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=2000"
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, language, t }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => {
    if (currentSlide === 3) {
      onComplete();
    } else {
      setCurrentSlide(s => s + 1);
    }
  };

  const prev = () => {
    setCurrentSlide(s => Math.max(0, s - 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06040a] flex flex-col items-center justify-center text-white overflow-hidden font-sans">
      {/* Mystic Particle Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.05),transparent_70%)]" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.3
            }}
            animate={{ 
              y: [null, "-20%", "20%"],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ 
              duration: 5 + Math.random() * 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute w-1 h-1 bg-amber-200/40 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full h-full flex flex-col"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <motion.img 
              key={slideImages[currentSlide]}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.25 }}
              transition={{ duration: 2 }}
              src={slideImages[currentSlide]} 
              alt="Background" 
              className="w-full h-full object-cover blur-[1px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#06040a]/40 via-[#06040a]/80 to-[#06040a]" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 text-center max-w-xl mx-auto">
            <motion.div 
              initial={{ y: 20, opacity: 0, rotate: -5 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 50 }}
              className="mb-12"
            >
              <div className="relative group">
                <div className={`absolute inset-0 bg-amber-400/10 blur-3xl rounded-full scale-150 ${currentSlide === 3 ? '' : 'animate-pulse'}`} />
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 2, 0, -2, 0]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10"
                >
                  {slideIcons[currentSlide]}
                </motion.div>
                
                {/* Decorative Circles */}
                <div className="absolute -inset-8 border border-amber-400/5 rounded-full pointer-events-none scale-110" />
                <div className="absolute -inset-12 border border-amber-400/10 rounded-full pointer-events-none scale-90 opacity-50" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 tracking-[-0.02em] leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-amber-100 via-amber-300 to-amber-500">
                  {t(`onboarding.slides.${currentSlide}.title`)}
                </span>
              </h2>
              
              <div className="h-0.5 w-12 bg-amber-400/30 mx-auto mb-6 rounded-full" />
              
              <p className="text-base md:text-lg text-neutral-300/80 leading-relaxed font-light font-sans max-w-md mx-auto italic">
                "{t(`onboarding.slides.${currentSlide}.description`)}"
              </p>

              {currentSlide === 0 && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 1.5 }}
                  className="mt-8 text-[10px] uppercase tracking-[0.3em] text-amber-200"
                >
                  Intuition • Guidance • Transformation
                </motion.p>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="relative z-20 pb-16 flex flex-col items-center gap-10 w-full max-w-sm px-8">
        <div className="flex gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`h-1 rounded-full transition-all duration-500 overflow-hidden ${
                i === currentSlide ? 'w-10 bg-amber-400' : 'w-2.5 bg-neutral-800'
              }`}
            >
              {i === currentSlide && (
                <motion.div 
                  className="h-full bg-amber-200"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center w-full">
          <button
            onClick={next}
            className="flex items-center gap-3 px-12 py-4 border border-amber-400/30 text-amber-100 rounded-2xl font-medium hover:bg-amber-400/10 transition-all hover:scale-105 active:scale-95 group mb-6"
          >
            <span className="tracking-widest uppercase text-xs">
              {currentSlide === 3 ? t('onboarding.start') : t('onboarding.next')}
            </span>
            {currentSlide === 3 ? (
              <Play className="w-4 h-4 fill-current text-amber-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            )}
          </button>

          <button
            onClick={prev}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-all text-xs uppercase tracking-widest ${
              currentSlide === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{language === 'tr' ? 'Geri' : 'Back'}</span>
          </button>
        </div>
      </div>

      {/* Skip Button */}
      <button 
        onClick={onComplete}
        className="absolute top-8 right-8 z-20 text-neutral-500 hover:text-amber-200 font-medium transition-colors text-sm"
      >
        {t('onboarding.skip')}
      </button>
    </div>
  );
};
