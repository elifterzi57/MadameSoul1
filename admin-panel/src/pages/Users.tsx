import React, { useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { Search, UserMinus, UserPlus, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface TargetUser {
  id: string;
  email: string;
  fullName?: string;
  profile?: any;
}

interface UserMoon {
  balance: number;
  purchasedBalance: number;
  dailyFreeBalance: number;
}

export default function Users() {
  const { adminData } = useAuthStore();
  const [emailQuery, setEmailQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetUser, setTargetUser] = useState<TargetUser | null>(null);
  const [userMoon, setUserMoon] = useState<UserMoon | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Check role permission for changes
  const canModify = adminData?.role === 'admin' || adminData?.role === 'çalışan';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailQuery.trim()) return;
    setLoading(true);
    setTargetUser(null);
    setUserMoon(null);
    setMessage(null);

    try {
      const q = query(collection(db, 'users'), where('email', '==', emailQuery.trim()));
      const snap = await getDocs(q);

      if (snap.empty) {
        setMessage({ type: 'error', text: 'Kullanıcı bulunamadı.' });
        setLoading(false);
        return;
      }

      const userDoc = snap.docs[0];
      const userData = userDoc.data();
      
      const foundUser: TargetUser = {
        id: userDoc.id,
        email: userData.email,
        fullName: userData.profile?.fullName || userData.fullName || 'Belirtilmemiş'
      };
      
      setTargetUser(foundUser);

      // Fetch user_moons balance
      const moonDocRef = doc(db, 'user_moons', foundUser.id);
      const moonDocSnap = await getDoc(moonDocRef);

      if (moonDocSnap.exists()) {
        setUserMoon(moonDocSnap.data() as UserMoon);
      } else {
        // User has no moon document yet, default values
        setUserMoon({ balance: 0, purchasedBalance: 0, dailyFreeBalance: 0 });
      }

    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Kullanıcı aranırken hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustBalance = async (mode: 'add' | 'subtract' | 'set') => {
    if (!targetUser || !userMoon) return;
    if (!canModify) {
      setMessage({ type: 'error', text: 'Bu işlemi yapmaya yetkiniz yok (Sadece Görüntüleyen).' });
      return;
    }

    if (amount <= 0 && mode !== 'set') {
      setMessage({ type: 'error', text: 'Geçersiz miktar.' });
      return;
    }

    setActionLoading(true);
    setMessage(null);

    try {
      const oldBalance = userMoon.balance;
      let newBalance = oldBalance;
      let difference = 0;

      if (mode === 'add') {
        newBalance = oldBalance + amount;
        difference = amount;
      } else if (mode === 'subtract') {
        newBalance = Math.max(0, oldBalance - amount);
        difference = -amount;
      } else if (mode === 'set') {
        newBalance = Math.max(0, amount);
        difference = newBalance - oldBalance;
      }

      const batch = writeBatch(db);

      // Update user_moons document
      const moonDocRef = doc(db, 'user_moons', targetUser.id);
      
      // Since it could be a new doc, use set with merge or update if exists
      const moonDocSnap = await getDoc(moonDocRef);
      const updatedMoonData = {
        userId: targetUser.id,
        balance: newBalance,
        purchasedBalance: mode === 'add' ? (userMoon.purchasedBalance + amount) : Math.max(0, userMoon.purchasedBalance + difference),
        dailyFreeBalance: userMoon.dailyFreeBalance,
        lastDailyClaimedAt: userMoon.dailyFreeBalance > 0 ? serverTimestamp() : null
      };

      if (moonDocSnap.exists()) {
        batch.update(moonDocRef, updatedMoonData);
      } else {
        batch.set(moonDocRef, updatedMoonData);
      }

      // Add to moon_transactions
      const txId = `tx_admin_${Date.now()}`;
      const txDocRef = doc(db, 'moon_transactions', txId);
      
      const txData = {
        userId: targetUser.id,
        amount: Math.abs(difference),
        type: difference >= 0 ? 'bonus' : 'spend',
        description: `Yönetici tarafından bakiye güncellemesi (${auth.currentUser?.email})`,
        pdfDownloaded: 0,
        performedBy: auth.currentUser?.email || 'Admin',
        targetUser: targetUser.id,
        status: 'success',
        paymentProvider: 'admin_dusting',
        idempotencyKey: `admin_${targetUser.id}_${txId}`,
        createdAt: serverTimestamp(),
        clientMetadata: {
          userAgent: navigator.userAgent,
          os: 'Web',
          appVersion: 'admin-1.0.0'
        }
      };
      
      batch.set(txDocRef, txData);

      // Log to admin_audit_logs
      const auditLogId = `audit_${Date.now()}`;
      const auditDocRef = doc(db, 'admin_audit_logs', auditLogId);
      
      const auditData = {
        adminUid: auth.currentUser?.uid,
        adminEmail: auth.currentUser?.email,
        action: 'UPDATE_MOON_BALANCE',
        targetUserId: targetUser.id,
        targetUserEmail: targetUser.email,
        oldBalance,
        newBalance,
        difference,
        timestamp: serverTimestamp()
      };
      
      batch.set(auditDocRef, auditData);

      // Commit changes
      await batch.commit();

      setUserMoon({
        balance: newBalance,
        purchasedBalance: updatedMoonData.purchasedBalance,
        dailyFreeBalance: updatedMoonData.dailyFreeBalance
      });
      setAmount(0);
      setMessage({ type: 'success', text: `Bakiye başarıyla güncellendi! Yeni Bakiye: ${newBalance}` });

    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Bakiye güncellenirken hata oluştu.' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Kullanıcı Ara</h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              placeholder="Kullanıcı e-posta adresi girin..."
              required
              value={emailQuery}
              onChange={(e) => setEmailQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Ara'}
          </button>
        </form>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border text-sm flex items-start gap-3 ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>{message.text}</div>
        </div>
      )}

      {/* Target User Status & Actions */}
      {targetUser && userMoon && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100">
          {/* User Details */}
          <div className="p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Kullanıcı Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase">Ad Soyad</span>
                <span className="text-slate-800 text-sm font-medium">{targetUser.fullName}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase">E-posta</span>
                <span className="text-slate-800 text-sm font-medium">{targetUser.email}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase">Kullanıcı ID</span>
                <span className="text-slate-800 text-sm font-mono text-xs select-all">{targetUser.id}</span>
              </div>
            </div>
          </div>

          {/* Current Moon Balances */}
          <div className="p-6 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 mb-4">Mevcut Moon Durumu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
                <span className="block text-sm text-slate-500 font-medium">Toplam Bakiye</span>
                <span className="block text-3xl font-extrabold text-blue-600 mt-2">{userMoon.balance} 🌙</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
                <span className="block text-sm text-slate-500 font-medium">Satın Alınan</span>
                <span className="block text-2xl font-bold text-slate-700 mt-2">{userMoon.purchasedBalance}</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
                <span className="block text-sm text-slate-500 font-medium">Günlük Ücretsiz</span>
                <span className="block text-2xl font-bold text-slate-700 mt-2">{userMoon.dailyFreeBalance}</span>
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Moon Bakiyesini Değiştir</h3>
            
            {!canModify && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm mb-4">
                Hesabınız "Sadece Görüntüleyen" yetkisine sahiptir. Değişiklik yapamazsınız.
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="w-full sm:w-48">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Moon Miktarı</label>
                <input
                  type="number"
                  min="0"
                  disabled={!canModify || actionLoading}
                  value={amount === 0 ? '' : amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Miktar girin"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={!canModify || actionLoading || amount <= 0}
                  onClick={() => handleAdjustBalance('add')}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Ekle
                </button>
                <button
                  type="button"
                  disabled={!canModify || actionLoading || amount <= 0}
                  onClick={() => handleAdjustBalance('subtract')}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  <UserMinus className="w-4 h-4" />
                  Eksilt
                </button>
                <button
                  type="button"
                  disabled={!canModify || actionLoading}
                  onClick={() => handleAdjustBalance('set')}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Eşitle (Set)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
