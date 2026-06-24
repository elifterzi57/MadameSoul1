import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User as UserIcon, 
  Calendar, 
  MapPin, 
  Heart, 
  History, 
  ShoppingBag, 
  Star,
  Sparkles,
  ChevronRight,
  Loader2,
  CalendarDays,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Download,
  CheckCircle2,
  AlertCircle,
  Bell,
  RotateCcw,
  HelpCircle
} from 'lucide-react';
import { db, auth, requestPushNotificationPermission, disablePushNotifications } from '../lib/firebase';
import { collection, query, where, getDocs, getDoc, setDoc, orderBy, limit, Timestamp, doc, updateDoc, deleteDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { convertToLocaleUppercase } from '../utils/textUtils';
import { gatherUserMetadata } from '../lib/metadata';

interface ProfileProps {
  user: any;
  userInfo: {
    name: string;
    dob: string;
    birthplace: string;
    relationship: string;
    language: string;
    isPremium?: boolean;
  };
  moonsCount: number;
  readingCount: number;
  onClose: () => void;
  onUpdateUserInfo: (info: any) => void;
  translations: any;
  locales?: any;
  onDownloadPastReading?: (reading: any) => void;
  onShowOnboarding?: () => void;
  showToast?: (message: string, type?: 'info' | 'error' | 'success') => void;
  onOpenStore?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ 
  user, 
  userInfo, 
  moonsCount, 
  readingCount,
  onClose, 
  onUpdateUserInfo,
  translations,
  locales,
  onDownloadPastReading,
  onShowOnboarding,
  showToast,
  onOpenStore
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(true);

  // Diary and Personalization States (MS-148)
  const [expandedReadingId, setExpandedReadingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [notesStatus, setNotesStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Web Push notification states and handlers
  const [pushEnabled, setPushEnabled] = useState(false);
  const [checkingPush, setCheckingPush] = useState(true);

  // Feedback States (MS-187)
  const [feedbacks, setFeedbacks] = useState<Record<string, { rating: number; comment?: string }>>({});
  const [activeRating, setActiveRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Build reverse map of English card names to keys
  const cardNameToKeyMap: Record<string, string> = {};
  if (locales && locales['en'] && locales['en'].cards) {
    Object.entries(locales['en'].cards).forEach(([key, card]: [string, any]) => {
      if (card && card.name) {
        cardNameToKeyMap[card.name.toLowerCase()] = key;
      }
    });
  }

  const translateDescription = (desc: string) => {
    if (!desc) return '';
    const lang = userInfo.language || 'en';
    
    // Check if it matches "Reading with cards: ..."
    const match = desc.match(/^Reading with cards: (.*)$/i);
    if (match) {
      const cardNamesStr = match[1];
      const cardNames = cardNamesStr.split(', ').map(name => name.trim());
      
      const localizedNames = cardNames.map(name => {
        const key = cardNameToKeyMap[name.toLowerCase()];
        if (key && locales && locales[lang]?.cards?.[key]?.name) {
          return locales[lang].cards[key].name;
        }
        return name; // fallback
      });
      
      const template = (locales && locales[lang]?.transactionDesc) || (locales?.en?.transactionDesc) || "Reading with cards: {cards}";
      return template.replace('{cards}', localizedNames.join(', '));
    }
    
    // Also translate system refunds and gifts!
    if (desc.includes('Timeout Refund') || desc.includes('Zaman Aşımı İadesi')) {
      return lang === 'tr' ? 'Zaman Aşımı İadesi (Sistem İadesi)' : 'Timeout Refund (System Refund)';
    }
    if (desc.includes('Mystical Reading Error Refund') || desc.includes('Mistik Yorum Hatası İadesi')) {
      return lang === 'tr' ? 'Mistik Yorum Hatası İadesi (Sistem İadesi)' : 'Mystical Reading Error Refund (System Refund)';
    }
    if (desc === 'Daily Free Gift' || desc === 'Günlük Ücretsiz Hediye') {
      return (locales && locales[lang]?.dailyGift) || (locales?.en?.dailyGift) || desc;
    }
    if (desc === 'Welcome Bonus' || desc === 'Hoş Geldin Bonusu') {
      return (locales && locales[lang]?.welcomeBonus) || (locales?.en?.welcomeBonus) || desc;
    }
    if (desc.startsWith('Demo purchase of') || desc.includes('Katina Moons satın alımı (Demo)') || desc.includes('Katina Moon satın alımı (Demo)')) {
      const amountMatch = desc.match(/\d+/);
      if (amountMatch) {
        const amount = amountMatch[0];
        const template = (locales && locales[lang]?.transactionBuy) || (locales?.en?.transactionBuy) || desc;
        return template.replace('{amount}', amount);
      }
    }
    if (desc.startsWith('Purchase of') || desc.includes('Katina Moons purchase') || desc.includes('Katina Moon satın alımı') || desc.includes('Katina Moons satın alımı')) {
      const amountMatch = desc.match(/\d+/);
      if (amountMatch) {
        const amount = amountMatch[0];
        const template = (locales && locales[lang]?.transactionBuyReal) || (locales?.en?.transactionBuyReal) || desc;
        return template.replace('{amount}', amount);
      }
    }
    
    return desc;
  };

  useEffect(() => {
    setActiveRating(0);
    setHoverRating(0);
    setFeedbackComment('');
  }, [expandedReadingId]);

  useEffect(() => {
    const checkPushToken = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'user_push_tokens', user.uid);
        const docSnap = await getDoc(docRef);
        setPushEnabled(docSnap.exists());
      } catch (e) {
        console.error("Error checking push token status:", e);
      } finally {
        setCheckingPush(false);
      }
    };
    checkPushToken();
  }, [user]);

  const handleTogglePush = async () => {
    if (!user) return;
    setCheckingPush(true);
    try {
      if (pushEnabled) {
        await disablePushNotifications(user.uid);
        setPushEnabled(false);
      } else {
        const token = await requestPushNotificationPermission(user.uid);
        if (token) {
          setPushEnabled(true);
        } else {
          showToast?.(
            userInfo.language === 'tr' 
              ? "Bildirim izni reddedildi veya tarayıcınız tarafından desteklenmiyor." 
              : "Notification permission denied or is not supported by your browser.", 
            'error'
          );
        }
      }
    } catch (err) {
      console.error("Error toggling push status:", err);
      showToast?.(
        userInfo.language === 'tr' ? "İşlem sırasında bir hata oluştu." : "An error occurred during the request.", 
        'error'
      );
    } finally {
      setCheckingPush(false);
    }
  };

  // Profile edit state
  const [editName, setEditName] = useState(userInfo.name);
  const [editDob, setEditDob] = useState(userInfo.dob);
  const [editBirthplace, setEditBirthplace] = useState(userInfo.birthplace);
  const [editRelationship, setEditRelationship] = useState(userInfo.relationship);

  useEffect(() => {
    setEditName(userInfo.name);
    setEditDob(userInfo.dob);
    setEditBirthplace(userInfo.birthplace);
    setEditRelationship(userInfo.relationship);
  }, [userInfo.name, userInfo.dob, userInfo.birthplace, userInfo.relationship]);

  // Settings state
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const input = e.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const upperVal = convertToLocaleUppercase(input.value, userInfo.language as any);
    
    setter(upperVal);
    
    requestAnimationFrame(() => {
      if (input) {
        input.setSelectionRange(start, end);
      }
    });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeletingAccount(true);
    setSettingsStatus(null);
    try {
      // 1. Check if user's session is fresh (re-authentication check)
      const lastSignInTime = user.metadata.lastSignInTime;
      const isFresh = lastSignInTime && (Date.now() - new Date(lastSignInTime).getTime() < 5 * 60 * 1000);
      if (!isFresh) {
        const error = new Error("Requires recent login");
        (error as any).code = "auth/requires-recent-login";
        throw error;
      }

      // 2. Perform ALL Firestore deletions in a single atomic batch
      const batch = writeBatch(db);

      // A. Delete user document from 'users'
      const userRef = doc(db, 'users', user.uid);
      batch.delete(userRef);

      // B. Delete user moons from 'user_moons'
      const moonsRef = doc(db, 'user_moons', user.uid);
      batch.delete(moonsRef);

      // C. Delete transactions from 'moon_transactions' where userId == uid
      const q = query(collection(db, 'moon_transactions'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // D. Also delete phone mapping if exists
      if (user.phoneNumber) {
        const phoneRef = doc(db, 'phones', user.phoneNumber);
        batch.delete(phoneRef);
      }

      // Execute batch commit atomically
      await batch.commit();

      // 3. Delete User from Firebase Auth
      await user.delete();

      // 4. Trigger close
      onClose();
    } catch (error: any) {
      console.error("Account deletion error:", error);
      if (error.code === 'auth/requires-recent-login') {
        const reauthMsg = translations?.profile?.settings?.reauthRequired || (userInfo.language === 'tr' ? "Lütfen tekrar giriş yapın." : "Please login again.");
        setSettingsStatus({ type: 'error', message: reauthMsg });
      } else {
        setSettingsStatus({ type: 'error', message: error.message });
      }
      setShowDeleteConfirm(false);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'moon_transactions'),
          where('userId', '==', user.uid),
          where('type', '==', 'spend'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const txItems = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch user reflections to merge customTitle and reflectionNotes
        const reflectionsQuery = query(
          collection(db, 'user_reflections'),
          where('userId', '==', user.uid)
        );
        const reflectionsSnapshot = await getDocs(reflectionsQuery);
        const reflectionsMap: Record<string, any> = {};
        reflectionsSnapshot.forEach(docSnap => {
          reflectionsMap[docSnap.id] = docSnap.data();
        });

        // Merge reflections data
        const items = txItems.map(item => {
          const refl = reflectionsMap[item.id] || {};
          return {
            ...item,
            customTitle: refl.customTitle || '',
            reflectionNotes: refl.reflectionNotes || ''
          };
        });

        setHistory(items);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    const fetchPurchases = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'moon_transactions'),
          where('userId', '==', user.uid),
          where('type', 'in', ['buy', 'bonus', 'refund']),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as any))
          .filter(item => {
            if (item.type === 'buy' || item.type === 'refund') return true;
            const desc = item.description || '';
            return desc.includes('İade') || desc.includes('Refund') || desc.includes('adjustment');
          })
          .slice(0, 10);
        setPurchases(items);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setIsLoadingPurchases(false);
      }
    };

    const fetchFeedbacks = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'ai_feedback'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fbMap: Record<string, { rating: number; comment?: string }> = {};
        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          fbMap[data.transactionId] = {
            rating: data.rating,
            comment: data.comment
          };
        });
        setFeedbacks(fbMap);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      }
    };

    fetchHistory();
    fetchPurchases();
    fetchFeedbacks();
  }, [user]);

  useEffect(() => {
    if (expandedReadingId) {
      const item = history.find(h => h.id === expandedReadingId);
      if (item) {
        setEditTitle(item.customTitle || translateDescription(item.description));
        setEditNotes(item.reflectionNotes || '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedReadingId]);

  const handleUpdatePassword = async () => {
    if (!user || !newPassword) return;
    setIsUpdating(true);
    setSettingsStatus(null);
    try {
      await updatePassword(user, newPassword);
      
      // Update password in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        password: newPassword,
        updatedAt: Timestamp.now()
      });

      setNewPassword('');
      setSettingsStatus({ type: 'success', message: profileT.settings.successPassword });
    } catch (error: any) {
      const errorCode = error.code || (error.message?.includes('auth/') ? error.message.match(/auth\/[a-z-]+/)?.[0] : null);
      
      if (errorCode === 'auth/requires-recent-login') {
        setSettingsStatus({ type: 'error', message: profileT.settings.reauthRequired });
      } else if (errorCode === 'auth/weak-password') {
        setSettingsStatus({ type: 'error', message: userInfo.language === 'tr' ? "Şifre çok zayıf (en az 6 karakter olmalı)." : "Password is too weak." });
      } else {
        setSettingsStatus({ type: 'error', message: error.message });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdating(true);
    setSettingsStatus(null);
    try {
      const metadata = await gatherUserMetadata();
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: editName,
        dob: editDob,
        birthplace: editBirthplace,
        relationship: editRelationship,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        deviceInfo: `${metadata.device} (${metadata.os})`,
        appVersion: '1.0.0',
        updatedAt: Timestamp.now()
      });
      onUpdateUserInfo({ ...userInfo, name: editName, dob: editDob, birthplace: editBirthplace, relationship: editRelationship });
      setSettingsStatus({ 
        type: 'success', 
        message: userInfo.language === 'tr' ? "Profil başarıyla güncellendi." : "Profile updated successfully." 
      });
    } catch (error: any) {
      setSettingsStatus({ type: 'error', message: error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubmitFeedback = async (transactionId: string) => {
    if (!user || activeRating === 0) return;
    setIsSubmittingFeedback(true);
    try {
      const feedbackRef = doc(db, 'ai_feedback', transactionId);
      await setDoc(feedbackRef, {
        transactionId,
        userId: user.uid,
        rating: activeRating,
        comment: feedbackComment || null,
        createdAt: serverTimestamp()
      });
      setFeedbacks(prev => ({
        ...prev,
        [transactionId]: { rating: activeRating, comment: feedbackComment || undefined }
      }));
      showToast?.(
        userInfo.language === 'tr' ? "Geri bildiriminiz başarıyla iletildi." : "Feedback submitted successfully.",
        'success'
      );
    } catch (err) {
      console.error("Error saving feedback:", err);
      showToast?.(
        userInfo.language === 'tr' ? "Geri bildirim gönderilemedi." : "Failed to submit feedback.",
        'error'
      );
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleToggleFavorite = async (itemId: string, currentVal: boolean) => {
    try {
      await updateDoc(doc(db, 'moon_transactions', itemId), {
        isFavorite: !currentVal
      });
      setHistory(prev => prev.map(item => item.id === itemId ? { ...item, isFavorite: !currentVal } : item));
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handleSaveNotes = async (itemId: string, title: string, notes: string) => {
    setIsSavingNotes(true);
    try {
      await setDoc(doc(db, 'user_reflections', itemId), {
        userId: user.uid,
        customTitle: title,
        reflectionNotes: notes,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setHistory(prev => prev.map(item => item.id === itemId ? { ...item, customTitle: title, reflectionNotes: notes } : item));
      const successMsg = translations?.profileDiary?.saveSuccess || "Reading updated successfully!";
      setNotesStatus({ type: 'success', message: successMsg });
      showToast?.(successMsg, 'success');
      setTimeout(() => setNotesStatus(null), 3000);
    } catch (err) {
      console.error("Error saving notes:", err);
      const errorMsg = translations?.profileDiary?.saveError || "Failed to update reading.";
      setNotesStatus({ type: 'error', message: errorMsg });
      showToast?.(errorMsg, 'error');
      setTimeout(() => setNotesStatus(null), 3000);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const getMysticRank = (count: number) => {
    const ranks = profileT.rankNames || {
      novice: "Novice",
      apprentice: "Apprentice",
      traveler: "Traveler",
      sage: "Sage",
      lord: "Lord"
    };
    if (count >= 100) return ranks.lord;
    if (count >= 50) return ranks.sage;
    if (count >= 25) return ranks.traveler;
    if (count >= 10) return ranks.apprentice;
    return ranks.novice;
  };

  const profileT = {
    title: translations?.profile?.title || "Profile",
    userInfo: translations?.profile?.userInfo || "User Information",
    readingHistory: translations?.profile?.readingHistory || "Past Readings",
    noHistory: translations?.profile?.noHistory || "No readings yet.",
    moons: translations?.profile?.moons || "Mystic Balance",
    status: translations?.profile?.status || "Relationship Status",
    birthplace: translations?.profile?.birthplace || "Birthplace",
    dob: translations?.profile?.dob || "Date of Birth",
    name: translations?.profile?.name || "Full Name",
    readingCount: translations?.profile?.readingCount || "Readings",
    mysticRank: translations?.profile?.mysticRank || "Mystic Rank",
    save: translations?.profile?.save || "Save",
    purchaseHistory: translations?.profile?.purchaseHistory || (userInfo.language === 'tr' ? "Satın Alım Geçmişi" : "Purchase History"),
    noPurchases: translations?.profile?.noPurchases || (userInfo.language === 'tr' ? "Henüz satın alım yapılmadı." : "No purchases yet."),
    receipt: translations?.profile?.receipt || (userInfo.language === 'tr' ? "Makbuz" : "Receipt"),
    notificationSettings: translations?.profile?.notificationSettings || (userInfo.language === 'tr' ? "Bildirim Ayarları" : "Notification Settings"),
    webPushNotifications: translations?.profile?.webPushNotifications || (userInfo.language === 'tr' ? "Web Push Bildirimleri" : "Web Push Notifications"),
    webPushDesc: translations?.profile?.webPushDesc || (userInfo.language === 'tr' ? "Kredileriniz yenilendiğinde ve falınız hazır olduğunda anında bildirim alın." : "Get instant notifications when your credits are renewed or when your reading is ready."),
    enabled: translations?.profile?.enabled || (userInfo.language === 'tr' ? "Açık" : "Enabled"),
    disabled: translations?.profile?.disabled || (userInfo.language === 'tr' ? "Kapalı" : "Disabled"),
    appIntroWizard: translations?.profile?.appIntroWizard || (userInfo.language === 'tr' ? "Tanıtım Sihirbazı" : "App Intro Wizard"),
    watchAppIntro: translations?.profile?.watchAppIntro || (userInfo.language === 'tr' ? "Tanıtım Sihirbazını İzle" : "Watch App Intro"),
    appIntroDesc: translations?.profile?.appIntroDesc || (userInfo.language === 'tr' ? "Uygulamanın özelliklerini ve nasıl çalıştığını gösteren tanıtım sihirbazını yeniden başlatın." : "Restart the onboarding wizard that shows how the application features work."),
    startIntro: translations?.profile?.startIntro || (userInfo.language === 'tr' ? "Tanıtımı Başlat" : "Start Intro"),
    accountManagement: translations?.profile?.accountManagement || (userInfo.language === 'tr' ? "Hesap Yönetimi" : "Account Management"),
    rankNames: {
      novice: translations?.profile?.rankNames?.novice || "Novice",
      apprentice: translations?.profile?.rankNames?.apprentice || "Apprentice",
      traveler: translations?.profile?.rankNames?.traveler || "Traveler",
      sage: translations?.profile?.rankNames?.sage || "Sage",
      lord: translations?.profile?.rankNames?.lord || "Lord"
    },
    tabs: { 
      overview: translations?.profile?.tabs?.overview || "Overview", 
      settings: translations?.profile?.tabs?.settings || "Settings" 
    },
    settings: {
      password: translations?.profile?.settings?.password || "Password",
      newPassword: translations?.profile?.settings?.newPassword || "New Password",
      updatePassword: translations?.profile?.settings?.updatePassword || "Change",
      successPassword: translations?.profile?.settings?.successPassword || "Changed",
      reauthRequired: translations?.profile?.settings?.reauthRequired || "Please login again",
      deleteAccount: translations?.profile?.deleteAccount || (userInfo.language === 'tr' ? "Hesabımı Sil" : "Delete Account"),
      deleteAccountDesc: translations?.profile?.deleteAccountDesc || (userInfo.language === 'tr' ? "Hesabınızı silmek tüm bakiyenizi, fal geçmişinizi ve kişisel verilerinizi kalıcı olarak temizler." : "Deleting your account permanently wipes your balance, history, and personal data."),
      deleteConfirmMessage: translations?.profile?.deleteConfirmMessage || (userInfo.language === 'tr' 
        ? "Hesabınızı ve tüm verilerinizi (bakiyeniz ve fal geçmişiniz dahil) kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!" 
        : "Are you sure you want to permanently delete your account and all associated data (including your balance and reading history)? This action cannot be undone!"),
      deleteConfirmBtn: translations?.profile?.deleteConfirmBtn || (userInfo.language === 'tr' ? "Evet, Hesabımı Sil" : "Yes, Delete My Account"),
      cancelBtn: translations?.profile?.cancelBtn || (userInfo.language === 'tr' ? "Vazgeç" : "Cancel")
    },
    history: {
      downloadPdf: translations?.profile?.history?.downloadPdf || "Download PDF",
      viewReading: translations?.profile?.history?.viewReading || "View",
      pdfLocked: translations?.profile?.history?.pdfLocked || (userInfo.language === 'tr' ? "PDF indirme özelliği premium fallara özeldir. Mağazadan bakiye yükleyerek bu özelliği etkinleştirebilirsiniz!" : "PDF download is exclusive to premium readings. Buy Moons in the store to unlock!"),
      evalTitle: translations?.profile?.history?.evalTitle || (userInfo.language === 'tr' ? "Mistik Falınızı Değerlendirin" : "Evaluate Your Mystical Reading")
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/30 overflow-hidden shadow-[0_0_50px_rgba(236,216,166,0.1)] relative max-h-[90vh] flex flex-col"
      >
        <div className="absolute top-4 right-4 z-20">
          <button onClick={onClose} className="p-2 bg-black/50 hover:bg-[#ecd8a6]/10 rounded-full text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header */}
        <div className="p-8 text-center border-b border-[#ecd8a6]/10 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ecd8a6]/10 to-transparent" />
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#ecd8a6]/10 border border-[#ecd8a6]/30 flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-[#ecd8a6]" />
            </div>
            <h2 className="text-2xl font-serif text-[#ecd8a6] tracking-widest uppercase">{profileT.title}</h2>
            
            <div className="mt-4 flex items-center justify-center gap-1 p-1 bg-[#1a1025] rounded-full border border-[#ecd8a6]/10 w-fit mx-auto">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-serif tracking-widest uppercase transition-all ${activeTab === 'overview' ? 'bg-[#ecd8a6] text-[#0a0512]' : 'text-[#ecd8a6]/60 hover:text-[#ecd8a6]'}`}
              >
                {profileT.tabs.overview}
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-serif tracking-widest uppercase transition-all ${activeTab === 'settings' ? 'bg-[#ecd8a6] text-[#0a0512]' : 'text-[#ecd8a6]/60 hover:text-[#ecd8a6]'}`}
              >
                {profileT.tabs.settings}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                {/* User Info Grid */}
                <section>
                  <h3 className="text-xs font-serif tracking-[0.2em] text-[#ecd8a6]/50 uppercase mb-6 flex items-center gap-2">
                    <UserIcon className="w-3 h-3" />
                    {profileT.userInfo}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[10px] font-serif tracking-widest text-[#ecd8a6]/40 uppercase">
                        <UserIcon className="w-4 h-4" />
                        {profileT.name}
                      </div>
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => handleInputChange(e, setEditName)}
                        className="bg-transparent border-b border-[#ecd8a6]/10 text-[#ecd8a6] font-medium focus:border-[#ecd8a6]/40 outline-none pb-1"
                        placeholder="Ad Soyad"
                      />
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[10px] font-serif tracking-widest text-[#ecd8a6]/40 uppercase">
                        <Calendar className="w-4 h-4" />
                        {profileT.dob}
                      </div>
                      <input 
                        type="date" 
                        value={editDob}
                        onChange={(e) => setEditDob(e.target.value)}
                        className="bg-transparent border-b border-[#ecd8a6]/10 text-[#ecd8a6] font-medium focus:border-[#ecd8a6]/40 outline-none pb-1 [color-scheme:dark]"
                      />
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[10px] font-serif tracking-widest text-[#ecd8a6]/40 uppercase">
                        <MapPin className="w-4 h-4" />
                        {profileT.birthplace}
                      </div>
                      <input 
                        type="text" 
                        value={editBirthplace}
                        onChange={(e) => handleInputChange(e, setEditBirthplace)}
                        className="bg-transparent border-b border-[#ecd8a6]/10 text-[#ecd8a6] font-medium focus:border-[#ecd8a6]/40 outline-none pb-1"
                        placeholder={profileT.birthplace}
                      />
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[10px] font-serif tracking-widest text-[#ecd8a6]/40 uppercase">
                        <Heart className="w-4 h-4" />
                        {profileT.status}
                      </div>
                      <select 
                        value={editRelationship}
                        onChange={(e) => setEditRelationship(e.target.value)}
                        className="bg-transparent border-b border-[#ecd8a6]/10 text-[#ecd8a6] font-medium focus:border-[#ecd8a6]/40 outline-none pb-1 appearance-none"
                      >
                        {translations?.statusOptions && Object.keys(translations.statusOptions).map(key => (
                          <option key={key} value={key} className="bg-[#0a0512]">
                            {translations.statusOptions[key]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <InfoCard icon={<History className="w-4 h-4" />} label={profileT.readingCount} value={readingCount.toString()} />
                    <InfoCard icon={<Star className="w-4 h-4" />} label={profileT.mysticRank} value={getMysticRank(readingCount)} />
                  </div>
                  {(editName !== userInfo.name || editDob !== userInfo.dob || editBirthplace !== userInfo.birthplace || editRelationship !== userInfo.relationship) && (
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={handleUpdateProfile}
                        disabled={isUpdating}
                        className="px-6 py-2 bg-[#ecd8a6] text-[#0a0512] rounded-lg text-[10px] font-serif tracking-widest uppercase hover:bg-white transition-all flex items-center gap-2"
                      >
                        {isUpdating && <Loader2 className="w-3 h-3 animate-spin" />}
                        {profileT.save || 'Kaydet'}
                      </button>
                    </div>
                  )}
                </section>

                {/* Reading History */}
                <section>
                  <h3 className="text-xs font-serif tracking-[0.2em] text-[#ecd8a6]/50 uppercase mb-6 flex items-center gap-2">
                    <History className="w-3 h-3" />
                    {profileT.readingHistory}
                  </h3>
                  
                  {isLoadingHistory ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 text-[#ecd8a6]/30 animate-spin" />
                    </div>
                  ) : history.length > 0 ? (
                    <div className="space-y-3">
                      {history.map((item) => {
                        const isExpanded = expandedReadingId === item.id;
                        const isFav = !!item.isFavorite;
                        return (
                          <div key={item.id} className="rounded-xl bg-white/5 border border-[#ecd8a6]/10 overflow-hidden transition-all duration-300">
                            {/* Row Header */}
                            <div 
                              className="flex items-center justify-between p-4 hover:bg-[#ecd8a6]/5 transition-colors cursor-pointer select-none" 
                              onClick={() => setExpandedReadingId(isExpanded ? null : item.id)}
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                {/* Favorite Star Button */}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(item.id, isFav);
                                  }}
                                  className="p-1 text-[#ecd8a6] hover:scale-110 transition-transform flex-shrink-0"
                                >
                                  <Star className={`w-5 h-5 ${isFav ? 'fill-[#ecd8a6] text-[#ecd8a6]' : 'text-[#ecd8a6]/40'}`} />
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="text-[#ecd8a6] text-sm font-medium flex items-center gap-1.5 min-w-0">
                                    <span className="truncate">{item.customTitle || translateDescription(item.description)}</span>
                                    {(userInfo.isPremium || item.deductedFrom === 'purchased') && (
                                      <span title={userInfo.language === 'tr' ? "Premium Açılım" : "Premium Reading"} className="flex-shrink-0 flex items-center">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400/20 animate-pulse" />
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-[#ecd8a6]/40 flex items-center gap-1 mt-1">
                                    <CalendarDays className="w-3 h-3" />
                                    {item.createdAt?.toDate().toLocaleDateString()}
                                    {item.cached && (
                                      <span className="ml-2 px-1.5 py-0.5 bg-purple-950/40 border border-[#ecd8a6]/20 rounded text-[9px] text-[#ecd8a6]/60">
                                        {userInfo.language === 'tr' ? 'Önbellek' : 'Cached'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {item.status === 'failed' && (
                                  <span className="flex items-center gap-1 text-[9px] sm:text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-lg font-sans font-semibold tracking-wide uppercase mr-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {userInfo.language === 'tr' ? "Sistem Hatası" : "System Error"}
                                  </span>
                                )}
                                {(item.status === 'success' || item.status === 'cached' || item.readingText) && (
                                  (userInfo.isPremium || item.deductedFrom === 'purchased') ? (
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDownloadPastReading?.(item);
                                      }}
                                      className="p-2 bg-[#ecd8a6]/10 hover:bg-[#ecd8a6]/20 rounded-lg text-[#ecd8a6] transition-all"
                                      title={profileT.history.downloadPdf}
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (showToast) {
                                          showToast(profileT.history.pdfLocked, 'info');
                                        }
                                      }}
                                      className="p-2 bg-black/40 hover:bg-black/60 rounded-lg text-[#ecd8a6]/30 transition-all cursor-not-allowed flex items-center justify-center relative group"
                                      title={profileT.history.pdfLocked}
                                    >
                                      <Download className="w-4 h-4 opacity-40" />
                                      <Lock className="w-2.5 h-2.5 text-amber-400 absolute bottom-0.5 right-0.5 bg-[#0a0512] rounded-full p-[0.5px]" />
                                    </button>
                                  )
                                )}
                                <ChevronRight className={`w-4 h-4 text-[#ecd8a6]/20 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-[#ecd8a6]/60' : ''}`} />
                              </div>
                            </div>

                            {/* Expanded Accordion Panel */}
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="border-t border-[#ecd8a6]/10 bg-black/40 overflow-hidden"
                                >
                                  <div className="p-4 sm:p-6 space-y-6">
                                    {/* Form Status Notification */}
                                    {notesStatus && expandedReadingId === item.id && (
                                      <div className={`p-3 rounded-lg flex items-center gap-2 text-xs border ${
                                        notesStatus.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                      }`}>
                                        <Sparkles className="w-4 h-4 animate-pulse" />
                                        <span>{notesStatus.message}</span>
                                      </div>
                                    )}

                                    {/* System Error message display if status is failed */}
                                    {item.status === 'failed' && (
                                      <div className="space-y-2">
                                        <div className="text-xs text-[#ecd8a6]/80 leading-relaxed font-sans bg-black/20 p-4 rounded-xl border border-rose-500/5 max-h-60 overflow-y-auto whitespace-pre-wrap">
                                          <span className="text-rose-400/80 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            {userInfo.language === 'tr' 
                                              ? "Bu açılım bir sistem hatası nedeniyle tamamlanamadı. Harcanan krediniz iade edilmiştir." 
                                              : "This reading could not be completed due to a system error. Your moon balance has been refunded."}
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    {/* Tarot Feedback Module */}
                                    {((item.status === 'success' || item.status === 'cached' || item.readingText) && item.status !== 'failed') && (
                                      <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10">
                                        <h4 className="text-[10px] font-serif tracking-widest text-[#ecd8a6]/60 uppercase">
                                          {profileT.history.evalTitle}
                                        </h4>
                                        {feedbacks[item.id] ? (
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-1">
                                              {[1, 2, 3, 4, 5].map((star) => (
                                                <Star 
                                                  key={star} 
                                                  className={`w-5 h-5 ${star <= feedbacks[item.id].rating ? 'fill-[#ecd8a6] text-[#ecd8a6]' : 'text-[#ecd8a6]/20'}`} 
                                                />
                                              ))}
                                            </div>
                                            {feedbacks[item.id].comment && (
                                              <p className="text-xs text-[#ecd8a6]/85 italic font-sans bg-[#0a0512]/40 p-2.5 rounded-lg border border-[#ecd8a6]/5">
                                                "{feedbacks[item.id].comment}"
                                              </p>
                                            )}
                                          </div>
                                        ) : (
                                          <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                              {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                  key={star}
                                                  type="button"
                                                  onClick={() => setActiveRating(star)}
                                                  onMouseEnter={() => setHoverRating(star)}
                                                  onMouseLeave={() => setHoverRating(0)}
                                                  className="p-1 hover:scale-110 transition-transform text-[#ecd8a6]"
                                                >
                                                  <Star 
                                                    className={`w-6 h-6 transition-all ${star <= (hoverRating || activeRating) ? 'fill-[#ecd8a6] text-[#ecd8a6]' : 'text-[#ecd8a6]/30'}`} 
                                                  />
                                                </button>
                                              ))}
                                              {activeRating > 0 && (
                                                <span className="text-xs text-[#ecd8a6]/60">
                                                  {activeRating} / 5
                                                </span>
                                              )}
                                            </div>
                                            {activeRating > 0 && (
                                              <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="space-y-2"
                                              >
                                                <textarea
                                                  value={feedbackComment}
                                                  onChange={(e) => setFeedbackComment(e.target.value)}
                                                  className="w-full h-16 bg-[#1a1025] border border-[#ecd8a6]/20 rounded-lg px-3 py-2 text-xs text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/40 font-sans resize-none"
                                                  placeholder={userInfo.language === 'tr' ? "Yorumunuz (isteğe bağlı)..." : "Your comment (optional)..."}
                                                  maxLength={1000}
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => handleSubmitFeedback(item.id)}
                                                  disabled={isSubmittingFeedback}
                                                  className="px-4 py-1.5 bg-[#ecd8a6]/25 hover:bg-[#ecd8a6] text-[#ecd8a6] hover:text-[#0a0512] rounded text-[10px] font-serif uppercase tracking-wider transition-all font-bold"
                                                >
                                                  {isSubmittingFeedback ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                  ) : (
                                                    userInfo.language === 'tr' ? "Gönder" : "Submit"
                                                  )}
                                                </button>
                                              </motion.div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {(userInfo.isPremium || item.deductedFrom === 'purchased') ? (
                                      <>
                                        {/* Edit Custom Title Form */}
                                        <div className="space-y-2">
                                          <label className="text-[10px] font-serif tracking-widest text-[#ecd8a6]/40 uppercase block">
                                            {translations?.profileDiary?.customTitleLabel || "Custom Title"}
                                          </label>
                                          <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="w-full bg-[#1a1025] border border-[#ecd8a6]/25 rounded-xl px-4 py-2.5 text-[#ecd8a6] text-xs focus:outline-none focus:border-[#ecd8a6]/60 transition-all font-serif"
                                            placeholder={translateDescription(item.description)}
                                          />
                                        </div>

                                        {/* Reflection / Manifestation Notes */}
                                        <div className="space-y-2">
                                          <label className="text-[10px] font-serif tracking-widest text-[#ecd8a6]/40 uppercase block">
                                            {translations?.profileDiary?.reflectionTitle || "Reflection & Manifestation Notes"}
                                          </label>
                                          <textarea
                                            value={editNotes}
                                            onChange={(e) => setEditNotes(e.target.value)}
                                            className="w-full h-24 bg-[#1a1025] border border-[#ecd8a6]/25 rounded-xl px-4 py-2.5 text-[#ecd8a6] text-xs focus:outline-none focus:border-[#ecd8a6]/60 transition-all font-sans resize-none"
                                            placeholder={translations?.profileDiary?.reflectionPlaceholder || "Record notes..."}
                                          />
                                        </div>

                                        {/* Save Button */}
                                        <div className="flex justify-end pt-2">
                                          <button
                                            onClick={() => handleSaveNotes(item.id, editTitle, editNotes)}
                                            disabled={isSavingNotes}
                                            className="px-5 py-2 bg-[#ecd8a6] text-[#0a0512] rounded-lg text-[10px] font-serif tracking-widest uppercase hover:bg-white transition-all font-bold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            {isSavingNotes && <Loader2 className="w-3 h-3 animate-spin" />}
                                            {translations?.profileDiary?.saveBtn || "Save Notes"}
                                          </button>
                                        </div>
                                      </>
                                    ) : (
                                      /* Glassmorphic Locked Card (MS-295) */
                                      <div className="relative overflow-hidden p-6 rounded-2xl bg-purple-950/20 border border-[#ecd8a6]/10 backdrop-blur-md flex flex-col items-center text-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#0a0512] border border-[#ecd8a6]/20 flex items-center justify-center text-[#ecd8a6]/70">
                                          <Lock className="w-4 h-4 text-amber-400" />
                                        </div>
                                        <div>
                                          <h4 className="text-xs font-serif text-[#ecd8a6] tracking-widest uppercase mb-1">
                                            {translations?.profileDiary?.lockedTitle || (userInfo.language === 'tr' ? "Mistik Günlük Kilidi" : "Mystical Diary Locked")}
                                          </h4>
                                          <p className="text-[10px] leading-relaxed text-[#ecd8a6]/60 max-w-xs mx-auto">
                                            {translations?.profileDiary?.lockedDesc || (userInfo.language === 'tr' ? "Özel başlık ve yansıma notu ekleme özellikleri sadece premium (satın alınan) fallara özeldir. Mağazadan bakiye yükleyerek kehanet günlüğünüzün kilidini açabilirsiniz!" : "Adding custom titles and reflection notes is exclusive to premium readings. Buy Moons in the store to unlock your mystical diary!")}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 rounded-2xl border border-dashed border-[#ecd8a6]/10 bg-[#ecd8a6]/5">
                      <p className="text-xs text-[#ecd8a6]/40 font-serif tracking-widest uppercase">{profileT.noHistory}</p>
                    </div>
                  )}
                </section>

                {/* Purchase History */}
                <section>
                  <h3 className="text-xs font-serif tracking-[0.2em] text-[#ecd8a6]/50 uppercase mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {profileT.purchaseHistory}
                  </h3>
                  
                  {isLoadingPurchases ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 text-[#ecd8a6]/30 animate-spin" />
                    </div>
                  ) : purchases.length > 0 ? (
                    <div className="space-y-3">
                      {purchases.map((item) => {
                        const isRefund = item.type === 'refund' || (item.type === 'bonus' && (item.description?.includes('İade') || item.description?.includes('Refund')));
                        return (
                          <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10 hover:bg-[#ecd8a6]/5 transition-colors group">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-lg bg-[#0a0512] border flex items-center justify-center ${isRefund ? 'border-green-500/30' : 'border-[#ecd8a6]/20'}`}>
                                {isRefund ? (
                                  <RotateCcw className="w-5 h-5 text-green-400/80" />
                                ) : (
                                  <ShoppingBag className="w-5 h-5 text-[#ecd8a6]/60" />
                                )}
                              </div>
                              <div>
                                <div className="text-[#ecd8a6] text-sm font-medium">{translateDescription(item.description)}</div>
                                <div className="text-[10px] text-[#ecd8a6]/40 flex items-center gap-1 mt-1">
                                  <CalendarDays className="w-3 h-3" />
                                  {item.createdAt?.toDate().toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 font-serif">
                              {isRefund && (
                                <span className="text-[10px] bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full font-sans font-semibold tracking-wide uppercase mr-2">
                                  {item.amount !== undefined ? (item.amount > 0 ? `+${item.amount}` : item.amount) : '+1'} {userInfo.language === 'tr' ? "İade" : (userInfo.language === 'es' ? "Reembolso" : (userInfo.language === 'fr' ? "Remboursement" : (userInfo.language === 'ko' ? "환불" : (userInfo.language === 'zh' ? "退款" : "Refund"))))}
                                </span>
                              )}
                              {(item.stripeReceiptUrl || (item.idempotencyKey && item.idempotencyKey.startsWith('cs_'))) && (
                                <a 
                                  href={item.stripeReceiptUrl && item.stripeReceiptUrl !== 'https://stripe.com/mock-receipt' 
                                    ? item.stripeReceiptUrl 
                                    : `/api/payments/receipt/${item.idempotencyKey}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-[#ecd8a6]/10 hover:bg-[#ecd8a6]/20 rounded-lg text-[#ecd8a6] text-xs font-serif tracking-wider uppercase transition-all font-semibold"
                                >
                                  {profileT.receipt}
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 rounded-2xl border border-dashed border-[#ecd8a6]/10 bg-[#ecd8a6]/5">
                      <p className="text-xs text-[#ecd8a6]/40 font-serif tracking-widest uppercase">
                        {profileT.noPurchases}
                      </p>
                    </div>
                  )}
                </section>
              </motion.div>
            ) : (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                {settingsStatus && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 border shadow-lg ${
                    settingsStatus.type === 'success' 
                      ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    {settingsStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-xs font-medium">{settingsStatus.message}</span>
                  </div>
                )}

                <section className="space-y-4">
                  <h3 className="text-xs font-serif tracking-[0.2em] text-[#ecd8a6]/50 uppercase mb-2 flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    {profileT.settings.password}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                    <div className="flex-1 relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={profileT.settings.newPassword}
                        className="w-full h-full bg-[#1a1025] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 pr-10 text-[#ecd8a6] text-sm focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-serif min-w-0"
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ecd8a6]/40 hover:text-[#ecd8a6]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button 
                      onClick={handleUpdatePassword}
                      disabled={isUpdating || !newPassword}
                      className="sm:w-40 whitespace-nowrap px-6 py-3 bg-[#ecd8a6] text-[#0a0512] rounded-xl text-[10px] font-serif tracking-widest uppercase hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center font-bold"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : profileT.settings.updatePassword}
                    </button>
                  </div>
                </section>

                <hr className="border-[#ecd8a6]/10 my-6" />

                {/* Web Push Notification Settings */}
                <section className="space-y-4">
                  <h3 className="text-xs font-serif tracking-[0.2em] text-[#ecd8a6]/50 uppercase mb-2 flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5" />
                    {profileT.notificationSettings}
                  </h3>
                  <div className="p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10 flex justify-between items-center gap-4">
                    <div>
                      <h4 className="text-sm font-serif font-bold text-[#ecd8a6]">
                        {profileT.webPushNotifications}
                      </h4>
                      <p className="text-xs text-[#ecd8a6]/50 mt-1 leading-relaxed">
                        {profileT.webPushDesc}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {checkingPush && <Loader2 className="w-4 h-4 text-[#ecd8a6] animate-spin" />}
                      <span className={`text-[10px] font-sans font-medium tracking-wider uppercase transition-colors duration-300 ${
                        pushEnabled ? 'text-emerald-400' : 'text-[#ecd8a6]/40'
                      }`}>
                        {pushEnabled ? profileT.enabled : profileT.disabled}
                      </span>
                      <button
                        onClick={handleTogglePush}
                        disabled={checkingPush}
                        type="button"
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                          pushEnabled ? 'bg-emerald-500 border border-emerald-400/20' : 'bg-white/10 border border-[#ecd8a6]/20'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-[#0a0512] transition-transform duration-300 ${
                            pushEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </section>

                <hr className="border-[#ecd8a6]/10 my-6" />

                {/* Onboarding Intro Replay Settings (MS-257) */}
                {onShowOnboarding && (
                  <section className="space-y-4">
                    <h3 className="text-xs font-serif tracking-[0.2em] text-[#ecd8a6]/50 uppercase mb-2 flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {profileT.appIntroWizard}
                    </h3>
                    <div className="p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="text-sm font-serif font-bold text-[#ecd8a6]">
                          {profileT.watchAppIntro}
                        </h4>
                        <p className="text-xs text-[#ecd8a6]/50 mt-1 leading-relaxed">
                          {profileT.appIntroDesc}
                        </p>
                      </div>
                      <button
                        onClick={onShowOnboarding}
                        type="button"
                        className="px-5 py-2.5 bg-[#ecd8a6]/10 hover:bg-[#ecd8a6] text-[#ecd8a6] hover:text-[#0a0512] rounded-xl text-[10px] font-serif tracking-widest uppercase transition-all duration-300 border border-[#ecd8a6]/20 active:scale-95 font-bold"
                      >
                        {profileT.startIntro}
                      </button>
                    </div>
                  </section>
                )}

                <hr className="border-[#ecd8a6]/10 my-6" />

                <section className="space-y-4">
                  <h3 className="text-xs font-serif tracking-[0.2em] text-[#ecd8a6]/50 uppercase mb-2 flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5" />
                    {profileT.accountManagement}
                  </h3>
                  
                  {!showDeleteConfirm ? (
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="text-sm font-serif font-bold text-red-400">{profileT.settings.deleteAccount}</h4>
                        <p className="text-xs text-[#ecd8a6]/50 mt-1 leading-relaxed">
                          {profileT.settings.deleteAccountDesc}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-5 py-2.5 bg-red-950/30 text-red-400 hover:bg-red-500 hover:text-[#0a0512] rounded-xl text-[10px] font-serif tracking-widest uppercase transition-all duration-300 border border-red-500/20 active:scale-95 font-bold"
                      >
                        {profileT.settings.deleteAccount}
                      </button>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-xl bg-red-950/20 border border-red-500/30 space-y-4 shadow-lg shadow-red-950/10"
                    >
                      <p className="text-xs text-red-400/90 leading-relaxed font-sans font-medium">
                        {profileT.settings.deleteConfirmMessage}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={isDeletingAccount}
                          className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-serif tracking-widest uppercase transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isDeletingAccount ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                          {profileT.settings.deleteConfirmBtn}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isDeletingAccount}
                          className="px-5 py-2.5 bg-[#1a1025] hover:bg-white/5 text-[#ecd8a6]/70 hover:text-[#ecd8a6] rounded-xl text-[10px] font-serif tracking-widest uppercase transition-all border border-[#ecd8a6]/20 font-bold"
                        >
                          {profileT.settings.cancelBtn}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10 flex flex-col gap-2">
    <div className="flex items-center gap-2 text-[10px] font-serif tracking-widest text-[#ecd8a6]/40 uppercase">
      {icon}
      {label}
    </div>
    <div className="text-[#ecd8a6] font-medium truncate h-[26px] flex items-center">{value}</div>
  </div>
);
