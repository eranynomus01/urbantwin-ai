'use client';

import React, { useState } from 'react';
import { City, ScenarioItem } from '@/types';
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
  const proposalA: Proposal = {
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
  };

  const proposalB: Proposal = {
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
  };

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
                {activeCity.name} Infrastructure Evaluation
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              Compare Competing Urban Proposals
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Evaluate tradeoffs side-by-side with objective spatial GIS metrics and an AI-synthesized policy recommendation.
            </p>
          </div>
        </div>

        {/* PROPOSAL CARDS SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* PROPOSAL A */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-slate-300">
                  {proposalA.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">{proposalA.kpis.estimatedCostInr}</span>
              </div>
              <h3 className="text-base font-bold text-white">{proposalA.name}</h3>

              <div className="mt-4 p-3 rounded-xl bg-black/30 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">🏥 Hospital Node:</span>
                  <span className="font-semibold text-white">{proposalA.hospitalLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">🚒 Fire Station Node:</span>
                  <span className="font-semibold text-white">{proposalA.fireStationLocation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PROPOSAL B (WINNER) */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-500/15 via-purple-600/5 to-[#0b1220] border border-purple-500/40 shadow-xl shadow-purple-500/10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-purple-500 text-white text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-bl-lg">
              Optimal Choice
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 border border-purple-500/40">
                  {proposalB.badge}
                </span>
                <span className="text-xs font-mono text-purple-300 font-bold">{proposalB.kpis.estimatedCostInr}</span>
              </div>
              <h3 className="text-base font-bold text-white">{proposalB.name}</h3>

              <div className="mt-4 p-3 rounded-xl bg-black/40 border border-purple-500/20 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">🏥 Hospital Node:</span>
                  <span className="font-semibold text-white">{proposalB.hospitalLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">🚒 Fire Station Node:</span>
                  <span className="font-semibold text-white">{proposalB.fireStationLocation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <div className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">Evaluation Metric</th>
                <th className="pb-3 font-bold">Proposal A</th>
                <th className="pb-3 font-bold">Proposal B</th>
                <th className="pb-3 font-bold text-right">Winning Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 font-semibold text-white flex items-center gap-2">
                  <Users size={14} className="text-cyan-400" />
                  <span>Population Covered (8-min reach)</span>
                </td>
                <td className="py-3 text-slate-300">{proposalA.kpis.populationCovered.toLocaleString()}</td>
                <td className="py-3 text-white font-bold">{proposalB.kpis.populationCovered.toLocaleString()}</td>
                <td className="py-3 text-right text-emerald-400 font-bold font-mono">
                  +15,700 (+32.3%) ★
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 font-semibold text-white flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Emergency Accessibility</span>
                </td>
                <td className="py-3 text-slate-300">{proposalA.kpis.emergencyAccessibilityPct}%</td>
                <td className="py-3 text-white font-bold">{proposalB.kpis.emergencyAccessibilityPct}%</td>
                <td className="py-3 text-right text-emerald-400 font-bold font-mono">
                  +10.8% ★
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 font-semibold text-white flex items-center gap-2">
                  <Clock size={14} className="text-orange-400" />
                  <span>Average Emergency Travel Time</span>
                </td>
                <td className="py-3 text-slate-300">{proposalA.kpis.avgTravelTimeMin} min</td>
                <td className="py-3 text-white font-bold">{proposalB.kpis.avgTravelTimeMin} min</td>
                <td className="py-3 text-right text-emerald-400 font-bold font-mono">
                  -1.8 min (-25%) ★
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 font-semibold text-white flex items-center gap-2">
                  <BarChart2 size={14} className="text-purple-400" />
                  <span>Hazard Risk Reduction Index</span>
                </td>
                <td className="py-3 text-slate-300">{proposalA.kpis.riskReductionPct}%</td>
                <td className="py-3 text-white font-bold">{proposalB.kpis.riskReductionPct}%</td>
                <td className="py-3 text-right text-emerald-400 font-bold font-mono">
                  +22.5% ★
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 font-semibold text-white flex items-center gap-2">
                  <Award size={14} className="text-amber-400" />
                  <span>Estimated Capital Expenditure</span>
                </td>
                <td className="py-3 text-slate-300">{proposalA.kpis.estimatedCostInr}</td>
                <td className="py-3 text-emerald-400 font-bold">{proposalB.kpis.estimatedCostInr}</td>
                <td className="py-3 text-right text-emerald-400 font-bold font-mono">
                  -₹ 4.5 Cr Saved ★
                </td>
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
            Recommended: Proposal B (Decentralized Industrial & Sub-Arterial)
          </div>

          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Proposal B delivers significantly superior coverage because it locates emergency fire tenders adjacent to high-risk industrial chemical assets while establishing tertiary hospital capacity in the rapidly expanding Urban Estate residential sector. It protects 15,700 more residents while lowering capital cost by ₹4.5 Crore.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onAskAI(`Compare Proposal A and Proposal B in detail for ${activeCity.name}. What are the primary budgetary, zoning, and political trade-offs between them?`)}
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
