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
import { collection, query, where, getDocs, orderBy, limit, Timestamp, doc, updateDoc } from 'firebase/firestore';
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
}

export const Profile: React.FC<ProfileProps> = ({ 
  user, 
  userInfo, 
  moonsCount, 
  readingCount,
  onClose, 
  onUpdateUserInfo,
  translations,
  onDownloadPastReading
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

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

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        // Fetch last 50 transactions for the user and filter/sort in memory 
        // to avoid mandatory composite index errors during initial setup
        const q = query(
          collection(db, 'moon_transactions'),
          where('userId', '==', user.uid),
          limit(50)
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter((item: any) => item.type === 'spend')
          .sort((a: any, b: any) => {
            const dateA = a.createdAt?.toMillis?.() || 0;
            const dateB = b.createdAt?.toMillis?.() || 0;
            return dateB - dateA;
          })
          .slice(0, 10);
        setHistory(items);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [user]);

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
      reauthRequired: translations?.profile?.settings?.reauthRequired || "Please login again"
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
                      {history.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10 hover:bg-[#ecd8a6]/5 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#0a0512] border border-[#ecd8a6]/20 flex items-center justify-center">
                              <History className="w-5 h-5 text-[#ecd8a6]/60" />
                            </div>
                            <div>
                              <div className="text-[#ecd8a6] text-sm font-medium">{item.description}</div>
                              <div className="text-[10px] text-[#ecd8a6]/40 flex items-center gap-1 mt-1">
                                <CalendarDays className="w-3 h-3" />
                                {item.createdAt?.toDate().toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.readingText && (
                              <button 
                                onClick={() => onDownloadPastReading?.(item)}
                                className="p-2 bg-[#ecd8a6]/10 hover:bg-[#ecd8a6]/20 rounded-lg text-[#ecd8a6] transition-all"
                                title={profileT.history.downloadPdf}
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            <ChevronRight className="w-4 h-4 text-[#ecd8a6]/20 group-hover:text-[#ecd8a6]/60 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 rounded-2xl border border-dashed border-[#ecd8a6]/10 bg-[#ecd8a6]/5">
                      <p className="text-xs text-[#ecd8a6]/40 font-serif tracking-widest uppercase">{profileT.noHistory}</p>
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
