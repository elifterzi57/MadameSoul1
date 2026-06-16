import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { auth } from '../lib/firebase';
import { LogOut, Database, Users, CreditCard, Activity, Shield } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Koleksiyonlar', href: '/', icon: Database },
  { name: 'Moon Yönetimi', href: '/users', icon: Users },
  { name: 'Finansal Tablolar', href: '/finance', icon: CreditCard },
  { name: 'Sistem Logları', href: '/logs', icon: Activity },
  { name: 'Çalışan Yetkileri', href: '/employees', icon: Shield },
];

export default function DashboardLayout() {
  const { adminData, user } = useAuthStore();
  const location = useLocation();

  if (!user || !adminData) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 bg-slate-800 flex items-center justify-center font-bold text-xl tracking-wider">
          MadameSoul Admin
        </div>
        
        <div className="p-4 text-xs text-slate-400 border-b border-slate-700">
          <div className="truncate">{user.email}</div>
          <div className="mt-1 capitalize text-blue-400">{adminData.role}</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">
            {navItems.find(item => item.href === location.pathname)?.name || 'Dashboard'}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
