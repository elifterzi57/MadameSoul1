import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, RefreshCw, ChevronRight } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ContactModalProps {
  language: string;
  locales: Record<string, any>;
  onClose: () => void;
  onErrorLog: (error: unknown, operation: string, path: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ language, locales, onClose, onErrorLog }) => {
  const [contactForm, setContactForm] = useState({ fullName: '', email: '', subject: '', message: '' });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSubmitting(true);
    try {
      await addDoc(collection(db, `messages_${language}`), {
        ...contactForm,
        createdAt: serverTimestamp()
      });
      setContactSuccess(true);
      setContactForm({ fullName: '', email: '', subject: '', message: '' });
    } catch (error) {
      onErrorLog(error, 'create', `messages_${language}`);
    } finally {
      setIsContactSubmitting(false);
    }
  };

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
        className="w-full max-w-md bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/30 overflow-hidden shadow-[0_0_50px_rgba(236,216,166,0.1)] relative max-h-[90vh] overflow-y-auto"
      >
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => { onClose(); setContactSuccess(false); }} 
            className="p-2 bg-black/50 hover:bg-[#ecd8a6]/10 rounded-full text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 pb-4 border-b border-[#ecd8a6]/10 relative overflow-hidden">
          <h2 className="text-2xl font-serif text-[#ecd8a6] tracking-widest uppercase mb-2">
            {locales[language]?.contact?.title || 'Bize Ulaşın'}
          </h2>
          <p className="text-[#ecd8a6]/70 text-sm">
            {locales[language]?.contact?.subtitle || 'Bizimle iletişime geçmek için aşağıdaki formu doldurabilirsiniz.'}
          </p>
        </div>
        
        <div className="p-6">
          {contactSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#ecd8a6]/10 flex items-center justify-center mx-auto mb-4 text-[#ecd8a6]">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif text-[#ecd8a6] mb-2 uppercase tracking-wide">
                {locales[language]?.contact?.successTitle || 'Mesajınız Alındı'}
              </h3>
              <p className="text-[#ecd8a6]/70">
                {locales[language]?.contact?.successSubtitle || 'En kısa sürede size dönüş yapacağız.'}
              </p>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-1 uppercase">
                  {locales[language]?.contact?.fullName || 'Ad Soyad'}
                </label>
                <input 
                  type="text" 
                  required
                  value={contactForm.fullName}
                  onChange={(e) => setContactForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-[#120a1c] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-1 uppercase">
                  {locales[language]?.contact?.email || 'E-posta'}
                </label>
                <input 
                  type="email" 
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-[#120a1c] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-1 uppercase">
                  {locales[language]?.contact?.subject || 'Konu'}
                </label>
                <input 
                  type="text" 
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full bg-[#120a1c] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-1 uppercase">
                  {locales[language]?.contact?.message || 'Mesaj'}
                </label>
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
                    <span className="font-bold">{locales[language]?.contact?.send || 'Gönder'}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
