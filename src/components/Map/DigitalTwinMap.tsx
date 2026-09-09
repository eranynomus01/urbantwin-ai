'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  Zone, 
  Hospital, 
  FireStation, 
  PoliceStation, 
  Park, 
  TransitNode, 
  RoadCorridor, 
  FloodRiskZone, 
  HeatRiskZone, 
  SimulationResult,
  EmergencyIncident,
  UserLiveLocation,
  MunicipalServiceAsset,
  MunicipalServiceType
} from '@/types';
import { Layers, Crosshair, Navigation, Check } from 'lucide-react';

const DynamicMapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0f1e] text-slate-400 gap-3">
      <div className="w-8 h-8 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin"></div>
      <p className="text-xs font-medium tracking-wide text-slate-400">Loading Spatial Canvas…</p>
    </div>
  ),
});

interface DigitalTwinMapProps {
  center: [number, number];
  zoom: number;
  isDarkMode: boolean;
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone | null) => void;
  userLiveLocation: UserLiveLocation | null;
  onTriggerLocateMe: () => void;
  isLocating?: boolean;
  municipalServices?: MunicipalServiceAsset[];
  selectedServiceTypes?: Set<MunicipalServiceType>;
  onSelectMunicipalAsset?: (asset: MunicipalServiceAsset) => void;
  sectors: Zone[];
  hospitals: Hospital[];
  fireStations: FireStation[];
  policeStations: PoliceStation[];
  parks: Park[];
  transitNodes: TransitNode[];
  roads: RoadCorridor[];
  floodZones: FloodRiskZone[];
  heatZones: HeatRiskZone[];
  activeSimulation: SimulationResult | null;
  activeIncident: EmergencyIncident | null;
  mapClickMode: 'inspect' | 'simulation_drop' | 'incident_drop';
  onMapClickCoord: (coord: [number, number]) => void;
}

export default function DigitalTwinMap(props: DigitalTwinMapProps) {
  const [layers, setLayers] = useState({
    roads: true,
    hospitals: true,
    fireStations: true,
    policeStations: true,
    parks: true,
    transit: true,
    floodZones: false,
    heatZones: false,
    populationDensity: false,
    coverageIsochrones: false,
  });

  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(false);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const activeLayerCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 1. TOP FLOATING JUMP BAR */}
      <div className="absolute top-4 left-4 z-[900] flex items-center gap-1.5 overflow-x-auto max-w-[calc(100%-140px)] pb-1 no-scrollbar">
        {/* Locate Me */}
        <button
          onClick={props.onTriggerLocateMe}
          disabled={props.isLocating}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-lg backdrop-blur-xl border ${
            props.userLiveLocation
              ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
              : 'bg-[#0f172a]/90 hover:bg-[#1e293b] text-slate-300 border-white/[0.08]'
          }`}
        >
          <Crosshair className={`w-3.5 h-3.5 text-sky-400 ${props.isLocating ? 'animate-spin' : ''}`} />
          <span>{props.isLocating ? 'Locating…' : props.userLiveLocation ? 'My GPS' : 'Locate Me'}</span>
        </button>

        {/* Sector Quick Pills */}
        <div className="flex items-center gap-1 bg-[#0f172a]/85 backdrop-blur-xl p-1 rounded-xl border border-white/[0.08] shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 flex items-center gap-1 shrink-0">
            <Navigation className="w-3 h-3 text-sky-400" /> Jump
          </span>
          {props.sectors.slice(0, 7).map((sec) => {
            const isSelected = props.selectedZone?.id === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => props.onSelectZone(sec)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition shrink-0 ${
                  isSelected
                    ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {sec.sectorNumber || sec.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. LEAFLET MAP ENGINE */}
      <DynamicMapInner {...props} layers={layers} />

      {/* 3. TOP-RIGHT LAYER SWITCHER */}
      <div className="absolute top-4 right-4 z-[900]">
        <button
          onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg backdrop-blur-xl border ${
            isLayerPanelOpen
              ? 'bg-sky-500 text-white border-sky-400'
              : 'bg-[#0f172a]/90 hover:bg-[#1e293b] text-slate-200 border-white/[0.08]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Layers</span>
          <span className="text-[10px] font-mono opacity-80">({activeLayerCount})</span>
        </button>

        {/* Layer Controls Dropdown Drawer */}
        {isLayerPanelOpen && (
          <div className="absolute top-10 right-0 w-64 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-4 shadow-2xl text-xs space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" /> Digital Twin Layers
              </span>
              <button
                onClick={() => setIsLayerPanelOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>

            {/* Infrastructure */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Infrastructure
              </div>
              <div className="space-y-1">
                {[
                  { key: 'roads', label: 'Arterial Roads & NH-48', color: '#f59e0b' },
                  { key: 'hospitals', label: 'Hospitals & Trauma', color: '#ef4444' },
                  { key: 'fireStations', label: 'Fire & Rescue Stations', color: '#f97316' },
                  { key: 'policeStations', label: 'Police Stations', color: '#3b82f6' },
                  { key: 'transit', label: 'Rapid Metro & Transit', color: '#8b5cf6' },
                  { key: 'parks', label: 'Parks & Biodiversity', color: '#10b981' },
                ].map(({ key, label, color }) => {
                  const active = layers[key as keyof typeof layers];
                  return (
                    <button
                      key={key}
                      onClick={() => toggleLayer(key as keyof typeof layers)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition ${
                        active ? 'bg-white/[0.06] text-slate-100 font-semibold' : 'text-slate-400 hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-[11px] truncate">{label}</span>
                      </span>
                      {active && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Risk & Analysis */}
            <div className="pt-2 border-t border-white/[0.06]">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Risks & Isochrones
              </div>
              <div className="space-y-1">
                {[
                  { key: 'floodZones', label: 'Flood Drainage Basins', color: '#3b82f6' },
                  { key: 'heatZones', label: 'Urban Heat Island (UHI)', color: '#ea580c' },
                  { key: 'coverageIsochrones', label: 'Emergency Isochrones (Buffers)', color: '#ef4444' },
                  { key: 'populationDensity', label: 'Population Density Choropleth', color: '#06b6d4' },
                ].map(({ key, label, color }) => {
                  const active = layers[key as keyof typeof layers];
                  return (
                    <button
                      key={key}
                      onClick={() => toggleLayer(key as keyof typeof layers)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition ${
                        active ? 'bg-white/[0.06] text-slate-100 font-semibold' : 'text-slate-400 hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-[11px] truncate">{label}</span>
                      </span>
                      {active && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM-LEFT DISCREET LEGEND */}
      <div className="absolute bottom-4 left-4 z-[900] bg-[#0f172a]/90 backdrop-blur-xl border border-white/[0.08] px-3 py-1.5 rounded-xl text-[11px] text-slate-300 hidden md:flex items-center gap-3 shadow-xl overflow-x-auto max-w-[calc(100%-80px)]">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Legend</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Water
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span> Power
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span> Shelter
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span> Hospital
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span> Fire
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> Police
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Waste
        </span>
      </div>
    </div>
  );
}
