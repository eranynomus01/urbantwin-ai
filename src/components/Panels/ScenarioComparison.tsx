'use client';

import React, { useState } from 'react';
import { ScenarioItem, SimulationResult } from '@/types';
import { 
  BarChart3, 
  GitCompare, 
  ShieldCheck, 
  TrendingUp, 
  Flame, 
  HeartPulse, 
  CloudRain, 
  Car, 
  Trees, 
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Award
} from 'lucide-react';

interface ScenarioComparisonProps {
  scenarios: ScenarioItem[];
  activeSimulation: SimulationResult | null;
  onApplyScenario: (scenario: ScenarioItem) => void;
  onResetToBaseline: () => void;
}

export const BASELINE_SCENARIO: ScenarioItem = {
  id: 'baseline-current-gurugram',
  name: 'Baseline — Current Gurugram 2026',
  description: 'Current real GIS infrastructure, active hospital beds, fire coverage, and drainage state.',
  simulationType: 'new_fire_station',
  cityId: 'gurugram',
  createdAt: '2026-09-01',
  author: 'UrbanTwin GIS Engine',
  kpis: {
    avgEmergencyResponseMin: 8.4,
    healthcareCoveragePct: 68.5,
    fireCoveragePct: 64.2,
    trafficCongestionIndex: 68.0,
    greenSpacePerCapitaSqM: 3.4,
    floodVulnerabilityScore: 6.8,
    uhiExtremeAreaPct: 42.0,
    overallUrbanResilienceScore: 62.0,
  }
};

export const PRESET_SCENARIO_A: ScenarioItem = {
  id: 'scenario-a-sec65-fire',
  name: 'Scenario A — Sector 65 Emergency Fire Station',
  description: 'Constructs a 4-tender rapid response fire station in Sector 65 (Golf Course Extension).',
  simulationType: 'new_fire_station',
  cityId: 'gurugram',
  createdAt: '2026-09-01',
  author: 'Urban Planner Model',
  kpis: {
    avgEmergencyResponseMin: 4.8,
    healthcareCoveragePct: 68.5,
    fireCoveragePct: 82.8,
    trafficCongestionIndex: 67.5,
    greenSpacePerCapitaSqM: 3.4,
    floodVulnerabilityScore: 6.8,
    uhiExtremeAreaPct: 42.0,
    overallUrbanResilienceScore: 78.5,
  }
};

export const PRESET_SCENARIO_B: ScenarioItem = {
  id: 'scenario-b-sec102-hospital',
  name: 'Scenario B — Sector 102 Multispeciality Trauma Center',
  description: 'Constructs a 400-bed trauma & emergency hospital along Dwarka Expressway corridor.',
  simulationType: 'new_hospital',
  cityId: 'gurugram',
  createdAt: '2026-09-01',
  author: 'Urban Planner Model',
  kpis: {
    avgEmergencyResponseMin: 6.9,
    healthcareCoveragePct: 84.2,
    fireCoveragePct: 64.2,
    trafficCongestionIndex: 66.0,
    greenSpacePerCapitaSqM: 3.4,
    floodVulnerabilityScore: 6.5,
    uhiExtremeAreaPct: 41.5,
    overallUrbanResilienceScore: 81.0,
  }
};

