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
  AlertCircle
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, getDoc, setDoc, orderBy, limit, Timestamp, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

interface ProfileProps {
  user: any;
  userInfo: {
    name: string;
    dob: string;
    birthplace: string;
    relationship: string;
    language: string;
  };
  moonsCount: number;
  readingCount: number;
  onClose: () => void;
  onUpdateUserInfo: (info: any) => void;
  translations: any;
  onDownloadPastReading?: (reading: any) => void;
  onShowOnboarding?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ 
  user, 
  userInfo, 
  moonsCount, 
  readingCount,
  onClose, 
  onUpdateUserInfo,
  translations,
  onDownloadPastReading,
  onShowOnboarding
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

  // Marketing consent state
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

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

  // Fetch marketing consents
  useEffect(() => {
    if (!user) return;
    const fetchConsents = async () => {
      try {
        const consentRef = doc(db, 'marketing_consents', user.uid);
        const consentSnap = await getDoc(consentRef);
        if (consentSnap.exists()) {
          const data = consentSnap.data();
          setEmailConsent(data.emailConsent || false);
          setSmsConsent(data.smsConsent || false);
          setSelectedInterests(data.interests || []);
        }
      } catch (error) {
        console.error("Error fetching marketing consents:", error);
      }
    };
    fetchConsents();
  }, [user]);

  const saveConsents = async (email: boolean, sms: boolean, interests: string[]) => {
    if (!user) return;
    try {
      const consentRef = doc(db, 'marketing_consents', user.uid);
      await setDoc(consentRef, {
        userId: user.uid,
        emailConsent: email,
        smsConsent: sms,
        interests,
        updatedAt: Timestamp.now()
      }, { merge: true });
    } catch (error) {
      console.error("Error saving marketing consents:", error);
    }
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
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
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
          where('type', '==', 'buy'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPurchases(items);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setIsLoadingPurchases(false);
      }
    };

