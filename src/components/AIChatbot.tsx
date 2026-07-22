'use client';
import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Bot, Send, X, Sparkles, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'aida';
  text: string;
  timestamp: string;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'aida',
      text: "👋 Hello! I am **AIDA** (Artificial Intelligence Disaster Assistant). Ask me anything regarding emergency survival protocols, nearest relief shelter guidance, or first aid instructions.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      let aiReply = await api.chatWithAIDA(textToSend, `User selected language: ${language}`);
      const aidaMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'aida',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aidaMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-2 group border-2 border-white/40"
      >
        <Bot className="w-7 h-7 animate-bounce" />
        <span className="font-bold text-sm hidden group-hover:inline-block pr-1">AIDA AI Guidance</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slideUp">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <div>
                <h3 className="font-bold text-sm leading-tight">AIDA Assistant</h3>
                <span className="text-[10px] text-blue-200">Powered by Gemini AI Engine</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-blue-800/80 text-white text-[11px] font-semibold px-2 py-1 rounded-lg border-none cursor-pointer"
              >
                <option value="English">EN</option>
                <option value="Hindi">हिंदी</option>
                <option value="Tamil">தமிழ்</option>
                <option value="Bengali">বাংলা</option>
                <option value="Marathi">मराठी</option>
              </select>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSend("What are the flood survival steps?")}
              className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full whitespace-nowrap text-slate-700 dark:text-slate-200 font-medium hover:border-blue-500"
            >
              🌊 Flood Survival
            </button>
            <button
              onClick={() => handleSend("Where is the nearest relief shelter?")}
              className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full whitespace-nowrap text-slate-700 dark:text-slate-200 font-medium hover:border-blue-500"
            >
              🏠 Nearest Shelter
            </button>
            <button
              onClick={() => handleSend("Emergency national helpline numbers")}
              className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full whitespace-nowrap text-slate-700 dark:text-slate-200 font-medium hover:border-blue-500"
            >
              📞 112 Helplines
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-80 text-xs">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'aida' && (
                  <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] whitespace-pre-wrap leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {m.text}
                  <span className="block mt-1 text-[9px] opacity-70 text-right">{m.timestamp}</span>
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 italic text-xs">
                <Sparkles className="w-4 h-4 animate-spin text-blue-500" /> AIDA is thinking...
              </div>
            )}
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AIDA emergency guidance..."
              className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
