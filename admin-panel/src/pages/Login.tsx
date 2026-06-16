import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fetchAdminData = useAuthStore(state => state.fetchAdminData);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (authError: any) {
        // Bootstrap super admin if it does not exist
        if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
           if (email === 'elifterzi57@gmail.com' && password === '613415') {
             try {
               userCredential = await createUserWithEmailAndPassword(auth, email, password);
             } catch (createError: any) {
               if (createError.code === 'auth/email-already-in-use') {
                 throw new Error('E-posta veya şifre hatalı.');
               }
               throw createError;
             }
           } else {
             throw new Error('E-posta veya şifre hatalı.');
           }
        } else {
           throw authError;
        }
      }

      await fetchAdminData(userCredential.user.uid, userCredential.user.email!);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Giriş yapılamadı.');
      auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05000a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1e1332]/40 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0a0512]/60 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-[#1e1332]/80 border border-[#ecd8a6]/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(236,216,166,0.1)]">
            <Lock className="w-8 h-8 text-[#ecd8a6]" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-serif tracking-wider text-[#ecd8a6]">
          MadameSoul Admin Paneli
        </h2>
        <p className="mt-2 text-center text-sm text-[#ecd8a6]/60 font-sans">
          Sadece yetkili personel girişi içindir.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-[#0a0512]/80 backdrop-blur-md py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-[#ecd8a6]/20 shadow-[0_0_50px_rgba(236,216,166,0.03)]">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-950/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-sans font-medium text-[#ecd8a6]/80 mb-2">E-posta Adresi</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg px-4 py-3 outline-none focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60 text-[#ecd8a6] transition-all placeholder:text-[#ecd8a6]/30 sm:text-sm"
                  placeholder="admin@madamesoul.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-sans font-medium text-[#ecd8a6]/80 mb-2">Şifre</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg px-4 py-3 outline-none focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60 text-[#ecd8a6] transition-all placeholder:text-[#ecd8a6]/30 sm:text-sm"
                  placeholder="••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-xl text-xs font-serif uppercase tracking-widest font-bold text-[#0a0512] bg-[#ecd8a6] hover:bg-white focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_15px_rgba(236,216,166,0.1)]"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
