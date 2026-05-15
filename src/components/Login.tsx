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
  User
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
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
}

const translations = {
  tr: {
    signInTitle: "MadameSoul'a Hoş Geldin",
    signInSubtitle: "Ruhsal rehberlik ve mistik sırlar için giriş yapın",
    signUpTitle: "MadameSoul Evrenine Katıl",
    signUpSubtitle: "Aramıza katılmak için bilgilerinizi girin",
    email: "E-posta Adresi",
    phone: "Telefon Numarası",
    password: "Şifre",
    signInLabel: "Giriş Yap",
    signUpLabel: "Kaydol",
    googleSignIn: "Google ile Giriş Yap",
    appleSignIn: "Apple ile Giriş Yap",
    switchToPhone: "Telefon ile devam et",
    switchToEmail: "E-posta ile devam et",
    sendCode: "Kod Gönder",
    verifyCode: "Kodu Doğrula",
    enterCode: "SMS ile gelen kodu girin",
    hasAccount: "Zaten bir hesabınız var mı? Giriş yapın",
    noAccount: "Henüz bir hesabınız yok mu? Kaydolun",
    error: "Bir hata oluştu, lütfen bilgileri kontrol edin.",
    loading: "Yükleniyor...",
    showIntro: "Uygulama Tanıtımını Gör"
  },
  en: {
    signInTitle: "Welcome to MadameSoul",
    signInSubtitle: "Enter the realm for spiritual guidance and mystic secrets",
    signUpTitle: "Join the MadameSoul Circle",
    signUpSubtitle: "Join our spiritual circle to begin",
    email: "Email Address",
    phone: "Phone Number",
    password: "Password",
    signInLabel: "Sign In",
    signUpLabel: "Sign Up",
    googleSignIn: "Continue with Google",
    appleSignIn: "Continue with Apple",
    switchToPhone: "Continue with Phone",
    switchToEmail: "Continue with Email",
    sendCode: "Send Code",
    verifyCode: "Verify Code",
    enterCode: "Enter verification code",
    hasAccount: "Already have an account? Sign In",
    noAccount: "Don't have an account? Sign Up",
    error: "An error occurred. Please check your details.",
    loading: "Loading...",
    showIntro: "Watch App Intro"
  },
  es: {
    signInTitle: "Bienvenido a MadameSoul",
    signInSubtitle: "Ingresa para recibir guía espiritual y secretos místicos",
    signUpTitle: "Únete al Círculo de MadameSoul",
    signUpSubtitle: "Únete a nuestro círculo espiritual",
    email: "Correo Electrónico",
    phone: "Número de Teléfono",
    password: "Contraseña",
    signInLabel: "Iniciar Sesión",
    signUpLabel: "Registrarse",
    googleSignIn: "Continuar con Google",
    appleSignIn: "Continuar con Apple",
    switchToPhone: "Continuar con Teléfono",
    switchToEmail: "Continuar con Correo",
    sendCode: "Enviar Código",
    verifyCode: "Verificar Código",
    enterCode: "Ingresa el código",
    hasAccount: "¿Ya tienes cuenta? Inicia sesión",
    noAccount: "¿No tienes cuenta? Regístrate",
    error: "Ocurrió un error. Verifica tus datos.",
    loading: "Cargando...",
    showIntro: "Ver Introducción"
  },
  fr: {
    signInTitle: "Bienvenue sur MadameSoul",
    signInSubtitle: "Entrez pour des conseils spirituels et des secrets mystiques",
    signUpTitle: "Rejoignez le Cercle MadameSoul",
    signUpSubtitle: "Rejoignez notre cercle spirituel",
    email: "Adresse E-mail",
    phone: "Numéro de Téléphone",
    password: "Mot de Passe",
    signInLabel: "Se Connecter",
    signUpLabel: "S'inscrire",
    googleSignIn: "Continuer avec Google",
    appleSignIn: "Continuer avec Apple",
    switchToPhone: "Continuer par Téléphone",
    switchToEmail: "Continuer par E-mail",
    sendCode: "Envoyer le Code",
    verifyCode: "Vérifier le Code",
    enterCode: "Entrez le code",
    hasAccount: "Déjà un compte ? Connexion",
    noAccount: "Pas de compte ? S'inscrire",
    error: "Une erreur est survenue. Vérifiez vos infos.",
    loading: "Chargement...",
    showIntro: "Voir l'Introduction"
  },
  zh: {
    signInTitle: "歡迎來到 MadameSoul",
    signInSubtitle: "進入精神指導和神秘秘密的領域",
    signUpTitle: "加入 MadameSoul 圈子",
    signUpSubtitle: "加入我們的屬靈圈子開始吧",
    email: "電子郵件地址",
    phone: "電話號碼",
    password: "密碼",
    signInLabel: "登入",
    signUpLabel: "註冊",
    googleSignIn: "繼續使用 Google",
    appleSignIn: "繼續使用 Apple",
    switchToPhone: "繼續使用電話",
    switchToEmail: "繼續使用電子郵件",
    sendCode: "發送代碼",
    verifyCode: "核實條碼",
    enterCode: "輸入驗證碼",
    hasAccount: "已有賬號？登入",
    noAccount: "沒有賬號？註冊",
    error: "發生錯誤。請檢查您的詳細信息。",
    loading: "載入中...",
    showIntro: "查看介紹"
  },
  ko: {
    signInTitle: "MadameSoul에 오신 것을 환영합니다",
    signInSubtitle: "영적 안내와 신비로운 비밀을 위해 입장하세요",
    signUpTitle: "MadameSoul 서클에 가입하세요",
    signUpSubtitle: "영적 서클에 가입하여 시작하세요",
    email: "이메일 주소",
    phone: "전화번호",
    password: "비밀번호",
    signInLabel: "로그인",
    signUpLabel: "회원가입",
    googleSignIn: "Google로 계속하기",
    appleSignIn: "Apple로 계속하기",
    switchToPhone: "전화번호로 계속하기",
    switchToEmail: "이메일로 계속하기",
    sendCode: "코드 전송",
    verifyCode: "코드 확인",
    enterCode: "인증 코드 입력",
    hasAccount: "이미 계정이 있으신가요? 로그인",
    noAccount: "계정이 없으신가요? 회원가입",
    error: "오류가 발생했습니다. 정보를 확인하세요.",
    loading: "로딩 중...",
    showIntro: "소개 보기"
  }
};

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

