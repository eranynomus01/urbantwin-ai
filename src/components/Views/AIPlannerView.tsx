'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  City, 
  Zone, 
  SimulationResult, 
  RealTimeCityTelemetry, 
  AIAdvisorResponse, 
  AIAdvisorQueryPayload 
} from '@/types';
import { 
  Sparkles, 
  Send, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Building, 
  Copy, 
  Check, 
  RotateCcw,
  Flame,
  ArrowRight,
  ShieldAlert,
  Zap,
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';

interface AIPlannerViewProps {
  activeCity: City;
  selectedZone: Zone | null;
  activeSimulation: SimulationResult | null;
  telemetry: RealTimeCityTelemetry;
  initialPrompt?: string | null;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  response?: AIAdvisorResponse;
  timestamp: string;
}

export default function AIPlannerView({
  activeCity,
  selectedZone,
  activeSimulation,
  telemetry,
  initialPrompt,
}: AIPlannerViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Welcome to the UrbanTwin AI Strategic Planning Desk for ${activeCity.name}, Haryana. I am grounded directly in real spatial GIS data, live CPCB air quality and weather telemetry, and OSRM routing calculations. How can I assist your urban planning or emergency preparedness decisions today?`,
      timestamp: 'Just now',
    },
  ]);

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUICK_QUESTIONS = [
    `Where should ${activeCity.name} locate a new fire station for maximum coverage?`,
    `What happens if NH-9 or major transit arterial is closed for 2 hours?`,
    `Where should we build a new tertiary hospital in ${activeCity.name}?`,
    `Which sectors have emergency response latency exceeding 10 minutes?`,
    `What cool-roof policies are recommended to counter summer urban heat island?`,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const payload: AIAdvisorQueryPayload = {
        cityId: activeCity.id,
        cityName: activeCity.name,
        userQuery: textToSend,
        selectedZone: selectedZone,
        activeSimulation: activeSimulation,
        currentTelemetry: telemetry,
      };

      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`AI service responded with status ${res.status}`);
      }

      const adviceData: AIAdvisorResponse = await res.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        response: adviceData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI query error:', err);
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Error processing spatial query: ${err?.message || 'Network timeout'}. Please verify your Gemini API key in Vercel settings or try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#070b16] h-[calc(100vh-3.5rem)] overflow-hidden">
      
      {/* 1. TOP HEADER BANNER */}
      <div className="px-4 py-3 md:px-8 border-b border-white/[0.08] bg-[#090f20]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
              AI Urban Planning Co-Pilot
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {activeCity.name} Grounded
            </span>
          </div>
          <h2 className="text-sm md:text-base font-bold text-white mt-0.5">
            Generative Spatial Policy & Decision Support
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Gemini Pro Grounded on Spatial DB</span>
        </div>
      </div>

      {/* 2. CHAT SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Quick Prompts Carousel */}
          {messages.length <= 2 && (
            <div className="space-y-2 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Suggested Urban Planning Inquiries:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-sky-500/30 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span>{q}</span>
                    <ArrowRight size={12} className="text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-sky-500/20">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-3xl rounded-2xl p-4 md:p-5 text-xs md:text-sm ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-500/10'
                    : 'bg-[#0c1424] border border-white/[0.08] text-slate-200 shadow-xl'
                }`}
              >
                {/* Standard Text */}
                {m.text && (
                  <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                )}

                {/* Grounded AI Advisor Response Cards */}
                {m.response && (
                  <div className="space-y-4">
                    
                    {/* Header badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">Strategic Assessment</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/20 text-sky-300">
                          {m.response.confidenceRating}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {m.response.groundedDataSummary.city} · {m.response.groundedDataSummary.populationEvaluated.toLocaleString()} pop evaluated
                      </span>
                    </div>

                    {/* Calculated GIS Metrics */}
                    {m.response.calculatedGisMetrics && m.response.calculatedGisMetrics.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {m.response.calculatedGisMetrics.map((met, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                            <span className="text-[10px] text-slate-400 block uppercase">{met.metric}</span>
                            <span className="text-sm font-bold text-sky-300">{met.value}</span>
                            <span className="text-[9px] text-slate-500 block mt-0.5">{met.sourceMethod}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Strategic Summary */}
                    <div className="space-y-2">
                      <p className="text-slate-200 leading-relaxed font-normal">
                        {m.response.aiStrategicAssessment.summary}
                      </p>
                    </div>

                    {/* Pros & Risks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 space-y-1">
                        <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>Key Advantages</span>
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {m.response.aiStrategicAssessment.prosAndBenefits.map((pro, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-emerald-400">•</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 space-y-1">
                        <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                          <AlertTriangle size={13} />
                          <span>Risks & Constraints</span>
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {m.response.aiStrategicAssessment.risksAndTradeoffs.map((risk, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-amber-400">•</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Policy Recommendation */}
                    <div className="p-3 rounded-xl bg-sky-500/[0.08] border border-sky-500/30 space-y-1">
                      <span className="text-sky-300 font-bold text-xs uppercase tracking-wider block">
                        Official Policy Recommendation:
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {m.response.aiStrategicAssessment.policyRecommendation}
                      </p>
                    </div>

                    {/* Priority Action Roadmap */}
                    {m.response.priorityActionItems && m.response.priorityActionItems.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Implementation Action Roadmap:
                        </span>
                        <div className="space-y-1.5">
                          {m.response.priorityActionItems.map((step) => (
                            <div
                              key={step.step}
                              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[11px]">
                                  {step.step}
                                </span>
                                <div>
                                  <span className="font-semibold text-white">{step.title}</span>
                                  <span className="text-[10px] text-slate-400 block">{step.implementingAgency}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-mono text-cyan-300 font-semibold">{step.estimatedCostRangeInr}</span>
                                <span className="text-[10px] text-slate-500 block">{step.timeline}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-2 text-[10px] text-slate-500 text-right">
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-sky-600/30 flex items-center justify-center text-sky-400 shrink-0">
                <Bot size={16} />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-white/10 text-xs text-sky-300 flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
                <span>Grounded spatial evaluation in progress across {activeCity.name} GIS layer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. BOTTOM INPUT BAR */}
      <div className="p-3 md:p-5 border-t border-white/[0.08] bg-[#070c18] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(query);
          }}
          className="max-w-4xl mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Ask AI Urban Planner about ${activeCity.name} infrastructure, emergency coverage, zoning...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 shadow-inner"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-40 transition-all active:scale-95"
          >
            <Send size={14} />
            <span className="hidden sm:inline">Inquire</span>
          </button>
        </form>
      </div>
    </div>
  );
}
