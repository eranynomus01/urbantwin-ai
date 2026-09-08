'use client';

import React from 'react';
import { 
  Building2, 
  Layers, 
  Shield, 
  Sparkles, 
  LayoutGrid, 
  Map as MapIcon 
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'map' | 'inspector' | 'simulator' | 'emergency' | 'ai_advisor' | 'scenarios';
  onSelectTab: (tab: 'map' | 'inspector' | 'simulator' | 'emergency' | 'ai_advisor' | 'scenarios') => void;
  selectedZoneName?: string;
}

export default function MobileBottomNav({
  activeTab,
  onSelectTab,
  selectedZoneName,
}: MobileBottomNavProps) {
  const tabs = [
    { id: 'map', label: 'Map', icon: MapIcon },
    { id: 'inspector', label: 'Sector', icon: Building2 },
    { id: 'simulator', label: 'What-If', icon: Layers },
    { id: 'emergency', label: 'Dispatch', icon: Shield },
    { id: 'ai_advisor', label: 'AI Advisor', icon: Sparkles },
    { id: 'scenarios', label: 'Compare', icon: LayoutGrid },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[1500] bg-[#080d1a]/95 border-t border-white/[0.08] backdrop-blur-2xl px-2 py-1 flex items-center justify-around select-none shadow-2xl safe-area-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id as any)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[48px] ${
              isActive
                ? 'text-sky-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg transition ${isActive ? 'bg-sky-500/15 border border-sky-500/30' : ''}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
