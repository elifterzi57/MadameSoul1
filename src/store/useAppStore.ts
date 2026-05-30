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
  userInfo: UserInfo;
  moonsCount: number;
  readingCount: number;
  step: 'SPLASH' | 'FORM' | 'DRAWING' | 'RESULT';
  setUser: (user: User | null) => void;
  setUserInfo: (info: Partial<UserInfo>) => void;
  setMoonsCount: (count: number) => void;
  setReadingCount: (count: number | ((prev: number) => number)) => void;
  setStep: (step: 'SPLASH' | 'FORM' | 'DRAWING' | 'RESULT') => void;
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  userInfo: {
    name: '',
    dob: '',
    birthplace: '',
    relationship: 'single',
    language: 'en',
    focus: 'general',
  },
  moonsCount: 0,
  readingCount: 0,
  step: 'SPLASH',
  setUser: (user) => set({ user }),
  setUserInfo: (info) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...info },
    })),
  setMoonsCount: (moonsCount) => set({ moonsCount }),
  setReadingCount: (count) =>
    set((state) => ({
      readingCount: typeof count === 'function' ? count(state.readingCount) : count,
    })),
  setStep: (step) => set({ step }),
}));
