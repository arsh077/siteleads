import { getCurrentUser } from '../lib/dal';
import { logout } from '../actions/auth';
import { Users, LayoutDashboard, ShieldCheck, UserCheck, LogOut } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  activeTab: 'dashboard' | 'employees' | 'settings';
}

export default async function Navbar({ activeTab }: NavbarProps) {
  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <nav className="bg-[#0F172A] border-b border-white/10 px-4 md:px-8 py-3 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Legal Success India" className="h-12 w-12 rounded-full object-cover invert brightness-125" />
        </div>

        {/* Desktop Navigation Links */}
        <div className="flex items-center gap-6">
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
            {user.role === 'admin' ? (
              <>
                <Link
                  href="/admin"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Master Dashboard
                </Link>

                <Link
                  href="/admin/employees"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTab === 'employees'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Employees Management
                </Link>
              </>
            ) : (
              <Link
                href="/employee/leads"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                My Assigned Leads
              </Link>
            )}
          </div>

          {/* User Status & Logout */}
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <Link
              href="/profile"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <div className="flex items-center justify-end gap-1 text-xs font-semibold text-white">
                  {user.role === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-green-400" />
                  )}
                  <span>{user.displayName || user.role}</span>
                </div>
                <p className="text-[10px] text-white/40">
                  <span className="capitalize text-blue-400 font-medium">{user.role}</span>
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-300 shadow">
                {(user.displayName || 'U').charAt(0).toUpperCase()}
              </div>
            </Link>

            <form action={logout}>
              <button
                type="submit"
                title="Logout"
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </nav>
  );
}
