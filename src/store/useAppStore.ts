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
};

export type AppState = {
  user: User | null;
  userRole: 'user' | 'employee' | 'admin' | null;
  userInfo: UserInfo;
  moonsCount: number;
  readingCount: number;
  step: 'SPLASH' | 'FORM' | 'DRAWING' | 'RESULT';
  setUser: (user: User | null) => void;
  setUserRole: (role: 'user' | 'employee' | 'admin' | null) => void;
  setUserInfo: (info: Partial<UserInfo>) => void;
  setMoonsCount: (count: number) => void;
  setReadingCount: (count: number | ((prev: number) => number)) => void;
  setStep: (step: 'SPLASH' | 'FORM' | 'DRAWING' | 'RESULT') => void;
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
}));