    fetchHistory();
    fetchPurchases();
  }, [user]);

  useEffect(() => {
    if (expandedReadingId) {
      const item = history.find(h => h.id === expandedReadingId);
      if (item) {
        setEditTitle(item.customTitle || item.description);
        setEditNotes(item.reflectionNotes || '');
      }
    }
  }, [expandedReadingId, history]);

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
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: editName,
        dob: editDob,
        birthplace: editBirthplace,
        relationship: editRelationship,
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
    try {
      await updateDoc(doc(db, 'moon_transactions', itemId), {
        customTitle: title,
        reflectionNotes: notes
      });
      setHistory(prev => prev.map(item => item.id === itemId ? { ...item, customTitle: title, reflectionNotes: notes } : item));
      setNotesStatus({ type: 'success', message: translations?.profileDiary?.saveSuccess || "Reading updated successfully!" });
      setTimeout(() => setNotesStatus(null), 3000);
    } catch (err) {
      console.error("Error saving notes:", err);
      setNotesStatus({ type: 'error', message: translations?.profileDiary?.saveError || "Failed to update reading." });
      setTimeout(() => setNotesStatus(null), 3000);
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
      deleteAccount: userInfo.language === 'tr' ? "Hesabımı Sil" : "Delete Account",
      deleteConfirmMessage: userInfo.language === 'tr' 
        ? "Hesabınızı ve tüm verilerinizi (bakiyeniz ve fal geçmişiniz dahil) kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!" 
        : "Are you sure you want to permanently delete your account and all associated data (including your balance and reading history)? This action cannot be undone!",
      deleteConfirmBtn: userInfo.language === 'tr' ? "Evet, Hesabımı Sil" : "Yes, Delete My Account",
      cancelBtn: userInfo.language === 'tr' ? "Vazgeç" : "Cancel"
    },
    history: {
      downloadPdf: translations?.profile?.history?.downloadPdf || "Download PDF",
      viewReading: translations?.profile?.history?.viewReading || "View"
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
                        onChange={(e) => setEditName(e.target.value)}
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
                        onChange={(e) => setEditBirthplace(e.target.value)}
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
                                  <div className="text-[#ecd8a6] text-sm font-medium truncate">{item.customTitle || item.description}</div>
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
                                {item.readingText && (
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

                                    {/* Tarot Interpretation Reading Text */}
                                    <div className="space-y-2">
                                      <h4 className="text-[10px] font-serif tracking-widest text-[#ecd8a6]/40 uppercase">
                                        {translations?.profileDiary?.detailsTitle || "Reading Details"}
                                      </h4>
                                      <div className="text-xs text-[#ecd8a6]/80 leading-relaxed font-sans bg-black/20 p-4 rounded-xl border border-[#ecd8a6]/5 max-h-60 overflow-y-auto whitespace-pre-wrap">
                                        {item.readingText}
                                      </div>
                                    </div>

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
                                        placeholder={item.description}
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
                                        className="px-5 py-2 bg-[#ecd8a6] text-[#0a0512] rounded-lg text-[10px] font-serif tracking-widest uppercase hover:bg-white transition-all font-bold"
                                      >
                                        {translations?.profileDiary?.saveBtn || "Save Notes"}
                                      </button>
                                    </div>
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
                    {userInfo.language === 'tr' ? "Satın Alım Geçmişi" : "Purchase History"}
                  </h3>
                  
                  {isLoadingPurchases ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 text-[#ecd8a6]/30 animate-spin" />
                    </div>
                  ) : purchases.length > 0 ? (
                    <div className="space-y-3">
                      {purchases.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10 hover:bg-[#ecd8a6]/5 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#0a0512] border border-[#ecd8a6]/20 flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-[#ecd8a6]/60" />
                            </div>
                            <div>
                              <div className="text-[#ecd8a6] text-sm font-medium">{item.description}</div>
                              <div className="text-[10px] text-[#ecd8a6]/40 flex items-center gap-1 mt-1">
                                <CalendarDays className="w-3 h-3" />
                                {item.createdAt?.toDate().toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 font-serif">
                            {item.stripeReceiptUrl && (
                              <a 
                                href={item.stripeReceiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-[#ecd8a6]/10 hover:bg-[#ecd8a6]/20 rounded-lg text-[#ecd8a6] text-xs font-serif tracking-wider uppercase transition-all font-semibold"
                              >
                                {userInfo.language === 'tr' ? "Makbuz" : "Receipt"}
                              </a>
                            )}
                            <ChevronRight className="w-4 h-4 text-[#ecd8a6]/20 group-hover:text-[#ecd8a6]/60 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 rounded-2xl border border-dashed border-[#ecd8a6]/10 bg-[#ecd8a6]/5">
                      <p className="text-xs text-[#ecd8a6]/40 font-serif tracking-widest uppercase">
                        {userInfo.language === 'tr' ? "Henüz satın alım yapılmadı." : "No purchases yet."}
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

                <section className="space-y-4">
                  <h3 className="text-xs font-serif tracking-[0.2em] text-[#ecd8a6]/50 uppercase mb-2 flex items-center gap-2">
                    <History className="w-3.5 h-3.5" />
                    {userInfo.language === 'tr' ? "Uygulama Tanıtımı" : "App Intro"}
                  </h3>
                  <div className="p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-sm font-serif font-bold text-[#ecd8a6]">{userInfo.language === 'tr' ? "Tanıtımı Tekrar İzle" : "Watch App Intro"}</h4>
                      <p className="text-xs text-[#ecd8a6]/50 mt-1 leading-relaxed">
                        {userInfo.language === 'tr' 
                          ? "MadameSoul rehberlik adımlarını ve onboarding slaytlarını baştan izleyin." 
                          : "Replay the MadameSoul onboarding tour and introductory guide from the beginning."}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (onShowOnboarding) {
                          onShowOnboarding();
                        }
                        onClose();
                      }}
                      className="px-5 py-2.5 bg-[#1a1025] hover:bg-white/5 text-[#ecd8a6]/70 hover:text-[#ecd8a6] rounded-xl text-[10px] font-serif tracking-widest uppercase transition-all border border-[#ecd8a6]/20 font-bold whitespace-nowrap active:scale-95"
                    >
                      {userInfo.language === 'tr' ? "İzlemeye Başla" : "Watch Now"}
                    </button>
                  </div>
                </section>

                <hr className="border-[#ecd8a6]/10 my-6" />

                <section className="space-y-4">
                  <h3 className="text-xs font-serif tracking-[0.2em] text-[#ecd8a6]/50 uppercase mb-2 flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5" />
                    {userInfo.language === 'tr' ? "Pazarlama Tercihleri" : "Marketing Preferences"}
                  </h3>
                  <div className="p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-serif font-bold text-[#ecd8a6]">
                          {userInfo.language === 'tr' ? "E-posta Bildirimleri" : "Email Notifications"}
                        </h4>
                        <p className="text-xs text-[#ecd8a6]/50 mt-0.5 leading-relaxed">
                          {userInfo.language === 'tr' ? "Yenilikler ve kampanyalar hakkında e-posta alın." : "Receive emails about updates and special offers."}
                        </p>
                      </div>
                      <input 
                        type="checkbox"
                        checked={emailConsent}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setEmailConsent(val);
                          saveConsents(val, smsConsent, selectedInterests);
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 accent-[#ecd8a6]"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-serif font-bold text-[#ecd8a6]">
                          {userInfo.language === 'tr' ? "SMS Bildirimleri" : "SMS Notifications"}
                        </h4>
                        <p className="text-xs text-[#ecd8a6]/50 mt-0.5 leading-relaxed">
                          {userInfo.language === 'tr' ? "Önemli duyuruları kısa mesajla alın." : "Get important announcements via text message."}
                        </p>
                      </div>
                      <input 
                        type="checkbox"
                        checked={smsConsent}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setSmsConsent(val);
                          saveConsents(emailConsent, val, selectedInterests);
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 accent-[#ecd8a6]"
                      />
                    </div>

                    <div className="pt-2 border-t border-[#ecd8a6]/10">
                      <h4 className="text-sm font-serif font-bold text-[#ecd8a6] mb-3">
                        {userInfo.language === 'tr' ? "İlgi Alanları" : "Interests"}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { id: 'daily_horoscope', labelTr: 'Günlük Burçlar', labelEn: 'Daily Horoscopes' },
                          { id: 'love_tarot', labelTr: 'Aşk Açılımları', labelEn: 'Love Readings' },
                          { id: 'career_tarot', labelTr: 'Kariyer ve Para', labelEn: 'Career & Finance' },
                          { id: 'special_deals', labelTr: 'Özel İndirimler', labelEn: 'Special Deals' },
                        ].map((interest) => {
                          const isChecked = selectedInterests.includes(interest.id);
                          const label = userInfo.language === 'tr' ? interest.labelTr : interest.labelEn;
                          return (
                            <label key={interest.id} className="flex items-center gap-3 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  let newInterests = [...selectedInterests];
                                  if (e.target.checked) {
                                    newInterests.push(interest.id);
                                  } else {
                                    newInterests = newInterests.filter(id => id !== interest.id);
                                  }
                                  setSelectedInterests(newInterests);
                                  saveConsents(emailConsent, smsConsent, newInterests);
                                }}
                                className="w-3.5 h-3.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 accent-[#ecd8a6]"
                              />
                              <span className="text-xs text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors">{label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="border-[#ecd8a6]/10 my-6" />

                <section className="space-y-4">
                  <h3 className="text-xs font-serif tracking-[0.2em] text-red-400/70 uppercase mb-2 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    {userInfo.language === 'tr' ? "TEHLİKELİ ALAN" : "DANGER ZONE"}
                  </h3>
                  
                  {!showDeleteConfirm ? (
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="text-sm font-serif font-bold text-red-400">{profileT.settings.deleteAccount}</h4>
                        <p className="text-xs text-[#ecd8a6]/50 mt-1 leading-relaxed">
                          {userInfo.language === 'tr' 
                            ? "Hesabınızı silmek tüm bakiyenizi, fal geçmişinizi ve kişisel verilerinizi kalıcı olarak temizler." 
                            : "Deleting your account permanently wipes your balance, history, and personal data."}
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
