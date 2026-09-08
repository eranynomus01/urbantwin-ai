'use client';

import React, { useState } from 'react';
import { ScenarioItem, SimulationResult } from '@/types';
import { LayoutGrid, RotateCcw, TrendingUp, TrendingDown, Award } from 'lucide-react';

const BASELINE = {
  id: 'baseline', name: 'Baseline (Current)', description: 'Real GIS infrastructure as-is.',
  kpis: { avgEmergencyResponseMin: 8.4, healthcareCoveragePct: 68.5, fireCoveragePct: 64.2, trafficCongestionIndex: 68, greenSpacePerCapitaSqM: 3.4, overallUrbanResilienceScore: 62 },
};
const PRESET_A = {
  id: 'preset-a', name: 'Scenario A — Sector 65 Fire Station',
  description: 'New 4-tender fire station in Sector 65.',
  kpis: { avgEmergencyResponseMin: 4.8, healthcareCoveragePct: 68.5, fireCoveragePct: 82.8, trafficCongestionIndex: 67.5, greenSpacePerCapitaSqM: 3.4, overallUrbanResilienceScore: 78.5 },
};
const PRESET_B = {
  id: 'preset-b', name: 'Scenario B — Sector 102 Hospital',
  description: '400-bed trauma hospital on Dwarka Expressway.',
  kpis: { avgEmergencyResponseMin: 6.9, healthcareCoveragePct: 84.2, fireCoveragePct: 64.2, trafficCongestionIndex: 66, greenSpacePerCapitaSqM: 3.4, overallUrbanResilienceScore: 81 },
};

const KPI_ROWS = [
  { key: 'avgEmergencyResponseMin', label: 'Avg Emergency ETA', unit: ' min', lowerBetter: true },
  { key: 'healthcareCoveragePct', label: 'Healthcare Coverage', unit: '%', lowerBetter: false },
  { key: 'fireCoveragePct', label: 'Fire Safety Coverage', unit: '%', lowerBetter: false },
  { key: 'trafficCongestionIndex', label: 'Traffic Congestion', unit: '%', lowerBetter: true },
  { key: 'greenSpacePerCapitaSqM', label: 'Green Space / Capita', unit: ' m²', lowerBetter: false },
  { key: 'overallUrbanResilienceScore', label: 'Resilience Score', unit: '/100', lowerBetter: false },
];

interface Props {
  scenarios: ScenarioItem[];
  activeSimulation: SimulationResult | null;
  onApplyScenario: (s: ScenarioItem) => void;
  onResetToBaseline: () => void;
}

export default function ScenarioComparison({ scenarios, onApplyScenario, onResetToBaseline }: Props) {
  const all = [BASELINE, PRESET_A, PRESET_B, ...scenarios] as any[];
  const [selA, setSelA] = useState(PRESET_A.id);
  const [selB, setSelB] = useState(PRESET_B.id);
  const scenA = all.find(s => s.id === selA) || PRESET_A;
  const scenB = all.find(s => s.id === selB) || PRESET_B;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-sky-400" /> Scenario Comparison
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Compare city outcomes side-by-side</p>
        </div>
        <button onClick={onResetToBaseline} className="btn-ghost p-1.5 rounded-lg" title="Reset to baseline">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Selectors */}
        <div className="grid grid-cols-2 gap-3">
          {[{ sel: selA, setSel: setSelA, label: 'Scenario A', color: 'sky' }, { sel: selB, setSel: setSelB, label: 'Scenario B', color: 'blue' }].map(({ sel, setSel, label, color }) => (
            <div key={label}>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-${color}-400`}>{label}</label>
              <select value={sel} onChange={e => setSel(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-[11px] text-slate-200 focus:outline-none focus:border-sky-500/50 truncate">
                {all.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Resilience score hero */}
        <div className="grid grid-cols-3 gap-2">
          <div className="metric-card rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-400 font-semibold mb-1">Baseline</div>
            <div className="text-2xl font-black text-slate-300">{BASELINE.kpis.overallUrbanResilienceScore}</div>
            <div className="text-[10px] text-slate-500">/ 100</div>
          </div>
          <div className="rounded-xl p-3 text-center bg-sky-500/10 border border-sky-500/20">
            <div className="text-[10px] text-sky-400 font-bold mb-1">Scenario A</div>
            <div className="text-2xl font-black text-sky-400">{scenA.kpis.overallUrbanResilienceScore}</div>
            <div className="text-[10px] text-emerald-400 font-bold">
              +{(scenA.kpis.overallUrbanResilienceScore - BASELINE.kpis.overallUrbanResilienceScore).toFixed(1)}
            </div>
          </div>
          <div className="rounded-xl p-3 text-center bg-blue-500/10 border border-blue-500/20">
            <div className="text-[10px] text-blue-400 font-bold mb-1">Scenario B</div>
            <div className="text-2xl font-black text-blue-400">{scenB.kpis.overallUrbanResilienceScore}</div>
            <div className="text-[10px] text-emerald-400 font-bold">
              +{(scenB.kpis.overallUrbanResilienceScore - BASELINE.kpis.overallUrbanResilienceScore).toFixed(1)}
            </div>
          </div>
        </div>

        {/* KPI Table */}
        <div className="metric-card rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 px-4 py-2.5 border-b border-white/[0.05] text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span>Metric</span>
            <span className="text-center">Base</span>
            <span className="text-center text-sky-400">A</span>
            <span className="text-center text-blue-400">B</span>
          </div>
          {KPI_ROWS.map(row => {
            const base = BASELINE.kpis[row.key as keyof typeof BASELINE.kpis] as number;
            const aVal = scenA.kpis[row.key as keyof typeof scenA.kpis] as number;
            const bVal = scenB.kpis[row.key as keyof typeof scenB.kpis] as number;
            const aGood = row.lowerBetter ? aVal < base : aVal > base;
            const bGood = row.lowerBetter ? bVal < base : bVal > base;
            return (
              <div key={row.key} className="grid grid-cols-4 px-4 py-2.5 text-[11px] border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition">
                <span className="text-slate-400 font-medium truncate pr-2" title={row.label}>{row.label}</span>
                <span className="text-center text-slate-400 font-mono">{base}{row.unit}</span>
                <span className={`text-center font-bold font-mono ${aGood ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {aVal}{row.unit}
                </span>
                <span className={`text-center font-bold font-mono ${bGood ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {bVal}{row.unit}
                </span>
              </div>
            );
          })}
        </div>

        {/* Apply buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => onApplyScenario(scenA as ScenarioItem)}
            className="btn-primary py-2.5 text-xs">Apply Scenario A</button>
          <button onClick={() => onApplyScenario(scenB as ScenarioItem)}
            className="py-2.5 text-xs font-bold rounded-xl transition text-blue-300 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15">
            Apply Scenario B
          </button>
        </div>
      </div>
    </div>
  );
}
