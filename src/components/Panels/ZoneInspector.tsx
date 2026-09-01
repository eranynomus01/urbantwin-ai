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
  Info,
  TrendingUp,
  CheckCircle2,
  ArrowRight
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
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" /> Sector Inspector
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
              Municipal Overview
            </span>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-2xl p-5 text-center space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">
              <MapPin className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-100 text-sm">Select Any Sector on the Map</h4>
              <p className="text-slate-400 text-xs mt-1">
                Inspect real GIS demographics, road density, emergency coverage isochrones, flood basin vulnerability, and infrastructure stress metrics.
              </p>
            </div>
          </div>

          {/* Citywide Statistics Overview */}
          <div className="space-y-2">
            <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Gurugram Citywide Spatial Baseline
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] font-semibold">Total Population</span>
                <span className="font-extrabold text-slate-100 text-sm">1,514,085</span>
                <span className="text-[9px] text-slate-500 block">Census + GMDA Ward</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] font-semibold">Total GIS Area</span>
                <span className="font-extrabold text-slate-100 text-sm">232.0 km²</span>
                <span className="text-[9px] text-slate-500 block">Municipal Jurisdiction</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] font-semibold">Tertiary Hospitals</span>
                <span className="font-extrabold text-red-400 text-sm">{hospitals.length} Super-Spec</span>
                <span className="text-[9px] text-slate-500 block">3,900+ Inpatient Beds</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] font-semibold">Active Fire Stations</span>
                <span className="font-extrabold text-orange-400 text-sm">{fireStations.length} Stations</span>
                <span className="text-[9px] text-slate-500 block">26 Tenders & Aerials</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-cyan-950/40 border border-cyan-800/50 rounded-xl p-3 text-[11px] text-cyan-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <b>GIS Navigation Tip:</b> Use the top teleport buttons to jump directly to DLF Cyber City, Sector 38 (Medanta), or Sector 56.
          </span>
        </div>
      </div>
    );
  }

  // Calculate nearest fire station and hospital
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
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-950 text-cyan-300 border border-cyan-700 font-mono">
                {selectedZone.sectorNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                {selectedZone.zoneType}
              </span>
            </div>
            <h3 className="font-black text-base text-slate-100 mt-1">{selectedZone.name}</h3>
          </div>
          <button
            onClick={onClearSelection}
            className="text-slate-400 hover:text-white p-1 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-2.5 transition"
          >
            ✕ Close
          </button>
        </div>

        {/* 1. KEY GIS METRICS GRID */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> Population
            </div>
            <div className="font-black text-slate-100 text-base">
              {selectedZone.population.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-cyan-400 font-semibold">
              Density: {selectedZone.populationDensity.toLocaleString('en-IN')} /km²
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-amber-400" /> Area & Roads
            </div>
            <div className="font-black text-slate-100 text-base">
              {selectedZone.areaSqKm} km²
            </div>
            <div className="text-[10px] text-amber-400 font-semibold">
              Road Density: {selectedZone.roadDensityKmPerSqKm} km/km²
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Flood Risk Index
            </div>
            <div className="font-black text-blue-400 text-base flex items-center justify-between">
              <span>{selectedZone.floodRiskScore} / 10</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                selectedZone.floodRiskScore >= 7 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-blue-950 text-blue-300'
              }`}>
                {selectedZone.floodRiskScore >= 7 ? 'Critical' : selectedZone.floodRiskScore >= 4 ? 'Moderate' : 'Low'}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${selectedZone.floodRiskScore * 10}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Heat Island (UHI)
            </div>
            <div className="font-black text-orange-400 text-base flex items-center justify-between">
              <span>{selectedZone.heatRiskScore} / 10</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                selectedZone.heatRiskScore >= 8 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-orange-950 text-orange-300'
              }`}>
                {selectedZone.heatRiskScore >= 8 ? 'Extreme' : 'Elevated'}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full"
                style={{ width: `${selectedZone.heatRiskScore * 10}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. EMERGENCY REACHABILITY ASSESSMENT */}
        <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2.5 shadow-lg">
          <div className="font-bold text-slate-200 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" /> Emergency Proximity & Golden Hour
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">Calculated OSRM</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400">Nearest Fire Station:</span>
              <span className="font-bold text-orange-300 text-right">
                {nearestFire.name.split(' ')[0]} ({minFireDist.toFixed(1)} km ~ {fireEtaMin} min)
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400">Nearest Trauma Center:</span>
              <span className="font-bold text-red-300 text-right">
                {nearestHosp.name.split('—')[0].trim()} ({minHospDist.toFixed(1)} km ~ {hospEtaMin} min)
              </span>
            </div>
          </div>
        </div>

        {/* 3. CIVIC AMENITIES */}
        <div className="space-y-1.5">
          <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
            Civic Infrastructure Inventory
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-semibold">Hospitals</span>
              <span className="font-black text-red-400 text-sm">{selectedZone.hospitalCount}</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-semibold">Schools</span>
              <span className="font-black text-amber-400 text-sm">{selectedZone.schoolCount}</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-semibold">Parks</span>
              <span className="font-black text-emerald-400 text-sm">{selectedZone.parkCount}</span>
            </div>
          </div>
        </div>

        {/* 4. PLANNING GAPS */}
        <div className="space-y-1.5">
          <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Infrastructure Gaps
          </div>
          <div className="space-y-1.5">
            {selectedZone.infrastructureGaps.map((gap, idx) => (
              <div
                key={idx}
                className="bg-amber-950/30 border border-amber-900/50 text-amber-200 text-[11px] p-2.5 rounded-xl leading-snug flex items-start justify-between gap-2"
              >
                <span>• {gap}</span>
                <button
                  onClick={() => onAskAI(`What are the priority policy solutions to address this gap in ${selectedZone.name}: ${gap}`)}
                  className="text-cyan-400 hover:text-cyan-300 font-bold shrink-0 text-[10px] underline"
                >
                  AI Soln →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-2 pt-4 border-t border-slate-800 mt-4">
        <button
          onClick={() => onStartSimulationInZone(selectedZone)}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Launch What-If Simulation in {selectedZone.sectorNumber}</span>
        </button>

        <button
          onClick={() =>
            onAskAI(`Analyze urban infrastructure gaps, drainage bottlenecks, and heat island mitigation options for ${selectedZone.name}`)
          }
          className="w-full bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ask UrbanTwin AI Advisor for Recommendations</span>
        </button>
      </div>
    </div>
  );
}
