import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, updateDoc, onSnapshot, query, where, getDocs, runTransaction } from 'firebase/firestore';
import { db, auth, logAnalyticsEvent } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding';
import { KatinaMoon } from './components/KatinaMoon';
import { Profile } from './components/Profile';
import { gatherUserMetadata, logUserEvent } from './lib/metadata';
import { useAppStore, Card } from './store/useAppStore';
import { StoreModal } from './components/StoreModal';
import { ContactModal } from './components/ContactModal';
import { LegalModal } from './components/LegalModal';
import { CookieBanner } from './components/CookieBanner';
import { generatePDF } from './utils/pdfGenerator';
import { convertToLocaleUppercase } from './utils/textUtils';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useMutation } from '@tanstack/react-query';
import { requestPushNotificationPermission, disablePushNotifications } from './lib/firebase';

import en from './locales/en.yaml';
import tr from './locales/tr.yaml';
import es from './locales/es.yaml';
import fr from './locales/fr.yaml';
import zh from './locales/zh.yaml';
import ko from './locales/ko.yaml';

import { 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  Settings, 
  Download, 
  Globe, 
  ArrowLeft, 
  X, 
  Plus, 
  Copy, 
  Check, 
  LogOut, 
  Loader2,
  User as UserIcon
} from 'lucide-react';

const KATINA_DECK = [
  { id: "Afyon", locKey: "afyon", name: "Afyon", desc: "Bağımlılıklar, göz boyama, illüzyonlar ve toksik bağlar." },
  { id: "Agac", locKey: "agac", name: "Ağaç", desc: "Köklenme, sağlık, büyüme, aile soyu ve uzun ömür." },
  { id: "Alyans", locKey: "alyans", name: "Alyans", desc: "Bağlılık, evlilik, ortaklık, ciddi bir tamamlanma." },
  { id: "Anahtar", locKey: "anahtar", name: "Anahtar", desc: "Çözüm ve yeni başlangıçlar. Sırların açığa çıkması." },
  { id: "Ay", locKey: "ay", name: "Ay", desc: "Sezgiler, romantizm, melankoli ve değişken ruh halleri." },
  { id: "Bahceler", locKey: "bahceler", name: "Bahçeler", desc: "Sosyalleşme, çevre, kalabalıklar ve toplum içindeki yeriniz." },
  { id: "Balik", locKey: "balik", name: "Balık", desc: "Maddi kazanç, bolluk ve şansın simgesidir." },
  { id: "Baykus", locKey: "baykus", name: "Baykuş", desc: "Bilgelik, gece gelen haberler veya etrafı gözlemleme zamanı." },
  { id: "Bulutlar", locKey: "bulutlar", name: "Bulutlar", desc: "Kafa karışıklığı, belirsizlik veya geçici sıkıntılar." },
  { id: "Capa", locKey: "Capa", name: "Çapa", desc: "Güven, sadakat, bir yere veya kişiye bağlılık, umut." },
  { id: "Cicekler", locKey: "Cicekler", name: "Çiçekler", desc: "Mutluluk, güzellik, armağanlar ve hoş sürprizler." },
  { id: "Dag", locKey: "dag", name: "Dağ", desc: "Engeller, aşılması zor durumlar, gecikmeler ve sınanmalar." },
  { id: "Dervis", locKey: "dervis", name: "Derviş", desc: "Bilgelik, yalnızlık, sabır ve manevi rehberlik." },
  { id: "Deve", locKey: "deve", name: "Deve", desc: "Finansal konularda sabır, inatçılık veya uzun bir yolculuk." },
  { id: "Ev", locKey: "ev", name: "Ev", desc: "Huzur, güvenlik, aile yaşantısı ve köklerin olduğu yer." },
  { id: "Fareler", locKey: "fareler", name: "Fareler", desc: "Kayıplar, içten içe kemiren endişe ve stres." },
  { id: "Gunes", locKey: "gunes", name: "Güneş", desc: "Büyük şans, mutluluk, aydınlanma ve başarı." },
  { id: "Hac", locKey: "hac", name: "Haç", desc: "Kaderin bir cilvesi, zorunluluklar veya acı ama gerekli tecrübeler." },
  { id: "Kale", locKey: "kale", name: "Kale", desc: "Güvenlik, sağlam yapı, dış etkenlere karşı korunaklı olma." },
  { id: "Kalp", locKey: "kalp", name: "Kalp", desc: "Büyük aşk, sevgi, şefkat ve duygusal mutluluk." },
  { id: "Kapi", locKey: "kapi", name: "Kapı", desc: "Fırsatlar, açılan yeni yollar veya verilmesi gereken bir karar." },
  { id: "Kitap", locKey: "kitap", name: "Kitap", desc: "Sırlar, eğitim, öğrenilmesi gereken şaşırtıcı bir gerçek." },
  { id: "Kopek", locKey: "kopek", name: "Köpek", desc: "Sadakat, dürüst bir dostluk veya güvenilir destek." },
  { id: "KizCocugu", locKey: "kizCocugu", name: "Kız Çocuğu", desc: "Masumiyet, yeni başlangıçlar veya genç bir energy." },
  { id: "Mektup", locKey: "mektup", name: "Mektup", desc: "Haberler, beklenen bir mesaj veya önemli bir iletişim." },
  { id: "Mezar", locKey: "mezar", name: "Mezar", desc: "Bitişler, büyük değişim, bir devrin kapanıp yenisinin başlaması." },
  { id: "Nil Nehri", locKey: "nil_nehri", name: "Nil Nehri", desc: "Bereketi, akışı, uzun ve verimli bir süreci temsil eder." },
  { id: "Samyeli", locKey: "samyeli", name: "Samyeli", desc: "Beklenmedik olaylar, ani değişimler veya geçici rüzgarlar." },
  { id: "Supurge", locKey: "supurge", name: "Süpürge", desc: "Temizlenme, kavga, hayatından bir şeyleri çıkarma gerekliliği." },
  { id: "Tilki", locKey: "tilki", name: "Tilki", desc: "Kurnazlık, dikkatli olunması gereken bir fırsatçılık." },
  { id: "Yatagan", locKey: "yatagan", name: "Yatağan", desc: "Keskin kararlar, güç, savunma veya yaklaşan bir tehlike." },
  { id: "Yelkenli", locKey: "yelkenli", name: "Yelkenli", desc: "Yolculuklar, akışta kalmak veya uzaktan gelecek bir haber." },
  { id: "Yol", locKey: "yol", name: "Yol", desc: "Seçimler, ayrılıklar ya da yeni bir hayata doğru atılan adım." },
  { id: "Yilan", locKey: "yilan", name: "Yılan", desc: "İhanet, gizli düşmanlık, kıskançlık veya sinsilik." },
  { id: "Yildizlar", locKey: "yildizlar", name: "Yıldızlar", desc: "Umut, ilham, hayallerin gerçekleşmesi, ruhsal rehberlik." }
];

type Language = 'tr' | 'en' | 'es' | 'fr' | 'zh' | 'ko';

const locales: Record<Language, any> = { en, tr, es, fr, zh, ko };



const STATUS_KEYS = ['single', 'relationship', 'married', 'engaged', 'complicated', 'breakup'] as const;
const FOCUS_KEYS = ['general', 'love', 'career', 'health'] as const;



const STATUS_OPTIONS: Array<{value: string} & Record<Language, string>> = STATUS_KEYS.map(key => {
  const opt: any = { value: key };
  Object.keys(locales).forEach(l => {
    opt[l as Language] = locales[l as Language]?.statusOptions?.[key];
  });
  return opt;
});

const FOCUS_OPTIONS: Array<{value: string} & Record<Language, string>> = FOCUS_KEYS.map(key => {
  const opt: any = { value: key };
  Object.keys(locales).forEach(l => {
    opt[l as Language] = locales[l as Language]?.focusOptions?.[key];
  });
  return opt;
});

