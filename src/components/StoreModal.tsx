import React from 'react';
import { motion } from 'motion/react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { User } from 'firebase/auth';
import { KatinaMoon } from './KatinaMoon';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  language: string;
  t: (key: string, params?: Record<string, any>) => string;
  showToast: (msg: string, type: 'info' | 'error' | 'success') => void;
  onErrorLog: (error: unknown, operation: string, path: string) => void;
  onCheckoutInitiated?: (pack: { amount: number; price: string }) => void;
  moonsCount?: number;
}

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  onClose,
  user,
  language,
  t,
  showToast,
  onErrorLog,
  onCheckoutInitiated,
  moonsCount = 0
}) => {
  if (!isOpen) return null;

  const handleBuy = async (pack: { amount: number; price: string }) => {
    if (!user) return;
    try {
      showToast(t('store.redirecting'), 'info');
      
      // Funnel tracking (MS-134)
      if (onCheckoutInitiated) {
        onCheckoutInitiated(pack);
      }

      const token = await user.getIdToken();
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: pack.amount,
          price: pack.price,
          userLanguage: language
        })
      });
      
      if (!response.ok) {
        throw new Error(t('store.failedSession'));
      }
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Invalid checkout response");
      }
    } catch (error) {
      console.error("Store checkout error:", error);
      showToast(error instanceof Error ? error.message : "Error initiating checkout", 'error');
      onErrorLog(error, 'checkout', `users/${user.uid}`);
    }
    onClose();
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
          <button onClick={onClose} className="p-2 bg-black/50 hover:bg-[#ecd8a6]/10 rounded-full text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 text-center pb-6 border-b border-[#ecd8a6]/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ecd8a6]/10 to-transparent" />
          <KatinaMoon className="w-12 h-12 text-[#ecd8a6] mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-[#ecd8a6] tracking-widest uppercase">
            {t('store.storeTitle')}
          </h2>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          {moonsCount <= 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-amber-900/10 border border-amber-500/30 flex items-start gap-3 text-left shadow-[0_0_20px_rgba(245,158,11,0.05)]"
            >
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-amber-500/90 font-medium leading-relaxed">
                  {t('store.zeroBalanceWarning')}
                </p>
              </div>
            </motion.div>
          )}

          {[
            { amount: 3, price: "$2.99", bonusKey: null },
            { amount: 10, price: "$8.99", bonusKey: "store.bonus1", popular: true },
            { amount: 25, price: "$19.99", bonusKey: "store.bonus5" }
          ].map((pack) => (
            <div 
              key={pack.amount} 
              className={`relative flex items-center justify-between p-4 rounded-xl border ${
                pack.popular ? 'border-[#ecd8a6] bg-[#ecd8a6]/5' : 'border-[#ecd8a6]/20 bg-[#ffffff]/5'
              } hover:bg-[#ecd8a6]/10 transition-colors cursor-pointer group`} 
              onClick={() => handleBuy(pack)}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ecd8a6] text-[#0a0512] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                  {t('store.popular')}
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0a0512] border border-[#ecd8a6]/30 flex items-center justify-center group-hover:border-[#ecd8a6] transition-colors">
                  <KatinaMoon className="w-5 h-5 text-[#ecd8a6]" />
                </div>
                <div className="text-left">
                  <div className="text-[#ecd8a6] font-serif flex items-baseline gap-1">
                    <span className="text-xl font-bold">{pack.amount}</span>
                    <span className="text-sm opacity-80">{t('store.moons')}</span>
                  </div>
                  {pack.bonusKey && (
                    <div className="text-xs text-amber-500/90 font-medium">✨ {t(pack.bonusKey)}</div>
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
  );
};
