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
    <div className="min-h-screen bg-[#05000a] text-[#ecd8a6] flex overflow-hidden relative">
      {/* Background ambient glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#1e1332]/30 rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* Sidebar */}
      <div className="w-64 bg-[#0a0512] border-r border-[#ecd8a6]/20 flex flex-col z-10">
        <div className="p-5 bg-[#120a1c] border-b border-[#ecd8a6]/20 flex items-center justify-center font-serif font-bold text-lg tracking-widest text-[#ecd8a6]">
          MadameSoul Admin
        </div>
        
        <div className="p-4 text-xs text-[#ecd8a6]/50 border-b border-[#ecd8a6]/10">
          <div className="truncate font-sans font-light">{user.email}</div>
          <div className="mt-1 capitalize text-[#ecd8a6] font-serif font-semibold tracking-wider">{adminData.role}</div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-sans tracking-wide border',
                  isActive 
                    ? 'bg-[#1e1332] text-[#ecd8a6] border-[#ecd8a6]/30 shadow-[0_0_15px_rgba(236,216,166,0.05)] font-semibold' 
                    : 'text-[#ecd8a6]/60 border-transparent hover:bg-[#1e1332]/40 hover:text-[#ecd8a6]/90'
                )}
              >
                <Icon className={clsx("w-4 h-4 transition-colors", isActive ? "text-[#ecd8a6]" : "text-[#ecd8a6]/60")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#ecd8a6]/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-[#ecd8a6]/60 hover:bg-red-950/20 hover:text-red-300 rounded-lg transition-all text-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden z-10">
        <header className="bg-[#0a0512]/60 backdrop-blur-md border-b border-[#ecd8a6]/10 h-16 flex items-center px-6 justify-between">
          <h1 className="text-lg font-serif tracking-widest text-[#ecd8a6] uppercase">
            {navItems.find(item => item.href === location.pathname)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-[#ecd8a6]/60 font-sans font-light uppercase tracking-widest">Sistem Aktif</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-[#05000a]/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
