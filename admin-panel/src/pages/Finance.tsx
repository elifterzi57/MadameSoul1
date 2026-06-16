import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { DollarSign, CreditCard, TrendingUp, Calendar, ArrowUpDown, RefreshCw, ExternalLink } from 'lucide-react';
import { startOfDay, startOfMonth, startOfYear, isAfter, parseISO } from 'date-fns';

interface CheckoutAttempt {
  id: string;
  userId: string;
  price?: number;
  amount?: number;
  currency?: string;
  status: string;
  stripeInvoiceId?: string;
  stripeReceiptUrl?: string;
  completedAt?: any;
  createdAt?: any;
}

export default function Finance() {
  const [attempts, setAttempts] = useState<CheckoutAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'all' | 'daily' | 'monthly' | 'yearly'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'checkout_attempts'),
        where('status', '==', 'completed'),
        limit(500)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CheckoutAttempt[];

      setAttempts(data);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const getAttemptDate = (att: CheckoutAttempt) => {
    const val = att.completedAt || att.createdAt;
    if (!val) return null;
    if (val.seconds) return new Date(val.seconds * 1000);
    if (typeof val === 'string') return parseISO(val);
    if (val instanceof Date) return val;
    return null;
  };

  // Filter and Sort Logic
  const filteredAttempts = attempts
    .filter(att => {
      if (timeFilter !== 'all') {
        const date = getAttemptDate(att);
        if (!date) return false;
        const now = new Date();
        if (timeFilter === 'daily') {
          return isAfter(date, startOfDay(now));
        } else if (timeFilter === 'monthly') {
          return isAfter(date, startOfMonth(now));
        } else if (timeFilter === 'yearly') {
          return isAfter(date, startOfYear(now));
        }
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = getAttemptDate(a)?.getTime() || 0;
      const dateB = getAttemptDate(b)?.getTime() || 0;
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Calculate Metrics
  const totalRevenue = filteredAttempts.reduce((sum, att) => sum + (att.price || 0), 0);
  const totalSalesCount = filteredAttempts.length;
  const totalMoonsSold = filteredAttempts.reduce((sum, att) => sum + (att.amount || 0), 0);
  const averageOrderValue = totalSalesCount > 0 ? (totalRevenue / totalSalesCount) : 0;

  return (
    <div className="space-y-6">
      {/* Filters & Refresh */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center bg-[#0a0512] border border-[#ecd8a6]/20 rounded-lg p-1 text-xs font-serif">
          <span className="px-2 text-[#ecd8a6]/50"><Calendar className="w-3.5 h-3.5" /></span>
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors text-xs tracking-wider cursor-pointer ${timeFilter === 'all' ? 'bg-[#1e1332] text-[#ecd8a6] border border-[#ecd8a6]/20' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]'}`}
          >
            TÜMÜ
          </button>
          <button
            onClick={() => setTimeFilter('daily')}
            className={`px-3 py-1.5 rounded-md transition-colors text-xs tracking-wider cursor-pointer ${timeFilter === 'daily' ? 'bg-[#1e1332] text-[#ecd8a6] border border-[#ecd8a6]/20' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]'}`}
          >
            GÜNLÜK
          </button>
          <button
            onClick={() => setTimeFilter('monthly')}
            className={`px-3 py-1.5 rounded-md transition-colors text-xs tracking-wider cursor-pointer ${timeFilter === 'monthly' ? 'bg-[#1e1332] text-[#ecd8a6] border border-[#ecd8a6]/20' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]'}`}
          >
            AYLIK
          </button>
          <button
            onClick={() => setTimeFilter('yearly')}
            className={`px-3 py-1.5 rounded-md transition-colors text-xs tracking-wider cursor-pointer ${timeFilter === 'yearly' ? 'bg-[#1e1332] text-[#ecd8a6] border border-[#ecd8a6]/20' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]'}`}
          >
            YILLIK
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 bg-[#0a0512] border border-[#ecd8a6]/20 hover:border-[#ecd8a6]/40 rounded-lg px-3 py-2 text-xs font-serif text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#ecd8a6]" />
            Tarih: {sortOrder === 'desc' ? 'Yeniden Eskiye' : 'Eskiden Yeniye'}
          </button>

          <button
            onClick={fetchFinancialData}
            disabled={loading}
            className="p-2 bg-[#0a0512] border border-[#ecd8a6]/20 hover:border-[#ecd8a6]/40 rounded-lg text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0a0512]/80 backdrop-blur-md border border-[#ecd8a6]/20 p-6 rounded-xl shadow-[0_0_30px_rgba(236,216,166,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-xs text-[#ecd8a6]/50 font-serif tracking-wider uppercase mb-1">Toplam Gelir</span>
              <span className="block text-2xl font-extrabold font-serif text-[#ecd8a6] mt-2 drop-shadow-[0_0_6px_rgba(236,216,166,0.15)]">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.05)]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-[#0a0512]/80 backdrop-blur-md border border-[#ecd8a6]/20 p-6 rounded-xl shadow-[0_0_30px_rgba(236,216,166,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-xs text-[#ecd8a6]/50 font-serif tracking-wider uppercase mb-1">Satış Sayısı</span>
              <span className="block text-2xl font-extrabold font-serif text-[#ecd8a6] mt-2 drop-shadow-[0_0_6px_rgba(236,216,166,0.15)]">{totalSalesCount}</span>
            </div>
            <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 text-indigo-400 rounded-lg shadow-[0_0_10px_rgba(99,102,241,0.05)]">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-[#0a0512]/80 backdrop-blur-md border border-[#ecd8a6]/20 p-6 rounded-xl shadow-[0_0_30px_rgba(236,216,166,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-xs text-[#ecd8a6]/50 font-serif tracking-wider uppercase mb-1">Satılan Moon</span>
              <span className="block text-2xl font-extrabold font-serif text-[#ecd8a6] mt-2 drop-shadow-[0_0_6px_rgba(236,216,166,0.15)]">{totalMoonsSold} 🌙</span>
            </div>
            <div className="p-3 bg-amber-950/20 border border-amber-500/20 text-amber-400 rounded-lg shadow-[0_0_10px_rgba(245,158,11,0.05)]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-[#0a0512]/80 backdrop-blur-md border border-[#ecd8a6]/20 p-6 rounded-xl shadow-[0_0_30px_rgba(236,216,166,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-xs text-[#ecd8a6]/50 font-serif tracking-wider uppercase mb-1">Ortalama Sepet</span>
              <span className="block text-2xl font-extrabold font-serif text-[#ecd8a6] mt-2 drop-shadow-[0_0_6px_rgba(236,216,166,0.15)]">
                ${averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 bg-[#1e1332]/40 border border-[#ecd8a6]/20 text-[#ecd8a6] rounded-lg shadow-[0_0_10px_rgba(236,216,166,0.05)]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Purchases Table */}
      <div className="bg-[#0a0512]/80 backdrop-blur-md border border-[#ecd8a6]/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(236,216,166,0.02)]">
        <div className="p-5 border-b border-[#ecd8a6]/15 flex justify-between items-center bg-[#120a1c]/40">
          <h2 className="font-serif tracking-widest text-sm text-[#ecd8a6] uppercase">Stripe Satın Alımları ({filteredAttempts.length})</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#ecd8a6]/60 font-sans font-light">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#ecd8a6]/70" />
            Veriler yükleniyor...
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="p-12 text-center text-[#ecd8a6]/50 font-sans">Kriterlere uygun işlem bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#ecd8a6]/10 text-left text-sm">
              <thead className="bg-[#120a1c] font-serif font-bold text-[#ecd8a6] tracking-wider text-xs uppercase border-b border-[#ecd8a6]/20">
                <tr>
                  <th className="px-6 py-4">Kullanıcı ID</th>
                  <th className="px-6 py-4">Paket (Miktar)</th>
                  <th className="px-6 py-4">Ödenen Tutar</th>
                  <th className="px-6 py-4">Fatura ID</th>
                  <th className="px-6 py-4">Tarih</th>
                  <th className="px-6 py-4">Makbuz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8a6]/10 text-[#ecd8a6]/80 font-sans">
                {filteredAttempts.map(att => {
                  const date = getAttemptDate(att);
                  return (
                    <tr key={att.id} className="hover:bg-[#1e1332]/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs select-all text-[#ecd8a6]">
                        <span className="bg-[#120a1c]/60 border border-[#ecd8a6]/10 px-2 py-1 rounded">
                          {att.userId}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">{att.amount || 0} Moon</td>
                      <td className="px-6 py-4 text-[#ecd8a6] font-semibold font-serif">
                        {att.price ? `$${att.price}` : '-'}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[#ecd8a6]/40">{att.stripeInvoiceId || '-'}</td>
                      <td className="px-6 py-4 text-xs font-light text-[#ecd8a6]/70">{date ? date.toLocaleString('tr-TR') : '-'}</td>
                      <td className="px-6 py-4">
                        {att.stripeReceiptUrl ? (
                          <a
                            href={att.stripeReceiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#ecd8a6] hover:text-white text-xs font-serif uppercase tracking-wider font-bold underline transition-colors cursor-pointer"
                          >
                            Makbuz <ExternalLink className="w-3 h-3 text-[#ecd8a6]" />
                          </a>
                        ) : (
                          <span className="text-[#ecd8a6]/30 text-xs">Yok</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
