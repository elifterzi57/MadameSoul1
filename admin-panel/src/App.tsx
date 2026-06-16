import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/useAuthStore';

// Layouts & Pages
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Collections from './pages/Collections';
import Users from './pages/Users';
import Finance from './pages/Finance';
import Logs from './pages/Logs';
import Employees from './pages/Employees';

export default function App() {
  const { setUser, fetchAdminData, clearAuth, loading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          await fetchAdminData(firebaseUser.uid, firebaseUser.email!);
        } catch (error) {
          console.error("Auth validation failed:", error);
          auth.signOut();
        }
      } else {
        clearAuth();
      }
    });

    return () => unsubscribe();
  }, [setUser, fetchAdminData, clearAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-600">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Collections />} />
          <Route path="/users" element={<Users />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/employees" element={<Employees />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
