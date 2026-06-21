import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  limit, 
  orderBy, 
  query, 
  getCountFromServer 
} from 'firebase/firestore';
import { 
  Users, 
  Coins, 
  AlertOctagon, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  Calendar,
  Layers
} from 'lucide-react';

interface OverviewTabProps {
  userRole: 'admin' | 'employee' | 'viewer' | null;
}

export const OverviewTab: React.FC<OverviewTabProps> = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  
  // Database counts (for overall metrics)
  const [dbCounts, setDbCounts] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalErrors: 0
  });

  // Raw fetched datasets
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [allFeedbacks, setAllFeedbacks] = useState<any[]>([]);
  const [allErrors, setAllErrors] = useState<any[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, { email: string; displayName?: string }>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Get total counts using getCountFromServer (fast and efficient)
      const usersCountSnap = await getCountFromServer(collection(db, 'users'));
      const txCountSnap = await getCountFromServer(collection(db, 'moon_transactions'));
      const errorCountSnap = await getCountFromServer(collection(db, 'error_logs'));

      setDbCounts({
        totalUsers: usersCountSnap.data().count,
        totalTransactions: txCountSnap.data().count,
        totalErrors: errorCountSnap.data().count
      });

      // 2. Fetch users for email mapping
      const usersSnap = await getDocs(collection(db, 'users'));
      const mapping: Record<string, { email: string; displayName?: string }> = {};
      usersSnap.forEach((docSnap) => {
        const data = docSnap.data();
        mapping[docSnap.id] = {
          email: data.email || '',
          displayName: data.displayName || data.name || ''
        };
      });
      setUsersMap(mapping);

      // 3. Fetch large subset of transactions (up to 200) for local filtering
      const txQuery = query(collection(db, 'moon_transactions'), orderBy('createdAt', 'desc'), limit(200));
      const txSnap = await getDocs(txQuery);
      const txList: any[] = [];
      txSnap.forEach((docSnap) => {
        txList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setAllTransactions(txList);

      // 4. Fetch large subset of feedbacks (up to 100)
      const feedbackQuery = query(collection(db, 'ai_feedback'), orderBy('createdAt', 'desc'), limit(100));
      const feedbackSnap = await getDocs(feedbackQuery);
      const feedbackList: any[] = [];
      feedbackSnap.forEach((docSnap) => {
        feedbackList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setAllFeedbacks(feedbackList);

      // 5. Fetch large subset of errors (up to 100)
      const errorQuery = query(collection(db, 'error_logs'), orderBy('createdAt', 'desc'), limit(100));
      const errorSnap = await getDocs(errorQuery);
      const errorList: any[] = [];
      errorSnap.forEach((docSnap) => {
        errorList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setAllErrors(errorList);

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
    const val = doc.createdAt || doc.timestamp || doc.updatedAt;
    if (!val) return null;
    if (val.seconds) return new Date(val.seconds * 1000);
    return new Date(val);
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
  const filteredTransactions = filterByPeriod(allTransactions);
  const filteredFeedbacks = filterByPeriod(allFeedbacks);
  const filteredErrors = filterByPeriod(allErrors);

  // Compute stats based on selected period
  const totalUsersCount = dbCounts.totalUsers; // Always show absolute total users

  // Spent moons calculation (Absolute sum of successful spend transactions in selected period)
  const spentMoonsCount = filteredTransactions
    .filter(tx => tx.type === 'spend' && (tx.status === 'success' || !tx.status))
    .reduce((acc, tx) => acc + Math.abs(tx.amount || 0), 0);

  // Average Rating
  const validFeedbacks = filteredFeedbacks.filter(fb => fb.rating);
  const averageRating = validFeedbacks.length > 0 
    ? (validFeedbacks.reduce((acc, fb) => acc + fb.rating, 0) / validFeedbacks.length) 
    : 0.0;

  // Errors count
  const errorsCount = period === 'all' ? dbCounts.totalErrors : filteredErrors.length;

  // Transaction type counts for chart distribution (based on filtered list)
  const txTypeCounts = filteredTransactions.reduce((acc, tx) => {
    const type = tx.type as 'spend' | 'buy' | 'bonus' | 'refund';
    if (type && acc[type] !== undefined) {
      acc[type]++;
    }
    return acc;
  }, { spend: 0, buy: 0, bonus: 0, refund: 0 });

  const getPercentage = (value: number) => {
    const total = txTypeCounts.spend + txTypeCounts.buy + txTypeCounts.bonus + txTypeCounts.refund;
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-[#ecd8a6] mx-auto"></div>
          <p className="mt-4 text-[#ecd8a6]/60 text-sm">Dashboard verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Period Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#ecd8a6]/10 pb-6">
        <div>
          <h2 className="font-serif text-3xl text-[#ecd8a6]">Genel Bakış</h2>
          <p className="text-sm text-[#ecd8a6]/60">Sistem performansı, kullanıcı istatistikleri ve bakiye harcamalarını takip edin.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Selector Buttons */}
          <div className="flex rounded-lg border border-[#ecd8a6]/20 bg-[#0c081a] p-0.5 shadow-inner">
            {([
              { key: 'daily', label: 'Bugün', icon: Clock },
              { key: 'weekly', label: 'Son 7 Gün', icon: Calendar },
              { key: 'monthly', label: 'Son 30 Gün', icon: Calendar },
              { key: 'all', label: 'Tümü', icon: Layers }
            ] as const).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setPeriod(item.key)}
                  className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
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
            className="flex items-center gap-2 rounded-lg bg-purple-900/20 border border-[#ecd8a6]/20 px-4 py-2 hover:bg-purple-900/30 transition text-xs font-semibold"
          >
            <Clock className="h-3.5 w-3.5" />
            Yenile
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">Kullanıcılar</span>
            <p className="text-2xl font-bold mt-0.5 text-[#ecd8a6]">{totalUsersCount}</p>
            <span className="text-[10px] text-blue-400/60 font-semibold block mt-0.5">Toplam Kayıtlı Üye</span>
          </div>
        </div>

        {/* Total Spent Moons (Success Moons Only) */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">Harcanan Moon</span>
            <p className="text-2xl font-bold mt-0.5 text-amber-400">{spentMoonsCount}</p>
            <span className="text-[10px] text-amber-400/60 font-semibold block mt-0.5">
              {period === 'all' ? 'Tüm Zamanlar Başarılı Tüketim' : `${period === 'daily' ? 'Bugün' : period === 'weekly' ? 'Bu Hafta' : 'Bu Ay'} Harcanan`}
            </span>
          </div>
        </div>

        {/* AI rating score */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">AI Memnuniyeti</span>
            <p className="text-2xl font-bold mt-0.5 text-[#ecd8a6]">
              {averageRating ? averageRating.toFixed(1) : '0.0'} <span className="text-xs text-[#ecd8a6]/40 font-normal">/ 5</span>
            </p>
            <span className="text-[10px] text-purple-400/60 font-semibold block mt-0.5">
              {validFeedbacks.length} Değerlendirme
            </span>
          </div>
        </div>

        {/* System Logs / errors */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">Sistem Hataları</span>
            <p className="text-2xl font-bold mt-0.5 text-red-400">{errorsCount}</p>
            <span className="text-[10px] text-red-400/60 font-semibold block mt-0.5">
              {period === 'all' ? 'Toplam Hata Kaydı' : `${period === 'daily' ? 'Son 24 Saatteki' : period === 'weekly' ? 'Bu Haftaki' : 'Bu Ayki'} Hatalar`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns - Activities */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Moon Transactions */}
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/30 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#ecd8a6]/10 pb-3">
              <h3 className="font-serif text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-400" />
                Son Bakiye İşlemleri
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#ecd8a6]/80 border-collapse">
                <thead>
                  <tr className="border-b border-[#ecd8a6]/10 text-[#ecd8a6]/50 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5">Kullanıcı Adı</th>
                    <th className="py-2.5">Tarih</th>
                    <th className="py-2.5">Tür</th>
                    <th className="py-2.5">Açıklama</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ecd8a6]/5">
                  {filteredTransactions.slice(0, 7).map((tx) => (
                    <tr key={tx.id} className="hover:bg-purple-950/5 transition">
                      <td className="py-3 font-semibold">{tx.userName || 'Belirtilmemiş'}</td>
                      <td className="py-3 text-[#ecd8a6]/60">{formatDate(tx.createdAt)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                          tx.type === 'spend' 
                            ? 'bg-red-500/10 text-red-300 border-red-500/20' 
                            : tx.type === 'buy'
                            ? 'bg-green-500/10 text-green-300 border-green-500/20'
                            : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 text-[#ecd8a6]/60 max-w-[200px] truncate">{tx.description || '-'}</td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[#ecd8a6]/40">Bu dönemde işlem bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent AI Feedbacks */}
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/30 p-6 space-y-4">
            <h3 className="font-serif text-lg flex items-center gap-2 border-b border-[#ecd8a6]/10 pb-3">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              Son AI Geri Bildirimleri
            </h3>
            <div className="space-y-3">
              {filteredFeedbacks.slice(0, 5).map((fb) => {
                const userEmail = usersMap[fb.userId]?.email;
                return (
                  <div key={fb.id} className="p-4 rounded-lg bg-[#07040e]/40 border border-[#ecd8a6]/5 text-xs flex justify-between items-start gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[#ecd8a6]">{fb.userName || 'Kullanıcı'}</span>
                        {userEmail && (
                          <span className="text-[10px] bg-purple-900/30 text-[#ecd8a6]/80 px-2 py-0.5 rounded border border-[#ecd8a6]/10 font-mono truncate max-w-[220px]">
                            {userEmail}
                          </span>
                        )}
                        <span className="text-[10px] text-[#ecd8a6]/40">{formatDate(fb.createdAt)}</span>
                      </div>
                      <p className="text-[#ecd8a6]/70 leading-relaxed italic">"{fb.comment || 'Yorumsuz'}"</p>
                    </div>
                    <div className="flex items-center shrink-0">
                      <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded text-xs font-bold">
                        ⭐ {fb.rating}
                      </span>
                    </div>
                  </div>
                );
              })}
              {filteredFeedbacks.length === 0 && (
                <p className="py-4 text-center text-[#ecd8a6]/40 text-xs">Bu dönemde geri bildirim bulunamadı.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right 1 Column - Distribution Chart & Error Snippets */}
        <div className="space-y-6">
          
          {/* Moon Transaction Type Distribution Chart */}
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/30 p-6 space-y-4">
            <h3 className="font-serif text-lg flex items-center gap-2 border-b border-[#ecd8a6]/10 pb-3">
              <Coins className="h-5 w-5 text-amber-400" />
              İşlem Dağılımı
            </h3>
            
            {/* Visual representation */}
            <div className="flex items-center justify-center py-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
                {/* Background circle */}
                <circle cx="16" cy="16" r="14" fill="transparent" stroke="#0e0a1b" strokeWidth="4" />
                
                {/* SVG pie rendering based on counts */}
                {(() => {
                  const spend = getPercentage(txTypeCounts.spend);
                  const buy = getPercentage(txTypeCounts.buy);
                  const bonus = getPercentage(txTypeCounts.bonus);
                  const refund = getPercentage(txTypeCounts.refund);
                  
                  let offset = 0;
                  const strokeWidth = 4;
                  const radius = 14;
                  const circ = 2 * Math.PI * radius; // 87.96

                  return (
                    <>
                      {spend > 0 && (() => {
                        const dash = (spend / 100) * circ;
                        const el = <circle cx="16" cy="16" r={radius} fill="transparent" stroke="#f87171" strokeWidth={strokeWidth} strokeDasharray={`${dash} ${circ}`} strokeDashoffset={-offset} />;
                        offset += dash;
                        return el;
                      })()}
                      {buy > 0 && (() => {
                        const dash = (buy / 100) * circ;
                        const el = <circle cx="16" cy="16" r={radius} fill="transparent" stroke="#4ade80" strokeWidth={strokeWidth} strokeDasharray={`${dash} ${circ}`} strokeDashoffset={-offset} />;
                        offset += dash;
                        return el;
                      })()}
                      {bonus > 0 && (() => {
                        const dash = (bonus / 100) * circ;
                        const el = <circle cx="16" cy="16" r={radius} fill="transparent" stroke="#60a5fa" strokeWidth={strokeWidth} strokeDasharray={`${dash} ${circ}`} strokeDashoffset={-offset} />;
                        offset += dash;
                        return el;
                      })()}
                      {refund > 0 && (() => {
                        const dash = (refund / 100) * circ;
                        const el = <circle cx="16" cy="16" r={radius} fill="transparent" stroke="#a78bfa" strokeWidth={strokeWidth} strokeDasharray={`${dash} ${circ}`} strokeDashoffset={-offset} />;
                        offset += dash;
                        return el;
                      })()}
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Legend / Info */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span>Spend (Harcama)</span>
                </div>
                <span className="font-semibold">{getPercentage(txTypeCounts.spend)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span>Buy (Satın Alım)</span>
                </div>
                <span className="font-semibold">{getPercentage(txTypeCounts.buy)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span>Bonus (Hediye)</span>
                </div>
                <span className="font-semibold">{getPercentage(txTypeCounts.bonus)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span>Refund (İade)</span>
                </div>
                <span className="font-semibold">{getPercentage(txTypeCounts.refund)}%</span>
              </div>
            </div>
          </div>

          {/* Recent System Error logs */}
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/30 p-6 space-y-4">
            <h3 className="font-serif text-lg flex items-center gap-2 border-b border-[#ecd8a6]/10 pb-3">
              <AlertOctagon className="h-5 w-5 text-red-400" />
              Son Kritik Hatalar
            </h3>
            <div className="space-y-3">
              {filteredErrors.slice(0, 5).map((err) => (
                <div key={err.id} className="p-3 rounded bg-red-950/10 border border-red-900/20 text-[10px] space-y-1">
                  <div className="flex justify-between items-center text-[#ecd8a6]/50">
                    <span className="font-mono uppercase">{err.context || 'Sunucu'}</span>
                    <span>{formatDate(err.createdAt)}</span>
                  </div>
                  <p className="text-red-400 font-semibold truncate">{err.message}</p>
                </div>
              ))}
              {filteredErrors.length === 0 && (
                <p className="text-center text-[#ecd8a6]/40 text-xs py-4">Bu dönemde hata kaydı bulunmamaktadır.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
