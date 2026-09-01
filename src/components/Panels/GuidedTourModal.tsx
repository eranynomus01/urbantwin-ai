'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Sliders, 
  ShieldAlert, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Building2 
} from 'lucide-react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStepAction: (step: number) => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Explore Real Gurugram GIS Digital Twin',
    subtitle: 'Authentic OpenStreetMap & PostGIS Infrastructure',
    icon: Building2,
    badge: 'Real Data Datum',
    description: 'The map represents real municipal boundaries, sectors 1–115, DLF Cyber City, real hospitals (Medanta, Fortis, Artemis), fire stations, and arterial corridors (NH-48, Golf Course Rd).',
    actionLabel: 'Inspect Cyber City Sector',
    tips: ['Click on any sector polygon to view demographic density and civic infrastructure counts.']
  },
  {
    step: 2,
    title: 'Toggle Environmental & Risk Layers',
    subtitle: 'Live Open-Meteo & CPCB NAQI Integration',
    icon: Layers,
    badge: 'Live Telemetry',
    description: 'Activate real-time weather, air quality heatmap, Badshahpur flood drainage basins, Urban Heat Island (UHI) hotspots, and emergency response isochrones.',
    actionLabel: 'Turn On Flood & Heat Layers',
    tips: ['Every card clearly shows data provider, license, and Last Updated (IST) timestamps.']
  },
  {
    step: 3,
    title: 'Run What-If Decision Simulations',
    subtitle: 'Simulate Road Closures & New Emergency Stations',
    icon: Sliders,
    badge: 'Numerical GIS Engine',
    description: 'Test hypothetical planning decisions against the real city. Simulate closing NH-48 for 2 hours (computing traffic redistribution and OSRM detour bypasses) or placing a new Fire Station in Sector 65.',
    actionLabel: 'Open Simulation Studio',
    tips: ['Calculations derive from PostGIS network traversal and GIS equilibrium models, not fake numbers.']
  },
  {
    step: 4,
    title: 'Point-and-Click Emergency Dispatch',
    subtitle: 'Live OSRM Road Graph Emergency Routing',
    icon: ShieldAlert,
    badge: 'OSRM Open Routing',
    description: 'Click anywhere on the Gurugram map to trigger an emergency incident (Fire, Trauma, Flash Flood). The system identifies the nearest fire station, trauma ICU, and fastest road route with travel time.',
    actionLabel: 'Open Emergency Dispatcher',
    tips: ['Uses real road network geometry and estimates population at risk within 500m.']
  },
  {
    step: 5,
    title: 'Grounded AI Urban Planner (Gemini)',
    subtitle: 'Strategic Decision Briefing & Executive Reporting',
    icon: Sparkles,
    badge: 'Grounded Intelligence',
    description: 'Google Gemini receives calculated spatial metrics, active telemetry, and simulation deltas to formulate structured planning memos with actionable implementation steps and cost estimates.',
    actionLabel: 'Ask AI Urban Planner',
    tips: ['Compare Baseline vs Candidate Scenarios and export printable PDF briefing reports in 1 click.']
  }
];

export default function GuidedTourModal({
  isOpen,
  onClose,
  onSelectStepAction,
}: GuidedTourModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleExecuteAction = () => {
    onSelectStepAction(currentStep.step);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-100">UrbanTwin AI Platform Tour</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Step {currentStep.step} of 5
                </span>
              </div>
              <p className="text-xs text-slate-400">
                A quick 60-second walkthrough on how to navigate, simulate, and generate AI insights.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800 text-xs"
          >
            ✕ Skip Tour
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 h-1.5 bg-slate-800">
          {TOUR_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className={`h-full transition-all duration-300 ${
                idx <= currentStepIndex ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-950 to-slate-800 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
              <Icon className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                {currentStep.badge}
              </span>
              <h4 className="font-extrabold text-lg text-slate-100">{currentStep.title}</h4>
              <p className="text-xs text-slate-400 font-medium">{currentStep.subtitle}</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
            {currentStep.description}
          </p>

          <div className="space-y-1.5">
            {currentStep.tips.map((tip, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-cyan-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-300 transition"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 transition"
            >
              {currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step →'}
            </button>
          </div>

          <button
            onClick={handleExecuteAction}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition"
          >
            <span>{currentStep.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
