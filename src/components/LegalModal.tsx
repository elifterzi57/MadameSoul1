import React from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { X } from 'lucide-react';
import { LEGAL_CONTENT } from '../data/legal';

interface LegalModalProps {
  language: string;
  onClose: () => void;
  t: (key: string) => string;
}

export const LegalModal: React.FC<LegalModalProps> = ({ language, onClose, t }) => {
  return (
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
        className="w-full max-w-2xl bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/30 overflow-hidden shadow-[0_0_50px_rgba(236,216,166,0.1)] relative max-h-[85vh] flex flex-col"
      >
        <div className="p-6 border-b border-[#ecd8a6]/10 flex items-center justify-between bg-[#130b21]">
          <h2 className="text-xl font-serif text-[#ecd8a6]">{t('legal.title')}</h2>
          <button 
            onClick={onClose} 
            className="p-2 bg-black/50 hover:bg-[#ecd8a6]/10 rounded-full text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar flex-1">
          <div className="legal-content prose prose-invert prose-amber max-w-none text-[#ecd8a6]/80 text-sm leading-relaxed">
            <Markdown>{LEGAL_CONTENT[language] || LEGAL_CONTENT['en']}</Markdown>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
