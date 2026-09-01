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
  Car, 
  CloudRain, 
  ShieldAlert, 
  Route, 
  Clock, 
  Users, 
  RotateCcw,
  Sparkles
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
  { id: 'fire_cyber_hub', label: '🔥 High-Rise Fire at DLF Cyber City', type: 'fire', coord: [28.4950, 77.0890] as [number, number] },
  { id: 'trauma_rajiv_chowk', label: '🚑 Multi-Vehicle Collision at Rajiv Chowk', type: 'road_accident', coord: [28.4480, 77.0400] as [number, number] },
  { id: 'flood_badshahpur', label: '🌊 Flash Waterlogging at Subhash Chowk', type: 'flash_flood', coord: [28.4220, 77.0440] as [number, number] },
  { id: 'fire_sector_56', label: '🔥 Commercial Complex Fire in Sector 56', type: 'fire', coord: [28.4312, 77.1008] as [number, number] },
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

    // 1. Identify closest Sector
    let nearestSector = sectors[0];
    let minSecDist = Infinity;
    sectors.forEach((s) => {
      const d = calculateHaversineDistance(targetCoord, s.center);
      if (d < minSecDist) {
        minSecDist = d;
        nearestSector = s;
      }
    });

    // 2. Identify nearest Fire Station
    let nearestFire = fireStations[0];
    let minFireDist = Infinity;
    fireStations.forEach((fs) => {
      const d = calculateHaversineDistance(targetCoord, fs.coordinates);
      if (d < minFireDist) {
        minFireDist = d;
        nearestFire = fs;
      }
    });

    // 3. Identify nearest Hospital
    let nearestHosp = hospitals[0];
    let minHospDist = Infinity;
    hospitals.forEach((h) => {
      const d = calculateHaversineDistance(targetCoord, h.coordinates);
      if (d < minHospDist) {
        minHospDist = d;
        nearestHosp = h;
      }
    });

    // 4. Identify nearest Police Station
    let nearestPolice = policeStations[0];
    let minPoliceDist = Infinity;
    policeStations.forEach((ps) => {
      const d = calculateHaversineDistance(targetCoord, ps.coordinates);
      if (d < minPoliceDist) {
        minPoliceDist = d;
        nearestPolice = ps;
      }
    });

    // 5. Compute real OSRM route from Fire Station to Incident
    const route = await calculateRoute(nearestFire.coordinates, targetCoord);

    // Estimate population within 500m based on sector density
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
        `Dispatch 2 First-Turnout Tenders from ${nearestFire.name} via ${route.summary}.`,
        `Alert Emergency Trauma Unit at ${nearestHosp.name} (${nearestHosp.icuBeds} ICU beds available).`,
        `Establish 300m perimeter cordon via ${nearestPolice.name}.`,
        `Synchronize ICCC green wave along arterial route corridors.`
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
            <h3 className="font-bold text-sm text-slate-100">Emergency Dispatcher</h3>
          </div>
          {activeIncident && (
            <button
              onClick={onClearIncident}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] bg-slate-800 px-2 py-1 rounded"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <label className="block text-[10px] uppercase font-bold text-slate-400">
            Quick Incident Presets
          </label>
          <div className="space-y-1">
            {INCIDENT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleDispatch(preset.coord, preset.type as IncidentType)}
                className="w-full text-left p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition text-[11px] flex items-center justify-between group"
              >
                <span>{preset.label}</span>
                <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition text-[10px]">
                  Dispatch →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Coordinate Selection */}
        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] text-slate-300">Custom Incident Pin</span>
            <span className="font-mono text-cyan-400 text-[10px]">
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
                className={`py-1.5 rounded text-center text-xs font-semibold ${
                  incidentType === t.type
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onEnableMapDrop('incident_drop')}
            className="w-full py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Click on Map to Drop Incident
          </button>
        </div>

        {/* TRIGGER DISPATCH BUTTON */}
        <button
          onClick={() => handleDispatch()}
          disabled={isCalculating}
          className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-red-600/20 transition disabled:opacity-50"
        >
          {isCalculating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Routing Real Road Network...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" />
              <span>Compute Emergency Response Plan</span>
            </>
          )}
        </button>

        {/* 4. ACTIVE INCIDENT RESPONSE SUMMARY */}
        {activeIncident && (
          <div className="bg-slate-900/95 border border-red-500/50 rounded-xl p-3.5 space-y-3 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-red-400 text-xs flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-red-500" /> {activeIncident.type.toUpperCase()} DISPATCH
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-800">
                {activeIncident.severity}
              </span>
            </div>

            <div className="text-[11px] text-slate-300">
              <span className="text-slate-400">Target Area:</span> <b>{activeIncident.sectorName}</b>
              <div className="flex items-center gap-1 text-slate-400 text-[10px] mt-0.5">
                <Users className="w-3 h-3 text-cyan-400" /> Pop at Risk: <b>{activeIncident.populationWithin500m.toLocaleString('en-IN')} citizens</b>
              </div>
            </div>

            {/* Calculated Response Nodes */}
            <div className="space-y-1.5 text-[11px]">
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between font-semibold text-orange-300">
                  <span>🚒 {activeIncident.nearestFireStation.name}</span>
                  <span className="font-bold font-mono text-cyan-400">
                    {activeIncident.nearestFireStation.estimatedDriveTimeMin} min ETA
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Route Distance: {activeIncident.nearestFireStation.distanceKm} km (OSRM Road Network)
                </div>
              </div>

              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between font-semibold text-red-300">
                  <span>🏥 {activeIncident.nearestHospital.name.split('—')[0]}</span>
                  <span className="font-bold font-mono text-cyan-400">
                    {activeIncident.nearestHospital.estimatedDriveTimeMin} min ETA
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Trauma Facility ({activeIncident.nearestHospital.distanceKm} km transit)
                </div>
              </div>
            </div>

            {/* Action Plan */}
            <div className="space-y-1">
              <span className="font-bold text-[10px] uppercase text-slate-400">
                Coordinated Response Plan:
              </span>
              {activeIncident.actionPlan.map((action, idx) => (
                <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                onAskAI(`Evaluate emergency disaster response feasibility for ${activeIncident.type} incident at ${activeIncident.sectorName}`)
              }
              className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Strategic Debriefing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
