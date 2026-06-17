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
  Clock
} from 'lucide-react';

interface OverviewTabProps {
  userRole: 'admin' | 'employee' | 'viewer' | null;
}

export const OverviewTab: React.FC<OverviewTabProps> = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalErrors: 0,
    averageRating: 0.0
  });

  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [recentErrors, setRecentErrors] = useState<any[]>([]);
  const [recentFeedbacks, setRecentFeedbacks] = useState<any[]>([]);
  const [txTypeCounts, setTxTypeCounts] = useState({
    spend: 0,
    buy: 0,
    bonus: 0,
    refund: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Get total counts using getCountFromServer (fast and efficient)
      const usersCountSnap = await getCountFromServer(collection(db, 'users'));
      const txCountSnap = await getCountFromServer(collection(db, 'moon_transactions'));
      const errorCountSnap = await getCountFromServer(collection(db, 'error_logs'));

      const totalUsers = usersCountSnap.data().count;
      const totalTransactions = txCountSnap.data().count;
      const totalErrors = errorCountSnap.data().count;

      // 2. Fetch last 50 feedbacks to compute average rating and list the latest ones
      const feedbackQuery = query(collection(db, 'ai_feedback'), orderBy('createdAt', 'desc'), limit(50));
      const feedbackSnap = await getDocs(feedbackQuery);
      
      let sumRating = 0;
      let feedbackCount = 0;
      const feedbackList: any[] = [];

      feedbackSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.rating) {
          sumRating += data.rating;
          feedbackCount++;
        }
        if (feedbackList.length < 5) {
          feedbackList.push({ id: docSnap.id, ...data });
        }
      });

      const averageRating = feedbackCount > 0 ? (sumRating / feedbackCount) : 0;

      // 3. Fetch recent 5 transactions and compute distribution for chart
      const txQuery = query(collection(db, 'moon_transactions'), orderBy('createdAt', 'desc'), limit(50));
      const txSnap = await getDocs(txQuery);
      const txList: any[] = [];
      const counts = { spend: 0, buy: 0, bonus: 0, refund: 0 };

      txSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const type = data.type as 'spend' | 'buy' | 'bonus' | 'refund';
        if (type && counts[type] !== undefined) {
          counts[type]++;
        }
        if (txList.length < 5) {
          txList.push({ id: docSnap.id, ...data });
        }
      });

      // 4. Fetch recent 5 error logs
      const errorQuery = query(collection(db, 'error_logs'), orderBy('createdAt', 'desc'), limit(5));
      const errorSnap = await getDocs(errorQuery);
      const errorList: any[] = [];
      errorSnap.forEach((docSnap) => {
        errorList.push({ id: docSnap.id, ...docSnap.data() });
      });

      setStats({
        totalUsers,
        totalTransactions,
        totalErrors,
        averageRating
      });
      setRecentTransactions(txList);
      setRecentErrors(errorList);
      setRecentFeedbacks(feedbackList);
      setTxTypeCounts(counts);

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

  // Safe percentage helper
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#ecd8a6]">Genel Bakış</h2>
          <p className="text-sm text-[#ecd8a6]/60">Sistem performansı, kullanıcı istatistikleri ve genel veritabanı durumunu takip edin.</p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 rounded-lg bg-purple-900/20 border border-[#ecd8a6]/20 px-4 py-2 hover:bg-purple-900/30 transition text-xs"
        >
          <Clock className="h-3.5 w-3.5" />
          Yenile
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">Kullanıcılar</span>
            <p className="text-2xl font-bold mt-1 text-[#ecd8a6]">{stats.totalUsers}</p>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">Moon İşlemleri</span>
            <p className="text-2xl font-bold mt-1 text-[#ecd8a6]">{stats.totalTransactions}</p>
          </div>
        </div>

        {/* AI rating score */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">AI Memnuniyeti</span>
            <p className="text-2xl font-bold mt-1 text-[#ecd8a6]">
              {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'} <span className="text-xs text-[#ecd8a6]/40 font-normal">/ 5</span>
            </p>
          </div>
        </div>

        {/* System Logs / errors */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 flex items-center gap-4 hover:border-[#ecd8a6]/25 transition duration-300">
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[#ecd8a6]/50 block uppercase tracking-wider font-semibold">Sistem Hataları</span>
            <p className="text-2xl font-bold mt-1 text-[#ecd8a6]">{stats.totalErrors}</p>
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
                  {recentTransactions.map((tx) => (
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
                  {recentTransactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[#ecd8a6]/40">Kayıt bulunamadı.</td>
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
              {recentFeedbacks.map((fb) => (
                <div key={fb.id} className="p-3 rounded-lg bg-[#07040e]/40 border border-[#ecd8a6]/5 text-xs flex justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{fb.userName || 'Kullanıcı'}</span>
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
              ))}
              {recentFeedbacks.length === 0 && (
                <p className="py-4 text-center text-[#ecd8a6]/40 text-xs">Geri bildirim bulunamadı.</p>
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
              İşlem Türü Dağılımı
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
              {recentErrors.map((err) => (
                <div key={err.id} className="p-3 rounded bg-red-950/10 border border-red-900/20 text-[10px] space-y-1">
                  <div className="flex justify-between items-center text-[#ecd8a6]/50">
                    <span className="font-mono uppercase">{err.context || 'Sunucu'}</span>
                    <span>{formatDate(err.createdAt)}</span>
                  </div>
                  <p className="text-red-400 font-semibold truncate">{err.message}</p>
                </div>
              ))}
              {recentErrors.length === 0 && (
                <p className="text-center text-[#ecd8a6]/40 text-xs py-4">Hata kaydı bulunmamaktadır.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
