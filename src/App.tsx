import React, { useState, useEffect } from 'react';
import { User } from './types';
import { getActiveSession, setActiveSession } from './services/storage';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { EmployeeManagement } from './components/EmployeeManagement';
import { SettingsScreen } from './components/SettingsScreen';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'settings'>('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const session = getActiveSession();
    if (session) {
      setCurrentUser(session);
    }
    setIsInitializing(false);
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setActiveSession(null);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleUserUpdated = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-white/60 font-medium">Loading LeadSync Workspace...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {activeTab === 'dashboard' && (
          currentUser.role === 'admin' ? (
            <AdminDashboard currentUser={currentUser} />
          ) : (
            <EmployeeDashboard currentUser={currentUser} />
          )
        )}

        {activeTab === 'employees' && currentUser.role === 'admin' && (
          <EmployeeManagement />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            currentUser={currentUser}
            onUserUpdated={handleUserUpdated}
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-white/5 py-4 text-center text-[11px] text-white/30 bg-[#0F172A]/80">
        <p>LeadSync MVP v1.0 • Equal Round-Robin Distribution Platform • Pure Logic Execution</p>
      </footer>
    </div>
  );
}
