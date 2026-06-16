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
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>{message.text}</div>
        </div>
      )}

      {/* Add Employee Form */}
      {isAdminUser && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Yeni Çalışan / Yetkili Ekle
          </h2>
          <p className="text-xs text-slate-500">
            Kullanıcının admin paneline erişebilmesi için önce MadameSoul uygulamasında bir hesabı bulunmalıdır. E-posta adresiyle arayarak yetki tanımlayabilirsiniz.
          </p>

          <form onSubmit={handleSearchUser} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="E-posta adresi girin..."
                required
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              {searchLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Ara'}
            </button>
          </form>

          {foundUser && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
              <div>
                <span className="block text-xs text-slate-400 font-semibold uppercase">Bulunan Kullanıcı</span>
                <span className="text-slate-800 text-sm font-medium">{foundUser.email}</span>
                <span className="block text-[10px] text-slate-400 font-mono">{foundUser.id}</span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                >
                  <option value="görüntüleyen">Sadece Görüntüleyen</option>
                  <option value="çalışan">Çalışan</option>
                  <option value="admin">Admin</option>
                </select>

                <button
                  type="button"
                  onClick={handleAddEmployee}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Yetkilendir
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Employees List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-slate-600" />
            Çalışan Yetkileri ve Rolleri ({employees.length})
          </h2>
          <button
            onClick={fetchEmployees}
            disabled={loading}
            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="px-6 py-3">E-posta</th>
                  <th className="px-6 py-3">UID</th>
                  <th className="px-6 py-3">Rol / Yetki</th>
                  <th className="px-6 py-3">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                {employees.map(emp => {
                  const isSelf = emp.id === auth.currentUser?.uid;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {emp.email} {isSelf && <span className="text-xs text-blue-500 font-normal">(Siz)</span>}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400 select-all">{emp.id}</td>
                      <td className="px-6 py-4">
                        {isAdminUser && !isSelf ? (
                          <select
                            value={emp.role}
                            onChange={(e) => handleUpdateRole(emp.id, emp.email, e.target.value as any)}
                            className="bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                          >
                            <option value="görüntüleyen">Sadece Görüntüleyen</option>
                            <option value="çalışan">Çalışan</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                            emp.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            emp.role === 'çalışan' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {emp.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isAdminUser && !isSelf ? (
                          <button
                            onClick={() => handleRemoveEmployee(emp.id, emp.email)}
                            className="text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Yetkiyi Kaldır"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
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
