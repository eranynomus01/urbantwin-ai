'use client';
import React, { useState } from 'react';
import { ShieldAlert, Megaphone, FileText, CheckCircle2, Radio } from 'lucide-react';
import { MOCK_ACTIVITY_LOGS } from '@/lib/mockData';

export const AdminDashboard: React.FC = () => {
  const [alertTitle, setAlertTitle] = useState('SEVERE WEATHER RED ALERT');
  const [alertMsg, setAlertMsg] = useState('Heavy cyclonic rainfall predicted across coastal sector. Evacuate low-lying areas immediately.');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-rose-700 via-red-700 to-amber-700 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-200 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" /> National System Super Admin Console
          </div>
          <h2 className="text-2xl font-extrabold">Super Admin Control Hub</h2>
          <p className="text-sm text-rose-100 mt-1">
            Root System Permissions • User Role Management • Mass Emergency Broadcast Console
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-rose-300 dark:border-rose-900 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-base">
          <Megaphone className="w-6 h-6 animate-pulse" /> Mass Emergency Broadcast Alert Console
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          This alert will be instantly dispatched via SMS Gateway, Push Notification, and Email SMTP to all citizens in affected zones.
        </p>

        {broadcastSent ? (
          <div className="p-4 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 rounded-2xl flex items-center gap-3 font-bold text-sm">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            BROADCAST DISPATCHED TO 14,250 REGISTERED CITIZENS & OFFICERS!
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Alert Headline</label>
              <input
                type="text"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Alert Message</label>
              <textarea
                value={alertMsg}
                onChange={(e) => setAlertMsg(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleBroadcast}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 animate-ping" /> DISPATCH MASS EMERGENCY ALERT (SMS / PUSH / EMAIL)
            </button>
          </div>
        )}
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" /> System Activity & Audit Logs
        </h3>
        <div className="space-y-2">
          {MOCK_ACTIVITY_LOGS.map((log) => (
            <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs flex justify-between items-center border border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">[{log.action}]</span>
                <span className="text-slate-700 dark:text-slate-300">{log.details}</span>
              </div>
              <span className="text-slate-400 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
