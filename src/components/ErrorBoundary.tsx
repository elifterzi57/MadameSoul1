import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAppStore } from '../store/useAppStore';
import en from '../locales/en.yaml';
import tr from '../locales/tr.yaml';
import es from '../locales/es.yaml';
import fr from '../locales/fr.yaml';
import zh from '../locales/zh.yaml';
import ko from '../locales/ko.yaml';

const locales: Record<string, any> = { en, tr, es, fr, zh, ko };

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    // Log client-side error to Firestore (MS-117)
    try {
      addDoc(collection(db, 'error_logs'), {
        source: 'client',
        userId: auth.currentUser?.uid || null,
        message: error.message,
        stack: error.stack || null,
        componentStack: errorInfo.componentStack || null,
        createdAt: serverTimestamp()
      });
    } catch (logErr) {
      console.error("Failed to log error to Firestore error_logs:", logErr);
    }
  }

  public render() {
    if (this.state.hasError) {
      const language = useAppStore.getState().userInfo.language || 'en';
      const currentLocale = locales[language] || locales.en;
      
      const t = (key: string): string => {
        let val = key.split('.').reduce((obj, k) => obj?.[k], currentLocale);
        if (val === undefined || val === null) {
          val = key.split('.').reduce((obj, k) => obj?.[k], locales.en);
        }
        return val !== undefined && val !== null ? String(val) : key;
      };

      return (
        <div className="min-h-screen bg-[#05000a] text-[#ecd8a6] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10 max-w-md bg-[#0a0512]/80 backdrop-blur-md border border-red-900/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.05)]">
            <div className="w-16 h-16 rounded-full bg-red-950/20 border border-red-900/30 flex items-center justify-center mx-auto mb-6 text-red-400">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h1 className="text-2xl font-serif tracking-widest uppercase mb-4 text-red-200">
              {t('errorBoundary.title')}
            </h1>
            <p className="text-sm text-[#ecd8a6]/70 leading-relaxed mb-8">
              {t('errorBoundary.description')}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full h-[50px] bg-gradient-to-br from-red-950/30 to-[#0a0512] border border-red-900/40 text-red-200 hover:text-white hover:border-red-500/60 rounded-xl transition-all flex items-center justify-center gap-2 group font-serif tracking-widest uppercase text-xs"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              {t('errorBoundary.retryButton')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
