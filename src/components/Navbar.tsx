import React, { useState } from 'react';
import { User } from '../types';
import { 
  Users, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  FileSpreadsheet, 
  ShieldCheck, 
  UserCheck, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  user: User;
  activeTab: 'dashboard' | 'employees' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'employees' | 'settings') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#0F172A] border-b border-white/10 px-4 md:px-8 py-3 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg btn-primary flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <span className="font-bold text-xl tracking-wider">L</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-semibold tracking-tight text-white flex items-center gap-1.5">
                LeadSync
              </h1>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                MVP v1.0
              </span>
            </div>
            <p className="text-[10px] text-white/40 hidden sm:block">Equal Round-Robin Lead Distribution</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {user.role === 'admin' ? 'Master Dashboard' : 'My Assigned Leads'}
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => setActiveTab('employees')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'employees'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Employees Management
              </button>
            )}

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
          </div>

          {/* User Status & Logout */}
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-xs font-semibold text-white">
                {user.role === 'admin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-green-400" />
                )}
                <span>{user.name}</span>
              </div>
              <p className="text-[10px] text-white/40">
                @{user.username} • <span className="capitalize text-blue-400 font-medium">{user.role}</span>
              </p>
            </div>

            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-300 shadow">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-300">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2 pb-2 animate-fadeIn">
          <div className="px-2 py-1.5 bg-white/5 rounded-lg mb-1 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">{user.name}</p>
              <p className="text-[10px] text-white/40">@{user.username} ({user.role})</p>
            </div>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 font-medium">
              Active
            </span>
          </div>

          <button
            onClick={() => {
              setActiveTab('dashboard');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium w-full text-left ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-white/70 bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            {user.role === 'admin' ? 'Master Dashboard' : 'My Assigned Leads'}
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => {
                setActiveTab('employees');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium w-full text-left ${
                activeTab === 'employees' ? 'bg-blue-600 text-white' : 'text-white/70 bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              Employee Accounts & Load
            </button>
          )}

          <button
            onClick={() => {
              setActiveTab('settings');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium w-full text-left ${
              activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-white/70 bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            Account Settings
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onLogout();
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium w-full text-left text-red-400 bg-red-500/10 border border-red-500/20 mt-1"
          >
            <LogOut className="w-4 h-4" />
            Logout from Account
          </button>
        </div>
      )}
    </nav>
  );
};
