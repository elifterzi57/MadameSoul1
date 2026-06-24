import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { DollarSign, ShoppingBag, TrendingUp, RefreshCw, AlertCircle, CheckCircle2, X, Info, ShieldAlert, Loader2, Clock, Calendar, Layers } from 'lucide-react';

interface FinanceTabProps {
  userRole: 'admin' | 'employee' | 'viewer' | null;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ userRole: _userRole }) => {
  const [sales, setSales] = useState<any[]>([]);
  const [pendingAttempts, setPendingAttempts] = useState<any[]>([]);
  const [completedAttempts, setCompletedAttempts] = useState<any[]>([]);
  const [period, setPeriod] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Sally's custom modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<any | null>(null);
  const [modalState, setModalState] = useState<'confirm' | 'loading' | 'success' | 'error'>('confirm');
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');

  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [completedMethods, setCompletedMethods] = useState<Record<string, string>>({});

  const [stripeListenerActive, setStripeListenerActive] = useState(false);
  const [listenerLoading, setListenerLoading] = useState(false);

  // Sorting state for pending and sales tables
  const [pendingSort, setPendingSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'createdAt', direction: 'desc' });
  const [salesSort, setSalesSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'createdAt', direction: 'desc' });

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

      // Fetch all checkout_attempts to group by pending vs completed without index issues
      const attemptsRef = collection(db, 'checkout_attempts');
      const aSnap = await getDocs(attemptsRef);
      const pendingData: any[] = [];
      const completedData: any[] = [];

      const completedMethodsMap: Record<string, string> = {};
      aSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const docWithId = { id: docSnap.id, ...data };
        if (data.status === 'pending') {
          pendingData.push(docWithId);
        } else if (data.status === 'completed') {
          completedData.push(docWithId);
          completedMethodsMap[docSnap.id] = data.completedMethod || 'webhook';
        } else if (data.status === 'cancelled') {
          // Push to salesData as a mock transaction object for visibility
          salesData.push({
            id: docSnap.id,
            userId: data.userId,
            amount: data.amount,
            price: data.price || (data.amount === 3 ? 2.99 : data.amount === 10 ? 8.99 : data.amount === 25 ? 19.99 : data.amount * 0.8),
            paymentProvider: 'Stripe',
            idempotencyKey: docSnap.id,
            createdAt: data.completedAt || data.createdAt || new Date(),
            description: 'Ödemesi gerçekleşmeyen işlemin iptali',
            isCancelled: true
          });
          completedMethodsMap[docSnap.id] = 'manual_reject';
        }
      });
      setSales(salesData);
      setCompletedMethods(completedMethodsMap);
      setCompletedAttempts(completedData);

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
    } catch (err: any) {
      console.error(err);
      setError(`Finansal veriler çekilirken hata oluştu: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualApprove = (attempt: any) => {
    setSelectedAttempt(attempt);
    setModalAction('approve');
    setModalState('confirm');
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleManualReject = (attempt: any) => {
    setSelectedAttempt(attempt);
    setModalAction('reject');
    setModalState('confirm');
    setModalError(null);
    setIsModalOpen(true);
  };

  const executeManualReject = async () => {
    if (!selectedAttempt) return;
    setModalState('loading');
    setActionLoadingId(selectedAttempt.id);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Giriş yapmış bir admin bulunamadı.");
      const idToken = await currentUser.getIdToken(true);

      const response = await fetch('/api/admin/reject-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ sessionId: selectedAttempt.id })
      });

      if (!response.ok) {
        const resText = await response.text();
        throw new Error(`İşlem iptal edilemedi: ${resText}`);
      }

      setModalState('success');
      fetchSalesData();
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || "İşlem iptal edilirken hata oluştu.");
      setModalState('error');
    } finally {
      setActionLoadingId(null);
    }
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

  const fetchListenerStatus = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const idToken = await currentUser.getIdToken(true);
      const res = await fetch('/api/admin/stripe-listener/status', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStripeListenerActive(data.status === 'running');
      }
    } catch (e) {
      console.error("Failed to fetch Stripe listener status:", e);
    }
  };

  const toggleStripeListener = async () => {
    setListenerLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const idToken = await currentUser.getIdToken(true);
      const action = stripeListenerActive ? 'stop' : 'start';
      const res = await fetch('/api/admin/stripe-listener/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        const data = await res.json();
        setStripeListenerActive(data.status === 'running');
      } else {
        const errText = await res.text();
        alert(`Dinleyici kontrol hatası: ${errText}`);
      }
    } catch (e: any) {
      console.error(e);
      alert(`Hata: ${e.message || e}`);
    } finally {
      setListenerLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
    fetchListenerStatus();
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

  const getDocDateObject = (doc: any): Date | null => {
    const val = doc.createdAt || doc.timestamp || doc.updatedAt;
    if (!val) return null;
    if (val.seconds) return new Date(val.seconds * 1000);
    return new Date(val);
  };

  // Filter completed attempts, pending attempts, and sales based on the selected period
  const filteredCompleted = completedAttempts.filter((item) => {
    if (period === 'all') return true;
    const itemDate = getDocDateObject(item);
    if (!itemDate) return false;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - itemDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (period === 'daily') return diffDays <= 1;
    if (period === 'weekly') return diffDays <= 7;
    if (period === 'monthly') return diffDays <= 30;
    return true;
  });

  const filteredPending = pendingAttempts.filter((item) => {
    if (period === 'all') return true;
    const itemDate = getDocDateObject(item);
    if (!itemDate) return false;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - itemDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (period === 'daily') return diffDays <= 1;
    if (period === 'weekly') return diffDays <= 7;
    if (period === 'monthly') return diffDays <= 30;
    return true;
  });

  const filteredSales = sales.filter((item) => {
    if (period === 'all') return true;
    const itemDate = getDocDateObject(item);
    if (!itemDate) return false;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - itemDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (period === 'daily') return diffDays <= 1;
    if (period === 'weekly') return diffDays <= 7;
    if (period === 'monthly') return diffDays <= 30;
    return true;
  });

  // Calculate metrics based on filtered completed attempts
  const displaySalesCount = filteredCompleted.length;
  const displayRevenue = filteredCompleted.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const displayAvgSaleValue = displaySalesCount > 0 ? displayRevenue / displaySalesCount : 0;

  // Sorting handlers and logic
  const handleSortPending = (field: string) => {
    setPendingSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleSortSales = (field: string) => {
    setSalesSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const sortedPending = [...filteredPending].sort((a, b) => {
    let aVal: any = a[pendingSort.field];
    let bVal: any = b[pendingSort.field];

    if (pendingSort.field === 'userId') {
      aVal = usersMap[a.userId] || a.userId || '';
      bVal = usersMap[b.userId] || b.userId || '';
    } else if (pendingSort.field === 'createdAt') {
      aVal = getDocDateObject(a)?.getTime() || 0;
      bVal = getDocDateObject(b)?.getTime() || 0;
    } else if (pendingSort.field === 'amount' || pendingSort.field === 'price') {
      aVal = Number(aVal || 0);
      bVal = Number(bVal || 0);
    } else {
      aVal = String(aVal || '').toLowerCase();
      bVal = String(bVal || '').toLowerCase();
    }

    if (aVal < bVal) return pendingSort.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return pendingSort.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const sortedSales = [...filteredSales].sort((a, b) => {
    let aVal: any = a[salesSort.field];
    let bVal: any = b[salesSort.field];

    if (salesSort.field === 'userId') {
      aVal = usersMap[a.userId] || a.userId || '';
      bVal = usersMap[b.userId] || b.userId || '';
    } else if (salesSort.field === 'createdAt') {
      aVal = getDocDateObject(a)?.getTime() || 0;
      bVal = getDocDateObject(b)?.getTime() || 0;
    } else if (salesSort.field === 'price') {
      const getPrice = (item: any) => {
        if (item.amount === 3) return 2.99;
        if (item.amount === 10) return 8.99;
        if (item.amount === 25) return 19.99;
        return Number(item.amount || 0) * 0.8;
      };
      aVal = getPrice(a);
      bVal = getPrice(b);
    } else if (salesSort.field === 'completedMethod') {
      aVal = completedMethods[a.idempotencyKey] || 'webhook';
      bVal = completedMethods[b.idempotencyKey] || 'webhook';
    } else if (salesSort.field === 'amount') {
      aVal = Number(aVal || 0);
      bVal = Number(bVal || 0);
    } else {
      aVal = String(aVal || '').toLowerCase();
      bVal = String(bVal || '').toLowerCase();
    }

    if (aVal < bVal) return salesSort.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return salesSort.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (currentField: string, activeSort: { field: string; direction: 'asc' | 'desc' }) => {
    if (activeSort.field !== currentField) {
      return <span className="text-[#ecd8a6]/25 ml-1 select-none">↕</span>;
    }
    return activeSort.direction === 'asc' 
      ? <span className="text-green-400 ml-1 select-none">↑</span> 
      : <span className="text-red-400 ml-1 select-none">↓</span>;
  };

  // Generate chart data points based on selected period
  const getChartData = () => {
    const now = new Date();
    let startDate = new Date();
    let numIntervals = 8;
    let labelFormat: 'hour' | 'day' | 'month' = 'day';

    if (period === 'daily') {
      startDate.setHours(now.getHours() - 24);
      numIntervals = 12; // every 2 hours
      labelFormat = 'hour';
    } else if (period === 'weekly') {
      startDate.setDate(now.getDate() - 7);
      numIntervals = 7; // daily
      labelFormat = 'day';
    } else if (period === 'monthly') {
      startDate.setDate(now.getDate() - 30);
      numIntervals = 10; // every 3 days
      labelFormat = 'day';
    } else {
      // Find oldest transaction or default to 6 months
      if (completedAttempts.length > 0) {
        const dates = completedAttempts.map(tx => getDocDateObject(tx)).filter(d => d !== null) as Date[];
        if (dates.length > 0) {
          const oldest = new Date(Math.min(...dates.map(d => d.getTime())));
          startDate = oldest;
        } else {
          startDate.setMonth(now.getMonth() - 6);
        }
      } else {
        startDate.setMonth(now.getMonth() - 6);
      }
      numIntervals = 6;
      labelFormat = 'month';
    }

    const duration = now.getTime() - startDate.getTime();
    const intervalMs = duration / numIntervals;
    const intervals: { start: Date; end: Date; total: number; label: string }[] = [];

    for (let i = 0; i < numIntervals; i++) {
      const intervalStart = new Date(startDate.getTime() + i * intervalMs);
      const intervalEnd = new Date(startDate.getTime() + (i + 1) * intervalMs);
      
      let label = '';
      if (labelFormat === 'hour') {
        label = intervalEnd.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      } else if (labelFormat === 'day') {
        label = intervalEnd.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      } else if (labelFormat === 'month') {
        label = intervalEnd.toLocaleDateString('tr-TR', { month: 'short' });
      }

      intervals.push({
        start: intervalStart,
        end: intervalEnd,
        total: 0,
        label
      });
    }

    // Sum transactions into intervals
    filteredCompleted.forEach((tx) => {
      const txDate = getDocDateObject(tx);
      if (!txDate) return;
      
      // Find matching interval
      for (let i = 0; i < numIntervals; i++) {
        const interval = intervals[i];
        if (txDate.getTime() >= interval.start.getTime() && txDate.getTime() <= interval.end.getTime()) {
          interval.total += Number(tx.price || 0);
          break;
        }
      }
    });

    return intervals;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#ecd8a6]/10 pb-6">
        <div>
          <h2 className="font-serif text-3xl text-[#ecd8a6]">Stripe Finans & Satış</h2>
          <p className="text-sm text-[#ecd8a6]/60">Ödeme durumlarını, satın alma işlemlerini ve ciro grafiklerini izleyin.</p>
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
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
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

          {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
            <button
              disabled={listenerLoading}
              onClick={toggleStripeListener}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition text-sm font-medium ${
                stripeListenerActive 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' 
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${stripeListenerActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
              {stripeListenerActive ? 'Stripe CLI: Aktif' : 'Stripe CLI: Kapalı (Başlat)'}
            </button>
          )}

          <button
            onClick={fetchSalesData}
            className="flex items-center gap-2 rounded-lg bg-purple-900/20 border border-[#ecd8a6]/20 px-4 py-2 hover:bg-purple-900/30 transition text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Yenile
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b] p-6 flex items-center justify-between shadow-lg shadow-purple-950/5">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#ecd8a6]/60 font-medium">Toplam Ciro (Completed)</span>
            <h3 className="mt-2 font-serif text-3xl text-green-400 font-bold">{formatCurrency(displayRevenue)}</h3>
          </div>
          <div className="rounded-full bg-green-500/10 border border-green-500/30 p-3 text-green-400">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b] p-6 flex items-center justify-between shadow-lg shadow-purple-950/5">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#ecd8a6]/60 font-medium">Satış Hacmi</span>
            <h3 className="mt-2 font-serif text-3xl text-[#ecd8a6] font-bold">{displaySalesCount} Adet</h3>
          </div>
          <div className="rounded-full bg-purple-500/10 border border-purple-500/30 p-3 text-purple-400">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b] p-6 flex items-center justify-between shadow-lg shadow-purple-950/5">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#ecd8a6]/60 font-medium">Sepet Ortalaması (AOV)</span>
            <h3 className="mt-2 font-serif text-3xl text-amber-300 font-bold">{formatCurrency(displayAvgSaleValue)}</h3>
          </div>
          <div className="rounded-full bg-amber-500/10 border border-amber-500/30 p-3 text-amber-300">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Dynamic Line Chart (Sally's Premium Design) */}
      <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6">
        <h3 className="font-serif text-xl mb-4 text-[#ecd8a6] flex items-center justify-between">
          <span>Stripe Satış Ciro Grafiği</span>
          <span className="text-xs font-sans text-green-400 font-semibold px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
            {period === 'daily' ? 'Son 24 Saat' : period === 'weekly' ? 'Son 7 Gün' : period === 'monthly' ? 'Son 30 Gün' : 'Tüm Zamanlar'}
          </span>
        </h3>
        {filteredCompleted.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-xs text-[#ecd8a6]/40">
            Bu dönemde gerçekleşen herhangi bir tamamlanmış satış bulunmadığı için grafik çizilemiyor.
          </div>
        ) : (() => {
          const chartData = getChartData();
          const maxVal = Math.max(...chartData.map(d => d.total), 10);
          
          const svgWidth = 800;
          const svgHeight = 240;
          const paddingLeft = 60;
          const paddingRight = 40;
          const paddingTop = 30;
          const paddingBottom = 40;
          
          const chartWidth = svgWidth - paddingLeft - paddingRight;
          const chartHeight = svgHeight - paddingTop - paddingBottom;

          const points = chartData.map((d, i) => {
            const x = paddingLeft + (i / (chartData.length - 1)) * chartWidth;
            const y = svgHeight - paddingBottom - (d.total / maxVal) * chartHeight;
            return { x, y, val: d.total, label: d.label };
          });

          const pathD = points.reduce((acc, p, i) => {
            return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
          }, '');

          // Generate area curve filled path for the gradient
          const areaD = points.length > 0 
            ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingBottom} L ${points[0].x} ${svgHeight - paddingBottom} Z`
            : '';

          const gridValues = [0, 0.25, 0.5, 0.75, 1];

          return (
            <div className="w-full overflow-x-auto select-none">
              <div className="min-w-[600px] h-60">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ecd8a6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0c081a" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Horizontal Grid lines and labels */}
                  {gridValues.map((v, idx) => {
                    const y = svgHeight - paddingBottom - v * chartHeight;
                    return (
                      <g key={idx} className="opacity-40">
                        <line 
                          x1={paddingLeft} 
                          y1={y} 
                          x2={svgWidth - paddingRight} 
                          y2={y} 
                          stroke="#ecd8a6" 
                          strokeWidth="0.5" 
                          strokeDasharray="4 4"
                        />
                        <text 
                          x={paddingLeft - 10} 
                          y={y + 4} 
                          fill="#ecd8a6" 
                          fontSize="9" 
                          textAnchor="end"
                          className="font-mono font-semibold"
                        >
                          {formatCurrency(v * maxVal)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area fill path under line */}
                  {areaD && (
                    <path d={areaD} fill="url(#chartGradient)" />
                  )}

                  {/* Line Chart path */}
                  {pathD && (
                    <path 
                      d={pathD} 
                      fill="none" 
                      stroke="#ecd8a6" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      filter="url(#glow)"
                    />
                  )}

                  {/* Data points (dots) and interactive tooltips */}
                  {points.map((p, idx) => (
                    <g key={idx} className="group/dot cursor-pointer">
                      <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r="4" 
                        fill="#0e0a1b" 
                        stroke="#ecd8a6" 
                        strokeWidth="2"
                        className="transition hover:r-6 hover:fill-[#ecd8a6]"
                      />
                      {/* Tooltip background & text */}
                      <g className="opacity-0 group-hover/dot:opacity-100 transition duration-200 pointer-events-none">
                        <rect 
                          x={p.x - 55} 
                          y={p.y - 32} 
                          width="110" 
                          height="22" 
                          rx="4" 
                          fill="#07040e" 
                          stroke="#ecd8a6" 
                          strokeWidth="1"
                          opacity="0.95"
                        />
                        <text 
                          x={p.x} 
                          y={p.y - 18} 
                          fill="#ecd8a6" 
                          fontSize="10" 
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {formatCurrency(p.val)}
                        </text>
                      </g>
                    </g>
                  ))}

                  {/* X Axis Labels */}
                  {points.map((p, idx) => (
                    <text 
                      key={idx} 
                      x={p.x} 
                      y={svgHeight - 15} 
                      fill="#ecd8a6" 
                      fontSize="9" 
                      textAnchor="middle" 
                      className="opacity-60 font-semibold"
                    >
                      {p.label}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Pending Transactions List */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl text-[#ecd8a6]">Bekleyen Ödeme Talepleri (Pending)</h3>
        {loading ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40">
            <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-b-2 border-[#ecd8a6]"></div>
          </div>
        ) : filteredPending.length === 0 ? (
          <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 text-[#ecd8a6]/40 text-xs">
            Bekleyen/Tamamlanmamış ödeme kaydı bulunmamaktadır.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-yellow-500/20 bg-[#0e0a1b]/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#ecd8a6]/80">
                <thead className="bg-[#0e0a1b] text-xs uppercase tracking-wider text-[#ecd8a6]/60">
                  <tr>
                    <th 
                      onClick={() => handleSortPending('createdAt')} 
                      className="px-6 py-4 border-b border-[#ecd8a6]/10 cursor-pointer hover:bg-[#ecd8a6]/5 select-none transition"
                    >
                      DATE {renderSortIcon('createdAt', pendingSort)}
                    </th>
                    <th 
                      onClick={() => handleSortPending('userId')} 
                      className="px-6 py-4 border-b border-[#ecd8a6]/10 cursor-pointer hover:bg-[#ecd8a6]/5 select-none transition"
                    >
                      MAIL {renderSortIcon('userId', pendingSort)}
                    </th>
                    <th 
                      onClick={() => handleSortPending('id')} 
                      className="px-6 py-4 border-b border-[#ecd8a6]/10 cursor-pointer hover:bg-[#ecd8a6]/5 select-none transition"
                    >
                      SESSION {renderSortIcon('id', pendingSort)}
                    </th>
                    <th 
                      onClick={() => handleSortPending('amount')} 
                      className="px-6 py-4 border-b border-[#ecd8a6]/10 cursor-pointer hover:bg-[#ecd8a6]/5 select-none transition"
                    >
                      AMOUNT {renderSortIcon('amount', pendingSort)}
                    </th>
                    <th 
                      onClick={() => handleSortPending('price')} 
                      className="px-6 py-4 border-b border-[#ecd8a6]/10 cursor-pointer hover:bg-[#ecd8a6]/5 select-none transition"
                    >
                      PRICE {renderSortIcon('price', pendingSort)}
                    </th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10 select-none">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ecd8a6]/10">
                  {sortedPending.map((attempt, idx) => (
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
                        <button
                          disabled={actionLoadingId === attempt.id}
                          onClick={() => handleManualReject(attempt)}
                          className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-1 text-xs text-rose-400 hover:bg-rose-500/20 transition disabled:opacity-50 ml-2"
                        >
                          İptal Et
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
        ) : filteredSales.length === 0 ? (
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
                    <th 
                      onClick={() => handleSortSales('createdAt')} 
                      className="px-6 py-4 border-b border-[#ecd8a6]/10 cursor-pointer hover:bg-[#ecd8a6]/5 select-none transition"
                    >
                      DATE {renderSortIcon('createdAt', salesSort)}
                    </th>
                    <th 
                      onClick={() => handleSortSales('userId')} 
                      className="px-6 py-4 border-b border-[#ecd8a6]/10 cursor-pointer hover:bg-[#ecd8a6]/5 select-none transition"
                    >
                      MAIL {renderSortIcon('userId', salesSort)}
                    </th>
                    <th 
                      onClick={() => handleSortSales('amount')} 
                      className="px-6 py-4 border-b border-[#ecd8a6]/10 cursor-pointer hover:bg-[#ecd8a6]/5 select-none transition"
                    >
                      AMOUNT {renderSortIcon('amount', salesSort)}
                    </th>
                    <th 
                      onClick={() => handleSortSales('price')} 
                      className="px-6 py-4 border-b border-[#ecd8a6]/10 cursor-pointer hover:bg-[#ecd8a6]/5 select-none transition"
                    >
                      PRICE {renderSortIcon('price', salesSort)}
                    </th>
                    <th 
                      onClick={() => handleSortSales('paymentProvider')} 
                      className="px-6 py-4 border-b border-[#ecd8a6]/10 cursor-pointer hover:bg-[#ecd8a6]/5 select-none transition"
                    >
                      PROVIDER {renderSortIcon('paymentProvider', salesSort)}
                    </th>
                    <th 
                      onClick={() => handleSortSales('completedMethod')} 
                      className="px-6 py-4 border-b border-[#ecd8a6]/10 cursor-pointer hover:bg-[#ecd8a6]/5 select-none transition"
                    >
                      STATUS {renderSortIcon('completedMethod', salesSort)}
                    </th>
                    <th 
                      onClick={() => handleSortSales('description')} 
                      className="px-6 py-4 border-b border-[#ecd8a6]/10 cursor-pointer hover:bg-[#ecd8a6]/5 select-none transition"
                    >
                      DESCRIPTION {renderSortIcon('description', salesSort)}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ecd8a6]/10">
                  {sortedSales.map((sale, idx) => {
                    let mappedPrice = '$0.00';
                    if (sale.amount === 3) mappedPrice = '$2.99';
                    else if (sale.amount === 10) mappedPrice = '$8.99';
                    else if (sale.amount === 25) mappedPrice = '$19.99';
                    else if (sale.amount) mappedPrice = `$${(sale.amount * 0.8).toFixed(2)}`;

                    return (
                      <tr key={sale.id || idx} className={`hover:bg-purple-950/10 transition ${sale.isCancelled ? 'opacity-70 bg-rose-950/5' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">{getDocDate(sale)}</td>
                        <td className="px-6 py-4 text-xs max-w-[150px] truncate">{usersMap[sale.userId] || sale.userId}</td>
                        <td className={`px-6 py-4 font-bold ${sale.isCancelled ? 'text-rose-400/50 line-through' : 'text-green-400'}`}>{sale.amount} Moon</td>
                        <td className={`px-6 py-4 text-xs font-bold ${sale.isCancelled ? 'text-[#ecd8a6]/40 line-through' : 'text-[#ecd8a6]'}`}>{mappedPrice}</td>
                        <td className="px-6 py-4 text-xs capitalize">{sale.paymentProvider || 'Stripe'}</td>
                        <td className="px-6 py-4 text-xs">
                          {(() => {
                            if (sale.isCancelled) {
                              return (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                  İptal Edildi
                                </span>
                              );
                            }
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
                        <td className={`px-6 py-4 text-xs max-w-[280px] break-words whitespace-normal ${sale.isCancelled ? 'text-rose-400/70' : ''}`}>{sale.description || 'Satın Alım'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Sally's Custom Approval/Cancellation Modal */}
      {isModalOpen && selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#ecd8a6]/20 bg-[#0e0a1b] p-6 shadow-2xl shadow-purple-950/50 transition-all">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#ecd8a6]/10 pb-4 mb-4">
              <h3 className="font-serif text-xl text-[#ecd8a6] flex items-center gap-2">
                {modalAction === 'reject' ? (
                  <ShieldAlert className="h-5 w-5 text-rose-500" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-yellow-500" />
                )}
                {modalAction === 'reject' ? 'Ödeme Talebi İptali' : 'Ödeme Onaylama'}
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
                {modalAction === 'reject' ? (
                  <div className="rounded-lg bg-rose-500/5 border border-rose-500/20 p-3 text-xs text-rose-400 flex gap-2">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>Bu işlem, seçilen Stripe ödeme teşebbüsünü iptal edecektir. Kullanıcıya herhangi bir Moon yüklemesi yapılmayacaktır. Bu işlem geri alınamaz.</p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/20 p-3 text-xs text-yellow-500 flex gap-2">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>Bu işlem, seçilen Stripe oturumunun ödemesini onaylayarak kullanıcının hesabına Katina Moon yüklemesi gerçekleştirecektir. Lütfen bilgileri kontrol edin.</p>
                  </div>
                )}

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
                    Vazgeç
                  </button>
                  {modalAction === 'reject' ? (
                    <button
                      onClick={executeManualReject}
                      className="px-5 py-2 text-sm text-white bg-rose-600 hover:bg-rose-700 font-semibold rounded-lg shadow-lg shadow-rose-600/10 transition"
                    >
                      Evet, İptal Et
                    </button>
                  ) : (
                    <button
                      onClick={executeManualApprove}
                      className="px-5 py-2 text-sm text-[#0e0a1b] bg-[#ecd8a6] hover:bg-[#ecd8a6]/90 font-semibold rounded-lg shadow-lg shadow-yellow-500/10 transition"
                    >
                      Evet, Onayla ve Yükle
                    </button>
                  )}
                </div>
              </div>
            )}

            {modalState === 'loading' && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className={`h-10 w-10 animate-spin ${modalAction === 'reject' ? 'text-rose-500' : 'text-yellow-500'}`} />
                <div className="text-center">
                  <p className="text-sm font-medium text-[#ecd8a6]">
                    {modalAction === 'reject' ? 'İşlem İptal Ediliyor' : 'Ödeme Onaylanıyor'}
                  </p>
                  <p className="text-xs text-[#ecd8a6]/60 mt-1">
                    {modalAction === 'reject' 
                      ? 'Stripe ödeme teşebbüsü iptal ediliyor...' 
                      : 'Stripe oturumu tamamlanıyor ve Moon\'lar aktarılıyor...'}
                  </p>
                </div>
              </div>
            )}

            {modalState === 'success' && (
              <div className="space-y-4 text-center py-4">
                {modalAction === 'reject' ? (
                  <>
                    <div className="inline-flex rounded-full bg-rose-500/10 border border-rose-500/30 p-3 text-rose-400">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-rose-400">İşlem Başarıyla İptal Edildi</h4>
                      <p className="text-xs text-[#ecd8a6]/60 mt-1">Stripe ödeme teşebbüsü iptal edildi ve bekleyen işlemleri listesinden kaldırıldı.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="inline-flex rounded-full bg-green-500/10 border border-green-500/30 p-3 text-green-400">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-green-400">Ödeme Başarıyla Tamamlandı</h4>
                      <p className="text-xs text-[#ecd8a6]/60 mt-1">Kullanıcı hesabına {selectedAttempt.amount} Moon başarıyla yüklendi.</p>
                    </div>
                  </>
                )}
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
                  <h4 className="font-serif text-lg text-red-400">
                    {modalAction === 'reject' ? 'İptal Etme Başarısız' : 'Onaylama Başarısız'}
                  </h4>
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
                    onClick={modalAction === 'reject' ? executeManualReject : executeManualApprove}
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
