import { create } from 'zustand';
import { User } from 'firebase/auth';

export type Language = 'tr' | 'en' | 'es' | 'fr' | 'zh' | 'ko';

export type Card = {
  id: string;
  locKey: string;
  name: string;
  desc: string;
};

export type UserInfo = {
  name: string;
  dob: string;
  birthplace: string;
  relationship: string;
  language: Language;
  focus: string; // MS-121
  termsAccepted?: boolean;
  termsAcceptedAt?: string;
  termsVersion?: string;
};

export type AppState = {
  user: User | null;
  userRole: 'user' | 'employee' | 'admin' | null;
  userInfo: UserInfo;
  moonsCount: number;
  readingCount: number;
  step: 'SPLASH' | 'FORM' | 'DRAWING' | 'RESULT';
  linkingEmail: string;
  pendingCredential: any | null;
  linkingProvider: 'Google' | 'Apple' | null;
  showLinkingModal: boolean;
  isSocialLoginInProgress: boolean;
  setUser: (user: User | null) => void;
  setUserRole: (role: 'user' | 'employee' | 'admin' | null) => void;
  setUserInfo: (info: Partial<UserInfo>) => void;
  setMoonsCount: (count: number) => void;
  setReadingCount: (count: number | ((prev: number) => number)) => void;
  setStep: (step: 'SPLASH' | 'FORM' | 'DRAWING' | 'RESULT') => void;
  setLinkingEmail: (email: string) => void;
  setPendingCredential: (credential: any | null) => void;
  setLinkingProvider: (provider: 'Google' | 'Apple' | null) => void;
  setShowLinkingModal: (show: boolean) => void;
  setIsSocialLoginInProgress: (inProgress: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  userRole: null,
  userInfo: {
    name: '',
    dob: '',
    birthplace: '',
    relationship: 'single',
    language: (localStorage.getItem('madamesoul_language') as Language) || 'en',
    focus: 'general',
  },
  moonsCount: 0,
  readingCount: 0,
  step: 'SPLASH',
  linkingEmail: '',
  pendingCredential: null,
  linkingProvider: null,
  showLinkingModal: false,
  isSocialLoginInProgress: false,
  setUser: (user) => set({ user }),
  setUserRole: (userRole) => set({ userRole }),
  setUserInfo: (info) =>
    set((state) => {
      if (info.language) {
        localStorage.setItem('madamesoul_language', info.language);
      }
      return {
        userInfo: { ...state.userInfo, ...info },
      };
    }),
  setMoonsCount: (moonsCount) => set({ moonsCount }),
  setReadingCount: (count) =>
    set((state) => ({
      readingCount: typeof count === 'function' ? count(state.readingCount) : count,
    })),
  setStep: (step) => set({ step }),
  setLinkingEmail: (linkingEmail) => set({ linkingEmail }),
  setPendingCredential: (pendingCredential) => set({ pendingCredential }),
  setLinkingProvider: (linkingProvider) => set({ linkingProvider }),
  setShowLinkingModal: (showLinkingModal) => set({ showLinkingModal }),
  setIsSocialLoginInProgress: (isSocialLoginInProgress) => set({ isSocialLoginInProgress }),
}));
