import React, { useState } from 'react';
import { User } from '../types';
import { updateUserCredentials } from '../services/storage';
import { Settings, User as UserIcon, KeyRound, CheckCircle2, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';

interface SettingsScreenProps {
  currentUser: User;
  onUserUpdated: (user: User) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ currentUser, onUserUpdated }) => {
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !username.trim()) {
      setError('Name and username are required.');
      return;
    }

    if (password && password !== confirmPassword) {
      setError('New passwords do not match!');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const updated = updateUserCredentials(
          currentUser.id,
          name.trim(),
          username.trim(),
          password ? password.trim() : undefined
        );

        setSuccess('Account credentials updated successfully!');
        setPassword('');
        setConfirmPassword('');
        onUserUpdated(updated);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to update credentials.');
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-5 sm:p-6 border border-white/10 space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Account Settings
            </h1>
            <p className="text-xs text-white/60">
              Update your account display name, username, and secure password.
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Form Card */}
      <div className="glass-panel p-6 border border-white/10 shadow-2xl space-y-5">
        
        {/* User Role Card */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold flex items-center justify-center text-sm">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{currentUser.name}</p>
              <p className="text-white/40 font-mono">@{currentUser.username}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/30 flex items-center gap-1">
              {currentUser.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
              {currentUser.role}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Username (Login ID)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <hr className="border-white/10 my-2" />

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Confirm Password */}
          {password && (
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500 font-mono"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 rounded-lg text-xs sm:text-sm font-semibold text-white cursor-pointer shadow-lg flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 mt-4"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Update Credentials
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
