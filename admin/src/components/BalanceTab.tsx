import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { useTranslation } from '../context/LanguageContext';
import { doc, getDoc, runTransaction, serverTimestamp, collection, getDocs, query, limit } from 'firebase/firestore';
import { Search, ShieldAlert, Award, Coins, HelpCircle } from 'lucide-react';


interface BalanceTabProps {
  userRole: 'admin' | 'employee' | 'viewer' | null;
}

export const BalanceTab: React.FC<BalanceTabProps> = ({ userRole }) => {
  const { t } = useTranslation();
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
      setSearchError(`${t('balance.fetchErrorPrefix')}${err.message || err}`);
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
          setSearchError(t('balance.usersFoundCount').replace('{count}', String(matches.length)));
        } else {
          setSearchError(t('balance.userNotFound'));
        }
      }
    } catch (err: any) {
      console.error(err);
      setSearchError(`${t('balance.searchErrorPrefix')}${err.message || err}`);
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
      
      setActionSuccess(t('balance.actionSuccess').replace('{balance}', String(updatedBalance)));
      setAdjustAmount(0);
      setReason('');
      setShowConfirmModal(false);
    } catch (err: any) {
      console.error(err);
      setActionError(`${t('balance.actionErrorPrefix')}${err.message || err}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl text-[#ecd8a6]">{t('balance.title')}</h2>
        <p className="text-sm text-[#ecd8a6]/60">{t('balance.subtitle')}</p>
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
              placeholder={t('balance.searchPlaceholder')}
              className="w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] pl-10 pr-4 py-2 text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-purple-900/40 border border-[#ecd8a6]/30 px-6 py-2 font-medium text-[#ecd8a6] hover:bg-purple-900/60 transition disabled:opacity-50"
          >
            {loading ? t('balance.searching') : t('balance.searchBtn')}
          </button>
        </form>

        {searchError && (
          <p className="mt-3 text-sm text-red-400">{searchError}</p>
        )}

        {searchResults.length > 1 && (
          <div className="mt-4 border-t border-[#ecd8a6]/10 pt-4 space-y-3">
            <h4 className="text-sm font-semibold text-[#ecd8a6]/80">{t('balance.matchingUsers')}</h4>
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
                    <span className="font-semibold block">{user.name || user.displayName || t('balance.notSpecified')}</span>
                    <span className="text-[10px] text-[#ecd8a6]/50 block break-all">{user.email || t('balance.socialLogin')}</span>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center gap-3">
                    <span className="font-mono text-[10px] text-[#ecd8a6]/40">{user.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${
                      foundUser?.id === user.id 
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                        : 'bg-purple-900/10 text-[#ecd8a6]/60 border-[#ecd8a6]/20'
                    }`}>
                      {foundUser?.id === user.id ? t('balance.selected') : t('balance.select')}
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
            <h3 className="font-serif text-xl border-b border-[#ecd8a6]/10 pb-3">{t('balance.userInformation')}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#ecd8a6]/50 block">{t('balance.name')}</span>
                <span>{foundUser.name || t('balance.notSpecified')}</span>
              </div>
              <div>
                <span className="text-[#ecd8a6]/50 block">{t('balance.email')}</span>
                <span className="break-all">{foundUser.email || t('balance.socialLogin')}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#ecd8a6]/50 block">{t('balance.uid')}</span>
                <span className="font-mono text-xs">{foundUser.id}</span>
              </div>
            </div>

            <h3 className="font-serif text-xl border-b border-[#ecd8a6]/10 pt-4 pb-3">{t('balance.currentMoonBalance')}</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#07040e]/50 p-3 rounded-lg border border-[#ecd8a6]/5">
                <Coins className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                <span className="text-xs text-[#ecd8a6]/50">{t('balance.totalBalance')}</span>
                <p className="text-xl font-bold text-amber-300 mt-1">{moonData.balance}</p>
              </div>
              <div className="bg-[#07040e]/50 p-3 rounded-lg border border-[#ecd8a6]/5">
                <Award className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                <span className="text-xs text-[#ecd8a6]/50">{t('balance.purchased')}</span>
                <p className="text-xl font-bold text-purple-300 mt-1">{moonData.purchasedBalance || 0}</p>
              </div>
              <div className="bg-[#07040e]/50 p-3 rounded-lg border border-[#ecd8a6]/5">
                <HelpCircle className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                <span className="text-xs text-[#ecd8a6]/50">{t('balance.dailyGift')}</span>
                <p className="text-xl font-bold text-blue-300 mt-1">{moonData.dailyFreeBalance || 0}</p>
              </div>
            </div>
          </div>

          {/* Balance Adjustment Form */}
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 space-y-4">
            <h3 className="font-serif text-xl border-b border-[#ecd8a6]/10 pb-3">{t('balance.adjustBalance')}</h3>
            
            {userRole === 'viewer' ? (
              <div className="rounded-lg border border-yellow-900/30 bg-yellow-950/10 p-4 text-yellow-400 flex gap-2">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <p className="text-xs">{t('balance.viewerRoleAlert')}</p>
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
                  <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">{t('balance.transactionType')}</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="adjustType" 
                        checked={adjustType === 'increase'} 
                        onChange={() => setAdjustType('increase')}
                        className="accent-purple-600"
                      />
                      <span>{t('balance.increaseBalance')}</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="adjustType" 
                        checked={adjustType === 'decrease'} 
                        onChange={() => setAdjustType('decrease')}
                        className="accent-purple-600"
                      />
                      <span>{t('balance.decreaseBalance')}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">{t('balance.amountMoon')}</label>
                  <input
                    type="number"
                    min="1"
                    value={adjustAmount === 0 ? '' : adjustAmount}
                    onChange={(e) => setAdjustAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-4 py-2 text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/50 text-lg font-bold"
                    placeholder={t('balance.amountPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">{t('balance.reason')}</label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    placeholder={t('balance.reasonPlaceholder')}
                    className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-4 py-2 text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/50 text-sm"
                  />
                </div>

                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={adjustAmount <= 0 || !reason.trim()}
                  className="w-full rounded-lg bg-gradient-to-r from-purple-800 to-[#ecd8a6]/60 px-4 py-3 font-semibold text-[#07040e] shadow-lg transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {t('balance.updateBalanceBtn')}
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
            <h3 className="font-serif text-2xl text-amber-300">{t('balance.confirmTitle')}</h3>
            <p className="mt-3 text-sm text-gray-300">
              {t('balance.confirmMessage')
                .replace('{user}', foundUser.email || foundUser.id)
                .replace('{amount}', `${adjustType === 'increase' ? '+' : '-'}${adjustAmount}`)}
            </p>
            
            <div className="mt-4 rounded-lg bg-[#07040e] p-3 border border-[#ecd8a6]/10 text-xs">
              <span className="text-[#ecd8a6]/50 block">{t('balance.confirmReason')}</span>
              <p className="mt-1 text-gray-300 italic">"{reason}"</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="rounded-lg border border-[#ecd8a6]/20 px-4 py-2 text-sm text-[#ecd8a6]/70 hover:bg-[#07040e] transition"
              >
                {t('balance.cancelBtn')}
              </button>
              <button
                onClick={submitAdjustment}
                disabled={actionLoading}
                className="rounded-lg bg-purple-900/60 border border-[#ecd8a6]/30 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-900 transition disabled:opacity-50"
              >
                {actionLoading ? t('balance.saving') : t('balance.applyChangeBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
