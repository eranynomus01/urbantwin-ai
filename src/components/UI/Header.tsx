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
  { id: 'inspector', label: 'Sector Map', icon: Map },
  { id: 'simulator', label: 'What-If', icon: BarChart2 },
  { id: 'emergency', label: 'Emergency', icon: Shield },
  { id: 'ai_advisor', label: 'AI Advisor', icon: Sparkles },
  { id: 'scenarios', label: 'Compare', icon: LayoutGrid },
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
              className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs"
            >
              <span className="text-slate-200 font-semibold">{activeCity.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {cityOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 panel-card rounded-xl shadow-2xl overflow-hidden z-[100]">
                {SUPPORTED_CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => { onSelectCity(city); setCityOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-xs transition hover:bg-white/[0.06] ${
                      city.id === activeCity.id ? 'text-sky-400 font-bold' : 'text-slate-300 font-medium'
                    } ${!city.isActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                    disabled={!city.isActive}
                  >
                    <div className="font-semibold">{city.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{city.state}, {city.country} {!city.isActive && '· Coming Soon'}</div>
                  </button>
                ))}
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
