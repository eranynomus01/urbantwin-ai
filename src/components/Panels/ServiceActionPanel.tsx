'use client';

import React, { useState } from 'react';
import { MunicipalServiceAsset, MunicipalServiceType, City } from '@/types';
import { SERVICES_CONFIG } from '@/components/UI/ServiceSelectorBar';
import { 
  Phone, 
  MapPin, 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';

interface ServiceActionPanelProps {
  activeCity: City;
  services: MunicipalServiceAsset[];
  selectedServiceTypes: Set<MunicipalServiceType>;
  onFocusAsset: (asset: MunicipalServiceAsset) => void;
  onAskAI: (prompt: string) => void;
  onSimulateDisruption: (asset: MunicipalServiceAsset) => void;
}

export default function ServiceActionPanel({
  activeCity,
  services = [],
  selectedServiceTypes,
  onFocusAsset,
  onAskAI,
  onSimulateDisruption,
}: ServiceActionPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filter assets based on active selected services in the bar + text search
  const filteredAssets = (services || []).filter((s) => {
    if (!s) return false;
    // Must belong to an active service type in the selector bar
    if (selectedServiceTypes && !selectedServiceTypes.has(s.serviceType)) return false;

    // Optional status filter
    if (activeFilter !== 'all' && s.status !== activeFilter) return false;

    // Search text match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-[#080d1a] text-slate-100 overflow-hidden">
      {/* 1. Header Card */}
      <div className="p-4 border-b border-white/[0.08] bg-[#0c1427]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                {activeCity.name} Portal
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live & Active
              </span>
            </div>
            <h2 className="text-base font-extrabold text-white mt-0.5">
              Municipal & Emergency Services
            </h2>
          </div>
          <button
            onClick={() => onAskAI(`What is the emergency readiness and infrastructure status of ${activeCity.name}, Haryana?`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Audit</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-2 line-clamp-2">
          {activeCity.tagline}
        </p>

        {/* Search Bar */}
        <div className="relative mt-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search facility, water plant, substation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
          />
        </div>
      </div>

      {/* 2. Quick Summary Chips */}
      <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between text-xs">
        <div className="text-slate-400">
          Showing <b className="text-white font-mono">{filteredAssets.length}</b> facilities in <b className="text-sky-300">{activeCity.name}</b>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition ${
              activeFilter === 'all' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('Operational')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition ${
              activeFilter === 'Operational' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter('Standby')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition ${
              activeFilter === 'Standby' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Standby
          </button>
        </div>
      </div>

      {/* 3. Facility Cards List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredAssets.length === 0 ? (
          <div className="p-8 text-center bg-white/[0.02] rounded-2xl border border-white/[0.06]">
            <Activity className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No facilities selected</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Please select one or more service pills from the top bar (e.g. Healthcare, Water, Power, Shelters).
            </p>
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const config = SERVICES_CONFIG.find(c => c.id === asset.serviceType);
            const Icon = config?.icon || Activity;

            return (
              <div
                key={asset.id}
                className="bg-[#0f172a]/90 hover:bg-[#131d35] border border-white/[0.08] hover:border-sky-500/40 rounded-2xl p-3.5 transition shadow-lg group"
              >
                {/* Top Row: Icon + Name + Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      config?.borderColor || 'border-slate-600'
                    } bg-white/[0.04]`}>
                      <Icon className={`w-4 h-4 ${config?.colorClass || 'text-white'}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition leading-snug">
                        {asset.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {asset.category}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    asset.status === 'Operational'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : asset.status === 'Standby'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {asset.status}
                  </span>
                </div>

                {/* Capacity / Key Metric */}
                <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.04] text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Specs & Capacity
                  </span>
                  <span className="font-semibold text-slate-200">
                    {asset.capacityOrLoad}
                  </span>
                </div>

                {/* Address & Contact */}
                <div className="mt-2 flex flex-col gap-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                    <span className="truncate">{asset.address}</span>
                  </div>
                  {asset.phone && (
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                      <a href={`tel:${asset.phone}`} className="hover:underline font-mono">
                        {asset.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onFocusAsset(asset)}
                    className="flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 transition"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Focus on Map</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSimulateDisruption(asset)}
                      title="Test what happens if this facility goes offline"
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-500/20 transition flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>Test Outage</span>
                    </button>
                    <button
                      onClick={() => onAskAI(`What is the service risk and backup plan if ${asset.name} in ${activeCity.name} suffers a disruption?`)}
                      className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-sky-300 transition"
                      title="Analyze with AI"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Bottom Quick Simulation Launcher */}
      <div className="p-3 bg-[#0c1427] border-t border-white/[0.08] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs text-slate-300 font-medium">
            Haryana SDMA Grid Active
          </span>
        </div>
        <button
          onClick={() => onAskAI(`Generate a comprehensive Disaster Readiness and Emergency Management Report for ${activeCity.name}, Haryana including Water, Power, and Shelter logistics.`)}
          className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
        >
          <span>City Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
