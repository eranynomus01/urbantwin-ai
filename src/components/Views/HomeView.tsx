'use client';

import React from 'react';
import { City, RealTimeCityTelemetry } from '@/types';
import { AppViewMode } from '@/components/UI/AppHeader';
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
  ExternalLink
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
      description: 'Explore the digital twin of the real city with GIS spatial layers, sector footprints, and live infrastructure.',
      buttonLabel: 'Explore Map',
      icon: Map,
      accent: 'from-cyan-500/20 to-blue-600/10',
      borderHover: 'hover:border-cyan-400/50',
      iconColor: 'text-cyan-400',
      badge: 'Spatial GIS',
    },
    {
      id: 'services' as AppViewMode,
      title: 'City Services',
      tagline: 'Municipal Infrastructure Hub',
      description: 'Explore hospitals, fire stations, police, water, power, waste, transit, shelters and critical civic networks.',
      buttonLabel: 'View Services',
      icon: LayoutGrid,
      accent: 'from-emerald-500/20 to-teal-600/10',
      borderHover: 'hover:border-emerald-400/50',
      iconColor: 'text-emerald-400',
      badge: `${totalServicesCount} Assets Indexed`,
    },
    {
      id: 'simulator' as AppViewMode,
      title: 'What-If Simulator',
      tagline: 'Predictive Decision Modeling',
      description: 'Simulate changes such as new hospitals, fire stations, road closures, eco parks and transit hubs before implementation.',
      buttonLabel: 'Launch Simulator',
      icon: Zap,
      accent: 'from-amber-500/20 to-orange-600/10',
      borderHover: 'hover:border-amber-400/50',
      iconColor: 'text-amber-400',
      badge: 'Scenario Engine',
    },
    {
      id: 'emergency' as AppViewMode,
      title: 'Emergency & Risk',
      tagline: 'Disaster Preparedness & Routing',
      description: 'Analyze fire risk, monsoon flood zones, urban heat island intensity, and emergency response coverage accessibility.',
      buttonLabel: 'Analyze Risks',
      icon: ShieldAlert,
      accent: 'from-rose-500/20 to-red-600/10',
      borderHover: 'hover:border-rose-400/50',
      iconColor: 'text-rose-400',
      badge: 'Hazard Intel',
    },
    {
      id: 'compare' as AppViewMode,
      title: 'Scenario Compare',
      tagline: 'Multi-Proposal Tradeoff Analysis',
      description: 'Compare competing urban-planning proposals side-by-side with clear numerical KPIs and AI-backed recommendations.',
      buttonLabel: 'Compare Proposals',
      icon: BarChart2,
      accent: 'from-purple-500/20 to-indigo-600/10',
      borderHover: 'hover:border-purple-400/50',
      iconColor: 'text-purple-400',
      badge: 'A / B Decision',
    },
    {
      id: 'ai_planner' as AppViewMode,
      title: 'AI Urban Planner',
      tagline: 'Generative Policy & Spatial Insight',
      description: 'Ask questions and get AI-assisted planning recommendations grounded in real city data and simulation findings.',
      buttonLabel: 'Consult AI',
      icon: Sparkles,
      accent: 'from-sky-500/20 to-blue-700/10',
      borderHover: 'hover:border-sky-400/50',
      iconColor: 'text-sky-400',
      badge: 'Gemini Powered',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#070b16] text-slate-100 flex flex-col justify-between">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 pt-10 pb-8 md:pt-16 md:pb-12 text-center max-w-5xl mx-auto">
        {/* Glow ambient accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[220px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Small live pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Real-World Digital Twin Active</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300">{activeCity.name}, Haryana</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight md:leading-none">
          Understand the city. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
            Simulate the future.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base md:text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed font-normal">
          Explore real-world urban data and simulate infrastructure decisions before implementing them in physical reality.
        </p>

        {/* Compact City Status Pill */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Building2 size={13} className="text-cyan-400" />
            <span className="font-semibold text-white">{activeCity.name}</span>
            <span className="text-slate-500">({activeCity.totalPopulation?.toLocaleString()} pop)</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            <Thermometer size={13} className="text-amber-400" />
            <span>{telemetry.weather.temperatureC}°C</span>
            <span className="text-slate-400 capitalize">({telemetry.weather.conditionText})</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            <Wind size={13} className="text-purple-400" />
            <span>AQI {telemetry.airQuality.aqi}</span>
            <span className="text-slate-400">({telemetry.airQuality.category})</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck size={13} />
            <span>{totalServicesCount} Services Operational</span>
          </div>
        </div>
      </section>

      {/* 2. SIX MAJOR FEATURE CARDS */}
      <section className="px-4 md:px-8 max-w-6xl mx-auto w-full pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onSelectView(card.id)}
                className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b ${card.accent} to-[#0b1220]/70 border border-white/[0.08] ${card.borderHover} shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer hover:-translate-y-1`}
              >
                {/* Top header within card */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-white/[0.05] border border-white/10 ${card.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/10">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 tracking-wide mt-0.5">
                    {card.tagline}
                  </p>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>{card.buttonLabel}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SMALL RECENT ACTIVITY & INSIGHT SECTION */}
      <section className="px-4 md:px-8 max-w-6xl mx-auto w-full pb-10">
        <div className="p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Recent Digital Twin Insights · {activeCity.name}
              </h4>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Live Grounding</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] text-xs">
              <span className="text-emerald-400 font-bold">● Coverage Peak:</span>
              <p className="text-slate-300 mt-1">
                Emergency ambulance radius reaches 86% of urban sectors in under 10 minutes.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] text-xs">
              <span className="text-amber-400 font-bold">● Thermal Island:</span>
              <p className="text-slate-300 mt-1">
                Industrial & high-density transport zones show surface heat delta of +5.8°C.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] text-xs">
              <span className="text-cyan-400 font-bold">● Infrastructure SCADA:</span>
              <p className="text-slate-300 mt-1">
                Western canal pumping grid maintains 60 MGD throughput across city distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="border-t border-white/[0.06] py-5 px-4 md:px-8 text-center text-xs text-slate-500 bg-[#050811]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 UrbanTwin AI · Urban Decision-Support Platform</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Spatial Engine: PostGIS & Leaflet</span>
            <span>•</span>
            <span>Intelligence: Google Gemini</span>
            <span>•</span>
            <span>Open Data: GMDA & CPCB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