export const Login: React.FC<LoginProps> = ({ onLogin, language, onLanguageChange, onShowOnboarding }) => {
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

  const t = translations[language] || translations.en;

  const saveUserToFirestore = async (user: User) => {
    try {
      const metadata = await gatherUserMetadata();
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        userId: user.uid,
        email: user.email || null,
        phoneNumber: user.phoneNumber || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
        metadata: {
          device: metadata.device,
          os: metadata.os,
          browser: metadata.browser,
          ip: metadata.ip,
          location: metadata.location
        }
      }, { merge: true });
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
      await saveUserToFirestore(result.user);
      onLogin();
    } catch (err: any) {
      console.error("Email auth error:", err);
      // Show more specific error message if available
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError(language === 'tr' ? "Giriş bilgileri hatalı veya kullanıcı bulunamadı." : "Invalid credentials or user not found.");
      } else if (err.code === 'auth/wrong-password') {
        setError(language === 'tr' ? "Hatalı şifre." : "Wrong password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError(language === 'tr' ? "Bu e-posta adresi zaten kullanımda." : "Email already in use.");
      } else if (err.code === 'auth/weak-password') {
        setError(language === 'tr' ? "Şifre çok zayıf (en az 6 karakter olmalı)." : "Password is too weak.");
      } else {
        setError(err.message || t.error);
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
        setError("SMS servisi bu bölge için aktif edilmemiş. Lütfen Google Cloud/Firebase panelini kontrol edin (Authentication > Settings > Sign-in method).");
      } else if (err.code === 'auth/billing-not-enabled') {
        setError("SMS gönderimi için Firebase projesinde faturalandırmanın (Blaze Plan) aktif olması veya test numarası eklenmesi gerekiyor. Test için Firebase panelinden test numarası tanımlayabilirsiniz.");
      } else if (err.code === 'auth/invalid-phone-number') {
        setError(language === 'tr' ? "Geçersiz telefon numarası." : "Invalid phone number.");
      } else {
        setError(err.message || t.error);
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
        setError(language === 'tr' ? "Geçersiz doğrulama kodu." : "Invalid verification code.");
      } else {
        setError(err.message || t.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
      onLogin();
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError(language === 'tr' ? "Giriş penceresi engellendi. Lütfen pop-uplara izin verin." : "Popup blocked. Please allow popups.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError(language === 'tr' ? "Giriş penceresi kapatıldı." : "Login window closed.");
      } else if (err.code === 'auth/configuration-not-found') {
        setError(language === 'tr' ? "Firebase Yapılandırma Hatası: Lütfen Firebase Console üzerinden Authentication > Sign-in method sekmesinden Google'ı aktif edin ve projeniz için bir destek e-postası seçin." : "Firebase Configuration Error: Please enable Google sign-in in the Firebase Console (Authentication > Sign-in method) and select a support email for your project.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(language === 'tr' ? "Yetkisiz Alan Adı: Bu alan adının Firebase Console > Authentication > Settings > Authorized Domains listesine eklenmesi gerekiyor." : "Unauthorized Domain: This domain needs to be added to the Authorized Domains list in the Firebase Console (Authentication > Settings).");
      } else {
        setError(err.message || t.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
      onLogin();
    } catch (err: any) {
      console.error("Apple login error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError(language === 'tr' ? "Giriş penceresi engellendi. Lütfen pop-uplara izin verin." : "Popup blocked. Please allow popups.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError(language === 'tr' ? "Giriş penceresi kapatıldı." : "Login window closed.");
      } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        setError(language === 'tr' ? "Firebase Yapılandırma Hatası: Lütfen Firebase Console üzerinden Apple giriş yönteminin tam olarak yapılandırıldığından emin olun (Service ID, Team ID, Key ID ve Private Key)." : "Firebase Configuration Error: Please ensure Apple sign-in is fully configured in the Firebase Console (Service ID, Team ID, Key ID, and Private Key).");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(language === 'tr' ? "Yetkisiz Alan Adı: Bu alan adının Firebase Console > Authentication > Settings > Authorized Domains listesine eklenmesi gerekiyor." : "Unauthorized Domain: This domain needs to be added to the Authorized Domains list in the Firebase Console (Authentication > Settings).");
      } else {
        setError(err.message || t.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0512] overflow-y-auto pt-20 pb-12 px-4 flex justify-center items-start sm:items-center">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Language Toggle */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[120]">
        <button 
          onClick={() => setShowLangs(!showLangs)}
          className="flex items-center gap-2 bg-[#1a1025]/90 backdrop-blur-md border border-[#ecd8a6]/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[#ecd8a6] hover:border-[#ecd8a6]/50 transition-all shadow-lg"
        >
          <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-[10px] sm:text-xs font-serif uppercase tracking-widest">{language}</span>
        </button>
        <AnimatePresence>
          {showLangs && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full mt-2 right-0 w-32 sm:w-40 bg-[#1a1025] border border-[#ecd8a6]/30 rounded-2xl overflow-hidden shadow-2xl z-[130]"
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
                {language === 'tr' ? '"Yıldızların fısıltısını ve ruhunuzun derinliklerini keşfedin."' : '"Discover the whispers of the stars and the depths of your soul."'}
              </p>
            </div>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 opacity-30">
              <div className="w-2 h-2 rounded-full bg-[#ecd8a6]" />
              <div className="w-2 h-2 rounded-full bg-[#ecd8a6]" />
              <div className="w-2 h-2 rounded-full bg-[#ecd8a6]" />
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
                {isSignUp ? t.signUpTitle : t.signInTitle}
              </h2>
              <p className="text-[#ecd8a6]/50 text-xs sm:text-sm max-w-[280px] md:max-w-none italic">
                {isSignUp ? t.signUpSubtitle : t.signInSubtitle}
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
                        placeholder={t.email}
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
                        placeholder={t.password}
                        required
                        className="w-full bg-black/40 border border-[#ecd8a6]/10 rounded-xl py-3.5 pl-11 pr-4 text-[#ecd8a6] text-sm focus:border-[#ecd8a6]/40 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-[10px] sm:text-xs text-center bg-red-400/5 py-2 rounded-lg border border-red-400/10">{error}</p>}

                  <div className="flex flex-col gap-3 pt-2">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#ecd8a6] text-[#0a0512] py-4 rounded-xl font-serif uppercase tracking-widest text-[11px] sm:text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#fff] active:scale-[0.98] transition-all shadow-lg"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <>
                          <span>{isSignUp ? t.signUpLabel : t.signInLabel}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="w-full text-[#ecd8a6]/60 hover:text-[#ecd8a6] text-[10px] sm:text-xs font-serif uppercase tracking-widest transition-all py-2"
                    >
                      {isSignUp ? t.hasAccount : t.noAccount}
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 pt-6 border-t border-[#ecd8a6]/10">
                    <button 
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full bg-white/5 hover:bg-white/10 text-[#ecd8a6] py-3.5 rounded-xl text-[10px] sm:text-xs font-serif uppercase tracking-widest border border-[#ecd8a6]/10 transition-all flex items-center justify-center gap-3"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      {t.googleSignIn}
                    </button>

                    <button 
                      type="button"
                      onClick={handleAppleLogin}
                      disabled={loading}
                      className="w-full bg-white/5 hover:bg-white/10 text-[#ecd8a6] py-3.5 rounded-xl text-[10px] sm:text-xs font-serif uppercase tracking-widest border border-[#ecd8a6]/10 transition-all flex items-center justify-center gap-3"
                    >
                      <Apple className="w-4 h-4" />
                      {t.appleSignIn}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setAuthMethod(authMethod === 'email' ? 'phone' : 'email')}
                      className="w-full bg-white/5 hover:bg-white/10 text-[#ecd8a6] py-4 rounded-xl font-serif uppercase tracking-widest text-[11px] sm:text-xs font-bold flex items-center justify-center gap-2 border border-[#ecd8a6]/20 transition-all"
                    >
                      {authMethod === 'email' ? <Phone className="w-3.5 h-3.5 opacity-50" /> : <Mail className="w-3.5 h-3.5 opacity-50" />}
                      <span>{authMethod === 'email' ? t.switchToPhone : t.switchToEmail}</span>
                    </button>

                    <div className="pt-2">
                      <button 
                        type="button"
                        onClick={onShowOnboarding}
                        className="w-full text-[#ecd8a6]/40 hover:text-[#ecd8a6]/80 py-3.5 text-[10px] sm:text-xs font-serif uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group border border-transparent hover:border-[#ecd8a6]/10 rounded-xl"
                      >
                        <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-700" />
                        <span>{t.showIntro}</span>
                      </button>
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
                            placeholder={t.phone}
                            required
                            className="w-full bg-black/40 border border-[#ecd8a6]/10 rounded-xl py-3.5 pl-11 pr-4 text-[#ecd8a6] text-sm focus:border-[#ecd8a6]/40 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div id="recaptcha-container" className="hidden"></div>
                      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#ecd8a6] text-[#0a0512] py-4 rounded-xl font-serif uppercase tracking-widest text-[11px] font-bold flex items-center justify-center gap-3 shadow-lg"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                          <>
                            <span>{t.sendCode}</span>
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
                          placeholder={t.enterCode}
                          required
                          className="w-full bg-black/40 border border-[#ecd8a6]/10 rounded-xl py-4 pl-11 pr-4 text-[#ecd8a6] focus:border-[#ecd8a6]/40 outline-none transition-all text-center tracking-[0.5em] text-lg font-bold"
                        />
                      </div>
                      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#ecd8a6] text-[#0a0512] py-4 rounded-xl font-serif uppercase tracking-widest text-[11px] font-bold flex items-center justify-center gap-3 shadow-lg"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                          <>
                            <span>{t.verifyCode}</span>
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
                      className="w-full bg-white/5 hover:bg-white/10 text-[#ecd8a6] py-3.5 rounded-xl text-[10px] sm:text-xs font-serif uppercase tracking-widest border border-[#ecd8a6]/10 transition-all flex items-center justify-center gap-3"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      {t.googleSignIn}
                    </button>

                    <button 
                      type="button"
                      onClick={handleAppleLogin}
                      disabled={loading}
                      className="w-full bg-white/5 hover:bg-white/10 text-[#ecd8a6] py-3.5 rounded-xl text-[10px] sm:text-xs font-serif uppercase tracking-widest border border-[#ecd8a6]/10 transition-all flex items-center justify-center gap-3"
                    >
                      <Apple className="w-4 h-4" />
                      {t.appleSignIn}
                    </button>

                    <button 
                      type="button"
                      onClick={() => {
                        setAuthMethod('email');
                        setConfirmationResult(null);
                      }}
                      className="w-full bg-white/5 hover:bg-white/10 text-[#ecd8a6] py-3.5 rounded-xl text-[10px] sm:text-xs font-serif uppercase tracking-widest border border-[#ecd8a6]/10 transition-all flex items-center justify-center gap-3"
                    >
                      <Mail className="w-3.5 h-3.5 opacity-70" />
                      {t.switchToEmail}
                    </button>

                    <div className="pt-2">
                      <button 
                        type="button"
                        onClick={onShowOnboarding}
                        className="w-full text-[#ecd8a6]/40 hover:text-[#ecd8a6]/80 py-3.5 text-[10px] sm:text-xs font-serif uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group border border-transparent hover:border-[#ecd8a6]/10 rounded-xl"
                      >
                        <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-700" />
                        <span>{t.showIntro}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
