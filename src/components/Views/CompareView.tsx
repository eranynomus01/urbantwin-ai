'use client';

import React, { useState } from 'react';
import { City, ScenarioItem } from '@/types';
import { formatNumber } from '@/lib/utils/format';
import { 
  BarChart2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Award,
  Clock,
  ShieldCheck,
  Users,
  Plus
} from 'lucide-react';

interface CompareViewProps {
  activeCity: City;
  savedScenarios?: ScenarioItem[];
  onAskAI: (prompt: string) => void;
}

interface Proposal {
  id: string;
  name: string;
  badge: string;
  hospitalLocation: string;
  fireStationLocation: string;
  kpis: {
    populationCovered: number;
    emergencyAccessibilityPct: number;
    avgTravelTimeMin: number;
    riskReductionPct: number;
    estimatedCostInr: string;
    uhiCoolingDeltaC: number;
  };
  pros: string[];
  cons: string[];
}

export default function CompareView({
  activeCity,
  savedScenarios,
  onAskAI,
}: CompareViewProps) {
  const initialProposals: Proposal[] = [
    {
      id: 'prop-a',
      name: 'Proposal A (Core Sector Consolidation)',
      badge: 'Proposal A',
      hospitalLocation: 'Sector 14 Commercial Belt',
      fireStationLocation: 'Model Town / Camp Chowk',
      kpis: {
        populationCovered: 48500,
        emergencyAccessibilityPct: 78.4,
        avgTravelTimeMin: 7.2,
        riskReductionPct: 62.0,
        estimatedCostInr: '₹ 42.5 Cr',
        uhiCoolingDeltaC: 0.8,
      },
      pros: [
        'Rapid land acquisition on existing municipal parcel',
        'Direct arterial transit feeder along Delhi Road',
      ],
      cons: [
        'Leaves Industrial Belt with 11-minute response latency',
        'Higher baseline land acquisition cost',
      ],
    },
    {
      id: 'prop-b',
      name: 'Proposal B (Decentralized Industrial & Sub-Arterial)',
      badge: 'Proposal B · Recommended',
      hospitalLocation: 'Urban Estate II & Sector 13',
      fireStationLocation: 'Industrial Area Phase I & II',
      kpis: {
        populationCovered: 64200,
        emergencyAccessibilityPct: 89.2,
        avgTravelTimeMin: 5.4,
        riskReductionPct: 84.5,
        estimatedCostInr: '₹ 38.0 Cr',
        uhiCoolingDeltaC: 1.5,
      },
      pros: [
        'Cuts industrial hazmat response time by 52%',
        'Expands coverage to 15,700 additional residents',
        'Lower total CapEx with HSIIDC land allocation',
      ],
      cons: [
        'Requires grade separator upgrade at Balsamand canal crossing',
      ],
    },
  ];

  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [isAddingProposal, setIsAddingProposal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newHospitalLoc, setNewHospitalLoc] = useState('');
  const [newFireLoc, setNewFireLoc] = useState('');
  const [newBudgetCr, setNewBudgetCr] = useState('35.0');
  const [newPopCoverage, setNewPopCoverage] = useState('58000');

  const handleAddCustomProposal = () => {
    if (!newTitle.trim()) return;
    const letter = String.fromCharCode(65 + proposals.length); // C, D, E...
    const pop = parseInt(newPopCoverage, 10) || 52000;
    const accessPct = Math.min(96, Math.round(75 + (pop / 64200) * 15 * 10) / 10);
    const travelTime = Math.max(3.8, Math.round((9.5 - (pop / 20000)) * 10) / 10);

    const custom: Proposal = {
      id: `prop-${Date.now()}`,
      name: `${newTitle.trim()} (Proposal ${letter})`,
      badge: `Proposal ${letter} · Custom`,
      hospitalLocation: newHospitalLoc.trim() || 'Central Sector Corridor',
      fireStationLocation: newFireLoc.trim() || 'Sub-Arterial Safety Depot',
      kpis: {
        populationCovered: pop,
        emergencyAccessibilityPct: accessPct,
        avgTravelTimeMin: travelTime,
        riskReductionPct: Math.min(95, Math.round(accessPct * 0.92)),
        estimatedCostInr: `₹ ${newBudgetCr} Cr`,
        uhiCoolingDeltaC: 1.2,
      },
      pros: [
        'Tailored to specific municipal and citizen-defined priorities',
        `Directly services ${pop.toLocaleString('en-IN')} citizens`,
      ],
      cons: [
        'Requires detailed feasibility engineering and environmental review',
      ],
    };

    setProposals((prev) => [...prev, custom]);
    setIsAddingProposal(false);
    setNewTitle('');
    setNewHospitalLoc('');
    setNewFireLoc('');
  };

  // Compute best proposal dynamically
  const bestProposal = [...proposals].sort((a, b) => 
    b.kpis.populationCovered * (b.kpis.emergencyAccessibilityPct / 100) - 
    a.kpis.populationCovered * (a.kpis.emergencyAccessibilityPct / 100)
  )[0] || proposals[0];

  return (
    <div className="flex-1 overflow-y-auto bg-[#070b16] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Urban Planning Scenario Compare
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeCity.name} Infrastructure Evaluation · {proposals.length} Scenarios Defined
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              Compare Any Number of Urban Proposals
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Add custom scenarios manually with your own parameters and let the AI synthesize winning metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingProposal(!isAddingProposal)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all active:scale-95"
            >
              <Plus size={14} />
              <span>Add Custom Proposal</span>
            </button>
          </div>
        </div>

        {/* ADD CUSTOM PROPOSAL MODAL / DRAWER */}
        {isAddingProposal && (
          <div className="p-5 rounded-2xl bg-[#0e1628] border border-purple-500/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                <span>Define New Manual Urban Proposal</span>
              </h3>
              <button
                onClick={() => setIsAddingProposal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Proposal Title / Strategy:</label>
                <input
                  type="text"
                  placeholder="e.g. Ring Road Rapid Transit & Trauma Hub"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-purple-400 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Estimated Budget (₹ Cr):</label>
                <input
                  type="text"
                  placeholder="e.g. 45.0"
                  value={newBudgetCr}
                  onChange={(e) => setNewBudgetCr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Hospital / Medical Site:</label>
                <input
                  type="text"
                  placeholder="e.g. Sector 21 Junction / Outer Bypass"
                  value={newHospitalLoc}
                  onChange={(e) => setNewHospitalLoc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-purple-400 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Fire & Emergency Site:</label>
                <input
                  type="text"
                  placeholder="e.g. Logistics Park / Sub-Arterial Link"
                  value={newFireLoc}
                  onChange={(e) => setNewFireLoc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-purple-400 placeholder-slate-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1">Target Population Reached:</label>
                <input
                  type="number"
                  placeholder="e.g. 62000"
                  value={newPopCoverage}
                  onChange={(e) => setNewPopCoverage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setIsAddingProposal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomProposal}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30"
              >
                Add Proposal to Comparison
              </button>
            </div>
          </div>
        )}

        {/* PROPOSAL CARDS SUMMARY (DYNAMIC N-SCENARIO GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposals.map((p, idx) => {
            const isWinner = p.id === bestProposal.id;
            return (
              <div
                key={p.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                  isWinner
                    ? 'bg-gradient-to-b from-purple-500/15 via-purple-600/5 to-[#0b1220] border-purple-500/40 shadow-xl shadow-purple-500/10'
                    : 'bg-white/[0.02] border-white/[0.08]'
                }`}
              >
                {isWinner && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-bl-lg">
                    Optimal Choice
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isWinner ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40' : 'bg-white/10 text-slate-300'
                    }`}>
                      {p.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-bold">{p.kpis.estimatedCostInr}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{p.name}</h3>

                  <div className="mt-4 p-3 rounded-xl bg-black/30 border border-white/5 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">🏥 Medical Node:</span>
                      <span className="font-semibold text-white truncate max-w-[170px]">{p.hospitalLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">🚒 Emergency Node:</span>
                      <span className="font-semibold text-white truncate max-w-[170px]">{p.fireStationLocation}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/5 text-[11px]">
                      <span className="text-slate-400">Pop. Reach:</span>
                      <span className="font-mono text-cyan-300 font-bold" suppressHydrationWarning>{formatNumber(p.kpis.populationCovered)}</span>
                    </div>
                  </div>
                </div>

                {proposals.length > 2 && (
                  <div className="mt-3 pt-2 border-t border-white/5 flex justify-end">
                    <button
                      onClick={() => setProposals(prev => prev.filter(item => item.id !== p.id))}
                      className="text-[10px] text-slate-500 hover:text-red-400 transition-colors"
                    >
                      Remove Proposal
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* COMPARISON TABLE */}
        <div className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">Evaluation Metric</th>
                {proposals.map((p) => (
                  <th key={p.id} className="pb-3 font-bold text-center">
                    {p.badge}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 font-semibold text-white flex items-center gap-2">
                  <Users size={14} className="text-cyan-400" />
                  <span>Population Covered (8-min reach)</span>
                </td>
                {proposals.map((p) => (
                  <td key={p.id} className={`py-3 text-center ${p.id === bestProposal.id ? 'text-cyan-300 font-bold' : 'text-slate-300'}`} suppressHydrationWarning>
                    {formatNumber(p.kpis.populationCovered)}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 font-semibold text-white flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Emergency Accessibility</span>
                </td>
                {proposals.map((p) => (
                  <td key={p.id} className={`py-3 text-center ${p.id === bestProposal.id ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                    {p.kpis.emergencyAccessibilityPct}%
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 font-semibold text-white flex items-center gap-2">
                  <Clock size={14} className="text-orange-400" />
                  <span>Average Emergency Travel Time</span>
                </td>
                {proposals.map((p) => (
                  <td key={p.id} className={`py-3 text-center ${p.id === bestProposal.id ? 'text-orange-400 font-bold' : 'text-slate-300'}`}>
                    {p.kpis.avgTravelTimeMin} min
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 font-semibold text-white flex items-center gap-2">
                  <BarChart2 size={14} className="text-purple-400" />
                  <span>Hazard Risk Reduction Index</span>
                </td>
                {proposals.map((p) => (
                  <td key={p.id} className={`py-3 text-center ${p.id === bestProposal.id ? 'text-purple-300 font-bold' : 'text-slate-300'}`}>
                    {p.kpis.riskReductionPct}%
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 font-semibold text-white flex items-center gap-2">
                  <Award size={14} className="text-amber-400" />
                  <span>Estimated Capital Expenditure</span>
                </td>
                {proposals.map((p) => (
                  <td key={p.id} className={`py-3 text-center ${p.id === bestProposal.id ? 'text-amber-300 font-bold' : 'text-slate-300'}`}>
                    {p.kpis.estimatedCostInr}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* AI SYNTHESIS PANEL */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-500/10 to-[#0c1322] border border-purple-500/30 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              AI Decision Recommendation
            </h4>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white font-semibold text-sm">
            Recommended: {bestProposal.name}
          </div>

          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Comparing across all {proposals.length} active scenarios in {activeCity.name}, <b>{bestProposal.name}</b> achieves the optimal multi-criteria trade-off. It secures the highest composite civic population reach ({bestProposal.kpis.populationCovered.toLocaleString('en-IN')} citizens) with an emergency accessibility rating of {bestProposal.kpis.emergencyAccessibilityPct}%, while maintaining estimated CapEx at {bestProposal.kpis.estimatedCostInr}.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onAskAI(`Synthesize an executive urban policy comparison for ${activeCity.name} across these ${proposals.length} proposals: ${proposals.map(p => `"${p.name}" (${p.kpis.estimatedCostInr})`).join(', ')}. Which provides the highest ROI for citizen safety and resilience?`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-colors"
            >
              <Sparkles size={13} />
              <span>Ask AI Deep Trade-Off Analysis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
