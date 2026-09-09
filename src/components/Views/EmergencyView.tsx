'use client';

import React, { useState } from 'react';
import { 
  City, 
  Zone, 
  Hospital, 
  FireStation, 
  PoliceStation, 
  FloodRiskZone, 
  HeatRiskZone, 
  RoadCorridor,
  EmergencyIncident,
  IncidentType
} from '@/types';
import { calculateRoute, calculateHaversineDistance } from '@/lib/routing/osrm';
import { 
  Flame, 
  CloudRain, 
  Thermometer, 
  ShieldAlert, 
  ArrowRight, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw,
  Zap,
  Building2,
  Navigation,
  ExternalLink
} from 'lucide-react';

interface EmergencyViewProps {
  activeCity: City;
  sectors: Zone[];
  hospitals: Hospital[];
  fireStations: FireStation[];
  policeStations: PoliceStation[];
  roads: RoadCorridor[];
  floodZones: FloodRiskZone[];
  heatZones: HeatRiskZone[];
  onAskAI: (prompt: string) => void;
}

type RiskCategory = 'fire' | 'flood' | 'heat' | 'coverage';

export default function EmergencyView({
  activeCity,
  sectors,
  hospitals,
  fireStations,
  policeStations,
  roads,
  floodZones,
  heatZones,
  onAskAI,
}: EmergencyViewProps) {
  const [selectedRisk, setSelectedRisk] = useState<RiskCategory | null>(null);
  const [activeIncident, setActiveIncident] = useState<EmergencyIncident | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  // Dispatch simulation handler
  const handleTriggerDispatch = async (coord: [number, number], type: IncidentType, label: string) => {
    setIsDispatching(true);

    // Find nearest fire station
    let nearestFS = fireStations[0];
    let minFSDist = Infinity;
    fireStations.forEach((fs) => {
      const d = calculateHaversineDistance(coord, fs.coordinates);
      if (d < minFSDist) {
        minFSDist = d;
        nearestFS = fs;
      }
    });

    // Find nearest hospital
    let nearestH = hospitals[0];
    let minHDist = Infinity;
    hospitals.forEach((h) => {
      const d = calculateHaversineDistance(coord, h.coordinates);
      if (d < minHDist) {
        minHDist = d;
        nearestH = h;
      }
    });

    // Find closest sector
    let nearestSec = sectors[0];
    let minSecDist = Infinity;
    sectors.forEach((s) => {
      const d = calculateHaversineDistance(coord, s.center);
      if (d < minSecDist) {
        minSecDist = d;
        nearestSec = s;
      }
    });

    // Calculate OSRM route
    const route = await calculateRoute(nearestFS.coordinates, coord);

    const incident: EmergencyIncident = {
      id: `inc-${Date.now()}`,
      type,
      coordinates: coord,
      sectorId: nearestSec.id,
      sectorName: nearestSec.name,
      severity: 'Critical',
      timestamp: new Date().toLocaleTimeString(),
      reportedAt: new Date().toLocaleTimeString(),
      nearestFireStation: {
        id: nearestFS.id,
        name: nearestFS.name,
        distanceKm: route.distanceKm || Math.round(minFSDist * 10) / 10,
        estimatedArrivalTimeMinutes: route.durationMin || Math.round((minFSDist / 35) * 60 * 10) / 10,
        coordinates: nearestFS.coordinates,
      },
      nearestHospital: {
        id: nearestH.id,
        name: nearestH.name,
        distanceKm: Math.round(minHDist * 10) / 10,
        estimatedArrivalTimeMinutes: Math.round((minHDist / 40) * 60 * 10) / 10,
        coordinates: nearestH.coordinates,
      },
      recommendedEvacuationRoute: route.coordinates,
      affectedPopulationEstimate: 4200,
      activeStatus: 'Dispatched',
    };

    setActiveIncident(incident);
    setIsDispatching(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#070b16] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Disaster & Emergency Intelligence
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeCity.name} Risk Matrix
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              Emergency Preparedness & Hazard Analysis
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Select a risk category below to inspect critical hazard zones, vulnerable infrastructure, and live dispatch routes.
            </p>
          </div>

          {selectedRisk && (
            <button
              onClick={() => { setSelectedRisk(null); setActiveIncident(null); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-slate-300 border border-white/10 transition-colors self-start md:self-auto"
            >
              <RotateCcw size={13} />
              <span>All Risk Categories</span>
            </button>
          )}
        </div>

        {/* 4 MAJOR RISK CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. FIRE RISK */}
          <div
            onClick={() => setSelectedRisk('fire')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedRisk === 'fire'
                ? 'bg-gradient-to-b from-orange-500/20 to-[#0b1220] border-orange-500/40 shadow-xl shadow-orange-500/10 scale-[1.02]'
                : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-orange-500/30'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-orange-500/15 text-orange-400">
                  <Flame size={22} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  Active
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Fire Risk</h3>
              <p className="text-xs text-slate-400 mt-1">
                Industrial chemical clusters, commercial towers, and high fuel-load corridors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-orange-400">
              <span>{fireStations.length} Fire Stations</span>
              <ArrowRight size={13} />
            </div>
          </div>

          {/* 2. FLOOD RISK */}
          <div
            onClick={() => setSelectedRisk('flood')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedRisk === 'flood'
                ? 'bg-gradient-to-b from-cyan-500/20 to-[#0b1220] border-cyan-500/40 shadow-xl shadow-cyan-500/10 scale-[1.02]'
                : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-cyan-500/30'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400">
                  <CloudRain size={22} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Monsoon
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Flood Risk</h3>
              <p className="text-xs text-slate-400 mt-1">
                Low-lying canal outfalls, natural drainage depressions, and waterlogging choke points.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-cyan-400">
              <span>{floodZones.length} Mapped Zones</span>
              <ArrowRight size={13} />
            </div>
          </div>

          {/* 3. HEAT RISK */}
          <div
            onClick={() => setSelectedRisk('heat')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedRisk === 'heat'
                ? 'bg-gradient-to-b from-rose-500/20 to-[#0b1220] border-rose-500/40 shadow-xl shadow-rose-500/10 scale-[1.02]'
                : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-rose-500/30'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400">
                  <Thermometer size={22} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Summer UHI
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Heat Island Risk</h3>
              <p className="text-xs text-slate-400 mt-1">
                Impervious concrete surfaces with +5.8°C thermal retention and sparse tree canopy.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-rose-400">
              <span>{heatZones.length} Hotspots Mapped</span>
              <ArrowRight size={13} />
            </div>
          </div>

          {/* 4. EMERGENCY COVERAGE */}
          <div
            onClick={() => setSelectedRisk('coverage')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedRisk === 'coverage'
                ? 'bg-gradient-to-b from-emerald-500/20 to-[#0b1220] border-emerald-500/40 shadow-xl shadow-emerald-500/10 scale-[1.02]'
                : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-emerald-500/30'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <ShieldAlert size={22} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Golden Hour
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Emergency Coverage</h3>
              <p className="text-xs text-slate-400 mt-1">
                Ambulance and fire response isochrones across all sectors with live OSRM routing.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>{hospitals.length} Hospitals Active</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>

        {/* DETAILED INFORMATION SECTION (ONLY REVEALED WHEN A CATEGORY IS CLICKED) */}
        {selectedRisk && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* FLOOD RISK DEEP DIVE */}
            {selectedRisk === 'flood' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CloudRain size={16} className="text-cyan-400" />
                    <span>Flood Risk Zones & Drainage Outfall Infrastructure</span>
                  </h3>
                  <button
                    onClick={() => onAskAI(`What flood mitigation investments does ${activeCity.name} urgently require for Western Yamuna Canal overflow and stormwater discharge?`)}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                  >
                    <Sparkles size={12} />
                    <span>Ask AI Flood Assessment</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {floodZones.map((fz) => (
                    <div key={fz.id} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white">{fz.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                          {fz.riskLevel} Risk
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                        <div>Water Depth Est: <b className="text-white">{fz.depthEstimateM}m</b></div>
                        <div>Affected Pop: <b className="text-white">{fz.affectedPopulation.toLocaleString()}</b></div>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <b>Critical Facilities at Risk:</b> {fz.criticalFacilitiesAtRisk.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FIRE RISK DEEP DIVE */}
            {selectedRisk === 'fire' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Flame size={16} className="text-orange-400" />
                    <span>Fire Vulnerability Matrix & Station Readiness</span>
                  </h3>
                  <button
                    onClick={() => onAskAI(`Where are the critical fire response gaps in ${activeCity.name} industrial clusters?`)}
                    className="flex items-center gap-1 text-xs text-orange-400 hover:underline"
                  >
                    <Sparkles size={12} />
                    <span>Ask AI Fire Strategy</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {fireStations.map((fs) => (
                    <div key={fs.id} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white">{fs.name}</span>
                        <span className="text-emerald-400 font-bold">{fs.status}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{fs.address}</p>
                      <div className="flex justify-between text-[11px] text-slate-300 pt-1 border-t border-white/5">
                        <span>Fire Engines: <b>{fs.fireEngines}</b></span>
                        <span>Coverage: <b>{fs.coverageRadiusKm} km</b></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HEAT RISK DEEP DIVE */}
            {selectedRisk === 'heat' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Thermometer size={16} className="text-rose-400" />
                    <span>Urban Heat Island (UHI) Thermal Concentration Zones</span>
                  </h3>
                  <button
                    onClick={() => onAskAI(`What cool-roof and green canopy policy can mitigate severe summer heat in ${activeCity.name}?`)}
                    className="flex items-center gap-1 text-xs text-rose-400 hover:underline"
                  >
                    <Sparkles size={12} />
                    <span>Ask AI Heat Mitigation</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {heatZones.map((hz) => (
                    <div key={hz.id} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white">{hz.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                          {hz.intensity}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                        <div>Surface Delta: <b className="text-rose-400">+{hz.surfaceTempDeltaC}°C</b></div>
                        <div>Tree Canopy: <b className="text-white">{hz.treeCanopyCoverPct}%</b></div>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <b>Intervention:</b> {hz.recommendedInterventions[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EMERGENCY COVERAGE & DISPATCH SIMULATION */}
            {selectedRisk === 'coverage' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert size={16} className="text-emerald-400" />
                    <span>Live Emergency Dispatch Simulation (OSRM Router)</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleTriggerDispatch(sectors[0]?.center || activeCity.center, 'fire', `Industrial Fire in ${sectors[0]?.name || activeCity.name}`)}
                    disabled={isDispatching}
                    className="p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-left transition-colors"
                  >
                    <span className="text-xs font-bold text-white block">🔥 Trigger Fire Incident</span>
                    <span className="text-[11px] text-slate-400">Route tender from nearest fire HQ</span>
                  </button>

                  <button
                    onClick={() => handleTriggerDispatch(sectors[1]?.center || activeCity.center, 'road_accident', `Trauma Accident on Major Arterial`)}
                    disabled={isDispatching}
                    className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-left transition-colors"
                  >
                    <span className="text-xs font-bold text-white block">🚑 Medical Trauma Emergency</span>
                    <span className="text-[11px] text-slate-400">Calculate golden hour hospital ETA</span>
                  </button>

                  <button
                    onClick={() => handleTriggerDispatch(sectors[2]?.center || activeCity.center, 'flash_flood', `Canal Inundation Choke Point`)}
                    disabled={isDispatching}
                    className="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-left transition-colors"
                  >
                    <span className="text-xs font-bold text-white block">🌊 Flood Inundation Alarm</span>
                    <span className="text-[11px] text-slate-400">Deploy relief team & pumps</span>
                  </button>
                </div>

                {/* Dispatch Result Card */}
                {activeIncident && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2 animate-in fade-in duration-150">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">🚨 Live Response Dispatched: {activeIncident.sectorName}</span>
                      <span className="text-emerald-400 font-bold">{activeIncident.activeStatus}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                      <div>
                        🚒 Nearest Fire HQ: <b className="text-white">{activeIncident.nearestFireStation.name}</b>
                        <div className="text-[11px] text-slate-400">
                          {activeIncident.nearestFireStation.distanceKm} km · ETA: <b className="text-emerald-400">{activeIncident.nearestFireStation.estimatedArrivalTimeMinutes} min</b>
                        </div>
                      </div>
                      <div>
                        🏥 Apex Hospital: <b className="text-white">{activeIncident.nearestHospital.name}</b>
                        <div className="text-[11px] text-slate-400">
                          {activeIncident.nearestHospital.distanceKm} km · ETA: <b className="text-emerald-400">{activeIncident.nearestHospital.estimatedArrivalTimeMinutes} min</b>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
