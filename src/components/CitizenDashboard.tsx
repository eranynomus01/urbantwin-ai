'use client';
import React, { useState } from 'react';
import { EmergencyReport, ReliefCenter } from '@/types';
import { User, ShieldCheck, AlertTriangle, Home, Phone } from 'lucide-react';

interface CitizenDashboardProps {
  emergencies: EmergencyReport[];
  reliefCenters: ReliefCenter[];
  onOpenSOS: () => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  emergencies,
  reliefCenters,
  onOpenSOS
}) => {
  const [familySafe, setFamilySafe] = useState(true);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">
            <User className="w-4 h-4" /> Citizen Emergency Hub
          </div>
          <h2 className="text-2xl font-extrabold">Welcome back, Rahul Sharma</h2>
          <p className="text-sm text-blue-100 mt-1 max-w-xl">
            Location active (28.6139° N, 77.2090° E). In case of immediate danger, press the SOS button to alert NDRF.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
          <div className="text-right">
            <span className="block text-xs text-blue-200">Family Safe Status</span>
            <span className="font-bold text-sm">{familySafe ? 'SAFE & VERIFIED' : 'NEEDS HELP'}</span>
          </div>
          <button
            onClick={() => setFamilySafe(!familySafe)}
            className={`p-3 rounded-xl transition-all font-bold text-xs ${
              familySafe ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
            }`}
          >
            {familySafe ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> My SOS Emergency Requests
            </h3>
            <button
              onClick={onOpenSOS}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
            >
              + New SOS
            </button>
          </div>

          <div className="space-y-3">
            {emergencies.map((e) => (
              <div
                key={e.id}
                className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 mr-2">
                      {e.disaster_type}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base inline">
                      {e.location_name}
                    </h4>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      e.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : e.status === 'Assigned'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    ● {e.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{e.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    AI Severity Score: <strong className="text-rose-500">{e.ai_severity}/10</strong>
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">
                    Assigned Unit: <strong className="text-blue-600 dark:text-blue-400">{e.assigned_team || 'Pending Dispatch'}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-500" /> Nearby Relief Centers
            </h3>
            <div className="space-y-3">
              {reliefCenters.map((rc) => (
                <div key={rc.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{rc.name}</h4>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {rc.available_beds} beds free
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">{rc.location_name}</p>
                  <a
                    href={`tel:${rc.contact_phone}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Phone className="w-3 h-3" /> Call Hotline: {rc.contact_phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
