import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  User,
  getAdditionalUserInfo,
  linkWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp, getDocs, query, collection, where } from 'firebase/firestore';
import { gatherUserMetadata } from '../lib/metadata';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Apple,
  Mail, 
  Phone, 
  Lock, 
  ArrowRight, 
  Loader2, 
  MessageSquare, 
  ShieldCheck, 
  MailCheck, 
  Globe, 
  RefreshCw,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { KatinaMoon } from './KatinaMoon';

interface LoginProps {
  onLogin: () => void;
  language: 'tr' | 'en' | 'es' | 'fr' | 'zh' | 'ko';
  onLanguageChange: (lang: 'tr' | 'en' | 'es' | 'fr' | 'zh' | 'ko') => void;
  onShowOnboarding: () => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const languages = [
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'zh', name: '中文' },
  { code: 'ko', name: '한국어' }
] as const;

const countryCodes = [
  { code: '+90', name: 'TR', flag: '🇹🇷' },
  { code: '+1', name: 'US', flag: '🇺🇸' },
  { code: '+44', name: 'GB', flag: '🇬🇧' },
  { code: '+49', name: 'DE', flag: '🇩🇪' },
  { code: '+33', name: 'FR', flag: '🇫🇷' },
  { code: '+34', name: 'ES', flag: '🇪🇸' },
  { code: '+39', name: 'IT', flag: '🇮🇹' },
  { code: '+86', name: 'CN', flag: '🇨🇳' },
  { code: '+81', name: 'JP', flag: '🇯🇵' },
  { code: '+82', name: 'KR', flag: '🇰🇷' },
  { code: '+7', name: 'RU', flag: '🇷🇺' },
  { code: '+971', name: 'AE', flag: '🇦🇪' },
  { code: '+966', name: 'SA', flag: '🇸🇦' },
  { code: '+31', name: 'NL', flag: '🇳🇱' },
  { code: '+41', name: 'CH', flag: '🇨🇭' },
  { code: '+46', name: 'SE', flag: '🇸🇪' },
  { code: '+47', name: 'NO', flag: '🇳🇴' },
  { code: '+45', name: 'DK', flag: '🇩🇰' },
  { code: '+32', name: 'BE', flag: '🇧🇪' },
  { code: '+43', name: 'AT', flag: '🇦🇹' },
] as const;

