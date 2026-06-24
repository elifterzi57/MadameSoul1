import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { 
  Database, 
  Coins, 
  CreditCard, 
  Terminal, 
  ShieldAlert, 
  LogOut, 
  User as UserIcon,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { CollectionsTab } from '../components/CollectionsTab';
import { BalanceTab } from '../components/BalanceTab';
import { FinanceTab } from '../components/FinanceTab';
import { LogsTab } from '../components/LogsTab';
import { PermissionsTab } from '../components/PermissionsTab';
import { OverviewTab } from '../components/OverviewTab';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'collections' | 'balance' | 'finance' | 'logs' | 'permissions'>('overview');
  const [selectedCollection, setSelectedCollection] = useState<string>('users');
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'employee' | 'viewer' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const collectionsList = [
    { id: 'ai_feedback', label: 'AI Geri Bildirimleri' },
    { id: 'ai_telemetry', label: 'AI Telemetri' },
    { id: 'contact_us', label: 'Contact Us' },
    { id: 'users', label: 'Kullanıcı Listesi' },
    { id: 'moon_transactions', label: 'Moon İşlemleri' },
    { id: 'error_logs', label: 'Sistem Hataları' },
    { id: 'user_moons', label: 'User Moons' },
    { id: 'user_reflections', label: 'Yansıma Notları' }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        const tokenResult = await user.getIdTokenResult(true);
        setUserRole((tokenResult.claims.role as 'admin' | 'employee' | 'viewer') || 'viewer');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth);
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin': return 'Süper Admin';
      case 'employee': return 'Çalışan (Moderatör)';
      case 'viewer': return 'Görüntüleyen (Salt Okunur)';
      default: return 'Görüntüleyen';
    }
  };

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'admin': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'employee': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'viewer': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#07040e] text-[#ecd8a6]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#ecd8a6]/10 bg-[#0c081a] p-6 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="mb-8 text-center border-b border-[#ecd8a6]/10 pb-6">
            <h1 className="font-serif text-2xl tracking-widest text-[#ecd8a6]">MADAME SOUL</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#ecd8a6]/50">Yönetici Paneli</p>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('overview');
                setIsCollectionsOpen(false);
              }}
              className={`flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-left transition ${
                activeTab === 'overview'
                  ? 'bg-purple-900/30 text-[#ecd8a6] border border-[#ecd8a6]/20'
                  : 'text-[#ecd8a6]/60 hover:bg-purple-950/20 hover:text-[#ecd8a6]'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span className="text-left">Genel Bakış</span>
            </button>

            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab('collections');
                  setIsCollectionsOpen(!isCollectionsOpen);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-left transition ${
                  activeTab === 'collections'
                    ? 'bg-purple-900/30 text-[#ecd8a6] border border-[#ecd8a6]/20'
                    : 'text-[#ecd8a6]/60 hover:bg-purple-950/20 hover:text-[#ecd8a6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 shrink-0" />
                  <span className="text-left">Veritabanı Koleksiyonları</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCollectionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCollectionsOpen && (
                <div className="mt-1 ml-4 space-y-1 border-l border-[#ecd8a6]/15 pl-3">
                  {collectionsList.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => {
                        setActiveTab('collections');
                        setSelectedCollection(col.id);
                      }}
                      className={`flex w-full items-center justify-start rounded-md px-3 py-2 text-xs font-medium text-left transition ${
                        activeTab === 'collections' && selectedCollection === col.id
                          ? 'bg-purple-900/50 text-[#ecd8a6] border border-[#ecd8a6]/10'
                          : 'text-[#ecd8a6]/50 hover:bg-purple-950/10 hover:text-[#ecd8a6]/80'
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('balance')}
              className={`flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-left transition ${
                activeTab === 'balance'
                  ? 'bg-purple-900/30 text-[#ecd8a6] border border-[#ecd8a6]/20'
                  : 'text-[#ecd8a6]/60 hover:bg-purple-950/20 hover:text-[#ecd8a6]'
              }`}
            >
              <Coins className="h-4 w-4 shrink-0" />
              <span className="text-left">Moon Bakiye Yönetimi</span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-left transition ${
                activeTab === 'finance'
                  ? 'bg-purple-900/30 text-[#ecd8a6] border border-[#ecd8a6]/20'
                  : 'text-[#ecd8a6]/60 hover:bg-purple-950/20 hover:text-[#ecd8a6]'
              }`}
            >
              <CreditCard className="h-4 w-4 shrink-0" />
              <span className="text-left">Stripe Finans & Satış</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-left transition ${
                activeTab === 'logs'
                  ? 'bg-purple-900/30 text-[#ecd8a6] border border-[#ecd8a6]/20'
                  : 'text-[#ecd8a6]/60 hover:bg-purple-950/20 hover:text-[#ecd8a6]'
              }`}
            >
              <Terminal className="h-4 w-4 shrink-0" />
              <span className="text-left">Sistem Hata Logları</span>
            </button>

            <button
              onClick={() => setActiveTab('permissions')}
              className={`flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-left transition ${
                activeTab === 'permissions'
                  ? 'bg-purple-900/30 text-[#ecd8a6] border border-[#ecd8a6]/20'
                  : 'text-[#ecd8a6]/60 hover:bg-purple-950/20 hover:text-[#ecd8a6]'
              }`}
            >
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span className="text-left">Çalışan Yetkileri</span>
            </button>
          </nav>
        </div>

        {/* User Info & Signout */}
        <div className="border-t border-[#ecd8a6]/10 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-purple-900/30 p-2 border border-[#ecd8a6]/20">
              <UserIcon className="h-4 w-4 text-[#ecd8a6]" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate text-[#ecd8a6]">{userEmail}</p>
              <span className={`inline-block mt-1 text-[9px] font-semibold px-2 py-0.5 rounded-full border ${getRoleBadgeColor()}`}>
                {getRoleLabel()}
              </span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-start gap-3 rounded-lg bg-red-950/20 border border-red-900/30 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/40 transition"
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && <OverviewTab userRole={userRole} />}
        {activeTab === 'collections' && (
          <CollectionsTab 
            userRole={userRole} 
            selectedCollection={selectedCollection} 
          />
        )}
        {activeTab === 'balance' && <BalanceTab userRole={userRole} />}
        {activeTab === 'finance' && <FinanceTab userRole={userRole} />}
        {activeTab === 'logs' && <LogsTab userRole={userRole} />}
        {activeTab === 'permissions' && <PermissionsTab userRole={userRole} />}
      </main>
    </div>
  );
};
