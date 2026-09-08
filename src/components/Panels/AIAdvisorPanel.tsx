'use client';

import React, { useState, useEffect } from 'react';
import { AIAdvisorResponse, Zone, SimulationResult, RealTimeCityTelemetry } from '@/types';
import { Sparkles, Send, Bot, CheckCircle2, AlertTriangle, TrendingUp, Building, Copy, Check, RotateCcw, Flame, Car, CloudRain } from 'lucide-react';

const QUICK_PROMPTS = [
  { icon: Flame, text: 'Where should Gurugram add a new fire station for maximum coverage?' },
  { icon: Car, text: 'What are the impacts of closing NH-48 for 2 hours on commuters?' },
  { icon: CloudRain, text: 'Assess flood vulnerability at Badshahpur drain and Subhash Chowk.' },
  { icon: Sparkles, text: 'How can Gurugram reduce urban heat island in DLF Cyber City?' },
];

interface Props {
  selectedZone: Zone | null;
  activeSimulation: SimulationResult | null;
  currentTelemetry: RealTimeCityTelemetry | null;
  activePrompt?: string | null;
  onClearActivePrompt?: () => void;
}

export default function AIAdvisorPanel({ selectedZone, activeSimulation, currentTelemetry, activePrompt, onClearActivePrompt }: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIAdvisorResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (activePrompt) {
      setQuery(activePrompt);
      sendQuery(activePrompt);
      onClearActivePrompt?.();
    }
  }, [activePrompt]);

  const sendQuery = async (q?: string) => {
    const text = q || query;
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityId: 'gurugram', cityName: 'Gurugram', userQuery: text, selectedZone, activeSimulation, currentTelemetry }),
      });
      if (res.ok) setResponse(await res.json() as AIAdvisorResponse);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(`UrbanTwin AI Memo\n\nQuery: "${response.query}"\n\nSummary:\n${response.aiStrategicAssessment.summary}\n\nRecommendation:\n${response.aiStrategicAssessment.policyRecommendation}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-100 text-sm">AI Advisor</h2>
            <p className="text-[10px] text-slate-400">Grounded Gemini urban planning intelligence</p>
          </div>
        </div>
        {response && (
          <div className="flex items-center gap-1">
            <button onClick={handleCopy} className="btn-ghost p-1.5 rounded-lg">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => setResponse(null)} className="btn-ghost p-1.5 rounded-lg">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Context pills */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/[0.05] border border-white/[0.07] text-slate-400 font-medium">📍 Gurugram</span>
          {selectedZone && <span className="text-[10px] px-2 py-0.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold">{selectedZone.name}</span>}
          {activeSimulation && <span className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold truncate max-w-[150px]">{activeSimulation.scenarioName}</span>}
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">Live Telemetry</span>
        </div>

        {/* Quick prompts */}
        {!response && !loading && (
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Suggested Queries</div>
            <div className="space-y-1.5">
              {QUICK_PROMPTS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <button key={i} onClick={() => { setQuery(p.text); sendQuery(p.text); }}
                    className="w-full metric-card hover:border-sky-500/20 rounded-xl px-4 py-3 text-left text-[12px] text-slate-300 font-medium flex items-start gap-2.5 group transition-all">
                    <Icon className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span className="leading-snug flex-1">{p.text}</span>
                    <span className="text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm shrink-0">→</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="metric-card rounded-2xl p-8 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-sky-500/30 border-t-sky-400 rounded-full animate-spin mx-auto"></div>
            <div>
              <div className="text-sm font-bold text-sky-400">Evaluating Spatial Data…</div>
              <p className="text-[11px] text-slate-400 mt-1">Analysing GIS topology, road network, and telemetry to generate a grounded response.</p>
            </div>
          </div>
        )}

        {/* Response */}
        {response && !loading && (
          <div className="space-y-4 fade-in-up">
            {/* Query */}
            <div className="metric-card rounded-xl p-4">
              <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider mb-1">Query</div>
              <p className="text-sm font-semibold text-slate-100">"{response.query}"</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="badge-live text-[10px]">{response.confidenceRating}</span>
              </div>
            </div>

            {/* Metrics */}
            {response.calculatedGisMetrics?.length > 0 && (
              <div className="metric-card rounded-xl p-4 space-y-2">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-sky-400" /> Calculated Metrics
                </div>
                {response.calculatedGisMetrics.map((m: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0 text-xs">
                    <span className="text-slate-400">{m.metric}</span>
                    <span className="font-bold text-sky-300 font-mono">{m.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Assessment */}
            <div className="metric-card rounded-xl p-4 space-y-3">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-sky-400" /> Strategic Assessment
              </div>
              <p className="text-[12px] text-slate-300 leading-relaxed">{response.aiStrategicAssessment.summary}</p>

              {response.aiStrategicAssessment.prosAndBenefits?.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">Benefits</div>
                  {response.aiStrategicAssessment.prosAndBenefits.map((p: string, i: number) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />{p}
                    </div>
                  ))}
                </div>
              )}

              {response.aiStrategicAssessment.risksAndTradeoffs?.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">Risks</div>
                  {response.aiStrategicAssessment.risksAndTradeoffs.map((r: string, i: number) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />{r}
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3 rounded-xl bg-sky-500/[0.06] border border-sky-500/[0.15] text-[11px] text-sky-200">
                <span className="font-bold block text-sky-400 text-[10px] uppercase mb-1">Policy Recommendation</span>
                {response.aiStrategicAssessment.policyRecommendation}
              </div>
            </div>

            {/* Roadmap */}
            {response.priorityActionItems?.length > 0 && (
              <div className="metric-card rounded-xl p-4 space-y-2.5">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-sky-400" /> Implementation Roadmap
                </div>
                {response.priorityActionItems.map((item: any) => (
                  <div key={item.step} className="metric-card rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-100">Step {item.step}: {item.title}</span>
                      <span className="text-sky-400 font-mono font-bold text-[10px]">{item.timeline}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{item.implementingAgency}</span>
                      <span className="font-bold text-amber-400">{item.estimatedCostRangeInr}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-white/[0.06]">
        <form onSubmit={e => { e.preventDefault(); sendQuery(); }} className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask any urban planning question…"
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition"
          />
          <button type="submit" disabled={!query.trim() || loading}
            className="btn-primary p-2.5 rounded-xl disabled:opacity-40">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
