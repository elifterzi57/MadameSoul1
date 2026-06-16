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
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 text-sm shadow-sm">
          <span className="px-2 text-slate-400"><Calendar className="w-4 h-4" /></span>
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors ${timeFilter === 'all' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Tümü
          </button>
          <button
            onClick={() => setTimeFilter('daily')}
            className={`px-3 py-1 rounded-md transition-colors ${timeFilter === 'daily' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Günlük
          </button>
          <button
            onClick={() => setTimeFilter('monthly')}
            className={`px-3 py-1 rounded-md transition-colors ${timeFilter === 'monthly' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Aylık
          </button>
          <button
            onClick={() => setTimeFilter('yearly')}
            className={`px-3 py-1 rounded-md transition-colors ${timeFilter === 'yearly' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Yıllık
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <ArrowUpDown className="w-4 h-4" />
            Tarih: {sortOrder === 'desc' ? 'Yeniden Eskiye' : 'Eskiden Yeniye'}
          </button>

          <button
            onClick={fetchFinancialData}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-sm text-slate-500 font-medium">Toplam Gelir</span>
              <span className="block text-2xl font-extrabold text-slate-800 mt-2">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-sm text-slate-500 font-medium">Satış Sayısı</span>
              <span className="block text-2xl font-extrabold text-slate-800 mt-2">{totalSalesCount}</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-sm text-slate-500 font-medium">Satılan Moon</span>
              <span className="block text-2xl font-extrabold text-slate-800 mt-2">{totalMoonsSold} 🌙</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-sm text-slate-500 font-medium">Ortalama Sepet</span>
              <span className="block text-2xl font-extrabold text-slate-800 mt-2">
                ${averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Purchases Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800">Stripe Satın Alımları ({filteredAttempts.length})</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Yükleniyor...</div>
        ) : filteredAttempts.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Kriterlere uygun işlem bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="px-6 py-3">Kullanıcı ID</th>
                  <th className="px-6 py-3">Paket (Miktar)</th>
                  <th className="px-6 py-3">Ödenen Tutar</th>
                  <th className="px-6 py-3">Fatura ID</th>
                  <th className="px-6 py-3">Tarih</th>
                  <th className="px-6 py-3">Makbuz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                {filteredAttempts.map(att => {
                  const date = getAttemptDate(att);
                  return (
                    <tr key={att.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs select-all text-blue-600">{att.userId}</td>
                      <td className="px-6 py-4 font-medium">{att.amount || 0} Moon</td>
                      <td className="px-6 py-4 text-slate-900 font-semibold">
                        {att.price ? `$${att.price}` : '-'}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{att.stripeInvoiceId || '-'}</td>
                      <td className="px-6 py-4 text-xs">{date ? date.toLocaleString('tr-TR') : '-'}</td>
                      <td className="px-6 py-4">
                        {att.stripeReceiptUrl ? (
                          <a
                            href={att.stripeReceiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold"
                          >
                            Makbuz <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">Yok</span>
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
