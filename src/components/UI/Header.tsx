'use client';

import React, { useState, useEffect } from 'react';
import { City, UserRole } from '@/types';
import { SUPPORTED_CITIES } from '@/data/cities';
import { Map, BarChart2, Shield, Sparkles, LayoutGrid, Database, FileBarChart, HelpCircle, ChevronDown, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeCity: City;
  onSelectCity: (city: City) => void;
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenDataModal: () => void;
  onOpenReportModal: () => void;
  onOpenTourModal: () => void;
  activeTab: string;
  onSelectTab: (tab: any) => void;
  onTriggerQuickDemo: (demoType: 'nh48_closure' | 'fire_sec65') => void;
}

const TABS = [
  { id: 'services', label: 'Services Portal', icon: LayoutGrid },
  { id: 'inspector', label: 'Sector Map', icon: Map },
  { id: 'simulator', label: 'What-If', icon: BarChart2 },
  { id: 'emergency', label: 'Emergency', icon: Shield },
  { id: 'ai_advisor', label: 'AI Advisor', icon: Sparkles },
  { id: 'scenarios', label: 'Compare', icon: FileBarChart },
];

export default function Header({
  activeCity,
  onSelectCity,
  userRole,
  onSelectRole,
  isDarkMode,
  onToggleTheme,
  onOpenDataModal,
  onOpenReportModal,
  onOpenTourModal,
  activeTab,
  onSelectTab,
  onTriggerQuickDemo,
}: HeaderProps) {
  const [time, setTime] = useState('');
  const [cityOpen, setCityOpen] = useState(false);

  useEffect(() => {
    const tick = () => setTime(
      new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }) + ' IST'
    );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="w-full shrink-0 bg-[#080d1a]/95 border-b border-white/[0.06] backdrop-blur-xl z-50 select-none">
      {/* Top Row */}
      <div className="flex items-center justify-between h-14 px-5 gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-sm tracking-tight">UT</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-sm text-white leading-tight tracking-tight">UrbanTwin AI</div>
            <div className="text-[10px] text-slate-400 font-medium">Gurugram Digital Twin Platform</div>
          </div>
        </div>

        {/* Center Nav Tabs (Desktop) */}
        <nav className="hidden md:flex items-end h-full gap-0.5 overflow-x-auto no-scrollbar">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onSelectTab(id)}
              className={`nav-tab flex items-center gap-1.5 ${activeTab === id ? 'active' : ''}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live Time */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot"></span>
            <span className="text-xs text-slate-300 font-mono font-medium">{time}</span>
          </div>

          {/* City Selector */}
          <div className="relative">
            <button
              onClick={() => setCityOpen(!cityOpen)}
              className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08]"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-100 font-bold">{activeCity.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {cityOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 panel-card rounded-2xl shadow-2xl overflow-hidden z-[100] border border-white/[0.1] bg-[#0c1427]/98 backdrop-blur-2xl">
                <div className="px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400">
                    Haryana Districts & Twin Cities
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto no-scrollbar py-1">
                  {SUPPORTED_CITIES.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => { onSelectCity(city); setCityOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs transition hover:bg-white/[0.08] flex items-center justify-between ${
                        city.id === activeCity.id ? 'bg-sky-500/15 text-sky-300 font-bold' : 'text-slate-300 font-medium'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-100">{city.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[170px]">
                          Pop: {city.totalPopulation.toLocaleString('en-IN')}
                        </div>
                      </div>
                      {city.id === activeCity.id && (
                        <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => onTriggerQuickDemo('nh48_closure')}
              className="px-3 py-1.5 text-[11px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg hover:bg-amber-400/15 transition"
            >
              ⛔ NH-48 Demo
            </button>
            <button
              onClick={() => onTriggerQuickDemo('fire_sec65')}
              className="px-3 py-1.5 text-[11px] font-bold text-orange-400 bg-orange-400/10 border border-orange-400/20 rounded-lg hover:bg-orange-400/15 transition"
            >
              🚒 Fire Stn Demo
            </button>
          </div>

          {/* Actions */}
          <button onClick={onOpenTourModal} title="Guided Tour" className="btn-ghost p-2 rounded-lg">
            <HelpCircle className="w-4 h-4" />
          </button>
          <button onClick={onOpenReportModal} title="Export PDF Report" className="btn-ghost p-2 rounded-lg">
            <FileBarChart className="w-4 h-4" />
          </button>
          <button onClick={onOpenDataModal} title="Data Sources" className="btn-ghost p-2 rounded-lg">
            <Database className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
