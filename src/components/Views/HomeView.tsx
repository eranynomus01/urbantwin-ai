'use client';

import React from 'react';
import { City, RealTimeCityTelemetry } from '@/types';
import { AppViewMode } from '@/components/UI/AppHeader';
import { formatNumber } from '@/lib/utils/format';
import { 
  Map, 
  LayoutGrid, 
  Zap, 
  ShieldAlert, 
  BarChart2, 
  Sparkles, 
  ArrowRight,
  Activity,
  Wind,
  Thermometer,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ExternalLink,
  Flame,
  HeartPulse,
  AlertTriangle,
  Trees,
  Compass,
  Radio,
  Clock,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface HomeViewProps {
  activeCity: City;
  onSelectView: (view: AppViewMode) => void;
  telemetry: RealTimeCityTelemetry;
  totalServicesCount: number;
}

export default function HomeView({
  activeCity,
  onSelectView,
  telemetry,
  totalServicesCount,
}: HomeViewProps) {
  const cards = [
    {
      id: 'explore' as AppViewMode,
      title: 'Explore City',
      tagline: 'Interactive 3D Digital Twin Map',
      description: 'Interact with geospatial sector footprints, live municipal infrastructure, road networks, and multi-tier GIS vector layers.',
      buttonLabel: 'Launch Map Canvas',
      icon: Map,
      accent: 'from-cyan-500/20 via-sky-500/10 to-[#0a1122]',
      borderHover: 'hover:border-cyan-400/60 hover:shadow-cyan-500/20',
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/15 border-cyan-500/30',
      badge: 'Spatial GIS 3D',
      metricPill: '22 Districts Live',
    },
    {
      id: 'services' as AppViewMode,
      title: 'Municipal Services',
      tagline: '8-Sector Civic Infrastructure',
      description: 'Audit hospitals, fire stations, police headquarters, water drainage, power substations, waste processing, and shelters.',
      buttonLabel: 'Inspect Civic Network',
      icon: LayoutGrid,
      accent: 'from-emerald-500/20 via-teal-500/10 to-[#0a1122]',
      borderHover: 'hover:border-emerald-400/60 hover:shadow-emerald-500/20',
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30',
      badge: `${totalServicesCount} Assets Tracked`,
      metricPill: '100% Operational',
    },
    {
      id: 'simulator' as AppViewMode,
      title: 'What-If Simulator',
      tagline: 'Predictive Spatial Modeling',
      description: 'Simulate urban interventions: new trauma hospitals, fire stations, road closures, eco-parks, and transit hubs before implementation.',
      buttonLabel: 'Run What-If Engine',
      icon: Zap,
      accent: 'from-amber-500/20 via-orange-500/10 to-[#0a1122]',
      borderHover: 'hover:border-amber-400/60 hover:shadow-amber-500/20',
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15 border-amber-500/30',
      badge: 'Golden Hour Math',
      metricPill: 'Real-Time Impact',
    },
    {
      id: 'emergency' as AppViewMode,
      title: 'Emergency & Hazard',
      tagline: 'Disaster Routing & Threat Matrices',
      description: 'Analyze industrial fire hazards, monsoon drainage basins, Urban Heat Island (UHI) intensity, and automated OSRM dispatch routes.',
      buttonLabel: 'Inspect Risk Zones',
      icon: ShieldAlert,
      accent: 'from-rose-500/20 via-red-500/10 to-[#0a1122]',
      borderHover: 'hover:border-rose-400/60 hover:shadow-rose-500/20',
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/15 border-rose-500/30',
      badge: 'Hazard Intel',
      metricPill: 'OSRM Route Graph',
    },
    {
      id: 'compare' as AppViewMode,
      title: 'Scenario Compare',
      tagline: 'Multi-Proposal Tradeoff Analysis',
      description: 'Evaluate competing urban interventions side-by-side with automated numerical scoring, CapEx budgets, and Pareto tradeoff analysis.',
      buttonLabel: 'Compare Proposals',
      icon: BarChart2,
      accent: 'from-purple-500/20 via-indigo-500/10 to-[#0a1122]',
      borderHover: 'hover:border-purple-400/60 hover:shadow-purple-500/20',
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/15 border-purple-500/30',
      badge: 'Proposal A vs B',
      metricPill: 'KPI Benchmarks',
    },
    {
      id: 'ai_planner' as AppViewMode,
      title: 'AI Urban Planner',
      tagline: 'Grounded Gemini Intelligence',
      description: 'Engage with a conversational spatial co-pilot grounded directly in Haryana GIS vector datasets, live sensor telemetry, and simulation logs.',
      buttonLabel: 'Consult AI Planner',
      icon: Sparkles,
      accent: 'from-sky-500/20 via-blue-500/10 to-[#0a1122]',
      borderHover: 'hover:border-sky-400/60 hover:shadow-sky-500/20',
      iconColor: 'text-sky-400',
      iconBg: 'bg-sky-500/15 border-sky-500/30',
      badge: 'Gemini 2.5 Grounded',
      metricPill: 'Multi-Turn Chat',
    },
  ];

  const quickScenarios = [
    {
      title: 'New Emergency Fire Station',
      desc: 'Sub-6 min coverage expansion',
      icon: Flame,
      color: 'text-orange-400',
      tag: 'Public Safety',
    },
    {
      title: '450-Bed Trauma Hospital',
      desc: 'Golden-hour catchment for 64k citizens',
      icon: HeartPulse,
      color: 'text-red-400',
      tag: 'Healthcare',
    },
    {
      title: 'Arterial Corridor Closure',
      desc: 'Model 2-hour detour congestion spillover',
      icon: AlertTriangle,
      color: 'text-amber-400',
      tag: 'Traffic Flow',
    },
    {
      title: '25-Acre Biodiversity Eco-Park',
      desc: '-1.6°C surface UHI cooling buffer',
      icon: Trees,
      color: 'text-emerald-400',
      tag: 'Climate Resilience',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#070b16] text-slate-100 flex flex-col justify-between cyber-grid relative">
      
      {/* Background radial ambient illumination */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[380px] radar-glow-circle pointer-events-none blur-2xl" />

      {/* ─────────────────────────────────────────────────────────────
          1. TOP LIVE TELEMETRY COMMAND STRIP
      ───────────────────────────────────────────────────────────── */}
      <section className="px-4 pt-4 md:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="p-2.5 md:p-3 rounded-2xl bg-[#0d1528]/85 backdrop-blur-xl border border-white/[0.08] shadow-2xl flex flex-wrap items-center justify-between gap-2.5">
          
          {/* City Status Chip */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-left">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Active Digital Twin
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                {activeCity.name}, Haryana
                <span className="text-[10px] text-slate-500 font-mono">({activeCity.state})</span>
              </span>
            </div>
          </div>

          {/* Environmental Telemetry */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs">
            {/* Weather */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Thermometer size={14} className="text-amber-400" />
              <div>
                <span className="font-bold text-white">{telemetry.weather.temperatureC}°C</span>
                <span className="text-[10px] text-slate-400 ml-1">({telemetry.weather.conditionText})</span>
              </div>
            </div>

            {/* AQI Meter with color bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Wind size={14} className="text-purple-400" />
              <div>
                <span className="text-slate-400 text-[10px] mr-1">AQI</span>
                <span className="font-bold text-white">{telemetry.airQuality.aqi}</span>
                <span className={`text-[10px] font-bold ml-1.5 px-1.5 py-0.5 rounded ${
                  telemetry.airQuality.aqi > 200 ? 'bg-red-500/20 text-red-300' :
                  telemetry.airQuality.aqi > 100 ? 'bg-amber-500/20 text-amber-300' :
                  'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {telemetry.airQuality.category}
                </span>
              </div>
            </div>

            {/* Traffic Load */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Activity size={14} className="text-cyan-400" />
              <div>
                <span className="text-slate-400 text-[10px] mr-1">Traffic Stress</span>
                <span className="font-bold text-white">{telemetry.trafficSummary.overallIndex}%</span>
              </div>
            </div>

            {/* Services Health */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck size={14} />
              <span className="font-bold text-xs">{totalServicesCount} Services Operational</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="relative px-4 pt-8 pb-6 md:pt-14 md:pb-10 text-center max-w-5xl mx-auto z-10">
        
        {/* Luminous Pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-950/80 via-sky-950/60 to-blue-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-6 shadow-xl shadow-cyan-500/10 animate-float-slow">
          <Radio size={13} className="text-cyan-400 animate-pulse" />
          <span>Real-Time Spatial Digital Twin</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-mono text-[11px]">GIS v2.4 Haryana Engine</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none">
          Understand the City.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent animate-gradient-text">
            Simulate the Future.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed font-normal">
          Evaluate public infrastructure, model emergency Golden-Hour routing, and test predictive What-If interventions before deploying capital in physical reality.
        </p>

        {/* Dual Primary Call-to-Actions */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => onSelectView('explore')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-cyan-500/25 transition-all active:scale-95 group"
          >
            <Map size={16} className="text-white group-hover:rotate-12 transition-transform" />
            <span>Launch 3D Explorer</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onSelectView('simulator')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-600/10 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 transition-all active:scale-95 group"
          >
            <Zap size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Run What-If Simulator</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onSelectView('ai_planner')}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 hover:text-white font-semibold text-xs tracking-wide transition-all active:scale-95"
          >
            <Sparkles size={15} className="text-sky-400" />
            <span>Consult AI Planner</span>
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SIX MAJOR HIGH-TECH COMMAND DECK MODULES
      ───────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              PLATFORM WORKSPACES
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Integrated Digital Twin Capabilities
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            6 Specialized Intelligence Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onSelectView(card.id)}
                className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b ${card.accent} border border-white/[0.08] ${card.borderHover} shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1.5 glass-card-glow`}
              >
                {/* Top header within card */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${card.iconBg} ${card.iconColor} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/10">
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                    <span>{card.title}</span>
                    <span className="text-[10px] font-mono font-medium text-slate-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/5">
                      {card.metricPill}
                    </span>
                  </h3>

                  <p className="text-xs font-semibold text-slate-400 tracking-wide mt-0.5">
                    {card.tagline}
                  </p>

                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Action Strip */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    {card.buttonLabel}
                  </span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. INTERACTIVE QUICK-START WHAT-IF LAUNCHER RIBBON
      ───────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 z-10">
        <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0e1628] to-cyan-500/10 border border-amber-500/20 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-white">One-Click What-If Simulation Shortcuts</h3>
                <p className="text-xs text-slate-400">Launch spatial impact tests on {activeCity.name}'s infrastructure in real time</p>
              </div>
            </div>
            <button
              onClick={() => onSelectView('simulator')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors self-start sm:self-auto"
            >
              <span>View All 7 Scenarios</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickScenarios.map((qs, i) => {
              const Icon = qs.icon;
              return (
                <button
                  key={i}
                  onClick={() => onSelectView('simulator')}
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-amber-500/30 text-left transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-lg bg-white/[0.05] ${qs.color}`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-black/30 px-2 py-0.5 rounded">
                        {qs.tag}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      {qs.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {qs.desc}
                    </p>
                  </div>
                  <div className="mt-3 text-[11px] font-bold text-amber-400/80 group-hover:text-amber-400 flex items-center gap-1">
                    <span>Simulate</span>
                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. CITY HEALTH DIAGNOSTICS & SYSTEM INSIGHTS
      ───────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto w-full pb-10 z-10">
        <div className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Live Spatial Diagnostics · {activeCity.name} Urban Twin
              </h4>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Synchronized with State GIS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Ambulance Reach</span>
                <Clock size={13} className="text-emerald-400" />
              </div>
              <div className="text-xl font-black text-white">86.4%</div>
              <p className="text-[11px] text-slate-400 mt-1">Sectors within &lt;10 min Golden-Hour</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Thermal Island (UHI)</span>
                <Thermometer size={13} className="text-rose-400" />
              </div>
              <div className="text-xl font-black text-rose-400">+5.8°C</div>
              <p className="text-[11px] text-slate-400 mt-1">Peak summer surface temperature delta</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Stormwater Drainage</span>
                <TrendingUp size={13} className="text-cyan-400" />
              </div>
              <div className="text-xl font-black text-cyan-400">60 MGD</div>
              <p className="text-[11px] text-slate-400 mt-1">Canal outfall retention & pumping flow</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Transit Catchment</span>
                <Compass size={13} className="text-purple-400" />
              </div>
              <div className="text-xl font-black text-purple-300">45,000</div>
              <p className="text-[11px] text-slate-400 mt-1">Daily multi-modal commuter reach</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-5 px-4 md:px-8 text-center text-xs text-slate-500 bg-[#050811] z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px]">
              UT
            </div>
            <p className="text-slate-400 font-medium">UrbanTwin AI · State Urban Decision-Support Platform</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/5">PostGIS + OSRM</span>
            <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/5">Leaflet 3D</span>
            <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/5">Google Gemini AI</span>
            <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/5">Haryana Open Data</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
