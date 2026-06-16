import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'employee' | 'viewer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        try {
          // Force refresh token to get latest custom claims
          const idTokenResult = await user.getIdTokenResult(true);
          const role = (idTokenResult.claims.role as string) || null;
          setUserRole(role);
        } catch (err) {
          console.error("Failed to fetch claims:", err);
          setUserRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0716]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-[#ecd8a6] mx-auto"></div>
          <p className="mt-4 text-[#ecd8a6] font-serif text-lg animate-pulse">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if role is authorized (admin covers everything, employee covers employee/viewer, viewer only covers viewer)
  const isAuthorized = () => {
    if (!userRole) return false;
    if (userRole === 'admin') return true;
    
    if (requiredRole === 'employee') {
      return userRole === 'employee';
    }
    
    if (requiredRole === 'viewer') {
      return userRole === 'employee' || userRole === 'viewer';
    }
    
    return true; // default protected dashboard access requires at least some admin_user role
  };

  if (!isAuthorized()) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0716] px-4 text-center">
        <div className="max-w-md rounded-2xl border border-red-900/30 bg-red-950/10 p-8 backdrop-blur-xl">
          <h2 className="font-serif text-2xl text-red-400">Yetkisiz Erişim</h2>
          <p className="mt-4 text-gray-300">Bu sayfayı görüntülemek için yeterli yetkiniz bulunmamaktadır.</p>
          <button 
            onClick={() => auth.signOut()}
            className="mt-6 rounded-lg bg-red-900/40 px-6 py-2 font-medium text-white transition hover:bg-red-800/60"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
