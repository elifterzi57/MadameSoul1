import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useTranslation } from '../context/LanguageContext';

import { 
  collection, 
  getDocs, 
  limit, 
  orderBy, 
  query,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { 
  Users, 
  AlertOctagon, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  Calendar,
  Layers,
  Percent,
  Globe,
  Compass,
  Activity,
  Coins,
  Sparkles
} from 'lucide-react';

interface OverviewTabProps {
  userRole: 'admin' | 'employee' | 'viewer' | null;
}

export const OverviewTab: React.FC<OverviewTabProps> = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  
  // Raw fetched datasets
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [allFeedbacks, setAllFeedbacks] = useState<any[]>([]);
  const [allErrors, setAllErrors] = useState<any[]>([]);
  const [allCheckoutAttempts, setAllCheckoutAttempts] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {

      // 2. Fetch users for email mapping & demography
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersList: any[] = [];
      usersSnap.forEach((docSnap) => {
        const data = docSnap.data();
        usersList.push({ id: docSnap.id, ...data });
      });
      setAllUsers(usersList);

      // 3. Fetch transactions (up to 300)
      const txQuery = query(collection(db, 'moon_transactions'), orderBy('createdAt', 'desc'), limit(300));
      const txSnap = await getDocs(txQuery);
      const txList: any[] = [];
      txSnap.forEach((docSnap) => {
        txList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setAllTransactions(txList);

      // 4. Fetch feedbacks (up to 150)
      const feedbackQuery = query(collection(db, 'ai_feedback'), orderBy('createdAt', 'desc'), limit(150));
      const feedbackSnap = await getDocs(feedbackQuery);
      const feedbackList: any[] = [];
      feedbackSnap.forEach((docSnap) => {
        feedbackList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setAllFeedbacks(feedbackList);

      // 5. Fetch errors (up to 100)
      const errorQuery = query(collection(db, 'error_logs'), orderBy('createdAt', 'desc'), limit(100));
      const errorSnap = await getDocs(errorQuery);
      const errorList: any[] = [];
      errorSnap.forEach((docSnap) => {
        errorList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setAllErrors(errorList);

      // 6. Fetch checkout attempts (up to 300)
      const checkoutSnap = await getDocs(query(collection(db, 'checkout_attempts'), orderBy('createdAt', 'desc'), limit(300)));
      const checkoutList: any[] = [];
      const nowMs = Date.now();
      checkoutSnap.forEach((docSnap) => {
        const data = docSnap.data();
        let status = data.status;
        
        const createdAtDate = data.createdAt?.seconds 
          ? new Date(data.createdAt.seconds * 1000) 
          : new Date(data.createdAt || nowMs);
        const ageMinutes = (nowMs - createdAtDate.getTime()) / (1000 * 60);

        if (status === 'pending' && ageMinutes > 10) {
          status = 'cancelled';
          const attemptRef = doc(db, 'checkout_attempts', docSnap.id);
          updateDoc(attemptRef, {
            status: 'cancelled',
            completedMethod: 'auto_timeout',
            completedAt: serverTimestamp()
          }).catch(err => console.error("Error auto-cancelling pending session in overview:", err));
        }

        checkoutList.push({ id: docSnap.id, ...data, status });
      });
      setAllCheckoutAttempts(checkoutList);



    } catch (err) {
      console.error("Dashboard overview data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('tr-TR', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDocDate = (doc: any): Date | null => {
    const val = doc.createdAt || doc.timestamp || doc.updatedAt || doc.lastLogin;
    if (!val) return null;
    if (typeof val.toDate === 'function') return val.toDate();
    if (typeof val.seconds === 'number') return new Date(val.seconds * 1000);
    if (typeof val._seconds === 'number') return new Date(val._seconds * 1000);
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
    return null;
  };

  // Dynamic filter helper
  const filterByPeriod = (items: any[]) => {
    if (period === 'all') return items;
    const now = new Date();
    return items.filter((item) => {
      const itemDate = getDocDate(item);
      if (!itemDate) return false;
      const diffTime = Math.abs(now.getTime() - itemDate.getTime());
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      if (period === 'daily') return diffDays <= 1;
      if (period === 'weekly') return diffDays <= 7;
      if (period === 'monthly') return diffDays <= 30;
      return true;
    });
  };

  // Filtered lists
  const filteredUsers = filterByPeriod(allUsers);
  const filteredTransactions = filterByPeriod(allTransactions);
  const filteredFeedbacks = filterByPeriod(allFeedbacks);
  const filteredErrors = filterByPeriod(allErrors);
  const filteredCheckoutAttempts = filterByPeriod(allCheckoutAttempts);

  // A. FINANCIAL CALCULATIONS
  // Gross Revenue (All time LTV of all users)
  const totalLTV = allUsers.reduce((acc, u) => acc + (Number(u.lifetimeValue) || 0), 0);
  
  // Scoped revenue from completed checkouts in the selected period (Gross)
  const periodRevenue = filteredCheckoutAttempts
    .filter(c => c.status === 'completed')
    .reduce((acc, c) => acc + (Number(c.price) || 0), 0);

  // Stripe fee formula: (Price * 0.029) + 0.30
  // Scoped net revenue after Stripe transaction fees
  const periodNetRevenue = filteredCheckoutAttempts
    .filter(c => c.status === 'completed')
    .reduce((acc, c) => {
      const price = Number(c.price) || 0;
      if (price <= 0) return acc;
      const stripeFee = price * 0.029 + 0.30;
      return acc + (price - stripeFee);
    }, 0);

  // Conversion calculations
  const completedCheckouts = filteredCheckoutAttempts.filter(c => c.status === 'completed').length;
  const abandonedCheckouts = filteredCheckoutAttempts.filter(c => c.status === 'abandoned' || c.status === 'pending' || c.status === 'cancelled').length;
  const totalCheckouts = completedCheckouts + abandonedCheckouts;
  const checkoutConversionRate = totalCheckouts > 0 
    ? Math.round((completedCheckouts / totalCheckouts) * 100) 
    : 0;
  const cartAbandonmentRate = totalCheckouts > 0 
    ? Math.round((abandonedCheckouts / totalCheckouts) * 100) 
    : 0;

  // Scoped Natural checkout recovery yield

  // B. USER ENGAGEMENT & PRODUCTS CALCULATIONS
  // PDF download rate (Spend transactions with pdfDownloaded == 1 vs total Spend transactions)
  const spendTx = filteredTransactions.filter(tx => tx.type === 'spend');
  const pdfDownloadedTx = spendTx.filter(tx => tx.pdfDownloaded === 1 || tx.pdfDownloaded === true);
  const pdfDownloadRate = spendTx.length > 0 
    ? Math.round((pdfDownloadedTx.length / spendTx.length) * 100) 
    : 0;

  // Average Rating
  const validFeedbacks = filteredFeedbacks.filter(fb => fb.rating);
  const averageRating = validFeedbacks.length > 0 
    ? (validFeedbacks.reduce((acc, fb) => acc + fb.rating, 0) / validFeedbacks.length) 
    : 0.0;

  // C. AI TELEMETRY & COST CALCULATIONS (Kaldırıldı)

  // Basic Stats (Period Filtered vs All Time)
  const periodNewUsers = filteredUsers.length;
  const totalUsersCount = allUsers.length;
  const premiumUsersCount = allUsers.filter(u => u.isPremium === true).length;
  const premiumPercentage = totalUsersCount > 0 ? Math.round((premiumUsersCount / totalUsersCount) * 100) : 0;
  const periodFortunesRead = filteredTransactions.filter(tx => tx.type === 'spend').length;
  const totalFortunesRead = allTransactions.filter(tx => tx.type === 'spend').length;
  const periodMoonsAcquired = filteredCheckoutAttempts
    .filter(c => c.status === 'completed')
    .reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const totalMoonsAcquired = allCheckoutAttempts
    .filter(c => c.status === 'completed')
    .reduce((acc, c) => acc + (Number(c.amount) || 0), 0);

  // Helper to extract email or phone number for a transaction user
  const getTransactionContact = (tx: any) => {
    if (tx.userEmail) return tx.userEmail;
    if (tx.userId) {
      const user = allUsers.find(u => u.id === tx.userId);
      if (user) {
        return user.email || user.phoneNumber || user.phone || '';
      }
    }
    return '';
  };

  // D. ACQUISITION CHANNELS & DEMOGRAPHICS
  const getDistribution = (items: any[], fieldExtractor: (item: any) => string): { name: string; count: number }[] => {
    const counts = items.reduce((acc, item) => {
      const key = fieldExtractor(item) || t('overview.panels.providerOther');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const providerDistribution = getDistribution(filteredUsers, u => {
    const provider = u.providerId || '';
    if (provider === 'google.com') return t('overview.panels.providerGoogle');
    if (provider === 'apple.com') return t('overview.panels.providerApple');
    if (provider === 'password') return t('overview.panels.providerPassword');
    if (provider === 'phone') return t('overview.panels.providerPhone');
    
    // Akıllı Fallback: Eski kayıtlarda providerId alanı olmayabilir
    if (u.phoneNumber && !u.email) return t('overview.panels.providerPhone');
    if (u.email) {
      if (u.email.endsWith('@gmail.com')) return t('overview.panels.providerGoogle');
      return t('overview.panels.providerPassword');
    }
    return t('overview.panels.providerOther');
  });
  const browserDistribution = getDistribution(filteredUsers, u => u.metadata?.browser || u.deviceInfo);
  const locationDistribution = getDistribution(filteredUsers, u => u.metadata?.location || u.timezone);


  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-[#ecd8a6] mx-auto"></div>
          <p className="mt-4 text-[#ecd8a6]/60 text-sm">{t('overview.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Period Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#ecd8a6]/10 pb-6">
        <div>
          <h2 className="font-serif text-3xl text-[#ecd8a6]">{t('overview.title')}</h2>
          <p className="text-sm text-[#ecd8a6]/60">{t('overview.subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Selector Buttons */}
          <div className="flex rounded-lg border border-[#ecd8a6]/20 bg-[#0c081a] p-0.5 shadow-inner">
            {[
              { key: 'daily', label: t('overview.periods.daily'), icon: Clock },
              { key: 'weekly', label: t('overview.periods.weekly'), icon: Calendar },
              { key: 'monthly', label: t('overview.periods.monthly'), icon: Calendar },
              { key: 'all', label: t('overview.periods.all'), icon: Layers }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setPeriod(item.key as any)}
                  className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    period === item.key
                      ? 'bg-purple-900/40 text-[#ecd8a6] shadow-sm border border-[#ecd8a6]/15'
                      : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6] hover:bg-purple-950/20'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <button 
            onClick={fetchData}
            className="flex items-center gap-2 rounded-lg bg-purple-900/20 border border-[#ecd8a6]/20 px-4 py-2 hover:bg-purple-900/30 transition text-xs font-semibold cursor-pointer"
          >
            <Clock className="h-3.5 w-3.5" />
            {t('overview.refresh')}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total & Scoped Revenue */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">{t('overview.stats.revenueTitle')}</span>
            <p className="text-2xl font-bold mt-0.5 text-[#ecd8a6]">
              ${periodRevenue.toFixed(2)} <span className="text-xs text-emerald-400 font-semibold">/ ${periodNetRevenue.toFixed(2)} {t('overview.stats.net')}</span>
            </p>
            <span className="text-[10px] text-[#ecd8a6]/40 font-semibold block mt-0.5">{t('overview.stats.totalLtv', { ltv: totalLTV.toFixed(2) })}</span>
          </div>
        </div>

        {/* Checkout Conversion */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">{t('overview.stats.checkoutConversion')}</span>
            <p className="text-2xl font-bold mt-0.5 text-[#ecd8a6]">
              %{checkoutConversionRate} <span className="text-xs text-[#ecd8a6]/40 font-normal">/ {t('overview.stats.abandonRate', { rate: cartAbandonmentRate })}</span>
            </p>
            <span className="text-[10px] text-blue-400/60 font-semibold block mt-0.5">{t('overview.stats.conversionCart')}</span>
          </div>
        </div>

        {/* CSAT / Engagement */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">{t('overview.stats.csatTitle')}</span>
            <p className="text-2xl font-bold mt-0.5 text-[#ecd8a6]">
              ⭐ {averageRating ? averageRating.toFixed(1) : '0.0'} <span className="text-xs text-[#ecd8a6]/40 font-normal">/ %{pdfDownloadRate} {t('overview.stats.pdfLabel')}</span>
            </p>
            <span className="text-[10px] text-amber-400/60 font-semibold block mt-0.5">{t('overview.stats.userSatisfaction')}</span>
          </div>
        </div>
      </div>

      {/* Basic Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        
        {/* Kullanıcı Sayısı Card */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">{t('overview.stats.userCountTitle')}</span>
            <p className="text-2xl font-bold mt-0.5 text-[#ecd8a6]">
              +{periodNewUsers} <span className="text-xs text-[#ecd8a6]/40 font-normal">/ {totalUsersCount} {t('overview.stats.totalLabel')}</span>
            </p>
            <span className="text-[10px] text-sky-400/60 font-semibold block mt-0.5">{t('overview.stats.scopedRegistrations')}</span>
          </div>
        </div>

        {/* Premium Kullanıcı Oranı Card */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">{t('overview.stats.premiumTitle')}</span>
            <p className="text-2xl font-bold mt-0.5 text-[#ecd8a6]">
              %{premiumPercentage} <span className="text-xs text-[#ecd8a6]/40 font-normal">/ {premiumUsersCount} {t('overview.stats.usersLabel')}</span>
            </p>
            <span className="text-[10px] text-purple-400/60 font-semibold block mt-0.5">{t('overview.stats.activePremium')}</span>
          </div>
        </div>

        {/* Bakılan Fal Sayısı Card */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">{t('overview.stats.fortunesTitle')}</span>
            <p className="text-2xl font-bold mt-0.5 text-[#ecd8a6]">
              {periodFortunesRead} <span className="text-xs text-[#ecd8a6]/40 font-normal">/ {totalFortunesRead} {t('overview.stats.allLabel')}</span>
            </p>
            <span className="text-[10px] text-indigo-400/60 font-semibold block mt-0.5">{t('overview.stats.scopedFortunes')}</span>
          </div>
        </div>

        {/* Alınan Katina Moon Sayısı Card */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">{t('overview.stats.moonsTitle')}</span>
            <p className="text-2xl font-bold mt-0.5 text-[#ecd8a6]">
              {periodMoonsAcquired} <span className="text-xs text-[#ecd8a6]/40 font-normal">/ {totalMoonsAcquired} {t('overview.stats.allLabel')}</span>
            </p>
            <span className="text-[10px] text-amber-400/60 font-semibold block mt-0.5">{t('overview.stats.scopedMoons')}</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Financial details, Conversion funnel & AI Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Detailed Financial & Checkout Conversion Metrics */}
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/30 p-6 space-y-5">
            <h3 className="font-serif text-lg flex items-center gap-2 border-b border-[#ecd8a6]/10 pb-3">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              {t('overview.panels.financialPerformance')}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-[#07040e]/60 border border-[#ecd8a6]/5">
                <p className="text-xs text-[#ecd8a6]/50 uppercase tracking-wider">{t('overview.panels.totalRequests')}</p>
                <p className="text-xl font-bold text-[#ecd8a6] mt-1">{totalCheckouts}</p>
              </div>
              <div className="p-4 rounded-lg bg-[#07040e]/60 border border-[#ecd8a6]/5">
                <p className="text-xs text-[#ecd8a6]/50 uppercase tracking-wider">{t('overview.panels.successfulPayments')}</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">{completedCheckouts}</p>
              </div>
              <div className="p-4 rounded-lg bg-[#07040e]/60 border border-[#ecd8a6]/5">
                <p className="text-xs text-[#ecd8a6]/50 uppercase tracking-wider">{t('overview.panels.abandonedPayments')}</p>
                <p className="text-xl font-bold text-red-400 mt-1">{abandonedCheckouts}</p>
              </div>
            </div>
          </div>

          {/* Son Bakiye İşlemleri (Wider Layout with User Details) */}
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/30 p-6 space-y-4">
            <h4 className="font-serif text-base flex items-center gap-1.5 border-b border-[#ecd8a6]/10 pb-3">
              <Activity className="h-5 w-5 text-amber-400" />
              {t('overview.panels.recentTransactions')}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#ecd8a6]/10 text-[#ecd8a6]/50">
                    <th className="py-2.5 font-semibold">{t('overview.panels.userHeader')}</th>
                    <th className="py-2.5 font-semibold">{t('overview.panels.typeHeader')}</th>
                    <th className="py-2.5 font-semibold">{t('overview.panels.dateHeader')}</th>
                    <th className="py-2.5 font-semibold text-right">{t('overview.panels.amountHeader')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ecd8a6]/5 text-[#ecd8a6]/80">
                  {filteredTransactions.slice(0, 8).map((tx) => {
                    const contact = getTransactionContact(tx);
                    const userIdentifier = contact || tx.userName || t('overview.panels.unknownUser');
                    return (
                      <tr key={tx.id} className="hover:bg-purple-950/10 transition">
                        <td className="py-3 font-mono text-[11px] text-[#ecd8a6]">{userIdentifier}</td>
                        <td className="py-3 font-medium capitalize">
                          {tx.type === 'spend' ? (
                            <span className="text-red-400/80">{t('overview.panels.txSpend')}</span>
                          ) : (
                            <span className="text-green-400/80">{t('overview.panels.txLoad')}</span>
                          )}
                        </td>
                        <td className="py-3 text-[11px] text-[#ecd8a6]/40">{formatDate(tx.createdAt)}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'spend' ? 'bg-red-500/10 text-red-300 border border-red-500/20' : 'bg-green-500/10 text-green-300 border border-green-500/20'
                          }`}>
                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[#ecd8a6]/40">{t('overview.panels.noTransactions')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Feedbacks (Full Width Grid) */}
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/30 p-6 space-y-4">
            <h4 className="font-serif text-base flex items-center gap-1.5 border-b border-[#ecd8a6]/10 pb-3">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              {t('overview.panels.recentComments')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
              {filteredFeedbacks.slice(0, 6).map((fb) => {
                const contact = getTransactionContact(fb);
                const userIdentifier = contact || fb.userName || t('overview.panels.commentAnonymous');
                return (
                  <div key={fb.id} className="p-3.5 rounded-lg bg-[#07040e]/40 border border-[#ecd8a6]/5 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[#ecd8a6] truncate max-w-[200px] font-mono text-[11px]">{userIdentifier}</span>
                      <span className="text-amber-400 font-bold shrink-0">⭐ {fb.rating}</span>
                    </div>
                    <p className="text-[#ecd8a6]/70 leading-relaxed italic text-[11px] line-clamp-2">"{fb.comment || t('overview.panels.commentNoText')}"</p>
                  </div>
                )
              })}
              {filteredFeedbacks.length === 0 && (
                <p className="text-center text-[#ecd8a6]/40 text-xs py-6 col-span-2">{t('overview.panels.noComments')}</p>
              )}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Demographics and Channels */}
        <div className="space-y-6">
          
          {/* User Signups & Acquisition Channels */}
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/30 p-6 space-y-5">
            <h3 className="font-serif text-lg flex items-center gap-2 border-b border-[#ecd8a6]/10 pb-3">
              <Globe className="h-5 w-5 text-sky-400" />
              {t('overview.panels.acquisitionChannels')}
            </h3>

            <div className="space-y-4">
              {/* Total Growth */}
              <div className="p-4 rounded-lg bg-[#07040e]/60 border border-[#ecd8a6]/5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase text-[#ecd8a6]/40 font-semibold">{t('overview.panels.newSignups')}</span>
                  <p className="text-2xl font-bold text-[#ecd8a6] mt-0.5">+{filteredUsers.length}</p>
                </div>
                <Users className="h-8 w-8 text-sky-400/40" />
              </div>

              {/* Providers list */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase text-[#ecd8a6]/50 tracking-wider font-semibold">{t('overview.panels.signupMethods')}</h4>
                <div className="space-y-1.5 text-xs">
                  {providerDistribution.map((item) => (
                    <div key={item.name} className="flex justify-between items-center p-2 rounded bg-[#07040e]/40 border border-[#ecd8a6]/5">
                      <span className="font-mono text-xs">{item.name}</span>
                      <span className="font-semibold text-[#ecd8a6]">{item.count} {t('overview.panels.recordSuffix')}</span>
                    </div>
                  ))}
                  {providerDistribution.length === 0 && (
                    <p className="text-center text-[#ecd8a6]/40 text-xs py-2">{t('overview.panels.noData')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Device & Demographics Distribution */}
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/30 p-6 space-y-5">
            <h3 className="font-serif text-lg flex items-center gap-2 border-b border-[#ecd8a6]/10 pb-3">
              <Compass className="h-5 w-5 text-indigo-400" />
              {t('overview.panels.demographicsDevices')}
            </h3>

            <div className="space-y-4">
              {/* Locations */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase text-[#ecd8a6]/50 tracking-wider font-semibold">{t('overview.panels.locationDistribution')}</h4>
                <div className="space-y-1.5 text-xs">
                  {locationDistribution.map((item) => (
                    <div key={item.name} className="flex justify-between items-center p-2 rounded bg-[#07040e]/40 border border-[#ecd8a6]/5">
                      <span className="font-mono text-xs truncate max-w-[150px]">{item.name}</span>
                      <span className="font-semibold text-[#ecd8a6]">{item.count}</span>
                    </div>
                  ))}
                  {locationDistribution.length === 0 && (
                    <p className="text-center text-[#ecd8a6]/40 text-xs py-2">{t('overview.panels.noLocations')}</p>
                  )}
                </div>
              </div>

              {/* Browsers */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase text-[#ecd8a6]/50 tracking-wider font-semibold">{t('overview.panels.deviceDistribution')}</h4>
                <div className="space-y-1.5 text-xs">
                  {browserDistribution.map((item) => (
                    <div key={item.name} className="flex justify-between items-center p-2 rounded bg-[#07040e]/40 border border-[#ecd8a6]/5">
                      <span className="font-mono text-xs truncate max-w-[150px]">{item.name}</span>
                      <span className="font-semibold text-[#ecd8a6]">{item.count}</span>
                    </div>
                  ))}
                  {browserDistribution.length === 0 && (
                    <p className="text-center text-[#ecd8a6]/40 text-xs py-2">{t('overview.panels.noDevices')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* System Errors */}
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/30 p-5 space-y-3">
            <h4 className="font-serif text-sm flex items-center gap-1.5 text-red-400 border-b border-[#ecd8a6]/5 pb-2">
              <AlertOctagon className="h-4 w-4" />
              {t('overview.panels.criticalErrors')}
            </h4>
            <div className="space-y-2">
              {filteredErrors.slice(0, 3).map((err) => (
                <div key={err.id} className="p-2.5 rounded bg-red-950/10 border border-red-900/20 text-[10px] space-y-1">
                  <p className="text-red-400 font-semibold truncate">{err.errorMessage || err.message}</p>
                  <p className="text-[#ecd8a6]/40 text-[9px]">{formatDate(err.createdAt)}</p>
                </div>
              ))}
              {filteredErrors.length === 0 && (
                <p className="text-center text-[#ecd8a6]/40 text-xs py-2">{t('overview.panels.noErrors')}</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};