export const Login: React.FC<LoginProps> = ({ onLogin, language, onLanguageChange, onShowOnboarding, t }) => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('+90');
  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const [code, setCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLangs, setShowLangs] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);

  // Account Linking states (MS-196)
  const [showLinkingModal, setShowLinkingModal] = useState(false);
  const [linkingEmail, setLinkingEmail] = useState('');
  const [linkingPassword, setLinkingPassword] = useState('');
  const [pendingCredential, setPendingCredential] = useState<any>(null);
  const [linkingProvider, setLinkingProvider] = useState<'Google' | 'Apple'>('Google');
  const [linkingError, setLinkingError] = useState('');
  const [linkingLoading, setLinkingLoading] = useState(false);

  const saveUserToFirestore = async (user: User, password?: string, additionalInfo?: any) => {
    try {
      const metadata = await gatherUserMetadata();
      const userRef = doc(db, 'users', user.uid);
      
      // Basic profile from user object
      const profileData = {
        userId: user.uid,
        email: user.email || null,
        phoneNumber: user.phoneNumber || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        password: password || null,
        providerId: user.providerData?.[0]?.providerId || user.providerId || null,
        emailVerified: user.emailVerified || false,
        isAnonymous: user.isAnonymous || false,
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
        consentsAcceptedAt: serverTimestamp(),
        metadata: {
          device: metadata.device,
          os: metadata.os,
          browser: metadata.browser,
          ip: metadata.ip,
          location: metadata.location
        }
      };

      // Add additional info if available (especially for Google/Apple)
      if (additionalInfo?.profile) {
        Object.assign(profileData, {
          firstName: additionalInfo.profile.given_name || additionalInfo.profile.first_name || null,
          lastName: additionalInfo.profile.family_name || additionalInfo.profile.last_name || null,
          locale: additionalInfo.profile.locale || null,
          gender: additionalInfo.profile.gender || null
        });
      }

      await setDoc(userRef, profileData, { merge: true });

      // Save to phones collection for marketing/tracking if phone exists
      if (user.phoneNumber) {
        const phoneRef = doc(db, 'phones', user.phoneNumber);
        await setDoc(phoneRef, {
          phoneNumber: user.phoneNumber,
          userId: user.uid,
          lastActive: serverTimestamp(),
          source: 'login'
        }, { merge: true });
      }
    } catch (err) {
      console.error("Firestore sync failed:", err);
    }
  };

  useEffect(() => {
    // Clear verifier on unmount
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (e) {}
      }
    };
  }, []);

  const initRecaptcha = () => {
    const container = document.getElementById('recaptcha-container');
    if (!container) return false;
    
    try {
      // Clear existing if it exists
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
      }

      // Ensure the container is empty to avoid "already rendered" issues
      container.innerHTML = '';
      
      window.recaptchaVerifier = new RecaptchaVerifier(auth, container, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          initRecaptcha();
        }
      });
      return true;
    } catch (err) {
      console.error("Recaptcha initialization failed:", err);
      return false;
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      await saveUserToFirestore(result.user, password);
      onLogin();
    } catch (err: any) {
      console.error("Email auth error:", err);
      // Show more specific error message if available
      // Add more specific error mappings
      const errorCode = err.code || (err.message?.includes('auth/') ? err.message.match(/auth\/[a-z-]+/)?.[0] : null);
      
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password') {
        setError(t('login.errorWrongCredentials'));
      } else if (errorCode === 'auth/email-already-in-use') {
        setError(t('login.errorEmailInUse'));
      } else if (errorCode === 'auth/invalid-email') {
        setError(t('login.errorInvalidEmail'));
      } else if (errorCode === 'auth/weak-password') {
        setError(t('login.errorWeakPassword'));
      } else if (errorCode === 'auth/too-many-requests') {
        setError(t('login.errorTooManyRequests'));
      } else {
        setError(err.message || t('login.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      const isInitialized = initRecaptcha();
      if (!isInitialized) {
        throw new Error("Recaptcha initialization failed. Please refresh.");
      }

      const fullPhone = `${selectedCountry}${phone}`;
      const result = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
      setConfirmationResult(result);
    } catch (err: any) {
      console.error("Phone auth error:", err);
      // Specifically handle the region error to inform the user
      if (err.code === 'auth/operation-not-allowed') {
        setError(t('login.errorSmsNotAllowed'));
      } else if (err.code === 'auth/billing-not-enabled') {
        setError(t('login.errorBillingNotEnabled'));
      } else if (err.code === 'auth/invalid-phone-number') {
        setError(t('login.errorInvalidPhone'));
      } else {
        setError(err.message || t('login.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(code);
        await saveUserToFirestore(result.user);
        onLogin();
      }
    } catch (err: any) {
      console.error("Code verify error:", err);
      if (err.code === 'auth/invalid-verification-code') {
        setError(t('login.errorInvalidCode'));
      } else {
        setError(err.message || t('login.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!consentAccepted) {
      setError(language === 'tr' ? "Lütfen önce Kullanıcı Sözleşmesini ve KVKK Açık Rıza Metnini onaylayın." : "Please accept the User Agreement and KVKK Consent first.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const additionalInfo = getAdditionalUserInfo(result);
      
      // Fallback: Check if another user with the same email already exists in Firestore (for multiple accounts console config)
      if (result.user.email) {
        const q = query(collection(db, 'users'), where('email', '==', result.user.email.toLowerCase()));
        const snap = await getDocs(q);
        const existingDocs = snap.docs.filter(d => d.id !== result.user.uid);
        if (existingDocs.length > 0) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential) {
            setLinkingEmail(result.user.email);
            setPendingCredential(credential);
            setLinkingProvider('Google');
            setShowLinkingModal(true);
            setLoading(false);
            // Delete the temporary Google user to free the credential and sign out
            await result.user.delete();
            return;
          }
        }
      }

      await saveUserToFirestore(result.user, undefined, additionalInfo);
      onLogin();
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        const email = err.customData?.email || err.email;
        const credential = GoogleAuthProvider.credentialFromError(err);
        if (email && credential) {
          setLinkingEmail(email);
          setPendingCredential(credential);
          setLinkingProvider('Google');
          setShowLinkingModal(true);
        } else {
          setError(err.message || t('login.error'));
        }
      } else if (err.code === 'auth/popup-blocked') {
        setError(t('login.errorPopupBlocked'));
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError(t('login.errorPopupClosed'));
      } else if (err.code === 'auth/configuration-not-found') {
        setError(t('login.errorConfigNotFound'));
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(t('login.errorUnauthorizedDomain'));
      } else {
        setError(err.message || t('login.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (!consentAccepted) {
      setError(language === 'tr' ? "Lütfen önce Kullanıcı Sözleşmesini ve KVKK Açık Rıza Metnini onaylayın." : "Please accept the User Agreement and KVKK Consent first.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      
      const result = await signInWithPopup(auth, provider);
      const additionalInfo = getAdditionalUserInfo(result);

      // Fallback: Check if another user with the same email already exists in Firestore (for multiple accounts console config)
      if (result.user.email) {
        const q = query(collection(db, 'users'), where('email', '==', result.user.email.toLowerCase()));
        const snap = await getDocs(q);
        const existingDocs = snap.docs.filter(d => d.id !== result.user.uid);
        if (existingDocs.length > 0) {
          const credential = OAuthProvider.credentialFromResult(result);
          if (credential) {
            setLinkingEmail(result.user.email);
            setPendingCredential(credential);
            setLinkingProvider('Apple');
            setShowLinkingModal(true);
            setLoading(false);
            // Delete the temporary Apple user to free the credential and sign out
            await result.user.delete();
            return;
          }
        }
      }

      await saveUserToFirestore(result.user, undefined, additionalInfo);
      onLogin();
    } catch (err: any) {
      console.error("Apple login error:", err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        const email = err.customData?.email || err.email;
        const credential = OAuthProvider.credentialFromError(err);
        if (email && credential) {
          setLinkingEmail(email);
          setPendingCredential(credential);
          setLinkingProvider('Apple');
          setShowLinkingModal(true);
        } else {
          setError(err.message || t('login.error'));
        }
      } else if (err.code === 'auth/popup-blocked') {
        setError(t('login.errorPopupBlocked'));
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError(t('login.errorPopupClosed'));
      } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        setError(t('login.errorConfigNotFound'));
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(t('login.errorUnauthorizedDomain'));
      } else {
        setError(err.message || t('login.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccounts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkingEmail || !linkingPassword || !pendingCredential) return;
    setLinkingLoading(true);
    setLinkingError('');
    try {
      // 1. Sign in with the existing email/password account
      const result = await signInWithEmailAndPassword(auth, linkingEmail, linkingPassword);
      const existingUser = result.user;

      // 2. Link the pending social credential to this logged-in user
      await linkWithCredential(existingUser, pendingCredential);

      // 3. Save profile/metadata details to Firestore
      await saveUserToFirestore(existingUser, linkingPassword);

      // 4. Reset states, close modal, and complete login
      setShowLinkingModal(false);
      setLinkingEmail('');
      setLinkingPassword('');
      setPendingCredential(null);
      onLogin();
    } catch (err: any) {
      console.error("Account linking failed:", err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setLinkingError(language === 'tr' ? "Hatalı şifre. Lütfen tekrar deneyin." : "Incorrect password. Please try again.");
      } else {
        setLinkingError(err.message || t('login.error'));
      }
    } finally {
      setLinkingLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0512] overflow-y-auto pt-20 pb-12 px-4 flex justify-center items-start sm:items-center">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>


      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm md:max-w-4xl bg-[#160c24]/90 backdrop-blur-2xl border border-[#ecd8a6]/15 rounded-[2rem] shadow-2xl relative mb-8 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ecd8a6]/30 to-transparent" />
        
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side: Visual (Desktop Only) */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#1a1025] to-[#0a0512] flex-col items-center justify-center p-12 relative overflow-hidden border-r border-[#ecd8a6]/10">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ecd8a6]/10 via-transparent to-transparent" />
            </div>
            
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 0.95, 1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 mb-8"
            >
              <div className="absolute inset-0 bg-[#ecd8a6]/20 blur-3xl rounded-full scale-150" />
              <KatinaMoon className="w-48 h-48 text-[#ecd8a6]" />
            </motion.div>
            
            <div className="text-center relative z-10">
              <h1 className="text-3xl font-serif text-[#ecd8a6] mb-4 tracking-widest uppercase">MadameSoul</h1>
              <div className="w-12 h-px bg-[#ecd8a6]/40 mx-auto mb-6" />
              <p className="text-[#ecd8a6]/60 font-serif italic text-lg leading-relaxed max-w-xs">
                {t('login.quote')}
              </p>
            </div>
            

          </div>

          {/* Right Side: Form */}
          <div className="flex-1 p-6 sm:p-10 md:p-12">
            {/* Logo/Icon Area (Mobile Only) */}
            <div className="flex justify-center mb-6 md:hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-[#ecd8a6]/10 blur-xl rounded-full scale-125" />
                <div className="w-16 h-16 bg-[#1a1025] border border-[#ecd8a6]/25 rounded-full flex items-center justify-center relative z-10">
                  <KatinaMoon className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Dynamic Titles */}
            <div className="text-center mb-8 w-full flex flex-col items-center">
              <h2 className="text-xl sm:text-2xl font-serif text-[#ecd8a6] tracking-tight mb-2 uppercase">
                {isSignUp ? t('login.signUpTitle') : t('login.signInTitle')}
              </h2>
              <p className="text-[#ecd8a6]/50 text-xs sm:text-sm max-w-[280px] md:max-w-none italic">
                {isSignUp ? t('login.signUpSubtitle') : t('login.signInSubtitle')}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {authMethod === 'email' ? (
                <motion.form 
                  key="email-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleEmailAuth}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ecd8a6]/40" />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('login.email')}
                        required
                        className="w-full bg-black/40 border border-[#ecd8a6]/10 rounded-xl py-3.5 pl-11 pr-4 text-[#ecd8a6] text-sm focus:border-[#ecd8a6]/40 outline-none transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ecd8a6]/40" />
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('login.password')}
                        required
                        className="w-full bg-black/40 border border-[#ecd8a6]/10 rounded-xl py-3.5 pl-11 pr-4 text-[#ecd8a6] text-sm focus:border-[#ecd8a6]/40 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-[10px] sm:text-xs text-center bg-red-400/5 py-2 rounded-lg border border-red-400/10">{error}</p>}

                  {/* KVKK / GDPR Consent Checkbox */}
                  <div className="flex items-start gap-2.5 px-1 py-1">
                    <input 
                      type="checkbox"
                      id="kvkk-consent-email"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#ecd8a6] cursor-pointer rounded border-[#ecd8a6]/20 bg-black/40"
                    />
                    <label htmlFor="kvkk-consent-email" className="text-[10px] sm:text-xs text-[#ecd8a6]/60 leading-normal cursor-pointer select-none">
                      {t('login.kvkkConsent')}
                    </label>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button 
                      type="submit"
                      disabled={loading || !consentAccepted}
                      className={`w-full py-4 rounded-xl font-serif uppercase tracking-widest text-[11px] sm:text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                        loading || !consentAccepted ? 'bg-[#ecd8a6]/30 text-[#0a0512]/50 cursor-not-allowed' : 'bg-[#ecd8a6] text-[#0a0512] hover:bg-[#fff] active:scale-[0.98]'
                      }`}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <>
                          <span>{isSignUp ? t('login.signUpLabel') : t('login.signInLabel')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="w-full text-[#ecd8a6]/60 hover:text-[#ecd8a6] text-[10px] sm:text-xs font-serif uppercase tracking-widest transition-all py-2"
                    >
                      {isSignUp ? t('login.hasAccount') : t('login.noAccount')}
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 pt-6 border-t border-[#ecd8a6]/10">
                    <button 
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className={`w-full py-3.5 rounded-xl text-[10px] sm:text-xs font-serif uppercase tracking-widest border transition-all flex items-center justify-center gap-3 ${
                        loading ? 'bg-white/5 border-[#ecd8a6]/5 text-[#ecd8a6]/30 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 border-[#ecd8a6]/10 text-[#ecd8a6] active:scale-[0.98]'
                      }`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      {t('login.googleSignIn')}
                    </button>

                    <button 
                      type="button"
                      onClick={handleAppleLogin}
                      disabled={loading}
                      className={`w-full py-3.5 rounded-xl text-[10px] sm:text-xs font-serif uppercase tracking-widest border transition-all flex items-center justify-center gap-3 ${
                        loading ? 'bg-white/5 border-[#ecd8a6]/5 text-[#ecd8a6]/30 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 border-[#ecd8a6]/10 text-[#ecd8a6] active:scale-[0.98]'
                      }`}
                    >
                      <Apple className="w-4 h-4" />
                      {t('login.appleSignIn')}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setAuthMethod(authMethod === 'email' ? 'phone' : 'email')}
                      className="w-full bg-white/5 hover:bg-white/10 active:scale-[0.98] text-[#ecd8a6] py-4 rounded-xl font-serif uppercase tracking-widest text-[11px] sm:text-xs font-bold flex items-center justify-center gap-2 border border-[#ecd8a6]/20 transition-all"
                    >
                      {authMethod === 'email' ? <Phone className="w-3.5 h-3.5 opacity-50" /> : <Mail className="w-3.5 h-3.5 opacity-50" />}
                      <span>{authMethod === 'email' ? t('login.switchToPhone') : t('login.switchToEmail')}</span>
                    </button>

                    <div className="pt-2">
                       <button 
                        type="button"
                        onClick={onShowOnboarding}
                        className="w-full text-[#ecd8a6]/40 hover:text-[#ecd8a6]/80 py-3.5 text-[10px] sm:text-xs font-serif uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group border border-transparent hover:border-[#ecd8a6]/10 rounded-xl"
                      >
                        <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-700" />
                        <span>{t('login.showIntro')}</span>
                      </button>
                    </div>

                    {/* Language Selector Under Button */}
                    <div className="flex flex-col items-center pt-2">
                      <div className="relative">
                        <button 
                          onClick={() => setShowLangs(!showLangs)}
                          className="flex items-center gap-2 text-[#ecd8a6]/40 hover:text-[#ecd8a6]/80 transition-colors group px-4 py-2"
                        >
                          <Globe className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                          <span className="text-[10px] sm:text-xs font-serif uppercase tracking-widest">
                            {languages.find(l => l.code === language)?.name}
                          </span>
                        </button>
                        <AnimatePresence>
                          {showLangs && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 sm:w-40 bg-[#1a1025] border border-[#ecd8a6]/30 rounded-2xl overflow-hidden shadow-2xl z-[160]"
                            >
                              {languages.map((lang) => (
                                <button
                                  key={lang.code}
                                  onClick={() => {
                                    onLanguageChange(lang.code);
                                    setShowLangs(false);
                                  }}
                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-left transition-colors font-serif text-[11px] sm:text-sm ${language === lang.code ? 'bg-[#ecd8a6] text-[#0a0512]' : 'text-[#ecd8a6] hover:bg-white/5'}`}
                                >
                                  {lang.name}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="phone-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  {!confirmationResult ? (
                    <form onSubmit={handlePhoneSubmit} className="space-y-4">
                      <div className="relative flex gap-2">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowCountrySelect(!showCountrySelect)}
                            className="h-full px-3 bg-black/40 border border-[#ecd8a6]/10 rounded-xl text-[#ecd8a6] text-sm flex items-center gap-1 hover:border-[#ecd8a6]/30 transition-all min-w-[70px]"
                          >
                            <span>{countryCodes.find(c => c.code === selectedCountry)?.flag}</span>
                            <span>{selectedCountry}</span>
                          </button>
                          
                          <AnimatePresence>
                            {showCountrySelect && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-full mb-2 left-0 w-48 max-h-60 bg-[#1a1025] border border-[#ecd8a6]/30 rounded-xl overflow-y-auto shadow-2xl z-[150] p-1 custom-scrollbar"
                              >
                                {countryCodes.map((c) => (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(c.code);
                                      setShowCountrySelect(false);
                                    }}
                                    className="w-full px-3 py-2 text-left hover:bg-[#ecd8a6] hover:text-[#0a0512] text-[#ecd8a6] rounded-lg transition-colors flex items-center justify-between text-xs"
                                  >
                                    <span className="flex items-center gap-2">
                                      <span>{c.flag}</span>
                                      <span>{c.name}</span>
                                    </span>
                                    <span className="opacity-60">{c.code}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="relative flex-1">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ecd8a6]/40" />
                          <input 
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder={t('login.phone')}
                            required
                            className="w-full bg-black/40 border border-[#ecd8a6]/10 rounded-xl py-3.5 pl-11 pr-4 text-[#ecd8a6] text-sm focus:border-[#ecd8a6]/40 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div id="recaptcha-container" className="hidden"></div>
                      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                      
                      {/* KVKK / GDPR Consent Checkbox */}
                      <div className="flex items-start gap-2.5 px-1 py-1">
                        <input 
                          type="checkbox"
                          id="kvkk-consent-phone"
                          checked={consentAccepted}
                          onChange={(e) => setConsentAccepted(e.target.checked)}
                          className="mt-1 w-4 h-4 accent-[#ecd8a6] cursor-pointer rounded border-[#ecd8a6]/20 bg-black/40"
                        />
                        <label htmlFor="kvkk-consent-phone" className="text-[10px] sm:text-xs text-[#ecd8a6]/60 leading-normal cursor-pointer select-none">
                          {t('login.kvkkConsent')}
                        </label>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading || !consentAccepted}
                        className={`w-full py-4 rounded-xl font-serif uppercase tracking-widest text-[11px] font-bold flex items-center justify-center gap-3 shadow-lg transition-all ${
                          loading || !consentAccepted ? 'bg-[#ecd8a6]/30 text-[#0a0512]/50 cursor-not-allowed' : 'bg-[#ecd8a6] text-[#0a0512] hover:bg-[#fff] active:scale-[0.98]'
                        }`}
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                          <>
                            <span>{t('login.sendCode')}</span>
                            <MessageSquare className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleCodeVerify} className="space-y-4">
                      <div className="relative">
                        <MailCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ecd8a6]/40" />
                        <input 
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder={t('login.enterCode')}
                          required
                          className="w-full bg-black/40 border border-[#ecd8a6]/10 rounded-xl py-4 pl-11 pr-4 text-[#ecd8a6] focus:border-[#ecd8a6]/40 outline-none transition-all text-center tracking-[0.5em] text-lg font-bold"
                        />
                      </div>
                      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                      <button 
                        type="submit"
                        disabled={loading || !consentAccepted}
                        className={`w-full py-4 rounded-xl font-serif uppercase tracking-widest text-[11px] font-bold flex items-center justify-center gap-3 shadow-lg transition-all ${
                          loading || !consentAccepted ? 'bg-[#ecd8a6]/30 text-[#0a0512]/50 cursor-not-allowed' : 'bg-[#ecd8a6] text-[#0a0512] hover:bg-[#fff] active:scale-[0.98]'
                        }`}
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                          <>
                            <span>{t('login.verifyCode')}</span>
                            <ShieldCheck className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  <div className="flex flex-col gap-4 pt-6 border-t border-[#ecd8a6]/10">
                    <button 
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className={`w-full py-3.5 rounded-xl text-[10px] sm:text-xs font-serif uppercase tracking-widest border transition-all flex items-center justify-center gap-3 ${
                        loading ? 'bg-white/5 border-[#ecd8a6]/5 text-[#ecd8a6]/30 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 border-[#ecd8a6]/10 text-[#ecd8a6] active:scale-[0.98]'
                      }`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      {t('login.googleSignIn')}
                    </button>

                    <button 
                      type="button"
                      onClick={handleAppleLogin}
                      disabled={loading}
                      className={`w-full py-3.5 rounded-xl text-[10px] sm:text-xs font-serif uppercase tracking-widest border transition-all flex items-center justify-center gap-3 ${
                        loading ? 'bg-white/5 border-[#ecd8a6]/5 text-[#ecd8a6]/30 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 border-[#ecd8a6]/10 text-[#ecd8a6] active:scale-[0.98]'
                      }`}
                    >
                      <Apple className="w-4 h-4" />
                      {t('login.appleSignIn')}
                    </button>

                    <button 
                      type="button"
                      onClick={() => {
                        setAuthMethod('email');
                        setConfirmationResult(null);
                      }}
                      className="w-full bg-white/5 hover:bg-white/10 active:scale-[0.98] text-[#ecd8a6] py-3.5 rounded-xl text-[10px] sm:text-xs font-serif uppercase tracking-widest border border-[#ecd8a6]/10 transition-all flex items-center justify-center gap-3"
                    >
                      <Mail className="w-3.5 h-3.5 opacity-70" />
                      {t('login.switchToEmail')}
                    </button>

                    <div className="pt-2">
                      <button 
                        type="button"
                        onClick={onShowOnboarding}
                        className="w-full text-[#ecd8a6]/40 hover:text-[#ecd8a6]/80 py-3.5 text-[10px] sm:text-xs font-serif uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group border border-transparent hover:border-[#ecd8a6]/10 rounded-xl"
                      >
                        <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-700" />
                        <span>{t('login.showIntro')}</span>
                      </button>
                    </div>

                    {/* Language Selector Under Button */}
                    <div className="flex flex-col items-center pt-2">
                      <div className="relative">
                        <button 
                          onClick={() => setShowLangs(!showLangs)}
                          className="flex items-center gap-2 text-[#ecd8a6]/40 hover:text-[#ecd8a6]/80 transition-colors group px-4 py-2"
                        >
                          <Globe className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                          <span className="text-[10px] sm:text-xs font-serif uppercase tracking-widest">
                            {languages.find(l => l.code === language)?.name}
                          </span>
                        </button>
                        <AnimatePresence>
                          {showLangs && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 sm:w-40 bg-[#1a1025] border border-[#ecd8a6]/30 rounded-2xl overflow-hidden shadow-2xl z-[160]"
                            >
                              {languages.map((lang) => (
                                <button
                                  key={lang.code}
                                  onClick={() => {
                                    onLanguageChange(lang.code);
                                    setShowLangs(false);
                                  }}
                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-left transition-colors font-serif text-[11px] sm:text-sm ${language === lang.code ? 'bg-[#ecd8a6] text-[#0a0512]' : 'text-[#ecd8a6] hover:bg-white/5'}`}
                                >
                                  {lang.name}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Account Linking Modal (MS-196) */}
      <AnimatePresence>
        {showLinkingModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#160c24] border border-[#ecd8a6]/20 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Ethereal Glow */}
              <div className="absolute -top-20 -left-20 w-48 h-48 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-lg font-serif text-[#ecd8a6] tracking-wider uppercase mb-2 text-center">
                {language === 'tr' ? "Hesapları Birleştir" : "Link Accounts"}
              </h3>
              <p className="text-xs text-[#ecd8a6]/60 font-sans mb-6 text-center leading-relaxed">
                {language === 'tr' 
                  ? `"${linkingEmail}" e-posta adresiyle zaten bir şifreli hesap mevcut. ${linkingProvider} girişinizi bu hesaba bağlamak için lütfen şifrenizi girin.`
                  : `An account with email "${linkingEmail}" already exists. Enter your password to link your ${linkingProvider} login with this account.`}
              </p>
              
              <form onSubmit={handleLinkAccounts} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] text-[#ecd8a6]/60 uppercase tracking-widest font-serif">
                    {language === 'tr' ? "Şifre" : "Password"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ecd8a6]/40" />
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      value={linkingPassword}
                      onChange={(e) => setLinkingPassword(e.target.value)}
                      className="w-full bg-white/5 border border-[#ecd8a6]/25 rounded-xl pl-12 pr-4 py-3 text-sm text-[#ecd8a6] placeholder-white/20 focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-sans"
                    />
                  </div>
                </div>

                {linkingError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-sans leading-relaxed">
                    {linkingError}
                  </div>
                )}

                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowLinkingModal(false);
                      setLinkingEmail('');
                      setLinkingPassword('');
                      setPendingCredential(null);
                    }}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 active:scale-[0.98] text-[#ecd8a6]/80 border border-[#ecd8a6]/10 rounded-xl text-xs font-serif uppercase tracking-widest transition-all cursor-pointer font-bold animate-all"
                  >
                    {language === 'tr' ? "İptal" : "Cancel"}
                  </button>
                  <button 
                    type="submit"
                    disabled={linkingLoading}
                    className="flex-1 py-3 bg-[#ecd8a6] hover:bg-white active:scale-[0.98] text-[#0a0512] rounded-xl text-xs font-serif font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {linkingLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {language === 'tr' ? "Birleştir" : "Link"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
