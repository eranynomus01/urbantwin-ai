'use client';

import React, { useState } from 'react';
import { SimulationType, SimulationResult, Zone, RoadCorridor } from '@/types';
import { runWhatIfSimulation } from '@/lib/simulation/engine';
import { Sliders, Play, Sparkles, MapPin, Save, RotateCcw, TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react';

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

const SIM_TYPES = [
  { id: 'new_fire_station', emoji: '🚒', label: 'Fire Station' },
  { id: 'new_hospital', emoji: '🏥', label: 'Hospital' },
  { id: 'road_closure', emoji: '⛔', label: 'Road Closure' },
  { id: 'new_park', emoji: '🌳', label: 'Eco Park' },
  { id: 'new_transit_hub', emoji: '🚇', label: 'Transit Hub' },
];

export default function WhatIfSimulator({
  roads, sectors, selectedZone, activeSimulation,
  onSimulationComplete, onClearSimulation, onSaveScenario, onAskAI,
  onEnableMapDrop, droppedCoords
}: WhatIfSimulatorProps) {
  const [simType, setSimType] = useState<SimulationType>('new_fire_station');
  const [isRunning, setIsRunning] = useState(false);
  const [roadId, setRoadId] = useState(roads[0]?.id || '');
  const [closureHours, setClosureHours] = useState(2);
  const [hospitalBeds, setHospitalBeds] = useState(350);
  const [fireEngines, setFireEngines] = useState(4);
  const [parkAcres, setParkAcres] = useState(25);
  const [transitCap, setTransitCap] = useState(45000);

  const coord: [number, number] = droppedCoords || (selectedZone ? selectedZone.center : [28.4312, 77.0600]);

  const handleRun = () => {
    setIsRunning(true);
    let params: any = {};
    if (simType === 'road_closure') {
      const road = roads.find(r => r.id === roadId) || roads[0];
      params = { roadId: road.id, roadName: road.name, closureDurationHours: closureHours };
    } else if (simType === 'new_hospital') {
      params = { proposedLocation: coord, name: 'Proposed Trauma Hospital', targetBeds: hospitalBeds, icuBeds: Math.round(hospitalBeds * 0.22), coverageRadiusKm: 6.5 };
    } else if (simType === 'new_fire_station') {
      params = { proposedLocation: coord, name: 'Proposed Fire Station', fireEngines, coverageRadiusKm: 5.5 };
    } else if (simType === 'new_park') {
      params = { proposedLocation: coord, name: 'Sector Eco-Park', areaAcres: parkAcres, canopyCoveragePct: 70 };
    } else if (simType === 'new_transit_hub') {
      params = { proposedLocation: coord, name: 'Transit Interchange', transitType: 'multimodal_interchange', targetDailyCapacity: transitCap };
    }
    setTimeout(() => {
      const result = runWhatIfSimulation(simType, params);
      onSimulationComplete(result);
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Panel Header */}
      <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" /> What-If Simulator
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Model infrastructure decisions & see impacts</p>
        </div>
        {activeSimulation && (
          <button onClick={onClearSimulation} className="btn-ghost p-1.5 rounded-lg">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Type Selector */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Scenario Type
          </label>
          <div className="grid grid-cols-5 gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            {SIM_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setSimType(t.id as SimulationType)}
                className={`py-2.5 px-1 rounded-lg text-center transition-all text-[11px] font-bold flex flex-col items-center gap-1 ${
                  simType === t.id
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-base leading-none">{t.emoji}</span>
                <span className="leading-tight text-center">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Parameters */}
        <div className="metric-card rounded-xl p-4 space-y-4">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Parameters</div>

          {simType === 'road_closure' && (
            <>
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1.5">Road / Corridor</label>
                <select
                  value={roadId}
                  onChange={e => setRoadId(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500/50"
                >
                  {roads.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-2">
                  Duration: <span className="text-red-400 font-extrabold">{closureHours === 0.5 ? '30 min' : `${closureHours} hours`}</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0.5, 1, 2, 6].map(d => (
                    <button key={d} onClick={() => setClosureHours(d)}
                      className={`py-2 rounded-lg text-xs font-bold transition ${closureHours === d ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'btn-ghost'}`}
                    >
                      {d === 0.5 ? '30m' : `${d}h`}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {simType === 'new_hospital' && (
            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-2">
                Inpatient Beds: <span className="text-sky-400 font-extrabold">{hospitalBeds}</span>
              </label>
              <input type="range" min={150} max={1200} step={50} value={hospitalBeds}
                onChange={e => setHospitalBeds(+e.target.value)}
                className="w-full accent-sky-500" />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>150 (CHC)</span><span>500 (Multi-spec)</span><span>1200 (Medicity)</span>
              </div>
            </div>
          )}

          {simType === 'new_fire_station' && (
            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-2">
                Fire Engines: <span className="text-orange-400 font-extrabold">{fireEngines} tenders</span>
              </label>
              <input type="range" min={2} max={8} step={1} value={fireEngines}
                onChange={e => setFireEngines(+e.target.value)}
                className="w-full accent-orange-500" />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>2 (Sub-stn)</span><span>4 (Standard)</span><span>8 (HQ)</span>
              </div>
            </div>
          )}

          {simType === 'new_park' && (
            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-2">
                Park Area: <span className="text-emerald-400 font-extrabold">{parkAcres} acres</span>
              </label>
              <input type="range" min={5} max={60} step={5} value={parkAcres}
                onChange={e => setParkAcres(+e.target.value)}
                className="w-full accent-emerald-500" />
            </div>
          )}

          {simType === 'new_transit_hub' && (
            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-2">
                Daily Capacity: <span className="text-purple-400 font-extrabold">{transitCap.toLocaleString('en-IN')}</span>
              </label>
              <input type="range" min={10000} max={120000} step={5000} value={transitCap}
                onChange={e => setTransitCap(+e.target.value)}
                className="w-full accent-purple-500" />
            </div>
          )}

          {/* Pin location */}
          {simType !== 'road_closure' && (
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
              <div className="text-[11px] text-slate-400">
                Location: <span className="text-sky-400 font-mono font-bold">{coord[0].toFixed(4)}, {coord[1].toFixed(4)}</span>
              </div>
              <button onClick={() => onEnableMapDrop('simulation_drop')}
                className="flex items-center gap-1.5 text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-lg px-3 py-1.5 hover:bg-sky-500/15 transition">
                <MapPin className="w-3.5 h-3.5" /> Pick on Map
              </button>
            </div>
          )}
        </div>

        {/* Run Button */}
        <button onClick={handleRun} disabled={isRunning}
          className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {isRunning ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Simulating on Road Graph…</>
          ) : (
            <><Play className="w-4 h-4 fill-white" /> Run Simulation</>
          )}
        </button>

        {/* Results Card */}
        {activeSimulation && (
          <div className="metric-card rounded-xl p-4 space-y-4 border border-sky-500/20 fade-in-up">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-100">{activeSimulation.scenarioName}</span>
              <span className="text-xs font-black text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 rounded-lg">
                Impact: {activeSimulation.impactScore}/100
              </span>
            </div>

            {/* KPI Deltas */}
            <div className="grid grid-cols-2 gap-2">
              <div className="metric-card rounded-lg p-2.5">
                <div className="text-[10px] text-slate-400">Population Served</div>
                <div className="text-sm font-extrabold text-slate-100">{activeSimulation.affectedPopulation.toLocaleString('en-IN')}</div>
              </div>
              {activeSimulation.deltaResponseTimeMin !== 0 && (
                <div className="metric-card rounded-lg p-2.5">
                  <div className="text-[10px] text-slate-400">Response Time Δ</div>
                  <div className={`text-sm font-extrabold flex items-center gap-1 ${activeSimulation.deltaResponseTimeMin < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {activeSimulation.deltaResponseTimeMin < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                    {activeSimulation.deltaResponseTimeMin > 0 ? '+' : ''}{activeSimulation.deltaResponseTimeMin} min
                  </div>
                </div>
              )}
              {activeSimulation.trafficDelayIndexDelta !== 0 && (
                <div className="metric-card rounded-lg p-2.5">
                  <div className="text-[10px] text-slate-400">Traffic Delay Δ</div>
                  <div className={`text-sm font-extrabold ${activeSimulation.trafficDelayIndexDelta > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {activeSimulation.trafficDelayIndexDelta > 0 ? '+' : ''}{activeSimulation.trafficDelayIndexDelta}%
                  </div>
                </div>
              )}
              {activeSimulation.uhiMitigationC > 0 && (
                <div className="metric-card rounded-lg p-2.5">
                  <div className="text-[10px] text-slate-400">UHI Cooling</div>
                  <div className="text-sm font-extrabold text-emerald-400">−{activeSimulation.uhiMitigationC}°C</div>
                </div>
              )}
            </div>

            {/* Key Findings */}
            <div className="space-y-1.5">
              {activeSimulation.keyFindings.slice(0, 3).map((f, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  {f}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => onSaveScenario(activeSimulation)}
                className="btn-ghost py-2 text-xs flex items-center justify-center gap-1.5">
                <Save className="w-3.5 h-3.5 text-sky-400" /> Save
              </button>
              <button onClick={() => onAskAI(`Explain planning consequences of: ${activeSimulation.scenarioName}`)}
                className="btn-ghost py-2 text-xs flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" /> AI Brief
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
