import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type AdminRole = 'admin' | 'çalışan' | 'görüntüleyen';

export interface AdminUser {
  email: string;
  role: AdminRole;
  createdAt: any;
}

interface AuthState {
  user: User | null;
  adminData: AdminUser | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchAdminData: (uid: string, email: string) => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  adminData: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  clearAuth: () => set({ user: null, adminData: null, loading: false }),
  fetchAdminData: async (uid: string, email: string) => {
    set({ loading: true });
    try {
      const docRef = doc(db, 'admin_users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ adminData: docSnap.data() as AdminUser, loading: false });
      } else {
        // Bootstrap super admin logic
        if (email.toLowerCase() === 'elifterzi57@gmail.com') {
          const newAdmin: AdminUser = {
            email: email.toLowerCase(),
            role: 'admin',
            createdAt: serverTimestamp()
          };
          await setDoc(docRef, newAdmin);
          set({ adminData: newAdmin, loading: false });
        } else {
          set({ adminData: null, loading: false });
          throw new Error('Yetkisiz erişim. Admin hesabı bulunamadı.');
        }
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      set({ adminData: null, loading: false });
      throw error;
    }
  }
}));
