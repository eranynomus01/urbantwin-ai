'use client';

import React, { useState, useEffect } from 'react';
import { City, UserRole } from '@/types';
import { SUPPORTED_CITIES } from '@/data/cities';
import { 
  Map, 
  LayoutGrid, 
  Zap, 
  ShieldAlert, 
  BarChart2, 
  Sparkles, 
  ChevronDown, 
  Search, 
  Menu, 
  X,
  Home,
  Sun,
  Moon,
  Database
} from 'lucide-react';

export type AppViewMode = 'home' | 'explore' | 'services' | 'simulator' | 'emergency' | 'compare' | 'ai_planner';

interface AppHeaderProps {
  activeView: AppViewMode;
  onSelectView: (view: AppViewMode) => void;
  activeCity: City;
  onSelectCity: (city: City) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenDataModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const NAV_ITEMS: { id: AppViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'explore',     label: 'Explore City', icon: Map },
  { id: 'services',    label: 'Services',     icon: LayoutGrid },
  { id: 'simulator',   label: 'What-If',      icon: Zap },
  { id: 'emergency',   label: 'Emergency',    icon: ShieldAlert },
  { id: 'compare',     label: 'Compare',      icon: BarChart2 },
  { id: 'ai_planner',  label: 'AI Planner',   icon: Sparkles },
];

export default function AppHeader({
  activeView,
  onSelectView,
  activeCity,
  onSelectCity,
  isDarkMode,
  onToggleTheme,
  onOpenDataModal,
  searchQuery,
  onSearchChange,
}: AppHeaderProps) {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative z-50 w-full border-b border-white/[0.08] bg-[#070c18]/95 backdrop-blur-xl shrink-0">
      <div className="mx-auto flex h-14 items-center justify-between px-3 md:px-6 gap-2 md:gap-4">
        
        {/* LEFT: BRAND IDENTITY */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectView('home')}
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
            title="UrbanTwin AI Command Center Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-300/30">
              <span className="text-white font-black text-xs tracking-wider">UT</span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                  UrbanTwin AI
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold tracking-wider uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  GIS v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none">Decision Support Platform</p>
            </div>
          </button>
        </div>

        {/* CENTER: DESKTOP NAVIGATION TABS */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onSelectView('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
              activeView === 'home'
                ? 'bg-white/10 text-white shadow-inner border border-white/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Home size={13} />
            Home
          </button>

          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isCurrent = activeView === id;
            return (
              <button
                key={id}
                onClick={() => onSelectView(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon size={13} className={isCurrent ? 'text-cyan-400' : 'text-slate-400'} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT CONTROLS: CITY SELECTOR & UTILITIES */}
        <div className="flex items-center gap-2 ml-auto">
          
          {/* Active City Selector */}
          <div className="relative">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-cyan-500/20 bg-cyan-950/30 hover:bg-cyan-900/40 transition-all text-[12px] text-cyan-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-100">{activeCity.name}</span>
              <span className="hidden md:inline text-[10px] text-cyan-400/80 uppercase tracking-wider">Haryana</span>
              <ChevronDown size={12} className={`text-slate-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {cityDropdownOpen && (
              <div className="absolute right-0 top-11 w-64 bg-[#0c1322] border border-white/10 rounded-xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10 mb-1">
                  Select Haryana City
                </div>
                {SUPPORTED_CITIES.map((c) => {
                  const isSelected = c.id === activeCity.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCity(c);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                          : 'text-slate-300 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-200">{c.name}</div>
                        <div className="text-[10px] text-slate-500">{c.totalPopulation?.toLocaleString()} residents</div>
                      </div>
                      {isSelected && <span className="text-[10px] text-cyan-400 font-bold">Active</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Clock pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
            <span>{time || 'LIVE IST'}</span>
          </div>

          {/* Data Sources Modal Trigger */}
          <button
            onClick={onOpenDataModal}
            className="hidden sm:flex items-center gap-1 p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/[0.05] transition-colors"
            title="Open Data Transparency & Provenance"
          >
            <Database size={15} />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#070c18] px-4 py-3 space-y-1.5 shadow-2xl">
          <button
            onClick={() => { onSelectView('home'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'home' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <Home size={16} />
            <span>Main Dashboard (Home)</span>
          </button>

          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { onSelectView(id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeView === id ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop for dropdown */}
      {cityDropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setCityDropdownOpen(false)} />
      )}
    </header>
  );
}
