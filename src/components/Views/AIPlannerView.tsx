'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  City, 
  Zone, 
  SimulationResult, 
  RealTimeCityTelemetry 
} from '@/types';
import { 
  Send, 
  Bot, 
  User,
  Copy, 
  Check, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  Compass,
  Building2,
  Trash2
} from 'lucide-react';

interface AIPlannerViewProps {
  activeCity: City;
  selectedZone: Zone | null;
  activeSimulation: SimulationResult | null;
  telemetry: RealTimeCityTelemetry;
  initialPrompt?: string | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function AIPlannerView({
  activeCity,
  selectedZone,
  activeSimulation,
  telemetry,
  initialPrompt,
}: AIPlannerViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Hello! 👋 I am your **UrbanTwin AI Planning Companion** for **${activeCity.name}, Haryana**.\n\nYou can chat with me normally about anything—from general questions to deep urban planning decisions. Ask me about:\n- City infrastructure and public services\n- Where to build new hospitals or fire stations\n- Flood risks and heat islands in ${activeCity.name}\n- How to run What-If simulations and evaluate tradeoffs\n\nWhat would you like to discuss today?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const CONVERSATION_STARTERS = [
    `Where does ${activeCity.name} need a new fire station?`,
    `How is emergency hospital reach across ${activeCity.name}?`,
    `What are the flood risk zones near the canal?`,
    `What happens if NH-9 is closed for 2 hours?`,
    `How do I use the What-If Simulator?`,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle incoming initial prompt if user navigated via "Ask AI" from another view
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: `Chat reset. I am ready to help you plan and analyze **${activeCity.name}**. What's on your mind?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Add user message to state
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Build conversation history to send to the backend
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome-msg')
        .map((m) => ({
          role: m.sender === 'user' ? ('user' as const) : ('model' as const),
          text: m.text,
        }));

      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: textToSend,
          history: historyPayload,
          cityName: activeCity.name,
          cityId: activeCity.id,
          selectedZone: selectedZone,
          activeSimulation: activeSimulation,
          currentTelemetry: telemetry,
        }),
      });

      if (!res.ok) {
        throw new Error(`AI service responded with status ${res.status}`);
      }

      const data = await res.json();
      const replyContent = data.reply || data.aiStrategicAssessment?.summary || "I've analyzed your question and have updated the spatial recommendation.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `I experienced a temporary network issue. However, based on **${activeCity.name}** spatial data:\n\n- Primary civic facilities are monitored in real time.\n- You can test proposed infrastructure changes directly in the **What-If Simulator**.\n\nPlease try asking again!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Helper to render basic markdown formatting cleanly
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm md:text-base font-bold text-white mt-3 mb-1">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-base md:text-lg font-bold text-white mt-3 mb-1.5">{line.replace('## ', '')}</h2>;
      }
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.substring(2);
        return (
          <div key={idx} className="flex items-start gap-2 my-0.5 pl-1">
            <span className="text-cyan-400 shrink-0">•</span>
            <span className="text-slate-200">{formatInlineBold(content)}</span>
          </div>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+\.)\s(.*)/);
        if (match) {
          return (
            <div key={idx} className="flex items-start gap-2 my-1 pl-1">
              <span className="text-cyan-400 font-bold shrink-0 font-mono text-xs">{match[1]}</span>
              <span className="text-slate-200">{formatInlineBold(match[2])}</span>
            </div>
          );
        }
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      // Regular paragraph
      return (
        <p key={idx} className="text-slate-200 leading-relaxed my-0.5">
          {formatInlineBold(line)}
        </p>
      );
    });
  };

  // Helper to render bold markdown (**text**)
  const formatInlineBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="text-slate-300 italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#070b16] h-[calc(100vh-3.5rem)] overflow-hidden">
      
      {/* 1. CHAT HEADER BAR */}
      <div className="px-4 py-3 md:px-8 border-b border-white/[0.08] bg-[#090f20]/90 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">UrbanTwin AI Chatbot</h2>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Conversational
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Grounded on {activeCity.name}, Haryana spatial database & simulation metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-400 hover:text-white border border-white/10 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Reset Chat</span>
          </button>
        </div>
      </div>

      {/* 2. CHAT SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Suggested Prompts Chips (Shown when few messages) */}
          {messages.length <= 2 && (
            <div className="space-y-2 pb-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <Sparkles size={12} className="text-cyan-400" />
                <span>Suggested Conversation Starters:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CONVERSATION_STARTERS.map((starter, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(starter)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/30 text-xs text-slate-300 hover:text-white transition-all text-left flex items-center gap-1.5 group"
                  >
                    <span>{starter}</span>
                    <ArrowRight size={11} className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Stream */}
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-cyan-500/20 mt-1">
                    <Bot size={15} />
                  </div>
                )}

                <div className={`relative group max-w-2xl rounded-2xl p-4 text-xs md:text-sm ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/10 rounded-br-none'
                    : 'bg-[#0c1424] border border-white/[0.08] text-slate-200 shadow-xl rounded-bl-none'
                }`}>
                  {/* Content */}
                  <div>
                    {renderFormattedText(msg.text)}
                  </div>

                  {/* Message Footer: Timestamp + Copy */}
                  <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-slate-400 hover:text-white"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check size={11} className="text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                    <User size={15} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-cyan-600/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot size={15} />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-white/10 text-xs text-cyan-300 flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <span>Thinking and analyzing {activeCity.name} spatial data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. CHAT INPUT DOCK */}
      <div className="p-3 md:p-4 border-t border-white/[0.08] bg-[#070c18] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="max-w-3xl mx-auto flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={`Talk to AI Planner about ${activeCity.name}... (e.g., "Where should we build a new hospital?")`}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 shadow-inner transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-40 transition-all active:scale-95 shrink-0"
          >
            <Send size={14} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
