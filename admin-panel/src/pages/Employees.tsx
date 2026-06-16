import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Shield, UserPlus, Trash2, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface Employee {
  id: string;
  email: string;
  role: 'admin' | 'çalışan' | 'görüntüleyen';
  createdAt?: any;
}

export default function Employees() {
  const { adminData } = useAuthStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Add Employee Form State
  const [searchEmail, setSearchEmail] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [foundUser, setFoundUser] = useState<{ id: string; email: string } | null>(null);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'çalışan' | 'görüntüleyen'>('görüntüleyen');
  
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isAdminUser = adminData?.role === 'admin';

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'admin_users'));
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;
    setSearchLoading(true);
    setFoundUser(null);
    setMessage(null);

    try {
      // Find in users collection
      const q = query(collection(db, 'users'), where('email', '==', searchEmail.trim()));
      const snap = await getDocs(q);

      if (snap.empty) {
        setMessage({ type: 'error', text: 'Bu e-posta adresine sahip bir kullanıcı MadameSoul uygulamasında kayıtlı değil.' });
        setSearchLoading(false);
        return;
      }

      const userDoc = snap.docs[0];
      setFoundUser({
        id: userDoc.id,
        email: userDoc.data().email
      });
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: 'Kullanıcı aranırken hata oluştu.' });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    if (!foundUser) return;
    if (!isAdminUser) {
      setMessage({ type: 'error', text: 'Sadece Admin rolündeki yöneticiler yetki atayabilir.' });
      return;
    }

    try {
      const docRef = doc(db, 'admin_users', foundUser.id);
      
      const newEmployee = {
        email: foundUser.email,
        role: selectedRole,
        createdAt: serverTimestamp()
      };

      await setDoc(docRef, newEmployee);

      // Log to admin_audit_logs
      const auditLogId = `audit_${Date.now()}`;
      await setDoc(doc(db, 'admin_audit_logs', auditLogId), {
        adminUid: auth.currentUser?.uid,
        adminEmail: auth.currentUser?.email,
        action: 'ADD_EMPLOYEE',
        targetUserId: foundUser.id,
        targetUserEmail: foundUser.email,
        assignedRole: selectedRole,
        timestamp: serverTimestamp()
      });

      setMessage({ type: 'success', text: `${foundUser.email} kullanıcısına başarıyla ${selectedRole} rolü atandı.` });
      setFoundUser(null);
      setSearchEmail('');
      fetchEmployees();
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || 'Yetki atanamadı.' });
    }
  };

  const handleUpdateRole = async (employeeId: string, email: string, newRole: 'admin' | 'çalışan' | 'görüntüleyen') => {
    if (!isAdminUser) {
      setMessage({ type: 'error', text: 'Sadece Admin rolündeki yöneticiler yetkileri güncelleyebilir.' });
      return;
    }

    try {
      const docRef = doc(db, 'admin_users', employeeId);
      await setDoc(docRef, { role: newRole }, { merge: true });

      // Log to admin_audit_logs
      const auditLogId = `audit_${Date.now()}`;
      await setDoc(doc(db, 'admin_audit_logs', auditLogId), {
        adminUid: auth.currentUser?.uid,
        adminEmail: auth.currentUser?.email,
        action: 'UPDATE_EMPLOYEE_ROLE',
        targetUserId: employeeId,
        targetUserEmail: email,
        newRole,
        timestamp: serverTimestamp()
      });

      setMessage({ type: 'success', text: `${email} kullanıcısının rolü ${newRole} olarak güncellendi.` });
      fetchEmployees();
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || 'Rol güncellenemedi.' });
    }
  };

  const handleRemoveEmployee = async (employeeId: string, email: string) => {
    if (!isAdminUser) {
      setMessage({ type: 'error', text: 'Sadece Admin rolündeki yöneticiler yetkileri kaldırabilir.' });
      return;
    }

    if (employeeId === auth.currentUser?.uid) {
      setMessage({ type: 'error', text: 'Kendi yetkinizi kaldıramazsınız.' });
      return;
    }

    if (!window.confirm(`${email} kullanıcısının tüm admin panel yetkilerini kaldırmak istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'admin_users', employeeId));

      // Log to admin_audit_logs
      const auditLogId = `audit_${Date.now()}`;
      await setDoc(doc(db, 'admin_audit_logs', auditLogId), {
        adminUid: auth.currentUser?.uid,
        adminEmail: auth.currentUser?.email,
        action: 'REMOVE_EMPLOYEE',
        targetUserId: employeeId,
        targetUserEmail: email,
        timestamp: serverTimestamp()
      });

      setMessage({ type: 'success', text: `${email} kullanıcısının admin yetkileri başarıyla kaldırıldı.` });
      fetchEmployees();
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || 'Yetki kaldırılamadı.' });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {message && (
        <div className={`p-4 rounded-lg border text-sm flex items-start gap-3 ${
          message.type === 'success' 
            ? 'bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.08)]' 
            : 'bg-red-950/20 border border-red-500/30 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.08)]'
        }`}>
          <AlertCircle className={`w-5 h-5 shrink-0 ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`} />
          <div className="font-sans">{message.text}</div>
        </div>
      )}

      {/* Add Employee Form */}
      {isAdminUser && (
        <div className="bg-[#0a0512]/80 backdrop-blur-md p-6 rounded-xl border border-[#ecd8a6]/20 shadow-[0_0_30px_rgba(236,216,166,0.03)] space-y-4">
          <h2 className="text-lg font-serif tracking-widest text-[#ecd8a6] flex items-center gap-2 uppercase">
            <UserPlus className="w-5 h-5 text-[#ecd8a6]" />
            Yeni Çalışan / Yetkili Ekle
          </h2>
          <p className="text-xs text-[#ecd8a6]/60 font-sans">
            Kullanıcının admin paneline erişebilmesi için önce MadameSoul uygulamasında bir hesabı bulunmalıdır. E-posta adresiyle arayarak yetki tanımlayabilirsiniz.
          </p>

          <form onSubmit={handleSearchUser} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#ecd8a6]/40 absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="E-posta adresi girin..."
                required
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/60 transition-all placeholder:text-[#ecd8a6]/30 font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#ecd8a6] hover:bg-white text-[#0a0512] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-serif uppercase tracking-wider font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(236,216,166,0.1)]"
            >
              {searchLoading ? <RefreshCw className="w-4 h-4 animate-spin text-[#0a0512]" /> : 'Ara'}
            </button>
          </form>

          {foundUser && (
            <div className="bg-[#120a1c]/60 p-4 rounded-lg border border-[#ecd8a6]/15 flex flex-wrap gap-4 items-center justify-between font-sans">
              <div>
                <span className="block text-xs text-[#ecd8a6]/50 font-serif tracking-wider uppercase mb-1">Bulunan Kullanıcı</span>
                <span className="text-[#ecd8a6] text-sm font-medium">{foundUser.email}</span>
                <span className="block text-[10px] text-[#ecd8a6]/40 font-mono mt-0.5">{foundUser.id}</span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="bg-[#0a0512] border border-[#ecd8a6]/20 text-[#ecd8a6] rounded-lg px-3 py-1.5 text-sm focus:outline-none cursor-pointer"
                >
                  <option value="görüntüleyen" className="bg-[#0a0512]">Sadece Görüntüleyen</option>
                  <option value="çalışan" className="bg-[#0a0512]">Çalışan</option>
                  <option value="admin" className="bg-[#0a0512]">Admin</option>
                </select>

                <button
                  type="button"
                  onClick={handleAddEmployee}
                  className="px-5 py-2 bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-900/30 text-emerald-300 rounded-lg text-xs font-serif uppercase tracking-wider font-bold transition-all cursor-pointer"
                >
                  Yetkilendir
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Employees List */}
      <div className="bg-[#0a0512]/80 backdrop-blur-md border border-[#ecd8a6]/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(236,216,166,0.02)]">
        <div className="p-5 border-b border-[#ecd8a6]/15 flex justify-between items-center bg-[#120a1c]/40">
          <h2 className="font-serif tracking-widest text-sm text-[#ecd8a6] flex items-center gap-2 uppercase">
            <Shield className="w-5 h-5 text-[#ecd8a6]" />
            Çalışan Yetkileri ve Rolleri ({employees.length})
          </h2>
          <button
            onClick={fetchEmployees}
            disabled={loading}
            className="p-1.5 text-[#ecd8a6]/60 hover:text-[#ecd8a6] hover:bg-[#1e1332]/40 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#ecd8a6]/60 font-sans font-light">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#ecd8a6]/70" />
            Loglar yükleniyor...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#ecd8a6]/10 text-left text-sm">
              <thead className="bg-[#120a1c] font-serif font-bold text-[#ecd8a6] tracking-wider text-xs uppercase border-b border-[#ecd8a6]/20">
                <tr>
                  <th className="px-6 py-4">E-posta</th>
                  <th className="px-6 py-4">UID</th>
                  <th className="px-6 py-4">Rol / Yetki</th>
                  <th className="px-6 py-4">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8a6]/10 text-[#ecd8a6]/80 font-sans">
                {employees.map(emp => {
                  const isSelf = emp.id === auth.currentUser?.uid;
                  return (
                    <tr key={emp.id} className="hover:bg-[#1e1332]/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#ecd8a6]">
                        {emp.email} {isSelf && <span className="text-xs text-indigo-400 font-normal ml-1">(Siz)</span>}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[#ecd8a6]/40 select-all">
                        <span className="bg-[#120a1c]/40 px-2 py-1 rounded border border-[#ecd8a6]/10 select-all">
                          {emp.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isAdminUser && !isSelf ? (
                          <select
                            value={emp.role}
                            onChange={(e) => handleUpdateRole(emp.id, emp.email, e.target.value as any)}
                            className="bg-[#0a0512] border border-[#ecd8a6]/20 text-[#ecd8a6] rounded px-2 py-1.5 text-xs focus:outline-none cursor-pointer"
                          >
                            <option value="görüntüleyen" className="bg-[#0a0512]">Sadece Görüntüleyen</option>
                            <option value="çalışan" className="bg-[#0a0512]">Çalışan</option>
                            <option value="admin" className="bg-[#0a0512]">Admin</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase border ${
                            emp.role === 'admin' ? 'bg-purple-950/40 border-purple-500/25 text-purple-300' :
                            emp.role === 'çalışan' ? 'bg-indigo-950/40 border-indigo-500/25 text-indigo-300' : 'bg-[#120a1c] border border-[#ecd8a6]/15 text-[#ecd8a6]/60'
                          }`}>
                            {emp.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isAdminUser && !isSelf ? (
                          <button
                            onClick={() => handleRemoveEmployee(emp.id, emp.email)}
                            className="text-rose-400 hover:text-rose-200 p-1.5 bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer"
                            title="Yetkiyi Kaldır"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-[#ecd8a6]/30">-</span>
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
