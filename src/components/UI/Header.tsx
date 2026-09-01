'use client';

import React from 'react';
import { City, UserRole } from '@/types';
import { SUPPORTED_CITIES } from '@/data/cities';
import { 
  Building2, 
  Layers, 
  Database, 
  FileText, 
  Moon, 
  Sun, 
  Shield, 
  UserCheck, 
  ChevronDown, 
  Activity,
  Globe
} from 'lucide-react';

interface HeaderProps {
  activeCity: City;
  onSelectCity: (city: City) => void;
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenDataModal: () => void;
  onOpenReportModal: () => void;
  activeTab: 'inspector' | 'simulator' | 'emergency' | 'ai_advisor' | 'scenarios';
  onSelectTab: (tab: 'inspector' | 'simulator' | 'emergency' | 'ai_advisor' | 'scenarios') => void;
}

export default function Header({
  activeCity,
  onSelectCity,
  userRole,
  onSelectRole,
  isDarkMode,
  onToggleTheme,
  onOpenDataModal,
  onOpenReportModal,
  activeTab,
  onSelectTab,
}: HeaderProps) {
  return (
    <header className="bg-slate-950/95 border-b border-slate-800 px-4 py-2 text-slate-100 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Brand & City Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-black text-base">
            UT
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
              <span>UrbanTwin AI</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-400 font-mono">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Real-Time GIS Digital Twin & Decision Simulator
            </p>
          </div>
        </div>

        {/* 1. CITY SELECTOR (Requirement 3) */}
        <div className="relative">
          <select
            value={activeCity.id}
            onChange={(e) => {
              const selected = SUPPORTED_CITIES.find((c) => c.id === e.target.value);
              if (selected && selected.isActive) {
                onSelectCity(selected);
              }
            }}
            className="bg-slate-900 border border-slate-700 hover:border-cyan-500/60 rounded-lg py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none cursor-pointer transition shadow-inner"
          >
            {SUPPORTED_CITIES.map((city) => (
              <option
                key={city.id}
                value={city.id}
                disabled={!city.isActive}
                className={!city.isActive ? 'text-slate-500 bg-slate-950' : 'text-slate-100 bg-slate-900'}
              >
                {city.name}, {city.state} {city.isActive ? '• Active GIS' : '— (Pending Data)'}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
        {[
          { id: 'inspector', label: 'Sector Inspector', icon: Building2 },
          { id: 'simulator', label: 'What-If Studio', icon: Layers },
          { id: 'emergency', label: 'Emergency Router', icon: Shield },
          { id: 'ai_advisor', label: 'AI Planner', icon: Activity },
          { id: 'scenarios', label: 'Scenario Deck', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition text-xs ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Role Switcher & Action Modals */}
      <div className="flex items-center gap-2">
        {/* Role Selector (Requirement 21) */}
        <div className="relative hidden md:block">
          <select
            value={userRole}
            onChange={(e) => onSelectRole(e.target.value as UserRole)}
            className="bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg py-1.5 pl-2.5 pr-7 text-xs font-medium text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none cursor-pointer"
          >
            <option value="urban_planner">Role: Urban Planner</option>
            <option value="administrator">Role: Administrator</option>
            <option value="public_viewer">Role: Public Viewer</option>
          </select>
          <UserCheck className="w-3.5 h-3.5 text-cyan-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Data Transparency Modal Trigger (Requirement 15) */}
        <button
          onClick={onOpenDataModal}
          className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          title="Data Sources, Quality Audit (94.5%) & Licenses"
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Data Sources</span>
        </button>

        {/* Report Generator Modal Trigger (Requirement 22) */}
        <button
          onClick={onOpenReportModal}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition"
          title="Generate Executive Decision Report"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Report</span>
        </button>

        {/* Theme mode toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
          title={isDarkMode ? 'Switch to Light Studio' : 'Switch to Dark Command Center'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>
    </header>
  );
}
