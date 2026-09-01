'use client';

import React from 'react';
import { Zone, FireStation, Hospital } from '@/types';
import { 
  Building2, 
  Users, 
  ShieldAlert, 
  Flame, 
  CloudRain, 
  Car, 
  Sparkles, 
  Activity, 
  Trees, 
  MapPin,
  AlertTriangle,
  Info
} from 'lucide-react';
import { calculateHaversineDistance } from '@/lib/routing/osrm';

interface ZoneInspectorProps {
  selectedZone: Zone | null;
  onClearSelection: () => void;
  onAskAI: (prompt: string) => void;
  onStartSimulationInZone: (zone: Zone) => void;
  fireStations: FireStation[];
  hospitals: Hospital[];
}

export default function ZoneInspector({
  selectedZone,
  onClearSelection,
  onAskAI,
  onStartSimulationInZone,
  fireStations,
  hospitals,
}: ZoneInspectorProps) {
  if (!selectedZone) {
    return (
      <div className="h-full flex flex-col justify-between p-4 text-xs text-slate-300">
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" /> Sector Inspector
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
              City Overview
            </span>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 text-center my-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center text-xl shadow-lg shadow-cyan-500/10">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm">Click any Sector on the Map</h4>
              <p className="text-slate-400 text-xs mt-1">
                Inspect real GIS demographics, road density, emergency response distances, flood vulnerability, and infrastructure stress metrics.
              </p>
            </div>
          </div>

          {/* Quick city statistics */}
          <div className="space-y-2 text-xs">
            <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
              Gurugram City Baseline
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Total Population</span>
                <span className="font-bold text-slate-100 text-sm">1,514,085</span>
              </div>
              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Municipal Area</span>
                <span className="font-bold text-slate-100 text-sm">232.0 km²</span>
              </div>
              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Active Hospitals</span>
                <span className="font-bold text-red-400 text-sm">{hospitals.length} Super-Spec</span>
              </div>
              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Fire Stations</span>
                <span className="font-bold text-orange-400 text-sm">{fireStations.length} Stations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-cyan-950/40 border border-cyan-800/40 rounded-lg p-3 text-[11px] text-cyan-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <b>GIS Tip:</b> Select DLF Cyber City, Sector 38 (Medanta), or Sector 56 to evaluate localized decision scenarios.
          </span>
        </div>
      </div>
    );
  }

  // Calculate nearest fire station and hospital to selected zone center
  let nearestFire = fireStations[0];
  let minFireDist = Infinity;
  fireStations.forEach((fs) => {
    const dist = calculateHaversineDistance(selectedZone.center, fs.coordinates);
    if (dist < minFireDist) {
      minFireDist = dist;
      nearestFire = fs;
    }
  });

  let nearestHosp = hospitals[0];
  let minHospDist = Infinity;
  hospitals.forEach((h) => {
    const dist = calculateHaversineDistance(selectedZone.center, h.coordinates);
    if (dist < minHospDist) {
      minHospDist = dist;
      nearestHosp = h;
    }
  });

  const fireEtaMin = Math.round(((minFireDist * 1.35) / 32) * 60 * 10) / 10;
  const hospEtaMin = Math.round(((minHospDist * 1.35) / 30) * 60 * 10) / 10;

  return (
    <div className="h-full flex flex-col justify-between p-4 text-xs text-slate-200 overflow-y-auto custom-scrollbar">
      <div className="space-y-4">
        {/* Header with dismiss */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-950 text-cyan-400 border border-cyan-800">
              Sector {selectedZone.sectorNumber} • {selectedZone.zoneType}
            </span>
            <h3 className="font-bold text-base text-slate-100 mt-1">{selectedZone.name}</h3>
          </div>
          <button
            onClick={onClearSelection}
            className="text-slate-400 hover:text-white p-1 text-sm bg-slate-800 rounded px-2"
          >
            ✕ Close
          </button>
        </div>

        {/* 1. KEY GIS METRICS GRID */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
            <div className="text-slate-400 text-[10px] flex items-center gap-1">
              <Users className="w-3 h-3 text-cyan-400" /> Population
            </div>
            <div className="font-bold text-slate-100 text-sm mt-0.5">
              {selectedZone.population.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400">
              {selectedZone.populationDensity.toLocaleString('en-IN')}/km²
            </div>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
            <div className="text-slate-400 text-[10px] flex items-center gap-1">
              <Building2 className="w-3 h-3 text-amber-400" /> Area & Density
            </div>
            <div className="font-bold text-slate-100 text-sm mt-0.5">
              {selectedZone.areaSqKm} km²
            </div>
            <div className="text-[10px] text-slate-400">
              Road: {selectedZone.roadDensityKmPerSqKm} km/km²
            </div>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
            <div className="text-slate-400 text-[10px] flex items-center gap-1">
              <CloudRain className="w-3 h-3 text-blue-400" /> Flood Risk Index
            </div>
            <div className="font-bold text-blue-400 text-sm mt-0.5">
              {selectedZone.floodRiskScore} / 10.0
            </div>
            <div className="text-[10px] text-slate-400">
              {selectedZone.floodRiskScore >= 7.0 ? 'High Inundation' : selectedZone.floodRiskScore >= 4.0 ? 'Moderate Basin' : 'Low Elevation Risk'}
            </div>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
            <div className="text-slate-400 text-[10px] flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" /> Heat Island (UHI)
            </div>
            <div className="font-bold text-orange-400 text-sm mt-0.5">
              {selectedZone.heatRiskScore} / 10.0
            </div>
            <div className="text-[10px] text-slate-400">
              {selectedZone.heatRiskScore >= 8.0 ? 'Critical Thermal Load' : selectedZone.heatRiskScore >= 6.0 ? 'Elevated Heat' : 'Moderate Canopy'}
            </div>
          </div>
        </div>

        {/* 2. EMERGENCY REACHABILITY ASSESSMENT */}
        <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/60 space-y-2">
          <div className="font-bold text-slate-300 text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Emergency Proximity
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Calculated OSRM</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/60">
              <span className="text-slate-400">Nearest Fire Station:</span>
              <span className="font-semibold text-orange-300 text-right">
                {nearestFire.name.split(' ')[0]} ({minFireDist.toFixed(1)} km ~ {fireEtaMin} min)
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/60">
              <span className="text-slate-400">Nearest Trauma Hospital:</span>
              <span className="font-semibold text-red-300 text-right">
                {nearestHosp.name.split('—')[0].trim()} ({minHospDist.toFixed(1)} km ~ {hospEtaMin} min)
              </span>
            </div>
          </div>
        </div>

        {/* 3. INFRASTRUCTURE AMENITIES COUNT */}
        <div className="space-y-1.5">
          <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
            Zone Civic Assets
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="bg-slate-800/50 p-2 rounded border border-slate-700/40">
              <span className="text-slate-400 block text-[10px]">Hospitals</span>
              <span className="font-bold text-slate-100">{selectedZone.hospitalCount}</span>
            </div>
            <div className="bg-slate-800/50 p-2 rounded border border-slate-700/40">
              <span className="text-slate-400 block text-[10px]">Schools</span>
              <span className="font-bold text-slate-100">{selectedZone.schoolCount}</span>
            </div>
            <div className="bg-slate-800/50 p-2 rounded border border-slate-700/40">
              <span className="text-slate-400 block text-[10px]">Parks</span>
              <span className="font-bold text-slate-100">{selectedZone.parkCount}</span>
            </div>
          </div>
        </div>

        {/* 4. INFRASTRUCTURE GAPS & VULNERABILITIES */}
        <div className="space-y-1.5">
          <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> Identified Planning Gaps
          </div>
          <div className="space-y-1">
            {selectedZone.infrastructureGaps.map((gap, idx) => (
              <div
                key={idx}
                className="bg-amber-950/30 border border-amber-900/40 text-amber-300/90 text-[11px] p-2 rounded-lg leading-tight"
              >
                • {gap}
              </div>
            ))}
          </div>
        </div>

        {/* 5. KEY LANDMARKS */}
        <div>
          <span className="text-slate-400 text-[10px] block mb-1">Key Landmarks:</span>
          <div className="flex flex-wrap gap-1">
            {selectedZone.keyLandmarks.map((lm, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700"
              >
                {lm}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-2 pt-4 border-t border-slate-800 mt-4">
        <button
          onClick={() => onStartSimulationInZone(selectedZone)}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Simulate Project in Sector {selectedZone.sectorNumber}</span>
        </button>

        <button
          onClick={() =>
            onAskAI(`Analyze urban infrastructure gaps and provide recommendations for ${selectedZone.name}`)
          }
          className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ask UrbanTwin AI Advisor</span>
        </button>
      </div>
    </div>
  );
}
