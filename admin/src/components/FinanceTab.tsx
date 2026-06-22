import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { DollarSign, ShoppingBag, TrendingUp, RefreshCw, AlertCircle, CheckCircle2, X, Info, ShieldAlert, Loader2 } from 'lucide-react';

interface FinanceTabProps {
  userRole: 'admin' | 'employee' | 'viewer' | null;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ userRole: _userRole }) => {
  const [sales, setSales] = useState<any[]>([]);
  const [pendingAttempts, setPendingAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Sally's custom modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<any | null>(null);
  const [modalState, setModalState] = useState<'confirm' | 'loading' | 'success' | 'error'>('confirm');
  const [modalError, setModalError] = useState<string | null>(null);

  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [completedMethods, setCompletedMethods] = useState<Record<string, string>>({});

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
      qSnap.forEach((docSnap) => {
        const data = docSnap.data();
        salesData.push({ id: docSnap.id, ...data });
      });

      setSales(salesData);

      // Fetch all checkout_attempts to group by pending vs completed without index issues
      const attemptsRef = collection(db, 'checkout_attempts');
      const aSnap = await getDocs(attemptsRef);
      const pendingData: any[] = [];
      const completedData: any[] = [];
      let totalAmountUSD = 0;

      const completedMethodsMap: Record<string, string> = {};
      aSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const docWithId = { id: docSnap.id, ...data };
        if (data.status === 'pending') {
          pendingData.push(docWithId);
        } else if (data.status === 'completed') {
          completedData.push(docWithId);
          totalAmountUSD += Number(data.price || 0);
          completedMethodsMap[docSnap.id] = data.completedMethod || 'webhook';
        }
      });
      setCompletedMethods(completedMethodsMap);

      // Sort pending attempts by createdAt desc in-memory
      pendingData.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });

      setPendingAttempts(pendingData);

      // Fetch users to map email / phone
      const usersRef = collection(db, 'users');
      const uSnap = await getDocs(usersRef);
      const uMap: Record<string, string> = {};
      uSnap.forEach((docSnap) => {
        const uData = docSnap.data();
        uMap[docSnap.id] = uData.email || uData.phoneNumber || '-';
      });
      setUsersMap(uMap);

      // Set actual completed metrics
      setTotalSalesCount(completedData.length);
      setTotalRevenue(totalAmountUSD);
      setAvgSaleValue(completedData.length > 0 ? totalAmountUSD / completedData.length : 0);
    } catch (err: any) {
      console.error(err);
      setError(`Finansal veriler çekilirken hata oluştu: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualApprove = (attempt: any) => {
    setSelectedAttempt(attempt);
    setModalState('confirm');
    setModalError(null);
    setIsModalOpen(true);
  };

  const executeManualApprove = async () => {
    if (!selectedAttempt) return;
    setModalState('loading');
    setActionLoadingId(selectedAttempt.id);
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
        body: JSON.stringify({ sessionId: selectedAttempt.id })
      });

      if (!response.ok) {
        const resText = await response.text();
        throw new Error(`Manuel onaylama başarısız oldu: ${resText}`);
      }

      setModalState('success');
      fetchSalesData();
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || "Manuel onaylama esnasında hata oluştu.");
      setModalState('error');
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
            <span className="text-xs uppercase tracking-wider text-[#ecd8a6]/60 font-medium">Toplam Ciro (Completed)</span>
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
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">DATE</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">MAIL</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">SESSION</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">AMOUNT</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">PRICE</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ecd8a6]/10">
                  {pendingAttempts.map((attempt, idx) => (
                    <tr key={attempt.id || idx} className="hover:bg-yellow-950/5 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-xs">{getDocDate(attempt)}</td>
                      <td className="px-6 py-4 text-xs max-w-[150px] truncate">{usersMap[attempt.userId] || attempt.userId}</td>
                      <td className="px-6 py-4 font-mono text-xs max-w-[150px] truncate">{attempt.id}</td>
                      <td className="px-6 py-4 font-bold text-yellow-500">{attempt.amount} Moon</td>
                      <td className="px-6 py-4 text-xs font-bold">${attempt.price || '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          disabled={actionLoadingId === attempt.id}
                          onClick={() => handleManualApprove(attempt)}
                          className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 text-xs text-yellow-400 hover:bg-yellow-500/20 transition disabled:opacity-50"
                        >
                          Manuel Onayla
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
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">DATE</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">MAIL</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">AMOUNT</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">PRICE</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">PROVIDER</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">STATUS</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ecd8a6]/10">
                  {sales.map((sale, idx) => {
                    let mappedPrice = '$0.00';
                    if (sale.amount === 3) mappedPrice = '$2.99';
                    else if (sale.amount === 10) mappedPrice = '$8.99';
                    else if (sale.amount === 25) mappedPrice = '$19.99';
                    else if (sale.amount) mappedPrice = `$${(sale.amount * 0.8).toFixed(2)}`;

                    return (
                      <tr key={sale.id || idx} className="hover:bg-purple-950/10 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-xs">{getDocDate(sale)}</td>
                        <td className="px-6 py-4 text-xs max-w-[150px] truncate">{usersMap[sale.userId] || sale.userId}</td>
                        <td className="px-6 py-4 font-bold text-green-400">{sale.amount} Moon</td>
                        <td className="px-6 py-4 text-xs font-bold text-[#ecd8a6]">{mappedPrice}</td>
                        <td className="px-6 py-4 text-xs capitalize">{sale.paymentProvider || 'Stripe'}</td>
                        <td className="px-6 py-4 text-xs">
                          {(() => {
                            const method = completedMethods[sale.idempotencyKey];
                            if (method === 'manual') {
                              return (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  Manual (Admin)
                                </span>
                              );
                            }
                            return (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                Auto (Webhook)
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 text-xs max-w-[200px] truncate">{sale.description || 'Satın Alım'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Sally's Custom Approval Modal */}
      {isModalOpen && selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#ecd8a6]/20 bg-[#0e0a1b] p-6 shadow-2xl shadow-purple-950/50 transition-all">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#ecd8a6]/10 pb-4 mb-4">
              <h3 className="font-serif text-xl text-[#ecd8a6] flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-yellow-500" />
                Ödeme Onaylama
              </h3>
              {modalState !== 'loading' && (
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1 text-[#ecd8a6]/60 hover:bg-white/5 hover:text-[#ecd8a6] transition"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Modal Content depending on state */}
            {modalState === 'confirm' && (
              <div className="space-y-4">
                <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/20 p-3 text-xs text-yellow-500 flex gap-2">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>Bu işlem, seçilen Stripe oturumunun ödemesini onaylayarak kullanıcının hesabına Katina Moon yüklemesi gerçekleştirecektir. Lütfen bilgileri kontrol edin.</p>
                </div>

                <div className="space-y-2 rounded-xl bg-purple-950/20 border border-[#ecd8a6]/10 p-4 text-sm">
                  <div className="flex flex-col gap-1 py-2 border-b border-[#ecd8a6]/5 text-left">
                    <span className="text-[#ecd8a6]/60 text-xs">Oturum (Session) ID</span>
                    <span className="font-mono text-xs select-all break-all bg-black/30 p-1.5 rounded">{selectedAttempt.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#ecd8a6]/5 items-center">
                    <span className="text-[#ecd8a6]/60 text-xs">Kullanıcı (Mail/Tel)</span>
                    <span className="font-mono text-xs select-all text-right break-all max-w-[250px]">{usersMap[selectedAttempt.userId] || selectedAttempt.userId}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#ecd8a6]/5 items-center">
                    <span className="text-[#ecd8a6]/60 text-xs">Satın Alınacak Tutar</span>
                    <span className="font-bold text-yellow-500">{selectedAttempt.amount} Moon</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#ecd8a6]/5 items-center">
                    <span className="text-[#ecd8a6]/60 text-xs">Fiyat</span>
                    <span className="font-bold text-green-400">${selectedAttempt.price || '0.00'}</span>
                  </div>
                  <div className="flex justify-between py-2 items-center">
                    <span className="text-[#ecd8a6]/60 text-xs">Oluşturulma Tarihi</span>
                    <span className="text-xs">{getDocDate(selectedAttempt)}</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm text-[#ecd8a6]/80 border border-[#ecd8a6]/20 rounded-lg hover:bg-white/5 transition"
                  >
                    İptal
                  </button>
                  <button
                    onClick={executeManualApprove}
                    className="px-5 py-2 text-sm text-[#0e0a1b] bg-[#ecd8a6] hover:bg-[#ecd8a6]/90 font-semibold rounded-lg shadow-lg shadow-yellow-500/10 transition"
                  >
                    Evet, Onayla ve Yükle
                  </button>
                </div>
              </div>
            )}

            {modalState === 'loading' && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="h-10 w-10 text-yellow-500 animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-medium text-[#ecd8a6]">Ödeme Onaylanıyor</p>
                  <p className="text-xs text-[#ecd8a6]/60 mt-1">Stripe oturumu tamamlanıyor ve Moon'lar aktarılıyor...</p>
                </div>
              </div>
            )}

            {modalState === 'success' && (
              <div className="space-y-4 text-center py-4">
                <div className="inline-flex rounded-full bg-green-500/10 border border-green-500/30 p-3 text-green-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-green-400">Ödeme Başarıyla Tamamlandı</h4>
                  <p className="text-xs text-[#ecd8a6]/60 mt-1">Kullanıcı hesabına {selectedAttempt.amount} Moon başarıyla yüklendi.</p>
                </div>
                <div className="rounded-xl bg-purple-950/20 border border-[#ecd8a6]/10 p-3 text-xs text-left max-w-sm mx-auto space-y-1">
                  <div><span className="text-[#ecd8a6]/60">Kullanıcı (Mail/Tel):</span> <span className="font-mono break-all">{usersMap[selectedAttempt.userId] || selectedAttempt.userId}</span></div>
                  <div><span className="text-[#ecd8a6]/60">Miktar:</span> <span className="font-bold text-yellow-500">{selectedAttempt.amount} Moon</span></div>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full px-4 py-2 text-sm text-[#0e0a1b] bg-[#ecd8a6] hover:bg-[#ecd8a6]/90 font-semibold rounded-lg transition"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}

            {modalState === 'error' && (
              <div className="space-y-4 text-center py-4">
                <div className="inline-flex rounded-full bg-red-500/10 border border-red-500/30 p-3 text-red-400">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-red-400">Onaylama Başarısız</h4>
                  <p className="text-xs text-red-400/80 mt-1 max-h-24 overflow-y-auto">{modalError}</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 text-sm text-[#ecd8a6]/80 border border-[#ecd8a6]/20 rounded-lg hover:bg-white/5 transition"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={executeManualApprove}
                    className="flex-1 px-4 py-2 text-sm text-[#0e0a1b] bg-[#ecd8a6] hover:bg-[#ecd8a6]/90 font-semibold rounded-lg transition"
                  >
                    Yeniden Dene
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
