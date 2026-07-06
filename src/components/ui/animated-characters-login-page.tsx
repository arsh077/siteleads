import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getUsers, setActiveSession } from '../../services/storage';
import { User } from '../../types';
import {
  ShieldCheck,
  Lock,
  User as UserIcon,
  LogIn,
  AlertCircle,
  Eye,
  EyeOff,
  Scale,
  Sparkles,
  Gavel,
  Briefcase,
  CheckCircle2,
  Building2,
  Award
} from 'lucide-react';

interface ComponentProps {
  onLoginSuccess?: (user: User) => void;
}

export function Component({ onLoginSuccess }: ComponentProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Character interaction states
  const [focusedInput, setFocusedInput] = useState<'none' | 'username' | 'password'>('none');
  const [selectedAttorney, setSelectedAttorney] = useState<'marcus' | 'elena'>('marcus');

  // Eye tracking offset based on input length
  const eyeOffset = Math.min(Math.max((username.length - 8) * 1.2, -12), 12);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = getUsers();
      const match = users.find(
        (u) =>
          u.username.toLowerCase() === username.trim().toLowerCase() &&
          u.password === password.trim()
      );

      if (!match) {
        setError('Invalid credentials. Access to legal lead portal denied.');
        setIsLoading(false);
        return;
      }

      if (!match.isActive) {
        setError('Account inactive. Contact Senior Managing Counsel to activate.');
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        setActiveSession(match);
        if (onLoginSuccess) {
          onLoginSuccess(match);
        } else {
          // Fallback if rendered standalone
          window.location.reload();
        }
      }, 800);
    }, 600);
  };

  const fillDemo = (uName: string, roleLabel: string) => {
    setUsername(uName);
    setPassword('123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient Legal & Tech Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 my-auto">
        
        {/* Left Column: Animated Attorney Character Section */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
          
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-amber-500/30 text-amber-300 text-xs font-medium shadow-lg backdrop-blur-md">
            <Scale className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>LeadSync Legal Workspace</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Attorney Portal
          </h1>

          {/* Attorney Selector Pills */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setSelectedAttorney('marcus')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedAttorney === 'marcus'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              Advocate Marcus
            </button>
            <button
              type="button"
              onClick={() => setSelectedAttorney('elena')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedAttorney === 'elena'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Counsel Elena
            </button>
          </div>

          {/* Character Animation Stage */}
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[280px] sm:h-[300px] flex items-center justify-center">
            
            {/* Background Halo */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-blue-500/5 to-transparent rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm" />

            {/* Speech Bubble */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${focusedInput}-${error ? 'err' : isSuccess ? 'succ' : showPassword ? 'peek' : 'normal'}-${selectedAttorney}`}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-amber-500/40 text-slate-200 text-xs px-3.5 py-1.5 rounded-xl shadow-xl z-20 whitespace-nowrap pointer-events-none flex items-center gap-1.5"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                {isSuccess ? (
                  <span className="text-emerald-400 font-semibold">Objection Overruled! Access Granted! ⚖️</span>
                ) : error ? (
                  <span className="text-rose-400 font-medium">Verification Failed! Please re-verify. 🚫</span>
                ) : focusedInput === 'password' ? (
                  showPassword ? (
                    <span className="text-amber-300">Aha! Peeking at protected credentials... 🕵️‍♂️</span>
                  ) : (
                    <span className="text-slate-300">Confidentiality Assured! Eyes Covered. 🙈</span>
                  )
                ) : focusedInput === 'username' ? (
                  <span className="text-amber-300">Verifying Counsel Bar & Identity... 🔍</span>
                ) : (
                  <span>Ready to manage LeadSync rounds, Counselor! 🏛️</span>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Render Selected Attorney SVG Component */}
            <AttorneySVGCharacter
              attorney={selectedAttorney}
              focusedInput={focusedInput}
              showPassword={showPassword}
              eyeOffset={eyeOffset}
              isSuccess={isSuccess}
              isError={!!error}
              isLoading={isLoading}
            />
          </div>

          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Interactive AI Attorney Avatar reacts in real-time to security input focus and lead compliance checks.
          </p>
        </div>

        {/* Right Column: Glassmorphism Login Form */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative space-y-6">
          
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-amber-400" />
                  Sign In to Lead Workspace
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Equal Round-Robin Distribution for Legal Inquiries & Lead Dumps
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                <Award className="w-3.5 h-3.5" />
                <span>Legal MVP v1.0</span>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-200">Authentication Warning</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Counsel / Staff Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4 text-amber-400/70" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput('none')}
                  placeholder="e.g. admin, rohan, or priya"
                  className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Vault Password
                </label>
                <span className="text-[11px] text-slate-500">Default demo: 123</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-amber-400/70" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput('none')}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-amber-400 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login CTA Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Authenticated! Entering Portal...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Authorize & Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                Quick Demo Switcher:
              </span>
              <span className="text-[11px] text-slate-500">Click to auto-fill</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin', 'Senior Partner / Admin')}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300">admin</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-medium">
                    Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Dump Leads Control</p>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('rohan', 'Associate Rohan')}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-blue-500/10 border border-slate-800 hover:border-blue-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-300">rohan</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-medium">
                    Staff
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Response Sheet</p>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('priya', 'Associate Priya')}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">priya</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-medium">
                    Staff
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Response Sheet</p>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Separate SVG Attorney Character Component with custom Framer Motion dynamics
interface AttorneySVGCharacterProps {
  attorney: 'marcus' | 'elena';
  focusedInput: 'none' | 'username' | 'password';
  showPassword?: boolean;
  eyeOffset: number;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
}

function AttorneySVGCharacter({
  attorney,
  focusedInput,
  showPassword,
  eyeOffset,
  isSuccess,
  isError,
  isLoading
}: AttorneySVGCharacterProps) {
  const isMarcus = attorney === 'marcus';

  // Determine hand / eyes covering state
  const isCoveringEyes = focusedInput === 'password' && !showPassword;
  const isPeeking = focusedInput === 'password' && showPassword;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2">
      <svg
        viewBox="0 0 320 320"
        className="w-full h-full max-w-[280px] max-h-[280px] drop-shadow-2xl"
      >
        <defs>
          {/* Suit & Lapel Gradients */}
          <linearGradient id="suitGradNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="suitGradCharcoal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Tie & Collar Gradients */}
          <linearGradient id="goldTie" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="burgundyTie" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>

          {/* Skin Tones */}
          <linearGradient id="skinMarcus" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#FDBA74" />
          </linearGradient>

          {/* Gold Metal Scales */}
          <linearGradient id="goldGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
        </defs>

        {/* Scales of Justice Background Watermark */}
        <g opacity="0.12" transform="translate(160, 100) scale(1.2)">
          <path
            d="M-40 -30 L40 -30 M0 -30 L0 30 M-40 -30 L-55 10 A15 10 0 0 0 -25 10 Z M40 -30 L25 10 A15 10 0 0 0 55 10 Z M-20 30 L20 30"
            stroke="#F59E0B"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* 1. Attorney Torso / Executive Suit */}
        <motion.g
          animate={{
            y: isLoading ? [0, -3, 0] : [0, -1.5, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: isLoading ? 0.6 : 3,
            ease: "easeInOut"
          }}
        >
          {/* Shoulders & Suit Coat */}
          <path
            d="M 60 280 C 60 210, 110 185, 160 185 C 210 185, 260 210, 260 280 L 260 320 L 60 320 Z"
            fill={isMarcus ? "url(#suitGradNavy)" : "url(#suitGradCharcoal)"}
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* White Crisp Collar Shirt */}
          <polygon
            points="125,185 195,185 175,235 145,235"
            fill="#F8FAFC"
          />

          {/* Tie or Legal Jabot Collar */}
          {isMarcus ? (
            <polygon
              points="152,190 168,190 172,250 160,265 148,250"
              fill="url(#goldTie)"
            />
          ) : (
            <polygon
              points="152,190 168,190 170,245 160,258 150,245"
              fill="url(#burgundyTie)"
            />
          )}

          {/* Suit Lapels */}
          <path
            d="M 90 220 L 132 186 L 146 245 L 115 280 Z"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="1"
          />
          <path
            d="M 230 220 L 188 186 L 174 245 L 205 280 Z"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Gold Lapel Pin (Scales of Justice) */}
          <circle cx="112" cy="225" r="5" fill="url(#goldGold)" />
          <path d="M 110 225 L 114 225 M 112 223 L 112 227" stroke="#78350F" strokeWidth="1" />
        </motion.g>

        {/* 2. Neck */}
        <rect x="142" y="152" width="36" height="38" rx="8" fill="url(#skinTone)" />

        {/* 3. Attorney Head & Hair */}
        <motion.g
          animate={{
            rotate: isError ? [-3, 3, -3, 3, 0] : isSuccess ? [0, -4, 4, 0] : 0,
            y: isSuccess ? -4 : 0
          }}
          transition={{ duration: 0.5 }}
        >
          {/* Head Base */}
          <rect x="110" y="70" width="100" height="95" rx="42" fill="url(#skinTone)" />

          {/* Ears */}
          <circle cx="106" cy="118" r="10" fill="url(#skinTone)" />
          <circle cx="214" cy="118" r="10" fill="url(#skinTone)" />

          {/* Hair Style */}
          {isMarcus ? (
            // Marcus: Slicked Back Executive Side Part
            <path
              d="M 106 100 C 105 60, 140 45, 160 45 C 190 45, 215 60, 214 100 C 205 80, 180 65, 160 65 C 135 65, 115 80, 106 100 Z"
              fill="#1E293B"
            />
          ) : (
            // Elena: Elegant Corporate Bob
            <g>
              <path
                d="M 100 115 C 98 60, 135 42, 160 42 C 188 42, 222 60, 220 115 C 224 140, 212 165, 208 165 C 202 140, 205 90, 160 70 C 115 90, 118 140, 112 165 C 108 165, 96 140, 100 115 Z"
                fill="#471505"
              />
            </g>
          )}

          {/* Eyebrows */}
          <motion.g
            animate={{
              y: isPeeking ? -4 : isError ? -2 : 0
            }}
          >
            {/* Left Brow */}
            <path
              d={isError ? "M 126 102 Q 138 96 148 102" : "M 126 98 Q 138 94 148 98"}
              stroke="#27272A"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Brow */}
            <path
              d={isError ? "M 172 102 Q 182 96 194 102" : "M 172 98 Q 182 94 194 98"}
              stroke="#27272A"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </motion.g>

          {/* Eyes Group (Interactive Pupil Movement) */}
          {!isCoveringEyes && (
            <g>
              {/* Left Eye White */}
              <ellipse cx="137" cy="115" rx="11" ry="8" fill="#FFFFFF" />
              {/* Right Eye White */}
              <ellipse cx="183" cy="115" rx="11" ry="8" fill="#FFFFFF" />

              {/* Pupils */}
              <motion.g
                animate={{
                  x: eyeOffset,
                  y: focusedInput === 'username' ? 2 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <circle cx="137" cy="115" r="5" fill="#0F172A" />
                <circle cx="183" cy="115" r="5" fill="#0F172A" />
                {/* Catchlight */}
                <circle cx="135" cy="113" r="1.8" fill="#FFFFFF" />
                <circle cx="181" cy="113" r="1.8" fill="#FFFFFF" />
              </motion.g>

              {/* Blinking Animation Overlay */}
              <motion.g
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ repeat: Infinity, duration: 4, times: [0, 0.95, 0.97, 0.99, 1] }}
                style={{ originY: "115px", originX: "160px" }}
              />
            </g>
          )}

          {/* Glasses Frame (Professional Legal Look) */}
          <g>
            {/* Left Frame */}
            <rect x="122" y="103" width="30" height="22" rx="6" fill="none" stroke="#D97706" strokeWidth="2.5" />
            {/* Right Frame */}
            <rect x="168" y="103" width="30" height="22" rx="6" fill="none" stroke="#D97706" strokeWidth="2.5" />
            {/* Bridge */}
            <line x1="152" y1="112" x2="168" y2="112" stroke="#D97706" strokeWidth="2.5" />
            {/* Temples */}
            <line x1="122" y1="110" x2="110" y2="110" stroke="#D97706" strokeWidth="2" />
            {/* Right Temple */}
            <line x1="198" y1="110" x2="210" y2="110" stroke="#D97706" strokeWidth="2" />
          </g>

          {/* Nose */}
          <path d="M 160 115 L 157 128 L 163 128" stroke="#D97706" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Mouth Expressions */}
          <g>
            {isSuccess ? (
              // Confident Lawyer Smile
              <path d="M 142 142 Q 160 156 178 142" stroke="#9A3412" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : isError ? (
              // Concerned / Serious Mouth
              <path d="M 145 148 Q 160 140 175 148" stroke="#9A3412" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : isPeeking ? (
              // Amused Smile
              <path d="M 144 142 Q 160 152 176 142" stroke="#9A3412" strokeWidth="3" fill="#FFFFFF" strokeLinecap="round" />
            ) : (
              // Pleasant Neutral Mouth
              <path d="M 146 144 Q 160 150 174 144" stroke="#9A3412" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            )}
          </g>
        </motion.g>

        {/* 4. Hands Covering Eyes Animation when Password Focused */}
        <AnimatePresence>
          {isCoveringEyes && (
            <motion.g
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
              {/* Left Sleeve */}
              <path d="M 75 220 L 125 125 L 148 135 L 90 240 Z" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              {/* Left Hand */}
              <ellipse cx="137" cy="116" rx="20" ry="16" fill="url(#skinTone)" />
              {/* Left Fingers */}
              <path d="M 120 106 Q 137 100 155 106 M 120 114 Q 137 108 156 114 M 122 122 Q 137 116 154 122" stroke="#D97706" strokeWidth="1.5" fill="none" />

              {/* Right Sleeve */}
              <path d="M 245 220 L 195 125 L 172 135 L 230 240 Z" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              {/* Right Hand */}
              <ellipse cx="183" cy="116" rx="20" ry="16" fill="url(#skinTone)" />
              {/* Right Fingers */}
              <path d="M 165 106 Q 183 100 200 106 M 164 114 Q 183 108 200 114 M 166 122 Q 183 116 198 122" stroke="#D97706" strokeWidth="1.5" fill="none" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* 5. Gavel Prop in Front */}
        <motion.g
          animate={{
            rotate: isSuccess ? [0, -25, 0] : 0,
            y: isSuccess ? [0, -5, 0] : 0
          }}
          transition={{ duration: 0.4 }}
          style={{ transformOrigin: "250px 260px" }}
        >
          {/* Gavel Head */}
          <rect x="235" y="240" width="35" height="18" rx="4" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
          {/* Gavel Handle */}
          <rect x="250" y="258" width="6" height="35" rx="2" fill="#B45309" />
          {/* Sound Block */}
          <ellipse cx="253" cy="295" rx="18" ry="6" fill="#451A03" stroke="#D97706" strokeWidth="1" />
        </motion.g>
      </svg>
    </div>
  );
}

// Export default and named Component as requested
export default Component;
