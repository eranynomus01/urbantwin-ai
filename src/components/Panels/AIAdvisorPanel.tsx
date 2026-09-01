'use client';

import React, { useState } from 'react';
import { 
  AIAdvisorResponse, 
  Zone, 
  SimulationResult, 
  RealTimeCityTelemetry 
} from '@/types';
import { 
  Sparkles, 
  Send, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Building,
  RotateCcw,
  Copy,
  Check,
  Flame,
  CloudRain,
  Car
} from 'lucide-react';

interface AIAdvisorPanelProps {
  selectedZone: Zone | null;
  activeSimulation: SimulationResult | null;
  currentTelemetry: RealTimeCityTelemetry | null;
  activePrompt?: string | null;
  onClearActivePrompt?: () => void;
}

const QUICK_PROMPTS = [
  { icon: Flame, text: 'Where should we consider adding a new fire station in Gurugram?' },
  { icon: Car, text: 'How will closing NH-48 for 2 hours impact traffic and emergency response?' },
  { icon: CloudRain, text: 'Assess flood vulnerability along Badshahpur drain basin and underpasses.' },
  { icon: Sparkles, text: 'What interventions will mitigate extreme heat island in Cyber City?' },
];

export default function AIAdvisorPanel({
  selectedZone,
  activeSimulation,
  currentTelemetry,
  activePrompt,
  onClearActivePrompt,
}: AIAdvisorPanelProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adviceResponse, setAdviceResponse] = useState<AIAdvisorResponse | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  React.useEffect(() => {
    if (activePrompt) {
      setQuery(activePrompt);
      handleSendQuery(activePrompt);
      if (onClearActivePrompt) onClearActivePrompt();
    }
  }, [activePrompt]);

  const handleSendQuery = async (customQuery?: string) => {
    const textToSend = customQuery || query;
    if (!textToSend.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId: 'gurugram',
          cityName: 'Gurugram',
          userQuery: textToSend,
          selectedZone,
          activeSimulation,
          currentTelemetry,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as AIAdvisorResponse;
        setAdviceResponse(data);
      }
    } catch (err) {
      console.error('Failed to get AI advisor response:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!adviceResponse) return;
    const memo = `
URBANTWIN AI — STRATEGIC URBAN PLANNING MEMORANDUM
Evaluated Query: "${adviceResponse.query}"
Confidence: ${adviceResponse.confidenceRating}

CALCULATED GIS METRICS:
${adviceResponse.calculatedGisMetrics.map(m => `• ${m.metric}: ${m.value} (${m.sourceMethod})`).join('\n')}

STRATEGIC ASSESSMENT:
${adviceResponse.aiStrategicAssessment.summary}

PROS & BENEFITS:
${adviceResponse.aiStrategicAssessment.prosAndBenefits.map(p => `• ${p}`).join('\n')}

RISKS & TRADEOFFS:
${adviceResponse.aiStrategicAssessment.risksAndTradeoffs.map(r => `• ${r}`).join('\n')}

POLICY RECOMMENDATION:
${adviceResponse.aiStrategicAssessment.policyRecommendation}

IMPLEMENTATION ROADMAP:
${adviceResponse.priorityActionItems.map(item => `Step ${item.step}: ${item.title} | Timeline: ${item.timeline} | Budget: ${item.estimatedCostRangeInr} | Agency: ${item.implementingAgency}`).join('\n')}
    `;
    navigator.clipboard.writeText(memo);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 text-xs text-slate-200 overflow-y-auto custom-scrollbar">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100">UrbanTwin AI Advisor</h3>
              <p className="text-[10px] text-slate-400">Grounded Gemini Decision Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {adviceResponse && (
              <>
                <button
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg transition"
                  title="Copy formatted planning memo"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setAdviceResponse(null)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg transition"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </>
            )}
          </div>
        </div>

        {/* Grounding Context Indicator */}
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5 shadow-md">
          <div className="font-bold text-cyan-400 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Active Spatial Grounding Datum
          </div>
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium">
              City: Gurugram
            </span>
            {selectedZone && (
              <span className="px-2 py-0.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                Zone: {selectedZone.name}
              </span>
            )}
            {activeSimulation && (
              <span className="px-2 py-0.5 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                Sim: {activeSimulation.scenarioName}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              Telemetry: Live Feeds
            </span>
          </div>
        </div>

        {/* Recommended Planning Prompts */}
        {!adviceResponse && (
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-slate-400">
              Recommended Decision Inquiries
            </label>
            <div className="space-y-1.5">
              {QUICK_PROMPTS.map((promptItem, idx) => {
                const Icon = promptItem.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(promptItem.text);
                      handleSendQuery(promptItem.text);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-cyan-500/40 transition text-[11px] flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="leading-snug text-slate-200 font-medium">{promptItem.text}</span>
                    </div>
                    <span className="text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition shrink-0 ml-2">
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 text-center space-y-3 animate-pulse shadow-xl">
            <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-xs text-cyan-300 font-bold">
              Evaluating PostGIS Spatial Topology & Route Graphs...
            </div>
            <p className="text-[11px] text-slate-400">
              Formulating grounded memorandum with zero hallucinations.
            </p>
          </div>
        )}

        {/* GROUNDED MEMORANDUM */}
        {adviceResponse && !isLoading && (
          <div className="space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Query & Confidence */}
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-start justify-between gap-2 shadow-lg">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-cyan-400 block">Evaluated Query</span>
                <p className="font-bold text-slate-100 text-xs mt-0.5">"{adviceResponse.query}"</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                {adviceResponse.confidenceRating}
              </span>
            </div>

            {/* 1. CALCULATED METRICS */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-3.5 space-y-2 shadow-lg">
              <span className="font-extrabold text-xs text-cyan-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Calculated Spatial Metrics
              </span>
              <div className="space-y-1.5">
                {adviceResponse.calculatedGisMetrics.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 text-[11px] border border-slate-800/80">
                    <span className="text-slate-300 font-medium">{m.metric}:</span>
                    <span className="font-bold text-cyan-300 font-mono text-right">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. STRATEGIC ASSESSMENT */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3 shadow-lg">
              <span className="font-extrabold text-xs text-slate-100 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-cyan-400" /> Strategic Assessment
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {adviceResponse.aiStrategicAssessment.summary}
              </p>

              {/* Pros & Tradeoffs */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-extrabold uppercase text-emerald-400">Pros & Benefits</div>
                {adviceResponse.aiStrategicAssessment.prosAndBenefits.map((pro, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-extrabold uppercase text-amber-400">Risks & Tradeoffs</div>
                {adviceResponse.aiStrategicAssessment.risksAndTradeoffs.map((risk, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{risk}</span>
                  </div>
                ))}
              </div>

              {/* Policy Recommendation */}
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-[11px] text-cyan-200 mt-2">
                <span className="font-extrabold block text-cyan-400 text-[10px] uppercase mb-1">
                  Policy Recommendation:
                </span>
                {adviceResponse.aiStrategicAssessment.policyRecommendation}
              </div>
            </div>

            {/* 3. IMPLEMENTATION ROADMAP */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-2.5 shadow-lg">
              <span className="font-extrabold text-xs text-slate-100 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-cyan-400" /> Implementation Roadmap
              </span>
              <div className="space-y-2">
                {adviceResponse.priorityActionItems.map((item) => (
                  <div key={item.step} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1">
                    <div className="font-bold text-slate-100 flex items-center justify-between">
                      <span>Step {item.step}: {item.title}</span>
                      <span className="text-[10px] text-cyan-400 font-mono font-bold">{item.timeline}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>Agency: <b className="text-slate-300">{item.implementingAgency}</b></span>
                      <span className="font-bold text-amber-300">{item.estimatedCostRangeInr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Query Input Bar */}
      <div className="pt-3 border-t border-slate-800 mt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask planning query (e.g. fire coverage, flood mitigation)..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white p-2.5 rounded-xl transition disabled:opacity-50 shadow-md shadow-cyan-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
