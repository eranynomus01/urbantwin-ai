'use client';

import React from 'react';
import { 
  Building2, 
  Layers, 
  Shield, 
  Activity, 
  Globe, 
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
    { id: 'map', label: 'GIS Map', icon: MapIcon },
    { id: 'inspector', label: 'Sector', icon: Building2 },
    { id: 'simulator', label: 'What-If', icon: Layers },
    { id: 'emergency', label: 'Dispatch', icon: Shield },
    { id: 'ai_advisor', label: 'AI Planner', icon: Activity },
    { id: 'scenarios', label: 'Deck', icon: Globe },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[1500] bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl px-1 py-1 flex items-center justify-around select-none shadow-2xl safe-area-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id as any)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 min-w-[50px] ${
              isActive
                ? 'text-cyan-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-cyan-950 border border-cyan-800/80 shadow-md shadow-cyan-950/50' : ''}`}>
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
