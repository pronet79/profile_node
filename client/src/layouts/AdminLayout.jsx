import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, MessageSquareQuote, Mail, HeartHandshake,
  Briefcase, Layers, Wrench, FileText, Settings, LogOut, Code2, BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Seo from '../components/Seo.jsx';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/feedback', label: 'Feedback', icon: MessageSquareQuote },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/donations', label: 'Support', icon: HeartHandshake },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/skills', label: 'Skills', icon: Layers },
  { to: '/admin/blog', label: 'Blog', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/admin/login'); };

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Seo title="Admin — Dashboard" noindex />
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-ink-900 p-4 md:flex">
        <div className="flex items-center gap-2 px-2 py-3 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent"><Code2 className="h-5 w-5" /></span>
          Admin
        </div>
        <nav className="mt-4 flex-1 space-y-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-accent/15 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-3">
          <p className="px-3 text-xs text-slate-500">{admin?.email}</p>
          <button onClick={handleLogout} className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        {/* Top bar — visible on every screen size, always shows Logout */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-ink-950/80 px-5 py-3 backdrop-blur sm:px-8">
          <span className="font-semibold md:hidden">Admin</span>
          <span className="hidden text-sm text-slate-400 md:block">Signed in as {admin?.email}</span>
          <button onClick={handleLogout} className="btn-ghost h-9 !px-3 text-xs">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
        <main className="p-5 sm:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