function AppContent() {
  const {
    user,
    userRole,
    userInfo,
    moonsCount,
    readingCount,
    step,
    setUser,
    setUserRole,
    setUserInfo,
    setMoonsCount,
    setReadingCount,
    setStep
  } = useAppStore();

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [drawnCards, setDrawnCards] = useState<any[]>([]);
  const [shuffledDeck, setShuffledDeck] = useState<any[]>([]);
  const [reading, setReading] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' | 'success' } | null>(null);
  
  
  // Modal states
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showPushPrompt, setShowPushPrompt] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [bannerCopied, setBannerCopied] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'name' | 'birthplace'
  ) => {
    const input = e.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const upperVal = convertToLocaleUppercase(input.value, userInfo.language);
    
    setUserInfo({ [field]: upperVal });
    
    requestAnimationFrame(() => {
      if (input) {
        input.setSelectionRange(start, end);
      }
    });
  };

  // Refs for tracking transaction status during async TanStack Query mutation
  const pendingTxId = useRef<string | null>(null);
  const pendingDeducted = useRef(false);
  const pendingDeductedFrom = useRef<'daily' | 'purchased' | null>(null);

  const [adsConfig, setAdsConfig] = useState<any>({
    ad1: {
      enabled: true,
      promoCode: "KATINA20",
      link: "https://www.amazon.com/s?k=katina+tarot",
      sponsored: { en: "Sponsored", tr: "Sponsorlu", es: "Patrocinado", fr: "Sponsorisé", zh: "赞助", ko: "스pon서" },
      promoCodeLabel: { en: "Use Code:", tr: "Kod:", es: "Código:", fr: "Code :", zh: "代码：", ko: "코드:" },
      text: { en: "Get 20% off Katina Tarot Cards on Amazon!", tr: "Amazon'da Katina Tarot Kartlarını %20 indirimli alın!" },
      buttonText: { en: "Shop Now", tr: "Hemen Al" }
    },
    ad2: {
      enabled: true,
      mediaType: "video",
      mediaSrc: "/ads/Govde.mp4",
      link: "https://www.etsy.com/shop/MadameSoulStudio",
      sponsored: { en: "Sponsored", tr: "Sponsorlu", es: "Patrocinado", fr: "Sponsorisé", zh: "赞助", ko: "스pon서" },
      title: { en: "Live Session", tr: "Canlı Seans" },
      text: { en: "Visit our Etsy shop for professional live reading sessions and personalized consultations.", tr: "Profesyonel canlı tarot seansları ve size özel açılımlar için Etsy mağazamızı ziyaret edin." },
      buttonText: { en: "Shop on Etsy", tr: "Etsy Mağazası" }
    }
  });

  const showToast = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleFirestoreError = (error: unknown, operationType: string, path: string | null) => {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error('Firestore Error: ', { error: errMessage, operationType, path });
    try {
      addDoc(collection(db, 'error_logs'), {
        source: 'client',
        userId: auth.currentUser?.uid || null,
        operationType,
        path,
        message: errMessage,
        stack: error instanceof Error ? error.stack || null : null,
        createdAt: serverTimestamp()
      });
    } catch (logErr) {
      console.error("Failed to log error to Firestore:", logErr);
    }
  };

  const isClaimingDaily = useRef(false);

  const claimDailyGift = async (userId: string) => {
    if (isClaimingDaily.current) return;
    isClaimingDaily.current = true;
    
    const moonRef = doc(db, 'user_moons', userId);
    try {
      await runTransaction(db, async (transaction) => {
        const moonDoc = await transaction.get(moonRef);
        if (!moonDoc.exists()) return;
        
        const data = moonDoc.data();
        const lastClaimed = data.lastDailyClaimedAt;
        const now = new Date();
        
        let canClaim = false;
        if (!lastClaimed) {
          canClaim = true;
        } else {
          const lastClaimedDate = lastClaimed.toDate();
          const diffMs = now.getTime() - lastClaimedDate.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);
          if (diffHours >= 24) {
            canClaim = true;
          }
        }
        
        if (canClaim) {
          const currentDailyFree = data.dailyFreeBalance || 0;
          const currentPurchased = data.purchasedBalance || 0;
          const newDailyFree = 1;
          const newBalance = newDailyFree + currentPurchased;
          const claimedMoons = newDailyFree - currentDailyFree;
          
          transaction.update(moonRef, {
            dailyFreeBalance: newDailyFree,
            balance: newBalance,
            lastDailyClaimedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          
          if (claimedMoons > 0) {
            const dailyGiftDesc = locales[userInfo.language]?.dailyGift || "Daily Free Gift";
            const txRef = doc(collection(db, 'moon_transactions'));
            const clientMetadata = {
              userAgent: navigator.userAgent,
              os: navigator.userAgent.includes("Mac") ? "macOS" :
                  navigator.userAgent.includes("Win") ? "Windows" :
                  navigator.userAgent.includes("Linux") ? "Linux" :
                  navigator.userAgent.includes("Android") ? "Android" :
                  navigator.userAgent.includes("like Mac") ? "iOS" : "Unknown",
              appVersion: "1.0.0"
            };
            const dailyIdempotencyKey = `daily_gift_${userId}_${new Date().toISOString().split('T')[0]}`;
            
            transaction.set(txRef, {
              userId,
              amount: 1,
              type: 'bonus',
              status: 'success',
              description: dailyGiftDesc,
              pdfDownloaded: 0,
              userLanguage: userInfo.language,
              userName: "",
              userDob: "",
              userBirthplace: "",
              userRelationship: "",
              selectedCards: [],
              paymentProvider: 'daily_gift',
              idempotencyKey: dailyIdempotencyKey,
              clientMetadata,
              createdAt: serverTimestamp()
            });
          }
        }
      });
      showToast(locales[userInfo.language]?.dailyGiftClaimed || "Your daily free Katina Moon has been claimed!", 'success');
    } catch (e) {
      console.error("Error claiming daily gift:", e);
    } finally {
      isClaimingDaily.current = false;
    }
  };

  useEffect(() => {
    fetch('/ads/ads_config.json')
      .then(res => res.json())
      .then(data => {
        if (data) setAdsConfig(data);
      })
      .catch(err => console.error("Could not load ads config:", err));
  }, []);

  useEffect(() => {
    let unsubscribeMoons: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setIsAuthLoading(false);

      // Clean state on user change
      setStep('SPLASH');
      setDrawnCards([]);
      setReading(null);
      setImageError({});
      setIsStoreOpen(false);
      setIsProfileOpen(false);
      setIsContactOpen(false);
      setIsLegalOpen(false);
      
      setUserInfo({
        name: '',
        dob: '',
        birthplace: '',
        relationship: 'single',
        focus: 'general'
      });

      if (u) {
        // Fetch user custom claim role (MS-161)
        try {
          const tokenResult = await u.getIdTokenResult();
          let role = (tokenResult.claims.role as 'user' | 'employee' | 'admin') || 'user';
          if ((import.meta as any).env.DEV) {
            role = 'admin';
          }
          setUserRole(role);
        } catch (roleErr) {
          console.error("Error fetching user role claims:", roleErr);
          setUserRole((import.meta as any).env.DEV ? 'admin' : 'user');
        }

        const moonRef = doc(db, 'user_moons', u.uid);
        const userRef = doc(db, 'users', u.uid);
        
        getDoc(userRef).then(async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserInfo({
              name: userInfo.name || data.name || '',
              dob: userInfo.dob || data.dob || '',
              birthplace: userInfo.birthplace || data.birthplace || '',
              relationship: userInfo.relationship || data.relationship || 'single',
              focus: userInfo.focus || data.focus || 'general'
            });
          } else {
            const metadata = await gatherUserMetadata();
            await setDoc(userRef, {
              userId: u.uid,
              email: u.email,
              name: u.displayName || '',
              dob: '',
              birthplace: '',
              relationship: 'single',
              focus: 'general',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              metadata
            });
            setUserInfo({ name: u.displayName || '' });
          }
        });

        const transactionsRef = collection(db, 'moon_transactions');
        const countQuery = query(transactionsRef, where('userId', '==', u.uid), where('type', '==', 'spend'));
        getDocs(countQuery).then(snap => {
          setReadingCount(snap.size);
        });

        // Check and recover any stuck pending transactions (MS-181)
        const pendingQuery = query(
          collection(db, 'moon_transactions'),
          where('userId', '==', u.uid),
          where('status', '==', 'pending')
        );
        getDocs(pendingQuery).then(async (snap) => {
          for (const docSnap of snap.docs) {
            const txData = docSnap.data();
            const createdAt = txData.createdAt?.toDate?.() || txData.createdAt;
            if (createdAt && (Date.now() - new Date(createdAt).getTime() > 2 * 60 * 1000)) {
              console.warn(`[Client Recovery] Recovering stuck pending transaction: ${docSnap.id}`);
              const moonRef = doc(db, 'user_moons', u.uid);
              try {
                await runTransaction(db, async (transaction) => {
                  const moonDoc = await transaction.get(moonRef);
                  if (!moonDoc.exists()) return;
                  const mData = moonDoc.data();
                  const daily = mData.dailyFreeBalance || 0;
                  const purchased = mData.purchasedBalance || 0;
                  const deductedFrom = txData.deductedFrom || 'daily';

                  if (deductedFrom === 'daily') {
                    const newDaily = daily + 1;
                    transaction.update(moonRef, {
                      dailyFreeBalance: newDaily,
                      balance: newDaily + purchased,
                      updatedAt: serverTimestamp()
                    });
                  } else {
                    const newPurchased = purchased + 1;
                    transaction.update(moonRef, {
                      purchasedBalance: newPurchased,
                      balance: daily + newPurchased,
                      updatedAt: serverTimestamp()
                    });
                  }

                  // Mark transaction as failed
                  transaction.update(docSnap.ref, {
                    status: 'failed',
                    error: 'Transaction timed out / server restart'
                  });

                  // Log system refund transaction (MS-182)
                  const refundTxRef = doc(collection(db, 'moon_transactions'));
                  transaction.set(refundTxRef, {
                    userId: u.uid,
                    amount: 1,
                    type: 'refund',
                    status: 'success',
                    description: userInfo.language === 'tr' ? 'Zaman Aşımı İadesi (Sistem İadesi)' : 'Timeout Refund (System Refund)',
                    pdfDownloaded: 0,
                    paymentProvider: deductedFrom === 'daily' ? 'daily_gift' : 'stripe',
                    idempotencyKey: `refund_timeout_${docSnap.id}`,
                    clientMetadata: {
                      userAgent: navigator.userAgent,
                      os: "WebClient",
                      appVersion: "1.0.0"
                    },
                    createdAt: serverTimestamp()
                  });
                });
                console.log(`[Client Recovery] Successfully recovered transaction: ${docSnap.id}`);
                
                // Fetch the updated balance
                const updatedMoon = await getDoc(moonRef);
                if (updatedMoon.exists()) {
                  setMoonsCount(updatedMoon.data().balance || 0);
                }
              } catch (err) {
                console.error(`[Client Recovery] Failed to recover transaction ${docSnap.id}:`, err);
              }
            }
          }
        });

        if (unsubscribeMoons) unsubscribeMoons();
        
        unsubscribeMoons = onSnapshot(moonRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setMoonsCount(data.balance || 0);
            
            const lastClaimed = data.lastDailyClaimedAt;
            const now = new Date();
            let shouldClaim = false;
            
            if (!lastClaimed) {
              shouldClaim = true;
            } else {
              const lastClaimedDate = lastClaimed.toDate();
              const diffMs = now.getTime() - lastClaimedDate.getTime();
              const diffHours = diffMs / (1000 * 60 * 60);
              if (diffHours >= 24) {
                shouldClaim = true;
              }
            }
            
            if (shouldClaim) {
              claimDailyGift(u.uid);
            }
          } else {
            const welcomeDesc = locales['en']?.welcomeBonus || "Welcome Bonus";
            setDoc(moonRef, {
              userId: u.uid,
              dailyFreeBalance: 0,
              purchasedBalance: 1,
              balance: 1,
              lastDailyClaimedAt: null,
              updatedAt: serverTimestamp()
            });
            const clientMetadata = {
              userAgent: navigator.userAgent,
              os: navigator.userAgent.includes("Mac") ? "macOS" :
                  navigator.userAgent.includes("Win") ? "Windows" :
                  navigator.userAgent.includes("Linux") ? "Linux" :
                  navigator.userAgent.includes("Android") ? "Android" :
                  navigator.userAgent.includes("like Mac") ? "iOS" : "Unknown",
              appVersion: "1.0.0"
            };
            addDoc(collection(db, 'moon_transactions'), {
              userId: u.uid,
              amount: 1,
              type: 'bonus',
              status: 'success',
              description: welcomeDesc,
              pdfDownloaded: 0,
              userLanguage: userInfo.language,
              userName: "",
              userDob: "",
              userBirthplace: "",
              userRelationship: "",
              selectedCards: [],
              paymentProvider: 'welcome_bonus',
              idempotencyKey: `welcome_bonus_${u.uid}`,
              clientMetadata,
              createdAt: serverTimestamp()
            });
            setMoonsCount(1);
          }
        }, (error) => {
          handleFirestoreError(error, 'get', `user_moons/${u.uid}`);
        });

        // Silent token check/refresh if permission is already granted (MS-169)
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          requestPushNotificationPermission(u.uid).catch(err => {
            console.warn("Silent token refresh failed:", err);
          });
        }
      } else {
        setMoonsCount(0);
        setUserRole(null);
        if (unsubscribeMoons) {
          unsubscribeMoons();
          unsubscribeMoons = undefined;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeMoons) unsubscribeMoons();
    };
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get('payment');
    const sessionId = queryParams.get('session_id');
    const isMock = queryParams.get('mock') === 'true';
    
    if (paymentStatus === 'success') {
      // Funnel Analytics: purchase_complete (MS-134)
      logAnalyticsEvent('purchase_complete', { language: userInfo.language });

      if (isMock && sessionId && user) {
        const completeMockPayment = async () => {
          try {
            const token = await user.getIdToken();
            const res = await fetch('/api/complete-mock-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ sessionId })
            });
            if (res.ok) {
              showToast(userInfo.language === 'tr' ? "Ödeme başarıyla tamamlandı!" : "Payment completed successfully!", 'success');
            } else {
              showToast(userInfo.language === 'tr' ? "Ödeme onaylanırken bir hata oluştu." : "Error validating payment.", 'error');
            }
          } catch (err) {
            console.error("Error completing mock payment:", err);
            showToast("Mock payment validation failed", 'error');
          }
        };
        completeMockPayment();
      } else {
        showToast(userInfo.language === 'tr' ? "Ödeme başarıyla tamamlandı!" : "Payment completed successfully!", 'success');
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancel') {
      showToast(userInfo.language === 'tr' ? "Ödeme iptal edildi." : "Payment cancelled.", 'info');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user]);

  // Web Push Soft Prompt trigger and handlers (MS-169)
  useEffect(() => {
    if (step === 'RESULT' && !isGenerating && user) {
      const prompted = localStorage.getItem(`madamesoul_push_prompted_${user.uid}`);
      if (!prompted && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        const timer = setTimeout(() => {
          setShowPushPrompt(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [step, isGenerating, user]);

  const handleClosePushPrompt = () => {
    if (user) {
      localStorage.setItem(`madamesoul_push_prompted_${user.uid}`, 'true');
    }
    setShowPushPrompt(false);
  };

  const handleEnablePush = async () => {
    if (!user) return;
    try {
      const token = await requestPushNotificationPermission(user.uid);
      if (token) {
        showToast(
          userInfo.language === 'tr' 
            ? "Bildirimleriniz başarıyla etkinleştirildi!" 
            : "Notifications enabled successfully!", 
          'success'
        );
      } else {
        showToast(
          userInfo.language === 'tr' 
            ? "Bildirim izni alınamadı." 
            : "Failed to get notification permission.", 
          'error'
        );
      }
    } catch (e) {
      console.error("Error enabling push notifications:", e);
    } finally {
      handleClosePushPrompt();
    }
  };

  // MS-118 Fallback translate logic
  const t = (key: string, params: Record<string, any> = {}) => {
    const currentLocale = locales[userInfo.language] || locales.en;
    let value = key.split('.').reduce((obj, k) => obj?.[k], currentLocale);
    
    if (value === undefined || value === null) {
      const fallbackLocale = locales.en;
      value = key.split('.').reduce((obj, k) => obj?.[k], fallbackLocale);
    }
    
    if (value === undefined || value === null) return key;
    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" resulted in a non-string value:`, value);
      return key; 
    }
    
    Object.entries(params).forEach(([k, v]) => {
      value = (value as string).replace(`{${k}}`, String(v));
    });
    
    return value as string;
  };

  // TanStack Query Mutation for Gemini Generation (MS-114)
  const generateMutation = useMutation({
    mutationFn: async (cards: Card[]) => {
      if (!user) throw new Error("User not signed in");

      const clientMetadata = {
        userAgent: navigator.userAgent,
        os: navigator.userAgent.includes("Mac") ? "macOS" :
            navigator.userAgent.includes("Win") ? "Windows" :
            navigator.userAgent.includes("Linux") ? "Linux" :
            navigator.userAgent.includes("Android") ? "Android" :
            navigator.userAgent.includes("like Mac") ? "iOS" : "Unknown",
        appVersion: "1.0.0"
      };
      const idempotencyKey = `spend_${user.uid}_${cards.map(c => c.id).join('_')}_${Date.now()}`;

      const moonRef = doc(db, 'user_moons', user.uid);
      const cardNamesEn = cards.map(c => locales['en']?.cards?.[c.locKey]?.name || c.name).join(', ');
      const txDesc = (locales['en']?.transactionDesc || "Reading with cards: {cards}").replace('{cards}', cardNamesEn);

      const txRef = doc(collection(db, 'moon_transactions'));
      pendingTxId.current = txRef.id;

      let deducted = false;
      let deductedFrom: 'daily' | 'purchased' | null = null;

      // First run transaction to deduct the moon balance
      await runTransaction(db, async (transaction) => {
        const moonDoc = await transaction.get(moonRef);
        if (!moonDoc.exists()) throw new Error("No moon balance record found.");

        const data = moonDoc.data();
        const daily = data.dailyFreeBalance || 0;
        const purchased = data.purchasedBalance || 0;
        const total = data.balance || 0;

        if (total < 1) throw new Error("Not enough Katina Moons!");

        let newDaily = daily;
        let newPurchased = purchased;

        if (daily > 0) {
          newDaily = daily - 1;
          deductedFrom = 'daily';
        } else {
          newPurchased = purchased - 1;
          deductedFrom = 'purchased';
        }

        const newBalance = newDaily + newPurchased;

        transaction.update(moonRef, {
          dailyFreeBalance: newDaily,
          purchasedBalance: newPurchased,
          balance: newBalance,
          updatedAt: serverTimestamp()
        });

        const paymentProvider = deductedFrom === 'daily' ? 'daily_gift' : 'stripe';

        transaction.set(txRef, {
          userId: user.uid,
          amount: -1,
          type: 'spend',
          status: 'pending',
          description: txDesc,
          pdfDownloaded: 0,
          userLanguage: userInfo.language,
          userName: userInfo.name,
          userDob: userInfo.dob,
          userBirthplace: userInfo.birthplace,
          userRelationship: userInfo.relationship,
          cards: cards.map(c => ({ id: c.id, locKey: c.locKey, name: c.name })),
          deductedFrom,
          paymentProvider,
          idempotencyKey,
          clientMetadata,
          createdAt: serverTimestamp()
        });
      });

      deducted = true;
      pendingDeducted.current = deducted;
      pendingDeductedFrom.current = deductedFrom;
      setReadingCount(prev => prev + 1);

      // Fetch generation from backend (MS-110 prompt validation & MS-121 focus selection)
      const token = await user.getIdToken();
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          transactionId: txRef.id,
          cards: cards.map(c => c.id),
          userName: userInfo.name,
          dob: userInfo.dob,
          birthplace: userInfo.birthplace,
          relationship: userInfo.relationship,
          language: userInfo.language,
          focus: userInfo.focus,
          idempotencyKey,
          clientMetadata
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();

      if (data.status === 'pending') {
        return new Promise<{ text: string; cached: boolean }>((resolve, reject) => {
          const unsubscribe = onSnapshot(doc(db, 'moon_transactions', txRef.id), (docSnap) => {
            if (docSnap.exists()) {
              const txData = docSnap.data();
              if (txData.status === 'success') {
                unsubscribe();
                resolve({ text: txData.readingText || '', cached: false });
              } else if (txData.status === 'failed') {
                unsubscribe();
                reject(new Error(userInfo.language === 'tr' ? "Mistik yorum oluşturulurken sunucuda bir hata oluştu." : "Server failed to generate mystical reading. Please try again."));
              }
            }
          }, (error) => {
            unsubscribe();
            reject(error);
          });
        });
      }

      return { text: data.text || t('errorSilent'), cached: !!data.cached };
    },
    onMutate: () => {
      setIsGenerating(true);
      setStep('RESULT');
      // Funnel Analytics: reading_requested (MS-134)
      logAnalyticsEvent('reading_requested', {
        language: userInfo.language,
        focus: userInfo.focus
      });
    },
    onSuccess: async (data) => {
      setReading(data.text);
      setIsGenerating(false);

      if (pendingTxId.current) {
        try {
          await updateDoc(doc(db, 'moon_transactions', pendingTxId.current), {
            readingText: data.text,
            status: 'success',
            cached: data.cached
          });
        } catch (e) {
          console.error("Error saving reading text:", e);
        }
      }

      // Rollback balance on cache hit (MS-151)
      if (data.cached && user && pendingDeducted.current && pendingDeductedFrom.current) {
        try {
          const moonRef = doc(db, 'user_moons', user.uid);
          await runTransaction(db, async (transaction) => {
            const moonDoc = await transaction.get(moonRef);
            if (!moonDoc.exists()) return;
            const mData = moonDoc.data();
            const daily = mData.dailyFreeBalance || 0;
            const purchased = mData.purchasedBalance || 0;

            if (pendingDeductedFrom.current === 'daily') {
              const newDaily = daily + 1;
              transaction.update(moonRef, {
                dailyFreeBalance: newDaily,
                balance: newDaily + purchased,
                updatedAt: serverTimestamp()
              });
            } else {
              const newPurchased = purchased + 1;
              transaction.update(moonRef, {
                purchasedBalance: newPurchased,
                balance: daily + newPurchased,
                updatedAt: serverTimestamp()
              });
            }
          });
          setReadingCount(prev => Math.max(0, prev - 1));
          showToast(userInfo.language === 'tr' ? "Önbellekten yüklendi, bakiyeniz iade edildi!" : "Loaded from cache, moon balance refunded!", 'success');
        } catch (refundError) {
          console.error("Error refunding cached moon balance:", refundError);
        }
      }
    },
    onError: async (error: any) => {
      console.error("Reading generation error:", error);
      setReading(t('errorInterrupted'));
      setIsGenerating(false);
      
      // Rollback balance on failure
      if (user && pendingDeducted.current && pendingDeductedFrom.current) {
        try {
          const moonRef = doc(db, 'user_moons', user.uid);
          await runTransaction(db, async (transaction) => {
            const moonDoc = await transaction.get(moonRef);
            if (!moonDoc.exists()) return;
            const data = moonDoc.data();
            const daily = data.dailyFreeBalance || 0;
            const purchased = data.purchasedBalance || 0;

            if (pendingDeductedFrom.current === 'daily') {
              const newDaily = daily + 1;
              transaction.update(moonRef, {
                dailyFreeBalance: newDaily,
                balance: newDaily + purchased,
                updatedAt: serverTimestamp()
              });
            } else {
              const newPurchased = purchased + 1;
              transaction.update(moonRef, {
                purchasedBalance: newPurchased,
                balance: daily + newPurchased,
                updatedAt: serverTimestamp()
              });
            }

            // Log system refund transaction (MS-182)
            const refundPaymentProvider = pendingDeductedFrom.current === 'daily' ? 'daily_gift' : 'stripe';
            const refundTxRef = doc(collection(db, 'moon_transactions'));
            const clientMetadata = {
              userAgent: navigator.userAgent,
              os: navigator.userAgent.includes("Mac") ? "macOS" :
                  navigator.userAgent.includes("Win") ? "Windows" :
                  navigator.userAgent.includes("Linux") ? "Linux" :
                  navigator.userAgent.includes("Android") ? "Android" :
                  navigator.userAgent.includes("like Mac") ? "iOS" : "Unknown",
              appVersion: "1.0.0"
            };
            transaction.set(refundTxRef, {
              userId: user.uid,
              amount: 1,
              type: 'refund',
              status: 'success',
              description: userInfo.language === 'tr' ? 'Mistik Yorum Hatası İadesi (Sistem İadesi)' : 'Mystical Reading Error Refund (System Refund)',
              pdfDownloaded: 0,
              paymentProvider: refundPaymentProvider,
              idempotencyKey: `refund_error_${pendingTxId.current || Date.now()}`,
              clientMetadata,
              createdAt: serverTimestamp()
            });
          });
        } catch (refundError) {
          console.error("Error refunding user moon balance:", refundError);
        }
      }

      if (pendingTxId.current) {
        try {
          await updateDoc(doc(db, 'moon_transactions', pendingTxId.current), {
            status: 'failed'
          });
        } catch (txStatusError) {
          console.error("Error updating transaction status to failed:", txStatusError);
        }
        setReadingCount(prev => Math.max(0, prev - 1));
      }
    }
  });

  const startCardSelection = async () => {
    if (moonsCount <= 0) {
      showToast(t('store.noMoons'), 'error');
      setIsStoreOpen(true);
      return;
    }

    if (user) {
      logUserEvent(user.uid, 'DRAW_CARDS_START');
      
      // Funnel Analytics: card_draw_started (MS-134)
      logAnalyticsEvent('card_draw_started', { language: userInfo.language });

      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          name: userInfo.name,
          dob: userInfo.dob,
          birthplace: userInfo.birthplace,
          relationship: userInfo.relationship,
          focus: userInfo.focus,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Error updating user profile on draw:", error);
      }
    }

    // Shuffle the deck of cards using Fisher-Yates shuffle
    const deck = [...KATINA_DECK];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setShuffledDeck(deck);
    setDrawnCards([]);
    setStep('DRAWING');
  };

  const handleDownload = async (pastReading?: any) => {
    const isEvent = pastReading && pastReading.nativeEvent;
    const actualPastReading = isEvent ? undefined : pastReading;

    const readingToUse = actualPastReading ? actualPastReading.readingText : reading;
    const cardsToUse = actualPastReading?.cards || drawnCards;
    
    const userInfoToUse = actualPastReading ? {
      name: actualPastReading.userName,
      dob: actualPastReading.userDob,
      birthplace: actualPastReading.userBirthplace,
      relationship: actualPastReading.userRelationship,
      language: actualPastReading.userLanguage || userInfo.language
    } : userInfo;

    if (!readingToUse || isExportingPDF) return;

    // Use imported standalone generatePDF service (MS-126)
    await generatePDF({
      readingText: readingToUse,
      drawnCards: cardsToUse,
      userInfo: userInfoToUse,
      locales,
      adsConfig,
      currentTransactionId: actualPastReading ? actualPastReading.id : pendingTxId.current,
      user,
      showToast,
      setIsExportingPDF
    });
  };

  const handleStartOver = () => {
    setStep('SPLASH');
    setDrawnCards([]);
    setReading(null);
  };

  const handleSignOut = async () => {
    try {
      if (user) {
        await disablePushNotifications(user.uid);
      }
      await signOut(auth);
      setShowOnboarding(true);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleLegalOpen = async () => {
    setIsLegalOpen(true);
    if (user) {
      try {
        const metadata = await gatherUserMetadata();
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          hasAcceptedLegal: 1,
          legalAcceptedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          metadata
        });
      } catch (error) {
        try {
          const metadata = await gatherUserMetadata();
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            userId: user.uid,
            email: user.email,
            displayName: user.displayName,
            hasAcceptedLegal: 1,
            legalAcceptedAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp(),
            metadata
          }, { merge: true });
        } catch (innerError) {
          handleFirestoreError(innerError, 'write', `users/${user.uid}`);
        }
      }
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#05000a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ecd8a6] animate-spin" />
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <Onboarding 
        language={userInfo.language} 
        t={t}
        onComplete={() => {
          setShowOnboarding(false);
          // Funnel Analytics: onboarding_complete (MS-134)
          logAnalyticsEvent('onboarding_complete', { language: userInfo.language });
        }} 
      />
    );
  }

  if (!user) {
    return (
      <Login 
        onLogin={() => {}} 
        language={userInfo.language} 
        onLanguageChange={(lang) => setUserInfo({ language: lang })}
        onShowOnboarding={() => setShowOnboarding(true)}
        t={t}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#05000a] text-[#ecd8a6] font-sans selection:bg-purple-900/50 overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-fuchsia-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #ecd8a6 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 right-0 w-full p-4 sm:p-6 flex justify-end items-center gap-2 sm:gap-3 z-[40] pointer-events-none"
      >

        {step !== 'DRAWING' && (
          <>
            <div 
              onClick={() => setIsProfileOpen(true)}
              className="h-9 sm:h-10 flex items-center justify-center p-2 bg-[#0a0512]/80 backdrop-blur-md rounded-full border border-[#ecd8a6]/30 shadow-lg cursor-pointer transition-all hover:border-[#ecd8a6]/60 group pointer-events-auto"
              title="Profile"
            >
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#ecd8a6] group-hover:scale-110 transition-transform" />
            </div>

            <div 
              onClick={() => setIsStoreOpen(true)}
              className="h-9 sm:h-10 flex items-center gap-1.5 sm:gap-2 bg-[#0a0512]/80 backdrop-blur-md px-3 sm:px-4 hover:bg-[#120a1c]/90 rounded-full border border-[#ecd8a6]/30 shadow-lg cursor-pointer transition-all hover:border-[#ecd8a6]/60 group pointer-events-auto"
            >
              <KatinaMoon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ecd8a6] group-hover:scale-110 transition-transform" />
              <span className="font-serif tracking-widest text-[#ecd8a6] text-xs sm:text-base font-semibold">{moonsCount}</span>
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#ecd8a6]/10 flex items-center justify-center ml-0.5 sm:ml-1 group-hover:bg-[#ecd8a6]/20 transition-colors">
                <Plus className="w-2.5 h-2.5 sm:w-3 h-3 text-[#ecd8a6]" />
              </div>
            </div>

            <button 
              onClick={handleSignOut}
              className="h-9 sm:h-10 flex items-center gap-1.5 sm:gap-2 px-3.5 bg-red-950/20 backdrop-blur-md rounded-full border border-red-900/30 text-red-200/60 hover:text-red-200 hover:border-red-900/60 transition-all group pointer-events-auto"
              title="Sign Out"
            >
              <span className="text-[9px] sm:text-[10px] font-serif tracking-widest uppercase inline-block">
                {t('store.logout')}
              </span>
              <LogOut className="w-3.5 h-3.5 sm:w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        )}
      </motion.div>

      {/* Store Modal Component (MS-126) */}
      <AnimatePresence>
        {isStoreOpen && (
          <StoreModal 
            isOpen={isStoreOpen}
            onClose={() => setIsStoreOpen(false)}
            user={user}
            language={userInfo.language}
            t={t}
            showToast={showToast}
            onErrorLog={handleFirestoreError}
            onCheckoutInitiated={(pack) => {
              // Funnel Analytics: checkout_initiated (MS-134)
              logAnalyticsEvent('checkout_initiated', {
                language: userInfo.language,
                amount: pack.amount,
                price: pack.price
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <Profile 
            user={user} 
            userInfo={userInfo} 
            moonsCount={moonsCount}
            readingCount={readingCount}
            onClose={() => setIsProfileOpen(false)}
            onUpdateUserInfo={(info) => {
              setUserInfo({
                name: info.name,
                dob: info.dob,
                birthplace: info.birthplace,
                relationship: info.relationship
              });
            }}
            translations={locales[userInfo.language]}
            onDownloadPastReading={handleDownload}
          />
        )}
      </AnimatePresence>

      {/* Soft Push Notification Prompt (MS-169) */}
      <AnimatePresence>
        {showPushPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/30 p-8 shadow-[0_0_50px_rgba(236,216,166,0.15)] text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#ecd8a6]/5 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-transparent border-[4px] border-double border-[#ecd8a6]/10 m-2 rounded-2xl pointer-events-none" />
              
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#ecd8a6]/10 border border-[#ecd8a6]/30 flex items-center justify-center relative z-10">
                <Sparkles className="w-8 h-8 text-[#ecd8a6]" />
              </div>
              
              <h3 className="text-xl font-serif text-[#ecd8a6] tracking-widest uppercase mb-4 relative z-10">
                {userInfo.language === 'tr' ? "Kehanetlerinizi Kaçırmayın" : "Don't Miss Your Destiny"}
              </h3>
              
              <p className="text-xs text-[#ecd8a6]/70 leading-relaxed font-sans mb-8 px-2 relative z-10">
                {userInfo.language === 'tr' 
                  ? "Günlük ücretsiz Katina Moon kredileriniz yüklendiğinde ve falınız hazır olduğunda mistik bildirimler almak için tarayıcı bildirimlerini etkinleştirin." 
                  : "Enable browser notifications to receive mystic updates when your daily free Katina Moon credits are loaded or when your readings are prepared."}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
                <button
                  onClick={handleEnablePush}
                  className="w-full sm:w-auto px-6 py-3 bg-[#ecd8a6] hover:bg-white text-[#0a0512] rounded-xl text-xs font-serif tracking-widest uppercase font-bold transition-all cursor-pointer"
                >
                  {userInfo.language === 'tr' ? "Bildirimleri Aç" : "Enable Notifications"}
                </button>
                <button
                  onClick={handleClosePushPrompt}
                  className="w-full sm:w-auto px-6 py-3 bg-[#120a1c]/80 hover:bg-white/5 text-[#ecd8a6]/70 hover:text-[#ecd8a6] rounded-xl text-xs font-serif tracking-widest uppercase font-bold transition-all border border-[#ecd8a6]/20 cursor-pointer"
                >
                  {userInfo.language === 'tr' ? "Daha Sonra" : "Maybe Later"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal Modal Component (MS-126) */}
      <AnimatePresence>
        {isLegalOpen && (
          <LegalModal 
            language={userInfo.language}
            onClose={() => setIsLegalOpen(false)}
            t={t}
          />
        )}
      </AnimatePresence>

      {/* Contact Modal Component (MS-126) */}
      <AnimatePresence>
        {isContactOpen && (
          <ContactModal 
            language={userInfo.language}
            locales={locales}
            onClose={() => setIsContactOpen(false)}
            onErrorLog={handleFirestoreError}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step !== 'SPLASH' && step !== 'FORM' && (
          <motion.button
            initial={{ opacity: 0, x: -20, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: 0 }}
            onClick={handleStartOver}
            className="absolute z-20 top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors bg-[#0a0512]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#ecd8a6]/20 hover:border-[#ecd8a6]/50 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">
              {t('returnToStart')}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 flex flex-col items-center">
        
        {step !== 'SPLASH' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 flex flex-col items-center"
          >
            <div className="flex items-center justify-center mb-2 mt-24 sm:mt-24 relative">
              <div className="absolute inset-0 bg-[#ecd8a6]/10 blur-xl rounded-full" />
              <h1 
                onClick={() => setStep('SPLASH')}
                className="text-4xl md:text-5xl font-serif tracking-widest text-[#ecd8a6] uppercase drop-shadow-md z-10 font-bold cursor-pointer hover:opacity-80 transition-opacity" 
                style={{ textShadow: "0 2px 10px rgba(236, 216, 166, 0.3)" }}
              >
                MADAME SOUL
              </h1>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Sparkles className="w-4 h-4 text-[#ecd8a6]/60" />
              <p className="text-[#ecd8a6]/80 text-sm tracking-[0.3em] uppercase">Katina Readings</p>
              <Sparkles className="w-4 h-4 text-[#ecd8a6]/60" />
            </div>
            <p className="text-[#ecd8a6]/70 max-w-lg mx-auto font-sans italic">
              {t('subtitle')}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 'SPLASH' && (
            <motion.div 
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              className="w-full flex-1 flex flex-col items-center justify-center min-h-[70vh] relative pt-12 sm:pt-20"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-[#ecd8a6]/20 border-dashed"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-[340px] h-[340px] md:w-[540px] md:h-[540px] rounded-full border border-[#ecd8a6]/10 border-dotted"
                />
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex items-center justify-center mb-8"
              >
                <div className="absolute inset-0 bg-[#ecd8a6]/10 blur-[60px] rounded-full" />
                <KatinaMoon className="w-16 h-16 md:w-20 md:h-20 text-[#ecd8a6] relative z-10" />
              </motion.div>

              <div className="text-center relative z-10 mb-2">
                <h1 className="text-4xl sm:text-5xl md:text-8xl font-serif tracking-widest text-[#ecd8a6] uppercase leading-tight font-bold" style={{ textShadow: "0 2px 20px rgba(236, 216, 166, 0.4)" }}>
                  MADAME<br/>
                  SOUL
                </h1>
              </div>
              
              <div className="flex items-center justify-center w-full max-w-2xl gap-3 sm:gap-4 mb-4 relative z-10">
                <div className="hidden sm:block h-px w-12 bg-[#ecd8a6]/40 flex-1" />
                <p className="text-[#ecd8a6]/80 text-xs sm:text-sm md:text-base tracking-[0.3em] sm:tracking-[0.4em] uppercase font-serif text-center w-full sm:w-auto">Katina Readings</p>
                <div className="hidden sm:block h-px w-12 bg-[#ecd8a6]/40 flex-1" />
              </div>

              <p className="text-[#ecd8a6]/70 text-base md:text-xl font-sans italic mb-10 text-center max-w-3xl relative z-10 mt-6 px-4">
                {t('splashText')}
              </p>

              <div className="flex flex-col items-center gap-8 relative z-10 w-full">
                <button
                  onClick={() => setStep('FORM')}
                  className="group w-full max-w-[320px] h-[58px] justify-center relative flex items-center gap-4 bg-gradient-to-br from-[#1e1332] to-[#05000a] overflow-hidden border border-[#ecd8a6]/40 text-[#ecd8a6] font-serif tracking-widest uppercase rounded-full shadow-[0_0_30px_rgba(236,216,166,0.15)] hover:shadow-[0_0_50px_rgba(236,216,166,0.3)] hover:border-[#ecd8a6]/80 transition-all duration-500 scale-105 hover:scale-110 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ecd8a6]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  <KatinaMoon className="w-6 h-6 text-[#ecd8a6] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 relative z-10" />
                  <span className="relative z-10 text-base sm:text-lg font-bold">{t('startButton')}</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
                  {adsConfig?.ad1?.enabled && (
                    <div className="relative bg-[#0a0512]/60 backdrop-blur-md border border-[#ecd8a6]/20 rounded-2xl overflow-hidden group hover:border-[#ecd8a6]/40 transition-colors h-full flex flex-col">
                      <div className="absolute top-0 right-0 bg-[#ecd8a6] text-[#0a0512] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider z-10">
                        {adsConfig?.ad1?.sponsored?.[userInfo.language] || adsConfig?.ad1?.sponsored?.en || "Sponsored"}
                      </div>
                      <div className="p-5 flex flex-col gap-4 flex-1">
                        <div className="text-center">
                          <p className="text-[#ecd8a6] text-sm md:text-base font-serif leading-relaxed">
                            {adsConfig?.ad1?.text?.[userInfo.language] || adsConfig?.ad1?.text?.en || "Get 20% off Katina Tarot Cards on Amazon!"}
                          </p>
                        </div>

                        {adsConfig?.ad1?.mediaSrc && (
                          <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-[#ecd8a6]/10 bg-black/40 shadow-inner group-hover:border-[#ecd8a6]/30 transition-colors">
                            {adsConfig?.ad1?.mediaType === 'image' ? (
                              <img 
                                src={adsConfig?.ad1?.mediaSrc}
                                className="w-full h-full object-cover grayscale-[0.2] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <video 
                                src={adsConfig?.ad1?.mediaSrc} 
                                autoPlay 
                                muted 
                                loop 
                                playsInline
                                className="w-full h-full object-cover grayscale-[0.2] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                              />
                            )}
                          </div>
                        )}

                        <div className="bg-black/40 rounded-xl p-3 flex items-center justify-between border border-[#ecd8a6]/10 mt-auto">
                          <div className="flex items-center gap-3">
                            <span className="text-[#ecd8a6]/60 text-[10px] font-serif uppercase tracking-widest">{adsConfig?.ad1?.promoCodeLabel?.[userInfo.language] || adsConfig?.ad1?.promoCodeLabel?.en || "Use Code:"}</span>
                            <span className="text-[#ecd8a6] text-sm font-mono font-bold tracking-[0.2em]">{adsConfig?.ad1?.promoCode || "KATINA20"}</span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              navigator.clipboard.writeText(adsConfig?.ad1?.promoCode || "KATINA20");
                              setBannerCopied(true);
                              setTimeout(() => setBannerCopied(false), 2000);
                            }}
                            className="p-1.5 hover:bg-[#ecd8a6]/10 rounded-md transition-colors text-[#ecd8a6]"
                            title={t('copyCode')}
                          >
                            {bannerCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 opacity-60" />}
                          </button>
                        </div>
                        <a 
                          href={adsConfig?.ad1?.link || "https://www.amazon.com/s?k=katina+tarot"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full h-[50px] flex items-center justify-center gap-2 bg-[#ecd8a6]/10 hover:bg-[#ecd8a6]/20 text-[#ecd8a6] rounded-xl text-xs font-serif uppercase tracking-widest transition-all font-medium border border-[#ecd8a6]/20"
                        >
                          {adsConfig?.ad1?.buttonText?.[userInfo.language] || adsConfig?.ad1?.buttonText?.en || "Shop Now"}
                        </a>
                      </div>
                    </div>
                  )}

                  {adsConfig?.ad2?.enabled && (
                    <div className="relative bg-[#0a0512]/60 backdrop-blur-md border border-[#ecd8a6]/20 rounded-2xl overflow-hidden group hover:border-[#ecd8a6]/40 transition-colors h-full flex flex-col">
                      <div className="absolute top-0 right-0 bg-[#ecd8a6] text-[#0a0512] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider z-10">
                        {adsConfig?.ad2?.sponsored?.[userInfo.language] || adsConfig?.ad2?.sponsored?.en || "Sponsored"}
                      </div>
                      <div className="p-5 flex flex-col gap-4 flex-1">
                        <div className="text-center">
                          <p className="text-[#ecd8a6]/60 text-[10px] font-serif uppercase tracking-widest mb-1">
                            {adsConfig?.ad2?.title?.[userInfo.language] || adsConfig?.ad2?.title?.en || "Live Session"}
                          </p>
                          <p className="text-[#ecd8a6] text-sm md:text-base font-serif leading-relaxed whitespace-pre-line">
                            {adsConfig?.ad2?.text?.[userInfo.language] || adsConfig?.ad2?.text?.en || ""}
                          </p>
                        </div>

                        <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-[#ecd8a6]/10 bg-black/40 shadow-inner group-hover:border-[#ecd8a6]/30 transition-colors">
                          {adsConfig?.ad2?.mediaType === 'image' ? (
                            <img 
                              src={adsConfig?.ad2?.mediaSrc}
                              className="w-full h-full object-cover grayscale-[0.2] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <video 
                              src={adsConfig?.ad2?.mediaSrc} 
                              autoPlay 
                              muted 
                              loop 
                              playsInline
                              className="w-full h-full object-cover grayscale-[0.2] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                            />
                          )}
                        </div>

                        <a 
                          href={adsConfig?.ad2?.link || "https://www.etsy.com/shop/MadameSoulStudio"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-[50px] flex items-center justify-center gap-2 bg-[#ecd8a6]/10 hover:bg-[#ecd8a6]/20 text-[#ecd8a6] rounded-xl text-xs font-serif uppercase tracking-widest transition-all font-medium border border-[#ecd8a6]/20 mt-auto"
                        >
                          {adsConfig?.ad2?.buttonText?.[userInfo.language] || adsConfig?.ad2?.buttonText?.en || "Shop on Etsy"}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'FORM' && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              className="w-full max-w-4xl bg-[#0a0512]/60 backdrop-blur-xl rounded-2xl border border-[#ecd8a6]/20 p-6 sm:p-8 md:p-12 shadow-[0_0_40px_rgba(236,216,166,0.05)] relative mx-4"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#ecd8a6]/50 to-transparent" />
              <form 
                onSubmit={(e) => { e.preventDefault(); startCardSelection(); }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10"
              >
                <div>
                  <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-2 uppercase">{t('nameLabel')}</label>
                  <input 
                    required
                    type="text"
                    value={userInfo.name}
                    onChange={e => handleInputChange(e, 'name')}
                    className="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg px-4 py-3 outline-none focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60 transition-all text-[#ecd8a6] placeholder:text-[#ecd8a6]/30 font-sans"
                    placeholder={t('namePlaceholder')}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-2 uppercase">{t('dobLabel')}</label>
                  <input 
                    required
                    type="date"
                    value={userInfo.dob}
                    onChange={e => setUserInfo({ dob: e.target.value })}
                    className="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg px-4 py-3 outline-none focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60 transition-all text-[#ecd8a6] custom-date-picker font-sans [color-scheme:dark]"
                  />
                  <style>{`
                    .custom-date-picker::-webkit-calendar-picker-indicator {
                      filter: invert(1) brightness(0.8) sepia(1) hue-rotate(5deg) saturate(3);
                    }
                  `}</style>
                </div>

                <div>
                  <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-2 uppercase">{t('pobLabel')}</label>
                  <input 
                    required
                    type="text"
                    value={userInfo.birthplace}
                    onChange={e => handleInputChange(e, 'birthplace')}
                    className="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg px-4 py-3 outline-none focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60 transition-all text-[#ecd8a6] placeholder:text-[#ecd8a6]/30 font-sans"
                    placeholder={t('pobPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-2 uppercase">{t('statusLabel')}</label>
                  <div className="relative">
                    <select 
                      value={userInfo.relationship}
                      onChange={e => setUserInfo({ relationship: e.target.value })}
                      className="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg px-4 py-3 outline-none focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60 transition-all appearance-none text-[#ecd8a6] font-sans"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-[#0a0512]">
                          {opt[userInfo.language as keyof typeof opt]}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>

                {/* MS-121 Open Reading Focus Category Selection form input */}
                <div>
                  <label className="block text-xs font-serif tracking-widest text-[#ecd8a6] mb-2 uppercase">
                    {t('focusLabel')}
                  </label>
                  <div className="relative">
                    <select 
                      value={userInfo.focus}
                      onChange={e => setUserInfo({ focus: e.target.value })}
                      className="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg px-4 py-3 outline-none focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60 transition-all appearance-none text-[#ecd8a6] font-sans"
                    >
                      {FOCUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-[#0a0512]">
                          {opt[userInfo.language as keyof typeof opt] || opt.value}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-4">
                  <button 
                    type="submit"
                    className="w-full h-[58px] bg-gradient-to-br from-[#1e1332] to-[#0a0512] border border-[#ecd8a6]/40 hover:border-[#ecd8a6]/80 text-[#ecd8a6] font-serif tracking-widest uppercase rounded-lg shadow-[0_0_15px_rgba(236,216,166,0.1)] hover:shadow-[0_0_25px_rgba(236,216,166,0.2)] flex items-center justify-center transition-all duration-300 font-bold cursor-pointer"
                  >
                    {t('submitButton')}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

                    {step === 'DRAWING' && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center"
            >
              {/* Header / Instructions */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif text-[#ecd8a6] mb-3 flex items-center justify-center gap-3">
                  <KatinaMoon className="w-8 h-8 text-[#ecd8a6] animate-[spin_15s_linear_infinite] flex-shrink-0" />
                  <span>{userInfo.language === 'tr' ? "Kaderinizin Kartlarını Seçin" : "Select the Cards of Your Destiny"}</span>
                </h2>
                <p className="text-[#ecd8a6]/70 max-w-md mx-auto text-sm">
                  {userInfo.language === 'tr'
                    ? "Zihninizi boşaltın, sorunuza odaklanın ve sırasıyla Geçmiş, Şimdiki Zaman ve Gelecek için 3 kart seçin."
                    : "Clear your mind, focus on your question, and select 3 cards for Past, Present, and Future."}
                </p>
                
                {/* Progress / Status */}
                <div className="mt-4 flex items-center justify-center gap-3">
                  <span className="px-3 py-1 bg-[#1e1332] border border-[#ecd8a6]/20 rounded-full text-xs text-[#ecd8a6]">
                    {userInfo.language === 'tr' ? `Seçilen: ${drawnCards.length} / 3` : `Selected: ${drawnCards.length} / 3`}
                  </span>
                  {drawnCards.length > 0 && (
                    <span className="text-xs text-[#ecd8a6]/60 italic font-sans font-medium">
                      {drawnCards.length === 1 && (userInfo.language === 'tr' ? "Sıradaki: Şimdiki Zaman" : "Next: Present")}
                      {drawnCards.length === 2 && (userInfo.language === 'tr' ? "Sıradaki: Gelecek" : "Next: Future")}
                      {drawnCards.length === 3 && (userInfo.language === 'tr' ? "Seçim tamamlandı!" : "Selection complete!")}
                    </span>
                  )}
                </div>
              </div>

              {/* The Row of 3 Selected Card Slots with flip animation */}
              <div className="grid grid-cols-3 gap-4 max-w-xl w-full mb-10">
                {[t('past'), t('present'), t('future')].map((label, idx) => {
                  const card = drawnCards[idx];
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-widest text-[#ecd8a6]/60 mb-2 font-sans font-medium">{label}</span>
                      <div className="w-full aspect-[2/3] max-w-[120px] rounded-lg border border-[#ecd8a6]/20 relative bg-[#120a1c]/60 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                        {card ? (
                          <motion.div
                            initial={{ rotateY: 180 }}
                            animate={{ rotateY: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full h-full relative"
                            style={{ transformStyle: 'preserve-3d' }}
                          >
                            <img
                              src={`/cards/${card.id}.webp`} loading="lazy"
                              alt={locales[userInfo.language]?.cards?.[card.locKey]?.name || card.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-center text-[10px] text-[#ecd8a6] truncate px-1 font-sans font-medium">
                              {locales[userInfo.language]?.cards?.[card.locKey]?.name || card.name}
                            </div>
                          </motion.div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-2 text-center text-[#ecd8a6]/30 text-xs">
                            <Sparkles className="w-4 h-4 mb-1 animate-pulse" />
                            <span className="text-[9px] uppercase tracking-wider font-sans font-medium">
                              {userInfo.language === 'tr' ? "Kart Seç" : "Draw Card"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Start Reading Button (if 3 selected) */}
              {drawnCards.length === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <button
                    onClick={() => generateMutation.mutate(drawnCards)}
                    className="px-8 py-3.5 bg-gradient-to-br from-[#1e1332] to-[#05000a] border border-[#ecd8a6]/40 hover:border-[#ecd8a6]/80 text-[#ecd8a6] font-sans font-semibold tracking-widest uppercase rounded-full shadow-[0_0_30px_rgba(236,216,166,0.15)] hover:shadow-[0_0_50px_rgba(236,216,166,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KatinaMoon className="w-5 h-5 text-[#ecd8a6] animate-[spin_6s_linear_infinite]" />
                    <span>{userInfo.language === 'tr' ? "Açılımı Yorumla" : "Interpret Spread"}</span>
                  </button>
                </motion.div>
              )}

              {/* The Interactive Deck/Board of 35 cards */}
              <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-10 gap-3 max-w-5xl w-full p-6 bg-[#0a0512]/40 backdrop-blur-md rounded-2xl border border-[#ecd8a6]/10 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                {shuffledDeck.map((card, idx) => {
                  const drawnIndex = drawnCards.findIndex(c => c.id === card.id);
                  const isSelected = drawnIndex !== -1;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={!isSelected && drawnCards.length < 3 ? {
                        y: -8,
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(236,216,166,0.4)",
                        borderColor: "rgba(236,216,166,0.8)"
                      } : {}}
                      onClick={() => {
                        if (isSelected || drawnCards.length >= 3) return;
                        setDrawnCards(prev => [...prev, card]);
                      }}
                      className={`aspect-[2/3] rounded-md border cursor-pointer relative overflow-hidden transition-all duration-300 ${
                        isSelected
                          ? 'border-[#ecd8a6] bg-[#120a1c]/80 shadow-[0_0_15px_rgba(236,216,166,0.3)]'
                          : 'border-[#ecd8a6]/20 bg-gradient-to-br from-[#1e1332] to-[#0a0512] hover:border-[#ecd8a6]/60'
                      }`}
                    >
                      {/* Card Back Design */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                        <div className="absolute inset-1 border border-double border-[#ecd8a6]/10 rounded-sm pointer-events-none" />
                        <Sparkles className={`w-5 h-5 ${isSelected ? 'text-[#ecd8a6]' : 'text-[#ecd8a6]/30'} transition-transform duration-300`} />
                        
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#0a0512]/80 flex flex-col items-center justify-center z-10">
                            <div className="w-6 h-6 rounded-full bg-[#ecd8a6] text-[#0a0512] font-serif font-bold text-xs flex items-center justify-center shadow-lg mb-1">
                              {drawnIndex + 1}
                            </div>
                            <span className="text-[8px] text-[#ecd8a6] uppercase tracking-widest font-sans font-bold">
                              {drawnIndex === 0 && (userInfo.language === 'tr' ? 'Geçmiş' : 'Past')}
                              {drawnIndex === 1 && (userInfo.language === 'tr' ? 'Şimdi' : 'Present')}
                              {drawnIndex === 2 && (userInfo.language === 'tr' ? 'Gelecek' : 'Future')}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 'RESULT' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[t('past'), t('present'), t('future')].map((label, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.8, type: "spring" }}
                    className="relative group perspective h-full"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-[#1e1332] to-[#0a0512] rounded-2xl border border-[#ecd8a6]/30 shadow-[0_0_30px_rgba(236,216,166,0.05)] flex flex-col items-center justify-between p-6 text-center transform transition-transform duration-500 group-hover:scale-105 group-hover:border-[#ecd8a6]/60 relative overflow-hidden">
                      <div className="absolute inset-0 bg-transparent border-[4px] border-double border-[#ecd8a6]/10 m-2 rounded-xl pointer-events-none" />
                      
                      <div className="relative z-10 w-full flex flex-col items-center justify-start mt-2">
                        <div className="text-xs font-serif tracking-widest text-[#ecd8a6]/70 uppercase mb-4">
                          {label}
                        </div>
                        <div className="w-8 h-px bg-[#ecd8a6]/30 mb-4" />
                      </div>
                      
                      <div className="flex w-full items-center justify-center my-4 relative group/img">
                        {!imageError[drawnCards[index]?.id] ? (
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                            className="relative w-full max-w-[140px] sm:max-w-[160px] aspect-[2/3] mx-auto rounded-md overflow-hidden border border-[#ecd8a6]/30 shadow-[0_5px_15px_rgba(0,0,0,0.5)] group-hover/img:shadow-[0_0_35px_rgba(236,216,166,0.25)] group-hover/img:border-[#ecd8a6]/60 transition-all duration-500 ease-out"
                          >
                            <img 
                              src={`/cards/${drawnCards[index]?.id}.webp`} loading="lazy" 
                              alt={locales[userInfo.language]?.cards?.[drawnCards[index]?.locKey]?.name || drawnCards[index]?.name}
                              onError={() => setImageError(prev => ({...prev, [drawnCards[index]?.id]: true}))}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ecd8a6]/10 to-transparent -translate-x-full group-hover/img:translate-x-full transition-transform duration-1000 ease-in-out z-20 pointer-events-none" />
                          </motion.div>
                        ) : (
                          <div className="flex flex-col mx-auto items-center justify-center w-full max-w-[140px] sm:max-w-[160px] aspect-[2/3] rounded-md border border-dashed border-[#ecd8a6]/20 bg-[#ecd8a6]/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                            <Sparkles className="w-8 h-8 text-[#ecd8a6]/30 mb-2 animate-pulse" />
                            <span className="text-[10px] text-[#ecd8a6]/40 uppercase tracking-widest font-serif">{locales[userInfo.language]?.cards?.[drawnCards[index]?.locKey]?.name || drawnCards[index]?.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="w-full relative z-10 mt-auto min-h-[96px] flex flex-col justify-center">
                        <h3 className="text-xl font-serif text-[#ecd8a6] mb-3">{locales[userInfo.language]?.cards?.[drawnCards[index]?.locKey]?.name || drawnCards[index]?.name}</h3>
                        <p className="text-xs text-[#ecd8a6]/60 font-sans italic leading-relaxed line-clamp-4 px-2">{locales[userInfo.language]?.cards?.[drawnCards[index]?.locKey]?.general || drawnCards[index]?.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="w-full max-w-5xl mx-auto bg-[#0a0512]/80 backdrop-blur-xl rounded-2xl border border-[#ecd8a6]/20 p-6 sm:p-8 md:p-12 shadow-[0_0_50px_rgba(236,216,166,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[#ecd8a6]/40 to-transparent"></div>
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#ecd8a6]/40"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#ecd8a6]/40"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#ecd8a6]/40"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#ecd8a6]/40"></div>
                
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-6">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-[#ecd8a6]/20 blur-[20px] rounded-full" />
                      <RefreshCw className="w-10 h-10 text-[#ecd8a6] relative z-10" />
                    </motion.div>
                    <p className="text-[#ecd8a6]/80 font-serif animate-pulse text-lg tracking-widest uppercase text-center">
                      {t('loading')}
                    </p>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="prose prose-invert prose-amber max-w-none font-sans leading-[2] tracking-wide"
                  >
                    <div className="markdown-body text-[#ecd8a6]/90 text-center">
                      <Markdown>{reading || ""}</Markdown>
                    </div>
                  </motion.div>
                )}
              </div>

              {!isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 sm:mt-16 flex flex-col w-full sm:flex-row justify-center items-center gap-4 sm:gap-6 flex-wrap relative z-20"
                >
                  <button 
                    onClick={() => handleDownload()}
                    disabled={isExportingPDF}
                    className="w-full sm:w-auto h-[58px] text-[#ecd8a6] hover:text-[#fff] flex items-center justify-center gap-3 border border-[#ecd8a6]/30 hover:border-[#ecd8a6]/60 px-6 sm:px-8 rounded-full transition-all bg-[#120a1c]/80 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isExportingPDF ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span className="font-serif tracking-widest text-xs uppercase">{isExportingPDF ? 'Exporting...' : t('downloadBtn')}</span>
                  </button>

                  <button 
                    onClick={handleStartOver}
                    className="w-full sm:w-auto h-[58px] text-[#ecd8a6] hover:text-[#fff] flex items-center justify-center gap-3 border border-[#ecd8a6]/30 hover:border-[#ecd8a6]/60 px-6 sm:px-8 rounded-full transition-all bg-[#120a1c]/80 backdrop-blur-sm cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="font-serif tracking-widest text-xs uppercase">{t('restartBtn')}</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full relative z-10 border-t border-[#ecd8a6]/10 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 flex justify-center gap-6 sm:gap-12">
          <button
            onClick={handleLegalOpen}
            className="text-[#ecd8a6] hover:text-[#fff] text-[10px] sm:text-xs font-serif tracking-widest uppercase hover:underline underline-offset-4 opacity-70 hover:opacity-100 transition-all cursor-pointer"
          >
            {t('legal.button')}
          </button>
          
          <button
            onClick={() => setIsContactOpen(true)}
            className="text-[#ecd8a6] hover:text-[#fff] text-[10px] sm:text-xs font-serif tracking-widest uppercase hover:underline underline-offset-4 opacity-70 hover:opacity-100 transition-all cursor-pointer"
          >
            {t('contact.footerText')}
          </button>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieBanner language={userInfo.language} t={t} />

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 z-50 md:max-w-sm bg-[#160d26] border border-[#ecd8a6] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(236,216,166,0.15)] overflow-hidden"
          >
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-full ${
                  toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                  toast.type === 'error' ? 'bg-rose-500/10 text-rose-400' :
                  'bg-[#ecd8a6]/10 text-[#ecd8a6]'
                }`}>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <p className="text-sm font-sans text-[#ecd8a6]/95 leading-relaxed">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToast(null)}
                className="text-[#ecd8a6]/50 hover:text-[#ecd8a6] transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className={`h-1 w-full bg-gradient-to-r ${
              toast.type === 'success' ? 'from-emerald-500/50 to-emerald-400' :
              toast.type === 'error' ? 'from-rose-500/50 to-rose-400' :
              'from-[#ecd8a6]/50 to-[#ecd8a6]'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