export default function ScenarioComparison({
  scenarios,
  onApplyScenario,
  onResetToBaseline,
}: ScenarioComparisonProps) {
  const [selectedScenarioA, setSelectedScenarioA] = useState<ScenarioItem>(PRESET_SCENARIO_A);
  const [selectedScenarioB, setSelectedScenarioB] = useState<ScenarioItem>(PRESET_SCENARIO_B);

  const scenarioList = [BASELINE_SCENARIO, PRESET_SCENARIO_A, PRESET_SCENARIO_B, ...scenarios];

  const compareKPIs = [
    { label: 'Avg Emergency Response', key: 'avgEmergencyResponseMin', unit: 'min', lowerIsBetter: true, icon: Flame },
    { label: 'Healthcare 10-min Coverage', key: 'healthcareCoveragePct', unit: '%', lowerIsBetter: false, icon: HeartPulse },
    { label: 'Fire Safety Isochrone', key: 'fireCoveragePct', unit: '%', lowerIsBetter: false, icon: ShieldCheck },
    { label: 'Traffic Congestion Index', key: 'trafficCongestionIndex', unit: '%', lowerIsBetter: true, icon: Car },
    { label: 'Green Space per Capita', key: 'greenSpacePerCapitaSqM', unit: 'm²', lowerIsBetter: false, icon: Trees },
    { label: 'Flood Vulnerability Score', key: 'floodVulnerabilityScore', unit: '/10', lowerIsBetter: true, icon: CloudRain },
    { label: 'Overall Urban Resilience', key: 'overallUrbanResilienceScore', unit: '/100', lowerIsBetter: false, icon: TrendingUp },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-4 text-xs text-slate-200 overflow-y-auto custom-scrollbar">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <h3 className="font-extrabold text-sm text-slate-100">Scenario Decision Deck</h3>
          </div>
          <button
            onClick={onResetToBaseline}
            className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition"
          >
            <RotateCcw className="w-3 h-3" /> Baseline
          </button>
        </div>

        {/* 1. SCENARIO CANDIDATE SELECTORS */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] uppercase font-bold text-cyan-400 mb-1">
              Scenario A (Candidate 1)
            </label>
            <select
              value={selectedScenarioA.id}
              onChange={(e) => {
                const found = scenarioList.find((s) => s.id === e.target.value);
                if (found) setSelectedScenarioA(found);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 text-xs truncate font-medium"
            >
              {scenarioList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-blue-400 mb-1">
              Scenario B (Candidate 2)
            </label>
            <select
              value={selectedScenarioB.id}
              onChange={(e) => {
                const found = scenarioList.find((s) => s.id === e.target.value);
                if (found) setSelectedScenarioB(found);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 text-xs truncate font-medium"
            >
              {scenarioList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. OVERALL URBAN RESILIENCE SCORECARD */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 rounded-2xl border border-cyan-500/30 p-3.5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs text-slate-100 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-400" /> Urban Resilience Index Comparison
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Normalized 0–100 Scale</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-semibold">Baseline Gurugram</span>
              <span className="text-lg font-black text-slate-300">
                {BASELINE_SCENARIO.kpis.overallUrbanResilienceScore}
              </span>
            </div>

            <div className="bg-cyan-950/60 p-2.5 rounded-xl border border-cyan-700/60">
              <span className="text-cyan-300 text-[10px] block font-bold truncate">Scenario A</span>
              <span className="text-lg font-black text-cyan-400">
                {selectedScenarioA.kpis.overallUrbanResilienceScore}
                <span className="text-[10px] text-emerald-400 ml-1">
                  (+{(selectedScenarioA.kpis.overallUrbanResilienceScore - BASELINE_SCENARIO.kpis.overallUrbanResilienceScore).toFixed(1)})
                </span>
              </span>
            </div>

            <div className="bg-blue-950/60 p-2.5 rounded-xl border border-blue-700/60">
              <span className="text-blue-300 text-[10px] block font-bold truncate">Scenario B</span>
              <span className="text-lg font-black text-blue-400">
                {selectedScenarioB.kpis.overallUrbanResilienceScore}
                <span className="text-[10px] text-emerald-400 ml-1">
                  (+{(selectedScenarioB.kpis.overallUrbanResilienceScore - BASELINE_SCENARIO.kpis.overallUrbanResilienceScore).toFixed(1)})
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 3. SIDE-BY-SIDE KPI TABLE */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="grid grid-cols-4 bg-slate-950 p-2.5 font-bold text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <span>Metric</span>
            <span className="text-center text-slate-400">Baseline</span>
            <span className="text-center text-cyan-400">Scenario A</span>
            <span className="text-center text-blue-400">Scenario B</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {compareKPIs.map((kpi) => {
              const baseVal = BASELINE_SCENARIO.kpis[kpi.key as keyof typeof BASELINE_SCENARIO.kpis];
              const aVal = selectedScenarioA.kpis[kpi.key as keyof typeof selectedScenarioA.kpis];
              const bVal = selectedScenarioB.kpis[kpi.key as keyof typeof selectedScenarioB.kpis];

              const isABetter = kpi.lowerIsBetter ? aVal < baseVal : aVal > baseVal;
              const isBBetter = kpi.lowerIsBetter ? bVal < baseVal : bVal > baseVal;

              const Icon = kpi.icon;

              return (
                <div key={kpi.key} className="grid grid-cols-4 p-2.5 items-center text-[11px] hover:bg-slate-800/40 transition">
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium truncate pr-1">
                    <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate" title={kpi.label}>{kpi.label}</span>
                  </div>

                  <div className="text-center text-slate-400 font-mono font-medium">
                    {baseVal}{kpi.unit}
                  </div>

                  <div className={`text-center font-mono font-bold ${isABetter ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {aVal}{kpi.unit}
                    {aVal !== baseVal && (
                      <span className="block text-[9px] opacity-80">
                        {aVal > baseVal ? '+' : ''}{(aVal - baseVal).toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className={`text-center font-mono font-bold ${isBBetter ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {bVal}{kpi.unit}
                    {bVal !== baseVal && (
                      <span className="block text-[9px] opacity-80">
                        {bVal > baseVal ? '+' : ''}{(bVal - baseVal).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. SCENARIO SUMMARIES & ACTIONS */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-3.5 space-y-2">
            <span className="font-extrabold text-cyan-400 text-[11px] block truncate">
              {selectedScenarioA.name}
            </span>
            <p className="text-[11px] text-slate-300 line-clamp-3">
              {selectedScenarioA.description}
            </p>
            <button
              onClick={() => onApplyScenario(selectedScenarioA)}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-2 rounded-xl text-xs transition shadow-md shadow-cyan-600/20"
            >
              Apply Scenario A to Twin
            </button>
          </div>

          <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-3.5 space-y-2">
            <span className="font-extrabold text-blue-400 text-[11px] block truncate">
              {selectedScenarioB.name}
            </span>
            <p className="text-[11px] text-slate-300 line-clamp-3">
              {selectedScenarioB.description}
            </p>
            <button
              onClick={() => onApplyScenario(selectedScenarioB)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded-xl text-xs transition shadow-md shadow-blue-600/20"
            >
              Apply Scenario B to Twin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
