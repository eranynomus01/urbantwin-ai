'use client';
import React from 'react';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';
import { Bell, X, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Broadcast Alerts</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {MOCK_NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 rounded-xl border transition-all ${
              n.type === 'urgent'
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
                : n.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              {n.type === 'urgent' ? (
                <ShieldAlert className="w-4 h-4 text-red-600" />
              ) : n.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              ) : (
                <Info className="w-4 h-4 text-blue-600" />
              )}
              <span>{n.title}</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">{n.message}</p>
            <span className="block mt-2 text-[10px] opacity-60">
              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
