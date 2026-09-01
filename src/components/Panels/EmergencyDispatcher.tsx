'use client';

import React, { useState } from 'react';
import { 
  EmergencyIncident, 
  IncidentType, 
  Hospital, 
  FireStation, 
  PoliceStation, 
  Zone 
} from '@/types';
import { calculateRoute, calculateHaversineDistance } from '@/lib/routing/osrm';
import { 
  AlertOctagon, 
  MapPin, 
  Flame, 
  HeartPulse, 
  ShieldAlert, 
  Route, 
  Clock, 
  Users, 
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface EmergencyDispatcherProps {
  hospitals: Hospital[];
  fireStations: FireStation[];
  policeStations: PoliceStation[];
  sectors: Zone[];
  activeIncident: EmergencyIncident | null;
  onDispatchIncident: (incident: EmergencyIncident) => void;
  onClearIncident: () => void;
  onEnableMapDrop: (mode: 'incident_drop') => void;
  onAskAI: (query: string) => void;
  droppedCoords: [number, number] | null;
}

export const INCIDENT_PRESETS = [
  { id: 'fire_cyber_hub', label: '🔥 3-Alarm Commercial Fire at DLF Cyber Hub', type: 'fire', coord: [28.4950, 77.0890] as [number, number] },
  { id: 'trauma_rajiv_chowk', label: '🚑 Major Expressway Collision at Rajiv Chowk', type: 'road_accident', coord: [28.4480, 77.0400] as [number, number] },
  { id: 'flood_badshahpur', label: '🌊 Severe Inundation at Subhash Chowk Underpass', type: 'flash_flood', coord: [28.4220, 77.0440] as [number, number] },
  { id: 'fire_sector_56', label: '🔥 Commercial Complex Blaze in Sector 56', type: 'fire', coord: [28.4312, 77.1008] as [number, number] },
];

export default function EmergencyDispatcher({
  hospitals,
  fireStations,
  policeStations,
  sectors,
  activeIncident,
  onDispatchIncident,
  onClearIncident,
  onEnableMapDrop,
  onAskAI,
  droppedCoords,
}: EmergencyDispatcherProps) {
  const [incidentType, setIncidentType] = useState<IncidentType>('fire');
  const [isCalculating, setIsCalculating] = useState(false);

  const currentCoord: [number, number] = droppedCoords || (activeIncident ? activeIncident.location : [28.4950, 77.0890]);

  const handleDispatch = async (targetCoord: [number, number] = currentCoord, type: IncidentType = incidentType) => {
    setIsCalculating(true);

    let nearestSector = sectors[0];
    let minSecDist = Infinity;
    sectors.forEach((s) => {
      const d = calculateHaversineDistance(targetCoord, s.center);
      if (d < minSecDist) {
        minSecDist = d;
        nearestSector = s;
      }
    });

    let nearestFire = fireStations[0];
    let minFireDist = Infinity;
    fireStations.forEach((fs) => {
      const d = calculateHaversineDistance(targetCoord, fs.coordinates);
      if (d < minFireDist) {
        minFireDist = d;
        nearestFire = fs;
      }
    });

    let nearestHosp = hospitals[0];
    let minHospDist = Infinity;
    hospitals.forEach((h) => {
      const d = calculateHaversineDistance(targetCoord, h.coordinates);
      if (d < minHospDist) {
        minHospDist = d;
        nearestHosp = h;
      }
    });

    let nearestPolice = policeStations[0];
    let minPoliceDist = Infinity;
    policeStations.forEach((ps) => {
      const d = calculateHaversineDistance(targetCoord, ps.coordinates);
      if (d < minPoliceDist) {
        minPoliceDist = d;
        nearestPolice = ps;
      }
    });

    const route = await calculateRoute(nearestFire.coordinates, targetCoord);

    const popRadiusKm = 0.5;
    const areaSqKm = Math.PI * popRadiusKm * popRadiusKm;
    const popWithin500m = Math.round(areaSqKm * nearestSector.populationDensity);

    const newIncident: EmergencyIncident = {
      id: `inc-${Date.now()}`,
      type,
      severity: 'Critical (Tier 1)',
      location: targetCoord,
      addressDescription: `${nearestSector.name} Corridor, Gurugram`,
      sectorName: nearestSector.name,
      populationWithin500m: popWithin500m,
      nearestFireStation: {
        id: nearestFire.id,
        name: nearestFire.name,
        distanceKm: route.distanceKm,
        estimatedDriveTimeMin: route.durationMinutes,
        coordinates: nearestFire.coordinates,
      },
      nearestHospital: {
        id: nearestHosp.id,
        name: nearestHosp.name,
        type: nearestHosp.hospitalType,
        distanceKm: Math.round(minHospDist * 1.35 * 10) / 10,
        estimatedDriveTimeMin: Math.round(((minHospDist * 1.35) / 30) * 60 * 10) / 10,
        coordinates: nearestHosp.coordinates,
      },
      nearestPoliceStation: {
        id: nearestPolice.id,
        name: nearestPolice.name,
        distanceKm: Math.round(minPoliceDist * 1.3 * 10) / 10,
        coordinates: nearestPolice.coordinates,
      },
      primaryRouteCoordinates: route.coordinates,
      trafficCongestionFactor: 1.25,
      actionPlan: [
        `Immediate Turnout: Dispatch 2 Heavy Fire Engines from ${nearestFire.name} via ${route.summary}.`,
        `Hospital Standby: Reserve trauma bays at ${nearestHosp.name} (${nearestHosp.icuBeds} ICU capacity).`,
        `Perimeter Control: Mobilize ${nearestPolice.name} patrol units for 300m safety cordon.`,
        `Traffic Signal Preemption: GMDA ICCC green-wave priority on approach corridor.`
      ]
    };

    onDispatchIncident(newIncident);
    setIsCalculating(false);
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 text-xs text-slate-200 overflow-y-auto custom-scrollbar">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-500" />
            <h3 className="font-extrabold text-sm text-slate-100">Emergency Dispatch Router</h3>
          </div>
          {activeIncident && (
            <button
              onClick={onClearIncident}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition"
            >
              <RotateCcw className="w-3 h-3" /> Clear Incident
            </button>
          )}
        </div>

        {/* 1. QUICK INCIDENT PRESETS */}
        <div className="space-y-2">
          <label className="block text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> 1-Click Incident Scenarios
          </label>
          <div className="space-y-1.5">
            {INCIDENT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleDispatch(preset.coord, preset.type as IncidentType)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-red-500/40 transition text-[11px] flex items-center justify-between group shadow-sm"
              >
                <span className="font-medium text-slate-200">{preset.label}</span>
                <span className="text-red-400 font-bold opacity-0 group-hover:opacity-100 transition text-[10px] shrink-0 ml-1">
                  Dispatch →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. CUSTOM LOCATION PIN */}
        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-2.5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] text-slate-300">Custom Incident Pin</span>
            <span className="font-mono text-cyan-400 text-[10px] font-bold">
              {currentCoord[0].toFixed(4)}, {currentCoord[1].toFixed(4)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'fire', label: '🔥 Fire', type: 'fire' },
              { id: 'medical', label: '🚑 Medical', type: 'medical' },
              { id: 'flash_flood', label: '🌊 Flood', type: 'flash_flood' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setIncidentType(t.type as IncidentType)}
                className={`py-2 rounded-xl text-center text-xs font-bold transition ${
                  incidentType === t.type
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onEnableMapDrop('incident_drop')}
            className="w-full py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Click on Map to Drop Incident
          </button>
        </div>

        {/* TRIGGER DISPATCH BUTTON */}
        <button
          onClick={() => handleDispatch()}
          disabled={isCalculating}
          className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-red-600/20 transition disabled:opacity-50"
        >
          {isCalculating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Querying OSRM Road Graph...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" />
              <span>Compute Emergency Response Dispatch</span>
            </>
          )}
        </button>

        {/* 3. ACTIVE DISPATCH RESULTS CARD */}
        {activeIncident && (
          <div className="bg-slate-900 border border-red-500/60 rounded-2xl p-4 space-y-3.5 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-red-400 text-xs flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-red-500" /> {activeIncident.type.toUpperCase()} DISPATCH
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-950 text-red-300 border border-red-700">
                {activeIncident.severity}
              </span>
            </div>

            <div className="text-[11px] text-slate-300">
              <span className="text-slate-400">Incident Sector:</span> <b>{activeIncident.sectorName}</b>
              <div className="flex items-center gap-1 text-slate-400 text-[10px] mt-0.5 font-medium">
                <Users className="w-3.5 h-3.5 text-cyan-400" /> Population at Risk: <b className="text-slate-200">{activeIncident.populationWithin500m.toLocaleString('en-IN')} citizens</b>
              </div>
            </div>

            {/* Calculated Response Nodes */}
            <div className="space-y-2 text-[11px]">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between font-bold text-orange-300">
                  <span>🚒 {activeIncident.nearestFireStation.name}</span>
                  <span className="font-mono text-cyan-400 text-sm">
                    {activeIncident.nearestFireStation.estimatedDriveTimeMin} min ETA
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Route Distance: <b>{activeIncident.nearestFireStation.distanceKm} km</b> (Real OSRM Graph)
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between font-bold text-red-300">
                  <span>🏥 {activeIncident.nearestHospital.name.split('—')[0]}</span>
                  <span className="font-mono text-cyan-400 text-sm">
                    {activeIncident.nearestHospital.estimatedDriveTimeMin} min ETA
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Trauma Facility (<b>{activeIncident.nearestHospital.distanceKm} km</b> transit)
                </div>
              </div>
            </div>

            {/* Step-by-Step Action Plan */}
            <div className="space-y-1.5">
              <span className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400">
                Multi-Agency Emergency Action Plan:
              </span>
              {activeIncident.actionPlan.map((action, idx) => (
                <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>{action}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                onAskAI(`Evaluate emergency disaster response feasibility and bottleneck risks for ${activeIncident.type} incident at ${activeIncident.sectorName}`)
              }
              className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Strategic Debriefing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
