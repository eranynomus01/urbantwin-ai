'use client';

import React from 'react';
import { MunicipalServiceType } from '@/types';
import { 
  HeartPulse, 
  Flame, 
  ShieldAlert, 
  Droplets, 
  Zap, 
  Trash2, 
  Home, 
  Compass,
  CheckCheck,
  X
} from 'lucide-react';

export interface ServiceConfig {
  id: MunicipalServiceType;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  colorClass: string;
  activeBg: string;
  borderColor: string;
  description: string;
}

export const SERVICES_CONFIG: ServiceConfig[] = [
  {
    id: 'healthcare',
    label: 'Healthcare & Trauma',
    shortLabel: 'Health',
    icon: HeartPulse,
    colorClass: 'text-rose-400',
    activeBg: 'bg-rose-500/20 text-rose-200 border-rose-400/40 shadow-rose-500/20',
    borderColor: 'border-rose-500',
    description: 'Hospitals, emergency ICUs, ambulance hubs, and trauma facilities.',
  },
  {
    id: 'fire_rescue',
    label: 'Fire & Rescue',
    shortLabel: 'Fire',
    icon: Flame,
    colorClass: 'text-orange-400',
    activeBg: 'bg-orange-500/20 text-orange-200 border-orange-400/40 shadow-orange-500/20',
    borderColor: 'border-orange-500',
    description: 'Fire stations, water tenders, aerial ladder platforms, and rescue dispatch.',
  },
  {
    id: 'police_safety',
    label: 'Police & Public Safety',
    shortLabel: 'Police',
    icon: ShieldAlert,
    colorClass: 'text-sky-400',
    activeBg: 'bg-sky-500/20 text-sky-200 border-sky-400/40 shadow-sky-500/20',
    borderColor: 'border-sky-500',
    description: 'Police headquarters, ICCC surveillance junctions, and law enforcement.',
  },
  {
    id: 'water_drainage',
    label: 'Water & Storm Drainage',
    shortLabel: 'Water',
    icon: Droplets,
    colorClass: 'text-cyan-400',
    activeBg: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40 shadow-cyan-500/20',
    borderColor: 'border-cyan-500',
    description: 'Water treatment plants, storm drain outfalls, and flood pumping stations.',
  },
  {
    id: 'power_grid',
    label: 'Power Grid & Substations',
    shortLabel: 'Power',
    icon: Zap,
    colorClass: 'text-amber-400',
    activeBg: 'bg-amber-500/20 text-amber-200 border-amber-400/40 shadow-amber-500/20',
    borderColor: 'border-amber-500',
    description: '220kV/400kV high-voltage grid substations, load nodes, and distribution feeders.',
  },
  {
    id: 'disaster_shelter',
    label: 'Disaster & Flood Shelters',
    shortLabel: 'Shelters',
    icon: Home,
    colorClass: 'text-purple-400',
    activeBg: 'bg-purple-500/20 text-purple-200 border-purple-400/40 shadow-purple-500/20',
    borderColor: 'border-purple-500',
    description: 'High-elevation community shelters, flood evacuation assembly zones, and relief camps.',
  },
  {
    id: 'waste_sanitation',
    label: 'Waste & Sanitation',
    shortLabel: 'Waste',
    icon: Trash2,
    colorClass: 'text-emerald-400',
    activeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 shadow-emerald-500/20',
    borderColor: 'border-emerald-500',
    description: 'Material recovery facilities (MRF), waste processing plants, and landfills.',
  },
  {
    id: 'transit_roads',
    label: 'Roads & Transit Corridors',
    shortLabel: 'Transit',
    icon: Compass,
    colorClass: 'text-indigo-400',
    activeBg: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40 shadow-indigo-500/20',
    borderColor: 'border-indigo-500',
    description: 'Expressways, major arterial corridors, metro rail links, and transit terminals.',
  },
];

interface ServiceSelectorBarProps {
  selectedServices: Set<MunicipalServiceType>;
  onToggleService: (service: MunicipalServiceType) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  serviceCounts?: Record<MunicipalServiceType, number>;
}

export default function ServiceSelectorBar({
  selectedServices,
  onToggleService,
  onSelectAll,
  onClearAll,
  serviceCounts,
}: ServiceSelectorBarProps) {
  return (
    <div className="w-full bg-[#0d1527]/90 border-b border-white/[0.08] px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        {/* Title Label */}
        <div className="flex items-center gap-2 shrink-0 pr-1 border-r border-white/[0.08]">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Select Services:
          </span>
        </div>

        {/* Selective Service Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {SERVICES_CONFIG.map((srv) => {
            const isSelected = selectedServices.has(srv.id);
            const Icon = srv.icon;
            const count = serviceCounts ? serviceCounts[srv.id] : undefined;

            return (
              <button
                key={srv.id}
                onClick={() => onToggleService(srv.id)}
                title={srv.description}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                  isSelected
                    ? `${srv.activeBg} border-current shadow-md`
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 border-white/[0.06]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-current' : srv.colorClass}`} />
                <span className="whitespace-nowrap">{srv.shortLabel}</span>
                {count !== undefined && count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white/[0.08] text-slate-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Batch Controls */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-white/[0.08]">
          <button
            onClick={onSelectAll}
            title="Turn on all services"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-300 hover:text-sky-300 bg-white/[0.04] hover:bg-white/[0.08] transition"
          >
            <CheckCheck className="w-3 h-3 text-sky-400" />
            <span className="hidden sm:inline">All</span>
          </button>
          <button
            onClick={onClearAll}
            title="Clear service selection"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-rose-300 bg-white/[0.04] hover:bg-white/[0.08] transition"
          >
            <X className="w-3 h-3 text-rose-400" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}
