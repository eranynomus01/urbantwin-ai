'use client';
import React from 'react';
import { UserRole } from '@/types';
import { QuickRoleSwitcher } from './QuickRoleSwitcher';
import { ShieldAlert, Bell, Moon, Sun, AlertTriangle, Radio } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSOS: () => void;
  onOpenNotifications: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onOpenSOS,
  onOpenNotifications,
  darkMode,
  setDarkMode
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-extrabold text-xl">
            <ShieldAlert className="w-6 h-6 animate-pulse text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                NDMA <span className="text-blue-600 dark:text-blue-400">DISASTER PORTAL</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                <Radio className="w-3 h-3 animate-ping" /> LIVE 24/7
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              National AI Emergency Response Platform
            </p>
          </div>
        </div>

        {/* Center Role Selector */}
        <div className="hidden md:block">
          <QuickRoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />
        </div>

        {/* Right Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSOS}
            className="sos-glow px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
          >
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">REPORT SOS</span>
          </button>

          {/* Broadcast Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Role Bar */}
      <div className="md:hidden px-4 pb-3">
        <QuickRoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />
      </div>
    </header>
  );
};
