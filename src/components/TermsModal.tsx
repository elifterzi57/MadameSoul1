import React, { useState } from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { Loader2, ShieldCheck } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { LEGAL_CONTENT } from '../data/legal';
import { useAppStore } from '../store/useAppStore';

interface TermsModalProps {
  userId: string;
  language: string;
  onAccept: () => void;
  t: (key: string, params?: Record<string, any>) => string;
}

export const TermsModal: React.FC<TermsModalProps> = ({ userId, language, onAccept, t }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUserInfo } = useAppStore();

  const handleAccept = async () => {
    setLoading(true);
    setError('');
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        termsAccepted: true,
        termsAcceptedAt: serverTimestamp(),
        termsVersion: '1.0.0'
      });

      // Update local Zustand state
      setUserInfo({
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
        termsVersion: '1.0.0'
      });

      onAccept();
    } catch (err: any) {
      console.error('Failed to accept terms:', err);
      setError(t('termsConsent.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-gradient-to-b from-[#130b21] to-[#0a0512]/95 border border-[#ecd8a6]/30 backdrop-blur-xl rounded-[2rem] shadow-2xl relative max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Top Gold Border Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ecd8a6]/40 to-transparent" />
        
        {/* Ethereal background glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-[#ecd8a6]/10 bg-[#130b21]/80 flex flex-col items-center justify-center relative z-10">
          <div className="w-12 h-12 bg-[#1a1025] border border-[#ecd8a6]/20 rounded-full flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-[#ecd8a6]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#ecd8a6] tracking-wider uppercase text-center">
            {t('termsConsent.title')}
          </h2>
          <p className="text-[#ecd8a6]/50 text-xs sm:text-sm font-sans mt-1 text-center max-w-md">
            {t('termsConsent.subtitle')}
          </p>
        </div>

        {/* Scrollable Terms Content */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 relative z-10 bg-black/20">
          <div className="legal-content prose prose-invert prose-amber max-w-none text-[#ecd8a6]/80 text-sm leading-relaxed">
            <Markdown>{LEGAL_CONTENT[language] || LEGAL_CONTENT['en']}</Markdown>
          </div>
        </div>

        {/* Modal Footer with Button */}
        <div className="p-6 border-t border-[#ecd8a6]/10 bg-[#0a0512]/95 flex flex-col items-center gap-4 relative z-10">
          {error && (
            <p className="text-red-400 text-xs text-center bg-red-400/5 py-2 px-4 rounded-lg border border-red-400/10 w-full max-w-md">
              {error}
            </p>
          )}
          
          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full max-w-md py-4 bg-[#ecd8a6] hover:bg-white active:scale-[0.98] text-[#0a0512] rounded-xl font-serif uppercase tracking-widest text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{t('termsConsent.accept')}</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
