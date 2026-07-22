'use client';
import React from 'react';
import { UserRole, User } from '@/types';
import { ShieldAlert, Bell, Moon, Sun, AlertTriangle, Radio, LogIn, LogOut, Shield } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSOS: () => void;
  onOpenNotifications: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenSOS,
  onOpenNotifications,
  darkMode,
  setDarkMode
}) => {
  const roleStyles: Record<UserRole, { bg: string; label: string }> = {
    citizen: { bg: 'bg-blue-600', label: 'Citizen Hub' },
    volunteer: { bg: 'bg-emerald-600', label: 'Volunteer Force' },
    officer: { bg: 'bg-amber-600', label: 'District Officer' },
    ngo: { bg: 'bg-purple-600', label: 'NGO Logistics' },
    admin: { bg: 'bg-rose-600', label: 'Super Admin' }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-extrabold text-xl border border-white/20">
            <ShieldAlert className="w-6 h-6 animate-pulse text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                NDMA <span className="text-blue-600 dark:text-blue-400">DISASTER PORTAL</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/10 text-red-500 border border-red-500/30">
                <Radio className="w-3 h-3 animate-ping" /> LIVE 24/7
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
              National Emergency Response & Triage Command
            </p>
          </div>
        </div>

        {/* Center Role Navigation Bar */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/60 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs shadow-inner">
          {(['citizen', 'volunteer', 'officer', 'ngo', 'admin'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className={`px-3.5 py-2 rounded-xl font-extrabold transition-all duration-200 ${
                currentRole === r
                  ? `${roleStyles[r].bg} text-white shadow-lg scale-105`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {roleStyles[r].label}
            </button>
          ))}
        </div>

        {/* Right Actions & Auth */}
        <div className="flex items-center gap-2.5">
          {/* SOS Report Button */}
          <button
            onClick={onOpenSOS}
            className="sos-glow px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl flex items-center gap-2 transition-all active:scale-95 border border-red-400/40"
          >
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">REPORT SOS</span>
          </button>

          {/* User Auth Profile / Login */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
              <div className={`w-8 h-8 ${roleStyles[currentUser.role].bg} text-white rounded-lg flex items-center justify-center font-black text-xs uppercase`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left text-xs pr-1">
                <span className="font-bold block text-white line-clamp-1">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400 capitalize">{currentUser.role}</span>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all border border-blue-400/30"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Broadcast Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
