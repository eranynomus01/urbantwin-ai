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
  EmergencyIncident 
} from '@/types';
import { Layers, Eye, EyeOff, ShieldAlert, Sparkles, Navigation, CloudRain, Flame } from 'lucide-react';

// Dynamically import MapInner with SSR disabled
const DynamicMapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-3">
      <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium tracking-wide text-cyan-400">Loading Gurugram PostGIS Digital Twin Map...</p>
    </div>
  ),
});

interface DigitalTwinMapProps {
  center: [number, number];
  zoom: number;
  isDarkMode: boolean;
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone | null) => void;
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

  return (
    <div className="relative w-full h-full overflow-hidden">
      <DynamicMapInner {...props} layers={layers} />

      {/* Floating Layer Switcher Toggle Button */}
      <div className="absolute top-4 right-4 z-[900] flex flex-col gap-2">
        <button
          onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
          className="bg-slate-900/90 hover:bg-slate-800 text-cyan-400 p-2.5 rounded-lg border border-cyan-500/40 shadow-xl backdrop-blur-md flex items-center gap-2 transition text-xs font-semibold"
          title="Digital Twin Layers"
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Twin Layers</span>
        </button>

        {/* Quick layer pills */}
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => toggleLayer('floodZones')}
            className={`p-2 rounded-lg border backdrop-blur-md flex items-center justify-between text-xs font-medium transition ${
              layers.floodZones
                ? 'bg-blue-600/90 text-white border-blue-400 shadow-blue-500/20 shadow-lg'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="Toggle Flood Risk Basin Overlay"
          >
            <span className="flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5" />
              Flood Inundation
            </span>
          </button>

          <button
            onClick={() => toggleLayer('heatZones')}
            className={`p-2 rounded-lg border backdrop-blur-md flex items-center justify-between text-xs font-medium transition ${
              layers.heatZones
                ? 'bg-orange-600/90 text-white border-orange-400 shadow-orange-500/20 shadow-lg'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="Toggle Urban Heat Island Hotspots"
          >
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              Heat Island (UHI)
            </span>
          </button>

          <button
            onClick={() => toggleLayer('coverageIsochrones')}
            className={`p-2 rounded-lg border backdrop-blur-md flex items-center justify-between text-xs font-medium transition ${
              layers.coverageIsochrones
                ? 'bg-red-600/90 text-white border-red-400 shadow-red-500/20 shadow-lg'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="Toggle Emergency Isochrones"
          >
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Response Coverage
            </span>
          </button>
        </div>
      </div>

      {/* Expanded Multi-Layer Control Modal/Drawer */}
      {isLayerPanelOpen && (
        <div className="absolute top-16 right-4 z-[950] w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl p-3.5 shadow-2xl text-slate-200 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Digital Twin Layers
            </span>
            <button
              onClick={() => setIsLayerPanelOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* Infrastructure group */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Infrastructure
              </div>
              <div className="space-y-1">
                {[
                  { key: 'roads', label: 'Arterial Road Corridors', color: '#f59e0b' },
                  { key: 'hospitals', label: 'Hospitals & Trauma', color: '#ef4444' },
                  { key: 'fireStations', label: 'Fire & Rescue Stations', color: '#f97316' },
                  { key: 'policeStations', label: 'Police Stations', color: '#3b82f6' },
                  { key: 'transit', label: 'Rapid Metro & Transit', color: '#8b5cf6' },
                  { key: 'parks', label: 'Parks & Biodiversity', color: '#10b981' },
                ].map(({ key, label, color }) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/80 cursor-pointer transition"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-slate-200">{label}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={layers[key as keyof typeof layers]}
                      onChange={() => toggleLayer(key as keyof typeof layers)}
                      className="accent-cyan-500 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Environmental & Risk */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Risk & Environment
              </div>
              <div className="space-y-1">
                <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/80 cursor-pointer transition">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Flood Risk Drainage Basins</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={layers.floodZones}
                    onChange={() => toggleLayer('floodZones')}
                    className="accent-cyan-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/80 cursor-pointer transition">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span>Urban Heat Island (UHI)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={layers.heatZones}
                    onChange={() => toggleLayer('heatZones')}
                    className="accent-cyan-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/80 cursor-pointer transition">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    <span>Population Density Heatmap</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={layers.populationDensity}
                    onChange={() => toggleLayer('populationDensity')}
                    className="accent-cyan-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/80 cursor-pointer transition">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span>Emergency Isochrones (Buffers)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={layers.coverageIsochrones}
                    onChange={() => toggleLayer('coverageIsochrones')}
                    className="accent-cyan-500 rounded"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend Footer Bar */}
      <div className="absolute bottom-4 left-4 z-[900] bg-slate-900/85 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 flex items-center gap-4 shadow-lg hidden md:flex">
        <span className="text-slate-400 font-semibold">Map Legend:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Hospital (Trauma)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Fire Station
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Rapid Metro
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Eco Park
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 border-b-2 border-amber-400"></span> NH-48 / Expressways
        </span>
      </div>
    </div>
  );
}
