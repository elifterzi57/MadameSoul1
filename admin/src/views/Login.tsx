import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useTranslation } from '../context/LanguageContext';

export const Login: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idTokenResult = await userCredential.user.getIdTokenResult(true);
      const role = idTokenResult.claims.role;

      if (role === 'admin' || role === 'employee' || role === 'viewer') {
        navigate('/');
      } else {
        await auth.signOut();
        setError(t('login.errorNoPermission'));
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError(t('login.errorInvalidCredentials'));
      } else {
        setError(t('login.errorGeneric') + (err.message || err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#07040e] px-4 overflow-hidden">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50 flex gap-2">
        <button
          onClick={() => setLanguage('tr')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
            language === 'tr'
              ? 'border-[#ecd8a6] bg-[#ecd8a6]/20 text-[#ecd8a6]'
              : 'border-transparent text-[#ecd8a6]/40 hover:text-[#ecd8a6]/80'
          }`}
        >
          TR
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
            language === 'en'
              ? 'border-[#ecd8a6] bg-[#ecd8a6]/20 text-[#ecd8a6]'
              : 'border-transparent text-[#ecd8a6]/40 hover:text-[#ecd8a6]/80'
          }`}
        >
          EN
        </button>
      </div>

      {/* Background magical elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-900/10 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-900/10 blur-[120px]"></div>

      <div className="relative w-full max-w-md rounded-2xl border border-[#ecd8a6]/20 bg-[#0e0a1b]/80 p-8 shadow-2xl shadow-purple-950/20 backdrop-blur-xl">
        {/* Title / Logo */}
        <div className="text-center">
          <h1 className="font-serif text-4xl tracking-widest text-[#ecd8a6] drop-shadow-md">
            MADAME SOUL
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#ecd8a6]/60">
            {t('login.subtitle')}
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-900/30 bg-red-950/20 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/80 font-medium">
              {t('login.emailLabel')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-4 py-3 text-[#ecd8a6] outline-none transition focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60"
              placeholder={t('login.emailPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/80 font-medium">
              {t('login.passwordLabel')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-4 py-3 text-[#ecd8a6] outline-none transition focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative flex w-full justify-center rounded-lg bg-gradient-to-r from-[#8a2be2]/80 to-[#ecd8a6]/80 px-4 py-3 text-sm font-semibold text-[#07040e] shadow-lg transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loading ? t('login.loggingIn') : t('login.logIn')}
          </button>
        </form>
      </div>
    </div>
  );
};

