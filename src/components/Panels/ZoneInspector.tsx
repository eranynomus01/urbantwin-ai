'use client';

import React, { useState } from 'react';
import { Zone, Hospital, FireStation } from '@/types';
import { calculateHaversineDistance } from '@/lib/routing/osrm';
import { 
  Building2, Users, Droplets, Flame, ShieldAlert, 
  Sparkles, ChevronRight, MapPin, Activity, AlertTriangle
} from 'lucide-react';

interface ZoneInspectorProps {
  selectedZone: Zone | null;
  onClearSelection: () => void;
  onAskAI: (prompt: string) => void;
  onStartSimulationInZone: (zone: Zone) => void;
  fireStations: FireStation[];
  hospitals: Hospital[];
}

function ScoreBar({ value, max = 10, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

export default function ZoneInspector({
  selectedZone, onClearSelection, onAskAI, onStartSimulationInZone, fireStations, hospitals
}: ZoneInspectorProps) {

  if (!selectedZone) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
          <MapPin className="w-7 h-7 text-sky-400" />
        </div>
        <div>
          <h3 className="font-bold text-slate-200 text-sm mb-1">Select a Sector</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
            Click any coloured area on the map to inspect its demographics, risk scores, and infrastructure gaps.
          </p>
        </div>

        {/* Citywide summary pills */}
        <div className="w-full grid grid-cols-2 gap-2 mt-2">
          {[
            { label: 'Population', value: '1.51 M', sub: 'Census + GMDA' },
            { label: 'City Area', value: '232 km²', sub: 'Municipal bounds' },
            { label: 'Hospitals', value: '5 Super-Spec', sub: '3,900+ beds' },
            { label: 'Fire Stations', value: '5 Active', sub: '26 tenders' },
          ].map(item => (
            <div key={item.label} className="metric-card rounded-xl p-3 text-left">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{item.label}</div>
              <div className="text-sm font-extrabold text-slate-100 mt-0.5">{item.value}</div>
              <div className="text-[10px] text-slate-500">{item.sub}</div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-slate-500 mt-1">
          Tip: Use the <span className="text-sky-400 font-bold">Jump to</span> buttons above the map for quick navigation.
        </p>
      </div>
    );
  }

  // Calculate nearest services
  const nearestFire = fireStations.reduce((best, fs) => {
    const d = calculateHaversineDistance(selectedZone.center, fs.coordinates);
    return d < calculateHaversineDistance(selectedZone.center, best.coordinates) ? fs : best;
  }, fireStations[0]);

  const nearestHosp = hospitals.reduce((best, h) => {
    const d = calculateHaversineDistance(selectedZone.center, h.coordinates);
    return d < calculateHaversineDistance(selectedZone.center, best.coordinates) ? h : best;
  }, hospitals[0]);

  const fireDist = calculateHaversineDistance(selectedZone.center, nearestFire.coordinates);
  const hospDist = calculateHaversineDistance(selectedZone.center, nearestHosp.coordinates);
  const fireEta = Math.round((fireDist * 1.35 / 32) * 60 * 10) / 10;
  const hospEta = Math.round((hospDist * 1.35 / 30) * 60 * 10) / 10;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Zone Header */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 rounded-md font-mono">
                {selectedZone.sectorNumber}
              </span>
              <span className="text-[10px] text-slate-400 capitalize bg-white/[0.05] border border-white/[0.06] px-2 py-0.5 rounded-md">
                {selectedZone.zoneType.replace(/_/g, ' ')}
              </span>
            </div>
            <h2 className="font-extrabold text-slate-100 text-base leading-tight">{selectedZone.name}</h2>
          </div>
          <button onClick={onClearSelection} className="btn-ghost p-1.5 rounded-lg text-slate-400 text-xs">✕</button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Population', value: selectedZone.population.toLocaleString('en-IN'), icon: <Users className="w-3.5 h-3.5 text-sky-400" />, sub: `${selectedZone.populationDensity.toLocaleString('en-IN')} / km²` },
            { label: 'Zone Area', value: `${selectedZone.areaSqKm} km²`, icon: <Building2 className="w-3.5 h-3.5 text-amber-400" />, sub: `Road density: ${selectedZone.roadDensityKmPerSqKm} km/km²` },
          ].map(m => (
            <div key={m.label} className="metric-card rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1">
                {m.icon} {m.label}
              </div>
              <div className="text-base font-extrabold text-slate-100">{m.value}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Risk Scores */}
        <div className="metric-card rounded-xl p-4 space-y-3.5">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Risk Indices</h4>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" /> Flood Risk
              </span>
              <span className={`font-bold ${selectedZone.floodRiskScore >= 7 ? 'text-red-400' : 'text-blue-400'}`}>
                {selectedZone.floodRiskScore}/10 · {selectedZone.floodRiskScore >= 7 ? 'Critical' : selectedZone.floodRiskScore >= 4 ? 'Moderate' : 'Low'}
              </span>
            </div>
            <ScoreBar value={selectedZone.floodRiskScore} color={selectedZone.floodRiskScore >= 7 ? '#ef4444' : '#3b82f6'} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Heat Island (UHI)
              </span>
              <span className={`font-bold ${selectedZone.heatRiskScore >= 8 ? 'text-red-400' : 'text-orange-400'}`}>
                {selectedZone.heatRiskScore}/10 · {selectedZone.heatRiskScore >= 8 ? 'Extreme' : 'Elevated'}
              </span>
            </div>
            <ScoreBar value={selectedZone.heatRiskScore} color={selectedZone.heatRiskScore >= 8 ? '#ef4444' : '#f97316'} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-400" /> Traffic Stress
              </span>
              <span className="font-bold text-amber-400">{selectedZone.trafficStressLevel}</span>
            </div>
          </div>
        </div>

        {/* Emergency Coverage */}
        <div className="metric-card rounded-xl p-4 space-y-2.5">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Emergency Proximity
          </h4>
          <div className="space-y-2 text-[12px]">
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-slate-400">🚒 {nearestFire.name.split(' ')[0]} Fire Stn</span>
              <div className="text-right">
                <span className="font-bold text-orange-400">{fireEta} min</span>
                <span className="text-slate-500 text-[10px] block">{fireDist.toFixed(1)} km via OSRM</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">🏥 {nearestHosp.name.split('—')[0].trim()}</span>
              <div className="text-right">
                <span className="font-bold text-red-400">{hospEta} min</span>
                <span className="text-slate-500 text-[10px] block">{hospDist.toFixed(1)} km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Hospitals', value: selectedZone.hospitalCount, color: 'text-red-400' },
            { label: 'Schools', value: selectedZone.schoolCount, color: 'text-amber-400' },
            { label: 'Parks', value: selectedZone.parkCount, color: 'text-emerald-400' },
          ].map(item => (
            <div key={item.label} className="metric-card rounded-xl p-3 text-center">
              <div className={`text-xl font-black ${item.color}`}>{item.value}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Planning Gaps */}
        {selectedZone.infrastructureGaps.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Infrastructure Gaps
            </h4>
            <div className="space-y-1.5">
              {selectedZone.infrastructureGaps.slice(0, 3).map((gap, i) => (
                <div key={i} className="flex items-start justify-between gap-2 text-[11px] text-slate-300 bg-amber-400/[0.05] border border-amber-400/[0.12] rounded-xl px-3 py-2.5">
                  <span className="leading-snug flex-1">{gap}</span>
                  <button onClick={() => onAskAI(`What should Gurugram do to address: ${gap}?`)} className="text-sky-400 shrink-0 font-bold hover:text-sky-300 transition">AI →</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-white/[0.06] space-y-2">
        <button
          onClick={() => onStartSimulationInZone(selectedZone)}
          className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
        >
          <Building2 className="w-3.5 h-3.5" />
          Run What-If Simulation Here
        </button>
        <button
          onClick={() => onAskAI(`Analyse urban planning gaps and improvement strategy for ${selectedZone.name}, Gurugram`)}
          className="btn-ghost w-full py-2.5 text-xs flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          Ask AI Advisor
        </button>
      </div>
    </div>
  );
}
