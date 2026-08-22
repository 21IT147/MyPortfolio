import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuthToken, logoutAdmin } from '@/lib/api';
import {
  LayoutDashboard,
  User,
  Code,
  FolderGit2,
  Briefcase,
  BookOpen,
  Mail,
  LogOut,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (location.pathname === '/admin/login') {
      setIsChecking(false);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      navigate('/admin/login');
    } else {
      setAuthenticated(true);
    }
    setIsChecking(false);
  }, [location.pathname, navigate]);

  if (location.pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center text-gray-400 text-sm">
        Verifying Authentication...
      </div>
    );
  }

  if (!authenticated) return null;

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Profile Info', href: '/admin/profile', icon: User },
    { label: 'Skills & Tech', href: '/admin/skills', icon: Code },
    { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
    { label: 'Work Experience', href: '/admin/experience', icon: Briefcase },
    { label: 'Notes & Guides', href: '/admin/notes', icon: BookOpen },
    { label: 'Inbox Messages', href: '/admin/messages', icon: Mail },
    { label: 'Super Admin Users', href: '/admin/users', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#e8eaf0] flex">
      
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-gray-800 hidden md:flex flex-col justify-between p-6 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Portfolio CMS</h2>
              <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Authenticated Admin</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-gray-800">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-blue-400 transition-colors px-3 py-1.5"
          >
            <ExternalLink className="w-4 h-4" /> View Live Portfolio
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <header className="md:hidden glass-nav p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-white text-sm">Admin Panel</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-red-400 font-semibold">Sign Out</button>
        </header>

        <main className="p-6 sm:p-10 max-w-6xl mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
