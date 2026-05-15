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
  Mail,
  Lock,
  Eye,
  EyeOff,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

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
  onClose: () => void;
  onUpdateUserInfo: (info: any) => void;
  translations: any;
  onDownloadPastReading?: (reading: any) => void;
}

export const Profile: React.FC<ProfileProps> = ({ 
  user, 
  userInfo, 
  moonsCount, 
  onClose, 
  translations,
  onDownloadPastReading
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Settings state
  const [email, setEmail] = useState(user?.email || '');
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

  const handleUpdateEmail = async () => {
    if (!user || !email || email === user.email) return;
    setIsUpdating(true);
    setSettingsStatus(null);
    try {
      await updateEmail(user, email);
      setSettingsStatus({ type: 'success', message: profileT.settings.successEmail });
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setSettingsStatus({ type: 'error', message: profileT.settings.reauthRequired });
      } else {
        setSettingsStatus({ type: 'error', message: error.message });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user || !newPassword) return;
    setIsUpdating(true);
    setSettingsStatus(null);
    try {
      await updatePassword(user, newPassword);
      setNewPassword('');
      setSettingsStatus({ type: 'success', message: profileT.settings.successPassword });
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setSettingsStatus({ type: 'error', message: profileT.settings.reauthRequired });
      } else {
        setSettingsStatus({ type: 'error', message: error.message });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const profileT = translations.profile || {
    title: "Profil",
    userInfo: "Kullanıcı Bilgileri",
    readingHistory: "Geçmiş Fallarım",
    noHistory: "Henüz bir fal bakılmamış.",
    moons: "Katina Moon Bakiyesi",
    status: "İlişki Durumu",
    birthplace: "Doğum Yeri",
    dob: "Doğum Tarihi",
    name: "İsim",
    tabs: { overview: "Genel Bakış", settings: "Ayarlar" },
    settings: {
      email: "E-posta",
      password: "Şifre",
      newPassword: "Yeni Şifre",
      updateEmail: "Güncelle",
      updatePassword: "Değiştir",
      successEmail: "Güncellendi",
      successPassword: "Değiştirildi",
      reauthRequired: "Tekrar giriş yapın"
    },
    history: {
      downloadPdf: "PDF İndir",
      viewReading: "Görüntüle"
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
                    <InfoCard icon={<UserIcon className="w-4 h-4" />} label={profileT.name} value={userInfo.name || '---'} />
                    <InfoCard icon={<Calendar className="w-4 h-4" />} label={profileT.dob} value={userInfo.dob || '---'} />
                    <InfoCard icon={<MapPin className="w-4 h-4" />} label={profileT.birthplace} value={userInfo.birthplace || '---'} />
                    <InfoCard icon={<Heart className="w-4 h-4" />} label={profileT.status} value={translations.statusOptions?.[userInfo.relationship] || userInfo.relationship || '---'} />
                  </div>
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
                    <Mail className="w-3 h-3" />
                    {profileT.settings.email}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-[#1a1025] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 text-[#ecd8a6] text-sm focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-serif min-w-0"
                    />
                    <button 
                      onClick={handleUpdateEmail}
                      disabled={isUpdating || email === user?.email}
                      className="whitespace-nowrap px-6 py-3 bg-[#ecd8a6] text-[#0a0512] rounded-xl text-[10px] font-serif tracking-widest uppercase hover:bg-[#fff] transition-all disabled:opacity-50 flex items-center justify-center min-h-[44px]"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : profileT.settings.updateEmail}
                    </button>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs font-serif tracking-[0.2em] text-[#ecd8a6]/50 uppercase mb-2 flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    {profileT.settings.password}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={profileT.settings.newPassword}
                        className="w-full bg-[#1a1025] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 pr-10 text-[#ecd8a6] text-sm focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-serif min-w-0"
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
                      className="whitespace-nowrap px-6 py-3 bg-[#ecd8a6] text-[#0a0512] rounded-xl text-[10px] font-serif tracking-widest uppercase hover:bg-[#fff] transition-all disabled:opacity-50 flex items-center justify-center min-h-[44px]"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : profileT.settings.updatePassword}
                    </button>
                  </div>
                </section>

                <section className="pt-4">
                  <div className="p-4 rounded-xl bg-[#ecd8a6]/5 border border-[#ecd8a6]/10">
                    <div className="flex items-center gap-3 text-[#ecd8a6]/60">
                      <ShoppingBag className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="text-[10px] font-serif tracking-widest uppercase mb-1">{profileT.moons}</div>
                        <div className="text-[#ecd8a6] font-serif text-lg">{moonsCount} Moons</div>
                      </div>
                    </div>
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
  <div className="p-4 rounded-xl bg-white/5 border border-[#ecd8a6]/10 flex flex-col gap-1">
    <div className="flex items-center gap-2 text-[10px] font-serif tracking-widest text-[#ecd8a6]/40 uppercase">
      {icon}
      {label}
    </div>
    <div className="text-[#ecd8a6] font-medium truncate">{value}</div>
  </div>
);
