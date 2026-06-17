import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ShieldAlert, UserPlus, RefreshCw, UserCheck } from 'lucide-react';

interface PermissionsTabProps {
  userRole: 'admin' | 'employee' | 'viewer' | null;
}

export const PermissionsTab: React.FC<PermissionsTabProps> = ({ userRole }) => {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New worker form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'employee' | 'viewer'>('employee');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchWorkers = async () => {
    setLoading(true);
    setError(null);
    try {
      const colSnap = await getDocs(collection(db, 'admin_users'));
      const workersData: any[] = [];
      colSnap.forEach((doc) => {
        workersData.push({ id: doc.id, ...doc.data() });
      });
      setWorkers(workersData);
    } catch (err: any) {
      console.error(err);
      setError(`Yetkili çalışanlar listesi alınamadı: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleCreateOrUpdateWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'admin') return;

    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Giriş yapmış bir admin bulunamadı.");

      // Fetch fresh ID token to authenticate with Express backend
      const idToken = await currentUser.getIdToken(true);

      const response = await fetch('/api/admin/set-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          email: email.trim(),
          role: selectedRole,
          password: password.trim() || undefined
        })
      });

      let data: any = {};
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`Geçersiz sunucu yanıtı: ${responseText.slice(0, 100)}`);
        }
      }

      if (!response.ok) {
        throw new Error(data.error || `Sunucu hatası: Status ${response.status}`);
      }

      if (data.status === 'password_required') {
        setFormError('Kullanıcı sistemde kayıtlı değil. Lütfen admin paneline erişebilmesi için bir şifre belirleyin.');
      } else {
        setFormSuccess(`Kullanıcı '${selectedRole}' rolüyle başarıyla tanımlandı.`);
        setEmail('');
        setPassword('');
        fetchWorkers(); // Refresh list
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Yetki ataması sırasında hata oluştu.');
    } finally {
      setFormLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Süper Admin';
      case 'employee': return 'Çalışan';
      case 'viewer': return 'Sadece Görüntüleyen';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#ecd8a6]">Çalışan Yetkileri</h2>
          <p className="text-sm text-[#ecd8a6]/60">Sistem yöneticileri, çalışanlar ve salt-okunur gözlemcilerin yetkilerini atayın.</p>
        </div>
        <button
          onClick={fetchWorkers}
          className="flex items-center gap-2 rounded-lg bg-purple-900/20 border border-[#ecd8a6]/20 px-4 py-2 hover:bg-purple-900/30 transition text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Yenile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Workers List Table */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-serif text-xl">Aktif Yetkili Çalışanlar</h3>
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40">
              <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-b-2 border-[#ecd8a6]"></div>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-900/30 bg-red-950/10 p-6 text-center text-red-400">
              {error}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40">
              <table className="w-full text-left text-sm text-[#ecd8a6]/80 border-collapse">
                <thead className="bg-[#0e0a1b] text-xs uppercase tracking-wider text-[#ecd8a6]/60">
                  <tr>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">E-posta</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">Yetki Rolü</th>
                    <th className="px-6 py-4 border-b border-[#ecd8a6]/10">Kullanıcı Kimliği (UID)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ecd8a6]/10">
                  {workers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-purple-950/10 transition">
                      <td className="px-6 py-4 font-semibold text-xs">{worker.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          worker.role === 'admin' 
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                            : worker.role === 'employee'
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                        }`}>
                          {getRoleLabel(worker.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] text-[#ecd8a6]/50">{worker.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Role Form */}
        <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-6 space-y-4 h-fit">
          <h3 className="font-serif text-xl border-b border-[#ecd8a6]/10 pb-3 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#ecd8a6]" />
            Yetki Ata / Oluştur
          </h3>

          {userRole !== 'admin' ? (
            <div className="rounded-lg border border-yellow-900/30 bg-yellow-950/10 p-4 text-yellow-400 flex gap-2">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <p className="text-xs">Sadece Süper Admin rolüne sahip yöneticiler yeni yetkili ataması yapabilir.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateOrUpdateWorker} className="space-y-4">
              {formSuccess && (
                <div className="rounded-lg border border-green-950 bg-green-950/20 p-3 text-center text-sm text-green-400">
                  {formSuccess}
                </div>
              )}
              {formError && (
                <div className="rounded-lg border border-red-950 bg-red-950/20 p-3 text-center text-sm text-red-400">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">E-posta Adresi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="calisan@madamesoul.com"
                  className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-3 py-2 text-sm text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/40"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">Rol Ataması</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-3 py-2 text-sm text-[#ecd8a6] outline-none"
                >
                  <option value="admin">Süper Admin (admin)</option>
                  <option value="employee">Çalışan (employee)</option>
                  <option value="viewer">Sadece Görüntüleyen (viewer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">Şifre (Yeni Kullanıcı İse)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 karakterli şifre"
                  className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-3 py-2 text-sm text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/40"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full flex justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-purple-800 to-[#ecd8a6]/60 px-4 py-2.5 font-semibold text-[#07040e] shadow-lg transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-sm"
              >
                <UserCheck className="h-4 w-4" />
                {formLoading ? 'Tanımlanıyor...' : 'Yetkiyi Tanımla'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
