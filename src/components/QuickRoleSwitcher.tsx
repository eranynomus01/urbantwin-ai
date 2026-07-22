'use client';
import React from 'react';
import { UserRole } from '@/types';
import { Shield, User, HeartHandshake, Building2, ShieldAlert } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const QuickRoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'citizen', label: 'Citizen', icon: <User className="w-4 h-4" />, color: 'bg-blue-600' },
    { role: 'volunteer', label: 'Volunteer', icon: <HeartHandshake className="w-4 h-4" />, color: 'bg-emerald-600' },
    { role: 'officer', label: 'District Officer', icon: <Shield className="w-4 h-4" />, color: 'bg-amber-600' },
    { role: 'ngo', label: 'NGO Partner', icon: <Building2 className="w-4 h-4" />, color: 'bg-purple-600' },
    { role: 'admin', label: 'Super Admin', icon: <ShieldAlert className="w-4 h-4" />, color: 'bg-rose-600' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl backdrop-blur-md border border-slate-300/50 dark:border-slate-700/50">
      <span className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden lg:inline-block">
        Portal View:
      </span>
      {roles.map((r) => {
        const isActive = currentRole === r.role;
        return (
          <button
            key={r.role}
            onClick={() => onRoleChange(r.role)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              isActive
                ? `${r.color} text-white shadow-md scale-105`
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/60 dark:hover:bg-slate-700/60'
            }`}
          >
            {r.icon}
            <span>{r.label}</span>
          </button>
        );
      })}
    </div>
  );
};
