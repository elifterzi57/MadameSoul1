import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { DollarSign, ShoppingBag, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';

interface FinanceTabProps {
  userRole: 'admin' | 'employee' | 'viewer' | null;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ userRole: _userRole }) => {
  const [sales, setSales] = useState<any[]>([]);
  const [pendingAttempts, setPendingAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Computed metrics
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [avgSaleValue, setAvgSaleValue] = useState(0);

  const fetchSalesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const txRef = collection(db, 'moon_transactions');
      // Query successful purchases
      const q = query(
        txRef,
        where('type', '==', 'buy'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );

      const qSnap = await getDocs(q);
      const salesData: any[] = [];
      let totalAmount = 0;

      qSnap.forEach((docSnap) => {
        const data = docSnap.data();
        salesData.push({ id: docSnap.id, ...data });
        // Assume amount is the number of Moon credits, lets map to a nominal dollar amount e.g. 1 Moon = $2.00
        const moonAmount = Math.abs(data.amount || 0);
        totalAmount += moonAmount;
      });

      setSales(salesData);
      setTotalSalesCount(salesData.length);
      setTotalRevenue(totalAmount * 1.5); // 1.50 USD per Moon as a realistic metric mapping
      setAvgSaleValue(salesData.length > 0 ? (totalAmount * 1.5) / salesData.length : 0);

      // Fetch pending attempts in memory
      const attemptsRef = collection(db, 'checkout_attempts');
      const qAttempts = query(attemptsRef, where('status', '==', 'pending'));
      const aSnap = await getDocs(qAttempts);
      const attemptsData: any[] = [];
      aSnap.forEach((docSnap) => {
        attemptsData.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Sort by createdAt desc in-memory
      attemptsData.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });

      setPendingAttempts(attemptsData);
    } catch (err: any) {
      console.error(err);
      setError(`Finansal veriler çekilirken hata oluştu: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualApprove = async (sessionId: string) => {
    if (!window.confirm("Bu ödemeyi manuel olarak onaylamak ve Moon yüklemek istediğinize emin misiniz?")) return;
    setActionLoadingId(sessionId);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Giriş yapmış bir admin bulunamadı.");
      const idToken = await currentUser.getIdToken(true);

      const response = await fetch('/api/admin/complete-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        const resText = await response.text();
        throw new Error(`Manuel onaylama başarısız oldu: ${resText}`);
      }

      alert("Ödeme manuel olarak onaylandı ve Moon'lar hesaba yüklendi.");
      fetchSalesData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Manuel onaylama esnasında hata oluştu.");
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'USD' }).format(val);
  };

  const getDocDate = (doc: any): string => {
    const val = doc.createdAt;
    if (!val) return '-';
    if (val.seconds) return new Date(val.seconds * 1000).toLocaleString('tr-TR');
    return new Date(val).toLocaleString('tr-TR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#ecd8a6]">Stripe Finans & Satış</h2>
          <p className="text-sm text-[#ecd8a6]/60">Ödeme durumlarını, satın alma işlemlerini ve ciro grafiklerini izleyin.</p>
        </div>
        <button
          onClick={fetchSalesData}
          className="flex items-center gap-2 rounded-lg bg-purple-900/20 border border-[#ecd8a6]/20 px-4 py-2 hover:bg-purple-900/30 transition text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Yenile
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b] p-6 flex items-center justify-between shadow-lg shadow-purple-950/5">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#ecd8a6]/60 font-medium">Toplam Tahmini Ciro</span>
            <h3 className="mt-2 font-serif text-3xl text-green-400 font-bold">{formatCurrency(totalRevenue)}</h3>
          </div>
          <div className="rounded-full bg-green-500/10 border border-green-500/30 p-3 text-green-400">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b] p-6 flex items-center justify-between shadow-lg shadow-purple-950/5">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#ecd8a6]/60 font-medium">Satış Hacmi</span>
            <h3 className="mt-2 font-serif text-3xl text-[#ecd8a6] font-bold">{totalSalesCount} Adet</h3>
          </div>
          <div className="rounded-full bg-purple-500/10 border border-purple-500/30 p-3 text-purple-400">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b] p-6 flex items-center justify-between shadow-lg shadow-purple-950/5">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#ecd8a6]/60 font-medium">Sepet Ortalaması (AOV)</span>
            <h3 className="mt-2 font-serif text-3xl text-amber-300 font-bold">{formatCurrency(avgSaleValue)}</h3>
          </div>
          <div className="rounded-full bg-amber-500/10 border border-amber-500/30 p-3 text-amber-300">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Basic Trend visualization */}
      <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6">
        <h3 className="font-serif text-xl mb-4 text-[#ecd8a6]">Satış Grafiği (Son İşlemler)</h3>
        {sales.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-xs text-[#ecd8a6]/40">
            Veri bulunamadığı için grafik çizilemiyor.
          </div>
        ) : (
          <div className="h-40 flex items-end gap-2 px-4 border-b border-l border-[#ecd8a6]/10 pb-2">
            {sales.slice(0, 15).reverse().map((sale, idx) => {
              const heightPct = Math.min(100, Math.max(10, ((sale.amount || 1) / 10) * 100));
              return (
                <div key={sale.id || idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                  {/* Tooltip */}
                  <span className="absolute bottom-full mb-2 bg-[#07040e] border border-[#ecd8a6]/20 px-2 py-1 text-[10px] rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    {sale.amount} Moon ({formatCurrency(sale.amount * 1.5)})
                  </span>
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className="w-full rounded-t-sm bg-gradient-to-t from-purple-950 to-[#ecd8a6]/50 hover:to-[#ecd8a6]/90 transition"
                  ></div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending Transactions List */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl text-[#ecd8a6]">Bekleyen Ödeme Talepleri (Pending)</h3>
        {loading ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40">
            <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-b-2 border-[#ecd8a6]"></div>
          </div>
        ) : pendingAttempts.length === 0 ? (
          <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 text-[#ecd8a6]/40 text-xs">
            Bekleyen/Tamamlanmamış ödeme kaydı bulunmamaktadır.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-yellow-500/20 bg-[#0e0a1b]/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#ecd8a6]/80">
                <thead className="bg-[#0e0a1b] text-xs uppercase tracking-wider text-[#ecd8a6]/60">
                  <tr>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">Oturum ID (Session)</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">Tarih</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">Kullanıcı Kimliği (UID)</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">Satın Alınacak</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">Tutar</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ecd8a6]/10">
                  {pendingAttempts.map((attempt, idx) => (
                    <tr key={attempt.id || idx} className="hover:bg-yellow-950/5 transition">
                      <td className="px-6 py-4 font-mono text-xs max-w-[150px] truncate">{attempt.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">{getDocDate(attempt)}</td>
                      <td className="px-6 py-4 font-mono text-xs">{attempt.userId}</td>
                      <td className="px-6 py-4 font-bold text-yellow-500">{attempt.amount} Moon</td>
                      <td className="px-6 py-4 text-xs font-bold">${attempt.price || '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          disabled={actionLoadingId === attempt.id}
                          onClick={() => handleManualApprove(attempt.id)}
                          className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 text-xs text-yellow-400 hover:bg-yellow-500/20 transition disabled:opacity-50"
                        >
                          {actionLoadingId === attempt.id ? 'Yükleniyor...' : 'Manuel Onayla'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl text-[#ecd8a6]">Son Stripe İşlemleri (Limit 100)</h3>
        {loading ? (
          <div className="flex h-48 items-center justify-center rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40">
            <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-b-2 border-[#ecd8a6]"></div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-900/30 bg-red-950/10 p-4 text-center text-red-400 text-sm">
            {error}
          </div>
        ) : sales.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 text-[#ecd8a6]/40 text-sm">
            <AlertCircle className="h-8 w-8 mb-2" />
            Henüz Stripe ödeme kaydı bulunmamaktadır.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#ecd8a6]/80">
                <thead className="bg-[#0e0a1b] text-xs uppercase tracking-wider text-[#ecd8a6]/60">
                  <tr>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">Tarih</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">Kullanıcı Kimliği (UID)</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">Miktar</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">Sağlayıcı</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">Açıklama</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ecd8a6]/10">
                  {sales.map((sale, idx) => (
                    <tr key={sale.id || idx} className="hover:bg-purple-950/10 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-xs">{getDocDate(sale)}</td>
                      <td className="px-6 py-4 font-mono text-xs">{sale.userId}</td>
                      <td className="px-6 py-4 font-bold text-green-400">{sale.amount} Moon</td>
                      <td className="px-6 py-4 text-xs capitalize">{sale.paymentProvider || 'Stripe'}</td>
                      <td className="px-6 py-4 text-xs max-w-[200px] truncate">{sale.description || 'Satın Alım'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
