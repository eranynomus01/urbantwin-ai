'use client';

import React, { useState } from 'react';
import { EmergencyIncident, IncidentType, Hospital, FireStation, PoliceStation, Zone } from '@/types';
import { calculateRoute, calculateHaversineDistance } from '@/lib/routing/osrm';
import { AlertOctagon, MapPin, RotateCcw, Sparkles, CheckCircle2, Zap, Users } from 'lucide-react';

const PRESETS = [
  { id: 'fire_cyber', label: '🔥 Fire at DLF Cyber Hub', type: 'fire', coord: [28.4950, 77.0890] as [number, number] },
  { id: 'accident_rajiv', label: '🚑 Accident at Rajiv Chowk', type: 'road_accident', coord: [28.4480, 77.0400] as [number, number] },
  { id: 'flood_subhash', label: '🌊 Flood at Subhash Chowk', type: 'flash_flood', coord: [28.4220, 77.0440] as [number, number] },
  { id: 'fire_sec56', label: '🔥 Fire in Sector 56', type: 'fire', coord: [28.4312, 77.1008] as [number, number] },
];

const TYPES = [
  { id: 'fire', label: '🔥 Fire' },
  { id: 'road_accident', label: '🚑 Medical' },
  { id: 'flash_flood', label: '🌊 Flood' },
];

interface EmergencyDispatcherProps {
  hospitals: Hospital[];
  fireStations: FireStation[];
  policeStations: PoliceStation[];
  sectors: Zone[];
  activeIncident: EmergencyIncident | null;
  onDispatchIncident: (i: EmergencyIncident) => void;
  onClearIncident: () => void;
  onEnableMapDrop: (mode: 'incident_drop') => void;
  onAskAI: (query: string) => void;
  droppedCoords: [number, number] | null;
}

