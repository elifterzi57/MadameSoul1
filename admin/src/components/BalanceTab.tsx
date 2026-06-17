import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, runTransaction, serverTimestamp, collection, getDocs, query, limit } from 'firebase/firestore';
import { Search, ShieldAlert, Award, Coins, HelpCircle } from 'lucide-react';

interface BalanceTabProps {
  userRole: 'admin' | 'employee' | 'viewer' | null;
}

export const BalanceTab: React.FC<BalanceTabProps> = ({ userRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [foundUser, setFoundUser] = useState<any | null>(null);
  const [moonData, setMoonData] = useState<any | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Adjustment state
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<'increase' | 'decrease'>('increase');
  const [reason, setReason] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleSelectUser = async (user: any) => {
    setLoading(true);
    setSearchError(null);
    setFoundUser(user);
    setMoonData(null);
    setActionSuccess(null);
    setActionError(null);

    try {
      const moonRef = doc(db, 'user_moons', user.id);
      const moonSnap = await getDoc(moonRef);
      if (moonSnap.exists()) {
        setMoonData(moonSnap.data());
      } else {
        setMoonData({
          balance: 0,
          dailyFreeBalance: 0,
          purchasedBalance: 0,
          userId: user.id
        });
      }
    } catch (err: any) {
      console.error(err);
      setSearchError(`Kullanıcı bakiye bilgileri alınamadı: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearchError(null);
    setFoundUser(null);
    setMoonData(null);
    setSearchResults([]);
    setActionSuccess(null);
    setActionError(null);

    try {
      let queryVal = searchQuery.trim();

      // 1. First try exact match by Document ID (User ID)
      const docRef = doc(db, 'users', queryVal);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const user = { id: docSnap.id, ...docSnap.data() };
        setSearchResults([user]);
        await handleSelectUser(user);
      } else {
        // 2. Fetch users and filter client-side for fuzzy/partial matches
        const usersRef = collection(db, 'users');
        const qSnap = await getDocs(query(usersRef, limit(500)));
        const queryLower = queryVal.toLowerCase();

        const matches = qSnap.docs.filter(d => {
          const data = d.data();
          const email = (data.email || '').toLowerCase();
          const displayName = (data.displayName || '').toLowerCase();
          const name = (data.name || '').toLowerCase();
          const uId = d.id.toLowerCase();

          return email.includes(queryLower) ||
                 displayName.includes(queryLower) ||
                 name.includes(queryLower) ||
                 uId.includes(queryLower);
        }).map(d => ({ id: d.id, ...d.data() }));

        setSearchResults(matches);

        if (matches.length === 1) {
          await handleSelectUser(matches[0]);
        } else if (matches.length > 1) {
          setSearchError(`${matches.length} kullanıcı bulundu. Lütfen işlem yapmak istediğinizi seçin.`);
        } else {
          setSearchError('Kullanıcı bulunamadı.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setSearchError(`Arama hatası: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const submitAdjustment = async () => {
    if (!reason.trim()) return;
    if (adjustAmount <= 0) return;
    if (userRole === 'viewer') return;

    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    const userId = foundUser.id;
    const moonRef = doc(db, 'user_moons', userId);
    const auditLogsRef = collection(db, 'admin_audit_logs');

    try {
      const delta = adjustType === 'increase' ? adjustAmount : -adjustAmount;

      await runTransaction(db, async (transaction) => {
        const moonDoc = await transaction.get(moonRef);
        let currentBalance = 0;
        let currentFree = 0;
        let currentPurchased = 0;

        if (moonDoc.exists()) {
          const data = moonDoc.data();
          currentBalance = data.balance || 0;
          currentFree = data.dailyFreeBalance || 0;
          currentPurchased = data.purchasedBalance || 0;
        }

        const newBalance = Math.max(0, currentBalance + delta);
        // Distribute the change (defaulting to purchased balance changes for adjustment)
        let newPurchased = Math.max(0, currentPurchased + delta);
        let newFree = currentFree;

        if (newPurchased === 0 && delta < 0) {
          // If subtracting more than purchased, subtract remaining from free balance
          const remainingToSubtract = Math.abs(delta) - currentPurchased;
          newFree = Math.max(0, currentFree - remainingToSubtract);
        }

        transaction.set(moonRef, {
          userId,
          balance: newBalance,
          dailyFreeBalance: newFree,
          purchasedBalance: newPurchased,
          lastDailyClaimedAt: moonDoc.exists() ? moonDoc.data().lastDailyClaimedAt : null,
          updatedAt: serverTimestamp()
        }, { merge: true });

        // Add transaction record to moon_transactions
        const txRef = doc(collection(db, 'moon_transactions'));
        const clientMetadata = {
          userAgent: navigator.userAgent,
          os: navigator.userAgent.includes("Mac") ? "macOS" :
              navigator.userAgent.includes("Win") ? "Windows" :
              navigator.userAgent.includes("Linux") ? "Linux" :
              navigator.userAgent.includes("Android") ? "Android" :
              navigator.userAgent.includes("like Mac") ? "iOS" : "Unknown",
          appVersion: "1.0.0"
        };
        const idempotencyKey = `admin_adjust_${userId}_${Date.now()}`;

        transaction.set(txRef, {
          userId,
          transactionId: txRef.id,
          amount: delta,
          type: delta > 0 ? 'bonus' : 'spend',
          description: `Admin düzenlemesi: ${reason}`,
          pdfDownloaded: 0,
          status: 'success',
          performedBy: auth.currentUser?.email || 'system',
          paymentProvider: 'admin_dusting',
          idempotencyKey,
          clientMetadata,
          createdAt: serverTimestamp()
        });

        // Add audit log entry
        const logRef = doc(auditLogsRef);
        transaction.set(logRef, {
          action: "BALANCE_ADJUSTMENT",
          performedBy: auth.currentUser?.email || 'unknown',
          targetUser: userId,
          details: {
            oldBalance: currentBalance,
            newBalance: newBalance,
            difference: delta,
            reason: reason
          },
          createdAt: serverTimestamp()
        });
      });

      // Update local state
      const updatedBalance = Math.max(0, moonData.balance + delta);
      setMoonData({
        ...moonData,
        balance: updatedBalance,
        purchasedBalance: Math.max(0, (moonData.purchasedBalance || 0) + delta)
      });
      
      setActionSuccess(`Kullanıcı bakiyesi başarıyla güncellendi (Yeni bakiye: ${updatedBalance} Moon).`);
      setAdjustAmount(0);
      setReason('');
      setShowConfirmModal(false);
    } catch (err: any) {
      console.error(err);
      setActionError(`İşlem sırasında hata oluştu: ${err.message || err}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl text-[#ecd8a6]">Moon Bakiye Yönetimi</h2>
        <p className="text-sm text-[#ecd8a6]/60">Kullanıcıların Moon bakiyelerini manuel olarak artırıp azaltın.</p>
      </div>

      {/* User Search Card */}
      <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b] p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[#ecd8a6]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kullanıcı E-postası veya UID girin..."
              className="w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] pl-10 pr-4 py-2 text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-purple-900/40 border border-[#ecd8a6]/30 px-6 py-2 font-medium text-[#ecd8a6] hover:bg-purple-900/60 transition disabled:opacity-50"
          >
            {loading ? 'Aranıyor...' : 'Ara'}
          </button>
        </form>

        {searchError && (
          <p className="mt-3 text-sm text-red-400">{searchError}</p>
        )}

        {searchResults.length > 1 && (
          <div className="mt-4 border-t border-[#ecd8a6]/10 pt-4 space-y-3">
            <h4 className="text-sm font-semibold text-[#ecd8a6]/80">Eşleşen Kullanıcılar:</h4>
            <div className="overflow-hidden rounded-lg border border-[#ecd8a6]/10 bg-[#07040e]/40 divide-y divide-[#ecd8a6]/10 max-h-60 overflow-y-auto">
              {searchResults.map((user) => (
                <div 
                  key={user.id} 
                  onClick={() => handleSelectUser(user)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 cursor-pointer transition text-xs ${
                    foundUser?.id === user.id 
                      ? 'bg-purple-900/20 text-[#ecd8a6]' 
                      : 'hover:bg-purple-950/10 text-[#ecd8a6]/70 hover:text-[#ecd8a6]'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-semibold block">{user.name || user.displayName || 'Belirtilmemiş'}</span>
                    <span className="text-[10px] text-[#ecd8a6]/50 block break-all">{user.email || 'Sosyal Giriş'}</span>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center gap-3">
                    <span className="font-mono text-[10px] text-[#ecd8a6]/40">{user.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${
                      foundUser?.id === user.id 
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                        : 'bg-purple-900/10 text-[#ecd8a6]/60 border-[#ecd8a6]/20'
                    }`}>
                      {foundUser?.id === user.id ? 'Seçildi' : 'Seç'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Info & Adjustment Form */}
      {foundUser && moonData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Profile Summary */}
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 space-y-4">
            <h3 className="font-serif text-xl border-b border-[#ecd8a6]/10 pb-3">Kullanıcı Bilgileri</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#ecd8a6]/50 block">İsim</span>
                <span>{foundUser.name || 'Belirtilmemiş'}</span>
              </div>
              <div>
                <span className="text-[#ecd8a6]/50 block">E-posta</span>
                <span className="break-all">{foundUser.email || 'Sosyal Giriş'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#ecd8a6]/50 block">UID (Kullanıcı Kimliği)</span>
                <span className="font-mono text-xs">{foundUser.id}</span>
              </div>
            </div>

            <h3 className="font-serif text-xl border-b border-[#ecd8a6]/10 pt-4 pb-3">Mevcut Moon Bakiyesi</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#07040e]/50 p-3 rounded-lg border border-[#ecd8a6]/5">
                <Coins className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                <span className="text-xs text-[#ecd8a6]/50">Toplam Bakiye</span>
                <p className="text-xl font-bold text-amber-300 mt-1">{moonData.balance}</p>
              </div>
              <div className="bg-[#07040e]/50 p-3 rounded-lg border border-[#ecd8a6]/5">
                <Award className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                <span className="text-xs text-[#ecd8a6]/50">Satın Alınan</span>
                <p className="text-xl font-bold text-purple-300 mt-1">{moonData.purchasedBalance || 0}</p>
              </div>
              <div className="bg-[#07040e]/50 p-3 rounded-lg border border-[#ecd8a6]/5">
                <HelpCircle className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                <span className="text-xs text-[#ecd8a6]/50">Günlük Hediye</span>
                <p className="text-xl font-bold text-blue-300 mt-1">{moonData.dailyFreeBalance || 0}</p>
              </div>
            </div>
          </div>

          {/* Balance Adjustment Form */}
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 space-y-4">
            <h3 className="font-serif text-xl border-b border-[#ecd8a6]/10 pb-3">Bakiye Ayarla</h3>
            
            {userRole === 'viewer' ? (
              <div className="rounded-lg border border-yellow-900/30 bg-yellow-950/10 p-4 text-yellow-400 flex gap-2">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <p className="text-xs">Sadece Görüntüleyen yetkisine sahipsiniz. Bakiye değiştirme işlemleri yapamazsınız.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {actionSuccess && (
                  <div className="rounded-lg border border-green-950 bg-green-950/20 p-3 text-center text-sm text-green-400">
                    {actionSuccess}
                  </div>
                )}
                {actionError && (
                  <div className="rounded-lg border border-red-950 bg-red-950/20 p-3 text-center text-sm text-red-400">
                    {actionError}
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">İşlem Tipi</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="adjustType" 
                        checked={adjustType === 'increase'} 
                        onChange={() => setAdjustType('increase')}
                        className="accent-purple-600"
                      />
                      <span>Bakiye Artır (+)</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="adjustType" 
                        checked={adjustType === 'decrease'} 
                        onChange={() => setAdjustType('decrease')}
                        className="accent-purple-600"
                      />
                      <span>Bakiye Azalt (-)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">Miktar (Moon)</label>
                  <input
                    type="number"
                    min="1"
                    value={adjustAmount === 0 ? '' : adjustAmount}
                    onChange={(e) => setAdjustAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-4 py-2 text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/50 text-lg font-bold"
                    placeholder="Eklenecek / Çıkarılacak Moon miktarı"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">İşlem Gerekçesi (Neden)</label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    placeholder="Bu değişikliği neden yapıyorsunuz? (örn: Ödeme hatası telafisi)"
                    className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-4 py-2 text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/50 text-sm"
                  />
                </div>

                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={adjustAmount <= 0 || !reason.trim()}
                  className="w-full rounded-lg bg-gradient-to-r from-purple-800 to-[#ecd8a6]/60 px-4 py-3 font-semibold text-[#07040e] shadow-lg transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  Bakiyeyi Güncelle
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && foundUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#ecd8a6]/30 bg-[#0e0a1b] p-6 shadow-2xl">
            <h3 className="font-serif text-2xl text-amber-300">İşlemi Onaylıyor musunuz?</h3>
            <p className="mt-3 text-sm text-gray-300">
              <strong className="text-[#ecd8a6]">{foundUser.email || foundUser.id}</strong> kullanıcısının bakiyesi{' '}
              <strong className={adjustType === 'increase' ? 'text-green-400' : 'text-red-400'}>
                {adjustType === 'increase' ? `+${adjustAmount}` : `-${adjustAmount}`} Moon
              </strong>{' '}
              olarak değiştirilecektir.
            </p>
            
            <div className="mt-4 rounded-lg bg-[#07040e] p-3 border border-[#ecd8a6]/10 text-xs">
              <span className="text-[#ecd8a6]/50 block">Gerekçe:</span>
              <p className="mt-1 text-gray-300 italic">"{reason}"</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="rounded-lg border border-[#ecd8a6]/20 px-4 py-2 text-sm text-[#ecd8a6]/70 hover:bg-[#07040e] transition"
              >
                İptal
              </button>
              <button
                onClick={submitAdjustment}
                disabled={actionLoading}
                className="rounded-lg bg-purple-900/60 border border-[#ecd8a6]/30 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-900 transition disabled:opacity-50"
              >
                {actionLoading ? 'Kaydediliyor...' : 'Evet, Değişikliği Uygula'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
