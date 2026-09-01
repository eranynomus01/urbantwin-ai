'use client';

import React, { useState } from 'react';
import { 
  SimulationType, 
  SimulationResult, 
  RoadClosureParams, 
  NewHospitalParams, 
  NewFireStationParams, 
  NewParkParams, 
  NewTransitHubParams,
  Zone,
  RoadCorridor
} from '@/types';
import { runWhatIfSimulation } from '@/lib/simulation/engine';
import { 
  Sliders, 
  Play, 
  Sparkles, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  Trees, 
  Bus, 
  Clock, 
  Flame,
  ArrowRight,
  Save,
  RotateCcw,
  Zap,
  CheckCircle2,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface WhatIfSimulatorProps {
  roads: RoadCorridor[];
  sectors: Zone[];
  selectedZone: Zone | null;
  activeSimulation: SimulationResult | null;
  onSimulationComplete: (result: SimulationResult) => void;
  onClearSimulation: () => void;
  onSaveScenario: (result: SimulationResult) => void;
  onAskAI: (query: string) => void;
  onEnableMapDrop: (mode: 'simulation_drop') => void;
  droppedCoords: [number, number] | null;
}

export default function WhatIfSimulator({
  roads,
  sectors,
  selectedZone,
  activeSimulation,
  onSimulationComplete,
  onClearSimulation,
  onSaveScenario,
  onAskAI,
  onEnableMapDrop,
  droppedCoords,
}: WhatIfSimulatorProps) {
  const [simType, setSimType] = useState<SimulationType>('new_fire_station');
  const [isSimulating, setIsSimulating] = useState(false);

  // Form states
  const [selectedRoadId, setSelectedRoadId] = useState(roads[0]?.id || 'road-nh48-delhi-jaipur-expy');
  const [closureDuration, setClosureDuration] = useState<number>(2);

  const [hospitalBeds, setHospitalBeds] = useState<number>(350);
  const [hospitalName, setHospitalName] = useState<string>('Sector 102 Multispeciality Trauma Center');

  const [fireEngines, setFireEngines] = useState<number>(4);
  const [fireStationName, setFireStationName] = useState<string>('Sector 65 Southern Peripheral Fire Station');

  const [parkAcres, setParkAcres] = useState<number>(25);
  const [parkCanopyPct, setParkCanopyPct] = useState<number>(75);

  const [transitCapacity, setTransitCapacity] = useState<number>(45000);

  const currentCoord: [number, number] = droppedCoords || (selectedZone ? selectedZone.center : [28.4312, 77.0600]);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    let params: any = {};

    if (simType === 'road_closure') {
      const road = roads.find(r => r.id === selectedRoadId) || roads[0];
      params = {
        roadId: road.id,
        roadName: road.name,
        closureDurationHours: closureDuration,
      } as RoadClosureParams;
    } else if (simType === 'new_hospital') {
      params = {
        proposedLocation: currentCoord,
        name: hospitalName,
        targetBeds: hospitalBeds,
        icuBeds: Math.round(hospitalBeds * 0.22),
        coverageRadiusKm: 6.5,
      } as NewHospitalParams;
    } else if (simType === 'new_fire_station') {
      params = {
        proposedLocation: currentCoord,
        name: fireStationName,
        fireEngines: fireEngines,
        coverageRadiusKm: 5.5,
      } as NewFireStationParams;
    } else if (simType === 'new_park') {
      params = {
        proposedLocation: currentCoord,
        name: 'Sector Eco-Restoration & Sponge Park',
        areaAcres: parkAcres,
        canopyCoveragePct: parkCanopyPct,
      } as NewParkParams;
    } else if (simType === 'new_transit_hub') {
      params = {
        proposedLocation: currentCoord,
        name: 'Rapid Feeder Transit Interchange',
        transitType: 'multimodal_interchange',
        targetDailyCapacity: transitCapacity,
      } as NewTransitHubParams;
    }

    setTimeout(() => {
      const result = runWhatIfSimulation(simType, params);
      onSimulationComplete(result);
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 text-xs text-slate-200 overflow-y-auto custom-scrollbar">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-extrabold text-sm text-slate-100">What-If Decision Simulator</h3>
          </div>
          {activeSimulation && (
            <button
              onClick={onClearSimulation}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg transition"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* 1. SIMULATION TYPE SELECTOR */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          {[
            { id: 'new_fire_station', label: '🚒 Fire Station', type: 'new_fire_station' },
            { id: 'new_hospital', label: '🏥 Hospital', type: 'new_hospital' },
            { id: 'road_closure', label: '⛔ Road Closure', type: 'road_closure' },
            { id: 'new_park', label: '🌳 Eco Park', type: 'new_park' },
            { id: 'new_transit_hub', label: '🚇 Transit Hub', type: 'new_transit_hub' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSimType(item.type as SimulationType)}
              className={`p-2 rounded-xl text-center font-bold transition text-[11px] ${
                simType === item.type
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 2. PARAMETERS CONTROLS */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold border-b border-slate-800 pb-2">
            <span>Simulation Parameters</span>
            <span className="text-cyan-400 font-mono text-[10px]">PostGIS Engine</span>
          </div>

          {/* ROAD CLOSURE INPUTS */}
          {simType === 'road_closure' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Select Highway / Arterial Corridor
                </label>
                <select
                  value={selectedRoadId}
                  onChange={(e) => setSelectedRoadId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 text-xs focus:ring-1 focus:ring-cyan-500 font-medium"
                >
                  {roads.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.lanes} lanes, {r.highwayType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                  Closure Duration: <span className="text-red-400 font-black">{closureDuration} Hours</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0.5, 1, 2, 6].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setClosureDuration(dur)}
                      className={`py-2 rounded-xl text-xs font-bold transition ${
                        closureDuration === dur
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {dur === 0.5 ? '30 Min' : `${dur} Hrs`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NEW HOSPITAL INPUTS */}
          {simType === 'new_hospital' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Proposed Facility Name
                </label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Target Inpatient Beds: <span className="text-red-400 font-bold">{hospitalBeds} Beds</span>
                </label>
                <input
                  type="range"
                  min={150}
                  max={1200}
                  step={50}
                  value={hospitalBeds}
                  onChange={(e) => setHospitalBeds(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5 font-mono">
                  <span>150 (CHC)</span>
                  <span>500 (Super-Spec)</span>
                  <span>1200 (Medicity Tier)</span>
                </div>
              </div>
            </div>
          )}

          {/* NEW FIRE STATION INPUTS */}
          {simType === 'new_fire_station' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Station Name
                </label>
                <input
                  type="text"
                  value={fireStationName}
                  onChange={(e) => setFireStationName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Fire Engine Tenders: <span className="text-orange-400 font-bold">{fireEngines} Tenders</span>
                </label>
                <input
                  type="range"
                  min={2}
                  max={8}
                  step={1}
                  value={fireEngines}
                  onChange={(e) => setFireEngines(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5 font-mono">
                  <span>2 (Sub-Station)</span>
                  <span>4 (Standard)</span>
                  <span>8 (Division HQ)</span>
                </div>
              </div>
            </div>
          )}

          {/* NEW PARK */}
          {simType === 'new_park' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Park Area: <span className="text-emerald-400 font-bold">{parkAcres} Acres</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={parkAcres}
                  onChange={(e) => setParkAcres(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Canopy Density: <span className="text-emerald-400 font-bold">{parkCanopyPct}%</span>
                </label>
                <input
                  type="range"
                  min={40}
                  max={90}
                  step={5}
                  value={parkCanopyPct}
                  onChange={(e) => setParkCanopyPct(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          )}

          {/* NEW TRANSIT HUB */}
          {simType === 'new_transit_hub' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Daily Footfall Capacity: <span className="text-purple-400 font-bold">{transitCapacity.toLocaleString('en-IN')} Commuters</span>
                </label>
                <input
                  type="range"
                  min={10000}
                  max={120000}
                  step={5000}
                  value={transitCapacity}
                  onChange={(e) => setTransitCapacity(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          )}

          {/* PIN DROPPER TRIGGER */}
          {simType !== 'road_closure' && (
            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Coords: <span className="font-mono text-cyan-300 font-bold">{currentCoord[0].toFixed(4)}, {currentCoord[1].toFixed(4)}</span>
              </span>
              <button
                type="button"
                onClick={() => onEnableMapDrop('simulation_drop')}
                className="px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 flex items-center gap-1 font-bold text-[10px] transition shadow-md"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Click Map to Position
              </button>
            </div>
          )}
        </div>

        {/* RUN SIMULATION BUTTON */}
        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition disabled:opacity-50"
        >
          {isSimulating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Traversing PostGIS Network Graph...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Execute What-If Decision Simulation</span>
            </>
          )}
        </button>

        {/* 3. SIMULATION RESULTS CARD */}
        {activeSimulation && (
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl p-4 space-y-3.5 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-cyan-400 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Spatial Simulation Results
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-950 text-cyan-300 border border-cyan-700">
                Impact Score: {activeSimulation.impactScore}/100
              </span>
            </div>

            {/* Key KPI Deltas */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-semibold">Population Served/Impacted</span>
                <span className="font-extrabold text-slate-100 text-sm">
                  {activeSimulation.affectedPopulation.toLocaleString('en-IN')}
                </span>
              </div>

              {activeSimulation.deltaResponseTimeMin !== 0 && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-semibold">Response Time Delta</span>
                  <span className={`font-extrabold text-sm flex items-center gap-1 ${
                    activeSimulation.deltaResponseTimeMin < 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {activeSimulation.deltaResponseTimeMin < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                    {activeSimulation.deltaResponseTimeMin > 0 ? '+' : ''}{activeSimulation.deltaResponseTimeMin} min
                  </span>
                </div>
              )}

              {activeSimulation.trafficDelayIndexDelta !== 0 && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-semibold">Traffic Delay Surge</span>
                  <span className={`font-extrabold text-sm ${activeSimulation.trafficDelayIndexDelta > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {activeSimulation.trafficDelayIndexDelta > 0 ? '+' : ''}{activeSimulation.trafficDelayIndexDelta}%
                  </span>
                </div>
              )}

              {activeSimulation.uhiMitigationC > 0 && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-semibold">UHI Surface Cooling</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    -{activeSimulation.uhiMitigationC}°C
                  </span>
                </div>
              )}
            </div>

            {/* Key Findings list */}
            <div className="space-y-1.5 text-[11px]">
              {activeSimulation.keyFindings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{finding}</span>
                </div>
              ))}
            </div>

            {/* AI Summary note */}
            {activeSimulation.aiExecutiveSummary && (
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-[11px] text-cyan-200">
                <span className="font-bold block text-cyan-400 text-[10px] uppercase mb-1">
                  AI Model Interpretation:
                </span>
                {activeSimulation.aiExecutiveSummary}
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onSaveScenario(activeSimulation)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Save className="w-3.5 h-3.5 text-cyan-400" /> Save Scenario
              </button>

              <button
                onClick={() =>
                  onAskAI(`Explain the urban planning consequences, infrastructure tradeoffs, and policy recommendations for ${activeSimulation.scenarioName}`)
                }
                className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Debriefing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