export default function EmergencyDispatcher({
  hospitals, fireStations, policeStations, sectors,
  activeIncident, onDispatchIncident, onClearIncident,
  onEnableMapDrop, onAskAI, droppedCoords
}: EmergencyDispatcherProps) {
  const [type, setType] = useState<IncidentType>('fire');
  const [loading, setLoading] = useState(false);

  const coord: [number, number] = droppedCoords || [28.4950, 77.0890];

  const dispatch = async (targetCoord: [number, number] = coord, incType: IncidentType = type) => {
    setLoading(true);
    const nearestSec = sectors.reduce((b, s) => calculateHaversineDistance(targetCoord, s.center) < calculateHaversineDistance(targetCoord, b.center) ? s : b, sectors[0]);
    const nearestFire = fireStations.reduce((b, s) => calculateHaversineDistance(targetCoord, s.coordinates) < calculateHaversineDistance(targetCoord, b.coordinates) ? s : b, fireStations[0]);
    const nearestHosp = hospitals.reduce((b, h) => calculateHaversineDistance(targetCoord, h.coordinates) < calculateHaversineDistance(targetCoord, b.coordinates) ? h : b, hospitals[0]);
    const nearestPolice = policeStations.reduce((b, p) => calculateHaversineDistance(targetCoord, p.coordinates) < calculateHaversineDistance(targetCoord, b.coordinates) ? p : b, policeStations[0]);

    const route = await calculateRoute(nearestFire.coordinates, targetCoord);
    const hospDist = calculateHaversineDistance(targetCoord, nearestHosp.coordinates);

    const incident: EmergencyIncident = {
      id: `inc-${Date.now()}`,
      type: incType,
      severity: 'Critical (Tier 1)',
      location: targetCoord,
      addressDescription: `${nearestSec.name}, Gurugram`,
      sectorName: nearestSec.name,
      populationWithin500m: Math.round(Math.PI * 0.25 * nearestSec.populationDensity),
      nearestFireStation: { id: nearestFire.id, name: nearestFire.name, distanceKm: route.distanceKm, estimatedDriveTimeMin: route.durationMinutes, coordinates: nearestFire.coordinates },
      nearestHospital: { id: nearestHosp.id, name: nearestHosp.name, type: nearestHosp.hospitalType, distanceKm: +(hospDist * 1.35).toFixed(1), estimatedDriveTimeMin: +((hospDist * 1.35 / 30) * 60).toFixed(1), coordinates: nearestHosp.coordinates },
      nearestPoliceStation: { id: nearestPolice.id, name: nearestPolice.name, distanceKm: +(calculateHaversineDistance(targetCoord, nearestPolice.coordinates) * 1.3).toFixed(1), coordinates: nearestPolice.coordinates },
      primaryRouteCoordinates: route.coordinates,
      trafficCongestionFactor: 1.25,
      actionPlan: [
        `Dispatch 2 engines from ${nearestFire.name} via ${route.summary}.`,
        `Reserve trauma bays at ${nearestHosp.name}.`,
        `Mobilise ${nearestPolice.name} for 300 m perimeter.`,
        `GMDA ICCC: green-wave signal priority on approach corridor.`,
      ],
    };
    onDispatchIncident(incident);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400" /> Emergency Dispatcher
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Route nearest services to any incident</p>
        </div>
        {activeIncident && (
          <button onClick={onClearIncident} className="btn-ghost p-1.5 rounded-lg">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* 1-click presets */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            <Zap className="w-3 h-3 inline mr-1 text-amber-400" /> Quick Scenarios
          </label>
          <div className="space-y-1.5">
            {PRESETS.map(p => (
              <button key={p.id} onClick={() => dispatch(p.coord, p.type as IncidentType)}
                className="w-full text-left px-4 py-3 rounded-xl metric-card hover:border-red-500/20 text-[12px] text-slate-200 font-medium flex items-center justify-between group transition-all">
                {p.label}
                <span className="text-red-400 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Dispatch →</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom drop */}
        <div className="metric-card rounded-xl p-4 space-y-3">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Custom Incident</div>
          <div className="grid grid-cols-3 gap-1.5">
            {TYPES.map(t => (
              <button key={t.id} onClick={() => setType(t.id as IncidentType)}
                className={`py-2 rounded-lg text-xs font-bold transition ${type === t.id ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'btn-ghost'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <button onClick={() => onEnableMapDrop('incident_drop')}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-lg py-2.5 hover:bg-sky-500/15 transition">
            <MapPin className="w-3.5 h-3.5" /> Click Map to Place Incident
          </button>
        </div>

        <button onClick={() => dispatch()} disabled={loading}
          className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}>
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Routing via OSRM…</>
            : <><AlertOctagon className="w-4 h-4" /> Compute Emergency Response</>
          }
        </button>

        {/* Result */}
        {activeIncident && (
          <div className="metric-card rounded-xl p-4 space-y-4 border border-red-500/20 fade-in-up">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-red-400 uppercase">{activeIncident.type} Dispatch</span>
              <span className="text-[10px] font-bold text-red-300 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg">{activeIncident.severity}</span>
            </div>

            <div className="text-[11px] text-slate-300 space-y-1">
              <div>📍 <b>{activeIncident.sectorName}</b></div>
              <div className="flex items-center gap-1 text-slate-400">
                <Users className="w-3.5 h-3.5" /> Population at risk: <b className="text-slate-200">{activeIncident.populationWithin500m.toLocaleString('en-IN')}</b>
              </div>
            </div>

            <div className="space-y-2">
              <div className="metric-card rounded-lg px-3 py-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">🚒 {activeIncident.nearestFireStation.name.split(' ')[0]} Fire Stn</span>
                <div className="text-right">
                  <span className="font-extrabold text-orange-400">{activeIncident.nearestFireStation.estimatedDriveTimeMin} min</span>
                  <span className="text-slate-500 text-[10px] block">{activeIncident.nearestFireStation.distanceKm} km · OSRM</span>
                </div>
              </div>
              <div className="metric-card rounded-lg px-3 py-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">🏥 {activeIncident.nearestHospital.name.split('—')[0]}</span>
                <div className="text-right">
                  <span className="font-extrabold text-red-400">{activeIncident.nearestHospital.estimatedDriveTimeMin} min</span>
                  <span className="text-slate-500 text-[10px] block">{activeIncident.nearestHospital.distanceKm} km</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              {activeIncident.actionPlan.map((a, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />{a}
                </div>
              ))}
            </div>

            <button onClick={() => onAskAI(`Evaluate emergency response feasibility for ${activeIncident.type} at ${activeIncident.sectorName}`)}
              className="btn-ghost w-full py-2 text-xs flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" /> AI Debriefing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
