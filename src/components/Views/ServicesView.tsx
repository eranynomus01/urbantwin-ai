'use client';

import React, { useState } from 'react';
import { City, MunicipalServiceAsset, MunicipalServiceType } from '@/types';
import { 
  HeartPulse, 
  Flame, 
  ShieldAlert, 
  Droplets, 
  Zap, 
  Trash2, 
  Home, 
  Compass, 
  Search, 
  MapPin, 
  Phone, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';

interface ServicesViewProps {
  activeCity: City;
  services: MunicipalServiceAsset[];
  onFocusAssetOnMap: (asset: MunicipalServiceAsset) => void;
  onSimulateDisruption: (asset: MunicipalServiceAsset) => void;
  onAskAI: (prompt: string) => void;
}

interface ServiceCategoryMeta {
  id: MunicipalServiceType;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bgLight: string;
  borderActive: string;
  subcategories: string[];
}

const CATEGORIES: ServiceCategoryMeta[] = [
  {
    id: 'healthcare',
    title: 'Health',
    subtitle: 'Hospitals, Clinics & Trauma Centers',
    icon: HeartPulse,
    color: 'text-red-400',
    bgLight: 'from-red-500/10 to-rose-600/5',
    borderActive: 'border-red-500/40',
    subcategories: ['Apex Civil Hospital', 'Super-Specialty Clinics', '24x7 Trauma Units', 'ICU Bays'],
  },
  {
    id: 'fire_rescue',
    title: 'Fire & Rescue',
    subtitle: 'Fire Stations & Tender Bays',
    icon: Flame,
    color: 'text-orange-400',
    bgLight: 'from-orange-500/10 to-amber-600/5',
    borderActive: 'border-orange-500/40',
    subcategories: ['District Headquarters', 'Industrial Hazmat Units', 'Hydraulic Aerial Platforms'],
  },
  {
    id: 'police_safety',
    title: 'Police & Safety',
    subtitle: 'Command Centers & Surveillance',
    icon: ShieldAlert,
    color: 'text-blue-400',
    bgLight: 'from-blue-500/10 to-indigo-600/5',
    borderActive: 'border-blue-500/40',
    subcategories: ['Smart City ICCC', 'Civil Lines Command', 'PCR Rapid Patrol Fleet'],
  },
  {
    id: 'water_drainage',
    title: 'Water & Drainage',
    subtitle: 'Treatment Plants & Storm Outfalls',
    icon: Droplets,
    color: 'text-cyan-400',
    bgLight: 'from-cyan-500/10 to-sky-600/5',
    borderActive: 'border-cyan-500/40',
    subcategories: ['Canal WTP Complex', 'SCADA Regulated Pumping', 'Stormwater Outfalls'],
  },
  {
    id: 'power_grid',
    title: 'Power Grid',
    subtitle: 'Thermal Hubs & Substations',
    icon: Zap,
    color: 'text-amber-400',
    bgLight: 'from-amber-500/10 to-yellow-600/5',
    borderActive: 'border-amber-500/40',
    subcategories: ['400kV Grid Terminals', '220kV Secondary Substations', 'Dual-Source Feeders'],
  },
  {
    id: 'waste_sanitation',
    title: 'Waste & Sanitation',
    subtitle: 'Processing & Biomethanation',
    icon: Trash2,
    color: 'text-emerald-400',
    bgLight: 'from-emerald-500/10 to-green-600/5',
    borderActive: 'border-emerald-500/40',
    subcategories: ['Solid Waste Processing', 'Biogas Clean Energy', 'Segregated Transfer Hubs'],
  },
  {
    id: 'transit_roads',
    title: 'Transit & Roads',
    subtitle: 'Bus Terminals & Rail Stations',
    icon: Compass,
    color: 'text-indigo-400',
    bgLight: 'from-indigo-500/10 to-purple-600/5',
    borderActive: 'border-indigo-500/40',
    subcategories: ['Interstate Bus Terminal', 'Northern Railway Mainline', 'Regional Airport Links'],
  },
  {
    id: 'disaster_shelter',
    title: 'Emergency Shelters',
    subtitle: 'Stadiums & Evacuation Points',
    icon: Home,
    color: 'text-purple-400',
    bgLight: 'from-purple-500/10 to-pink-600/5',
    borderActive: 'border-purple-500/40',
    subcategories: ['Indoor Sports Arenas', 'Helipad Evacuation Staging', 'Campus Relief Centers'],
  },
];

export default function ServicesView({
  activeCity,
  services,
  onFocusAssetOnMap,
  onSimulateDisruption,
  onAskAI,
}: ServicesViewProps) {
  const [activeCategory, setActiveCategory] = useState<MunicipalServiceType>('healthcare');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MunicipalServiceAsset | null>(null);

  // Filter services by category and search
  const displayedServices = services.filter((s) => {
    const matchesCategory = s.serviceType === activeCategory;
    const matchesSearch = searchQuery === '' || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentCategoryMeta = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="flex-1 overflow-y-auto bg-[#070b16] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* TOP INTRO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Municipal Services Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeCity.name}, Haryana
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              Essential Civic & Emergency Infrastructure
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Inspect critical services across 8 municipal categories. Click any facility to locate it on the digital twin canvas or model an emergency outage.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search facility name, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* 8 SERVICE CATEGORY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            const count = services.filter((s) => s.serviceType === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedAsset(null);
                }}
                className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                  isSelected
                    ? `bg-gradient-to-b ${cat.bgLight} to-[#0b1220] ${cat.borderActive} shadow-lg shadow-cyan-500/10`
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-lg bg-white/[0.05] mb-2 ${isSelected ? cat.color : 'text-slate-400'}`}>
                  <Icon size={18} />
                </div>
                <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {cat.title}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 font-mono">
                  {count} assets
                </span>
              </button>
            );
          })}
        </div>

        {/* CURRENT CATEGORY OVERVIEW BANNER */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-white/[0.05] ${currentCategoryMeta.color}`}>
              <currentCategoryMeta.icon size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{currentCategoryMeta.title} Network</h3>
              <p className="text-xs text-slate-400">{currentCategoryMeta.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {currentCategoryMeta.subcategories.map((sub, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[11px] text-slate-300 border border-white/5">
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* ASSET LIST GRID */}
        {displayedServices.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/[0.01] border border-white/[0.04]">
            <p className="text-sm text-slate-400">No {currentCategoryMeta.title} facilities found matching "{searchQuery}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedServices.map((asset) => (
              <div
                key={asset.id}
                className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-cyan-500/30 shadow-md hover:shadow-xl transition-all"
              >
                <div>
                  {/* Status & Category */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded border border-white/5">
                      {asset.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{asset.status}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {asset.name}
                  </h4>

                  {/* Address */}
                  <p className="text-xs text-slate-400 mt-1 flex items-start gap-1">
                    <MapPin size={12} className="shrink-0 mt-0.5 text-cyan-400" />
                    <span>{asset.address}</span>
                  </p>

                  {/* Metrics Box */}
                  <div className="mt-3.5 p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Capacity / Load:</span>
                      <span className="font-semibold text-slate-200">{asset.capacityOrLoad}</span>
                    </div>
                    {asset.coverageRadiusKm && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Coverage Radius:</span>
                        <span className="text-cyan-300 font-mono">{asset.coverageRadiusKm} km</span>
                      </div>
                    )}
                    {asset.phone && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Contact / Helpline:</span>
                        <span className="font-mono text-slate-300">{asset.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-[10px]">Source:</span>
                      <span className="text-slate-400 text-[10px]">{asset.source}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2">
                  <button
                    onClick={() => onFocusAssetOnMap(asset)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors"
                  >
                    <Compass size={13} />
                    <span>Focus on Map</span>
                  </button>
                  <button
                    onClick={() => onSimulateDisruption(asset)}
                    className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition-colors"
                    title="Simulate Facility Disruption in What-If"
                  >
                    <Zap size={13} />
                  </button>
                  <button
                    onClick={() => onAskAI(`What is the cascade impact if ${asset.name} in ${activeCity.name} goes offline, and what contingency emergency protocols should be deployed?`)}
                    className="p-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 transition-colors"
                    title="Ask AI Urban Planner"
                  >
                    <Sparkles size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
