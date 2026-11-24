import React, { useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import {
  Activity,
  Award,
  Briefcase,
  Cpu,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SIDEBAR_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: 'Profile & Resume', icon: User },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/skills', label: 'Skills', icon: Cpu },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/education', label: 'Education', icon: GraduationCap },
  { to: '/admin/achievements', label: 'Achievements', icon: Award },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { to: '/admin/media', label: 'Media Library', icon: Image },
  { to: '/admin/settings', label: 'CMS & Settings', icon: Settings },
  { to: '/admin/activity', label: 'Activity Logs', icon: Activity },
];

export const AdminLayout: React.FC = () => {
  const { admin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian text-sm text-slateMuted">
        Verifying session...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-obsidian text-ivory">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.08] bg-midnight transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/40 bg-obsidian font-display text-sm font-bold text-gold-light">
              OB
            </div>
            <div>
              <p className="font-display text-sm font-bold text-ivory">Admin Panel</p>
              <p className="text-[11px] text-slateMuted">{admin.role}</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-slateMuted lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {SIDEBAR_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gold/15 text-gold-light ring-1 ring-gold/30'
                      : 'text-slateMuted hover:bg-surface hover:text-ivory'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.08] p-4">
          <div className="mb-3 rounded-xl bg-obsidian/70 px-3 py-2.5">
            <p className="truncate text-xs font-semibold text-ivory">{admin.name}</p>
            <p className="truncate text-[11px] text-slateMuted">{admin.email}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs text-slateMuted hover:border-gold/40 hover:text-ivory"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.07] bg-obsidian/85 px-5 py-3.5 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-surface text-ivory"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-sm font-bold text-gold-light">OB Portfolio CMS</span>
          <Link to="/" className="text-xs text-slateMuted">
            View Site
          </Link>
        </header>

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
