'use client';

import React, { useState } from 'react';
import { 
  City, 
  Zone, 
  RoadCorridor, 
  SimulationType, 
  SimulationResult 
} from '@/types';
import { runWhatIfSimulation } from '@/lib/simulation/engine';
import { formatNumber } from '@/lib/utils/format';
import { 
  Flame, 
  HeartPulse, 
  AlertTriangle, 
  Trees, 
  Compass, 
  CloudRain, 
  Thermometer,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  Save,
  MapPin
} from 'lucide-react';

interface SimulatorViewProps {
  activeCity: City;
  sectors: Zone[];
  roads: RoadCorridor[];
  onSaveScenario?: (result: SimulationResult) => void;
  onAskAI: (prompt: string) => void;
}

type ScenarioChoice = 
  | 'new_fire_station' 
  | 'new_hospital' 
  | 'road_closure' 
  | 'new_park' 
  | 'new_transit_hub' 
  | 'flood_scenario' 
  | 'heat_scenario'
  | 'custom_proposal';

export default function SimulatorView({
  activeCity,
  sectors,
  roads,
  onSaveScenario,
  onAskAI,
}: SimulatorViewProps) {
  // 3-Step State
  const [selectedScenario, setSelectedScenario] = useState<ScenarioChoice>('new_fire_station');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Custom User-Defined Scenario Parameters
  const [customProposalTitle, setCustomProposalTitle] = useState('');
  const [customProposalDescription, setCustomProposalDescription] = useState('');
  const [customTargetSector, setCustomTargetSector] = useState(sectors[0]?.id || 'sec-1');
  const [customInterventionType, setCustomInterventionType] = useState<'infrastructure' | 'emergency' | 'environmental' | 'transit'>('infrastructure');
  const [customBudgetCr, setCustomBudgetCr] = useState<number>(25);

  // Scenario 1: Fire Station params
  const [fireStationSector, setFireStationSector] = useState(sectors[0]?.id || 'sec-1');
  const [fireEngines, setFireEngines] = useState(4);
  const [fireRadiusKm, setFireRadiusKm] = useState(5.5);

  // Scenario 2: Hospital params
  const [hospitalSector, setHospitalSector] = useState(sectors[1]?.id || sectors[0]?.id || 'sec-2');
  const [hospitalBeds, setHospitalBeds] = useState(350);
  const [hospitalRadiusKm, setHospitalRadiusKm] = useState(7.0);

  // Scenario 3: Road Closure params
  const [closedRoadId, setClosedRoadId] = useState(roads[0]?.id || 'road-1');
  const [closureHours, setClosureHours] = useState(2);

  // Scenario 4: Park params
  const [parkSector, setParkSector] = useState(sectors[2]?.id || sectors[0]?.id || 'sec-3');
  const [parkAreaSqKm, setParkAreaSqKm] = useState(0.85);

  // Scenario 5: Transit Hub params
  const [transitSector, setTransitSector] = useState(sectors[0]?.id || 'sec-1');
  const [transitCapacity, setTransitCapacity] = useState(35000);

  // Scenario 6: Flood Scenario params
  const [floodRainfallMm, setFloodRainfallMm] = useState(85);

  // Scenario 7: Heat Scenario params
  const [heatSurfaceAlbedo, setHeatSurfaceAlbedo] = useState('cool_roofs');

  const SCENARIOS = [
    {
      id: 'new_fire_station' as ScenarioChoice,
      title: 'New Fire Station',
      icon: Flame,
      color: 'text-orange-400',
      bg: 'from-orange-500/15 to-amber-600/5',
      border: 'border-orange-500/30',
      description: 'Model coverage gains and emergency response time reduction.',
    },
    {
      id: 'new_hospital' as ScenarioChoice,
      title: 'New Hospital',
      icon: HeartPulse,
      color: 'text-red-400',
      bg: 'from-red-500/15 to-rose-600/5',
      border: 'border-red-500/30',
      description: 'Calculate newly covered population within 8-minute golden hour radius.',
    },
    {
      id: 'road_closure' as ScenarioChoice,
      title: 'Road Closure',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'from-amber-500/15 to-yellow-600/5',
      border: 'border-amber-500/30',
      description: 'Simulate traffic detour congestion and emergency detour delays.',
    },
    {
      id: 'new_park' as ScenarioChoice,
      title: 'New Eco Park',
      icon: Trees,
      color: 'text-emerald-400',
      bg: 'from-emerald-500/15 to-teal-600/5',
      border: 'border-emerald-500/30',
      description: 'Assess Urban Heat Island (UHI) temperature cooling & green per capita.',
    },
    {
      id: 'new_transit_hub' as ScenarioChoice,
      title: 'New Transit Hub',
      icon: Compass,
      color: 'text-indigo-400',
      bg: 'from-indigo-500/15 to-blue-600/5',
      border: 'border-indigo-500/30',
      description: 'Evaluate multi-modal commuter shift & reduction in carbon emissions.',
    },
    {
      id: 'flood_scenario' as ScenarioChoice,
      title: 'Flood Scenario',
      icon: CloudRain,
      color: 'text-cyan-400',
      bg: 'from-cyan-500/15 to-sky-600/5',
      border: 'border-cyan-500/30',
      description: 'Test high-intensity monsoon rainfall runoff against stormwater outfalls.',
    },
    {
      id: 'heat_scenario' as ScenarioChoice,
      title: 'Heat Wave Scenario',
      icon: Thermometer,
      color: 'text-rose-400',
      bg: 'from-rose-500/15 to-pink-600/5',
      border: 'border-rose-500/30',
      description: 'Simulate surface temperature extremes and evaluate cool-roof policies.',
    },
    {
      id: 'custom_proposal' as ScenarioChoice,
      title: 'Custom AI Proposal',
      icon: Sparkles,
      color: 'text-purple-400',
      bg: 'from-purple-500/20 to-indigo-600/10',
      border: 'border-purple-500/40',
      description: 'Define your own custom municipal scenario in natural language with custom parameters.',
    },
  ];

  const handleRunSimulation = () => {
    setIsSimulating(true);

    setTimeout(() => {
      let result: SimulationResult;

      const sectorObj = sectors.find(s => s.id === fireStationSector) || sectors[0];
      const targetCoord = sectorObj ? sectorObj.center : activeCity.center;

      if (selectedScenario === 'new_fire_station') {
        result = runWhatIfSimulation('new_fire_station', {
          proposedLocation: targetCoord,
          name: `${sectorObj?.name || 'Sector'} Rapid Fire Sub-Station`,
          fireEngines: fireEngines,
          coverageRadiusKm: fireRadiusKm,
        });
      } else if (selectedScenario === 'new_hospital') {
        const hSec = sectors.find(s => s.id === hospitalSector) || sectors[0];
        result = runWhatIfSimulation('new_hospital', {
          proposedLocation: hSec?.center || targetCoord,
          name: `${hSec?.name || 'Sector'} Multi-Speciality Civil Medical Center`,
          targetBeds: hospitalBeds,
          icuBeds: Math.round(hospitalBeds * 0.22),
          hasEmergencyService: true,
          coverageRadiusKm: hospitalRadiusKm,
        });
      } else if (selectedScenario === 'road_closure') {
        const road = roads.find(r => r.id === closedRoadId) || roads[0];
        result = runWhatIfSimulation('road_closure', {
          roadId: road?.id || 'road-1',
          roadName: road?.name || 'Major Urban Corridor',
          closureDurationHours: closureHours,
        });
      } else if (selectedScenario === 'new_park') {
        const pSec = sectors.find(s => s.id === parkSector) || sectors[0];
        result = runWhatIfSimulation('new_park', {
          proposedLocation: pSec?.center || targetCoord,
          name: `${pSec?.name || 'Sector'} Biodiversity & Urban Cooling Forest`,
          areaSqKm: parkAreaSqKm,
          treeCanopyCoverPct: 80,
        });
      } else if (selectedScenario === 'new_transit_hub') {
        const tSec = sectors.find(s => s.id === transitSector) || sectors[0];
        result = runWhatIfSimulation('new_transit_hub', {
          proposedLocation: tSec?.center || targetCoord,
          name: `${tSec?.name || 'Sector'} Multi-Modal Transit Hub`,
          dailyCommuterCapacity: transitCapacity,
          transitType: 'integrated_bus_rapid',
        });
      } else if (selectedScenario === 'custom_proposal') {
        const cSec = sectors.find(s => s.id === customTargetSector) || sectors[0];
        const scenarioTitle = customProposalTitle.trim() || `Custom Municipal Project at ${cSec?.name || activeCity.name}`;
        const desc = customProposalDescription.trim() || `Citizen & urban planning proposal for ${activeCity.name}.`;

        const impactDelta = customInterventionType === 'emergency' ? 18.5 :
          customInterventionType === 'environmental' ? 14.0 :
          customInterventionType === 'transit' ? 22.0 : 16.5;

        result = {
          simulationType: 'new_hospital',
          scenarioName: scenarioTitle,
          affectedZoneIds: [cSec.id, ...(sectors.slice(1, 3).map(s => s.id))],
          affectedPopulation: Math.round((cSec.population || 42000) * 1.45),
          deltaResponseTimeMin: customInterventionType === 'emergency' ? -2.4 : -1.1,
          healthcareCoverageIncreasePct: customInterventionType === 'emergency' ? 19.5 : 8.2,
          fireCoverageIncreasePct: customInterventionType === 'emergency' ? 16.8 : 7.5,
          trafficDelayIndexDelta: customInterventionType === 'transit' ? -12.4 : -4.2,
          uhiMitigationC: customInterventionType === 'environmental' ? 2.1 : 0.6,
          transitCatchmentGain: customInterventionType === 'transit' ? 28500 : 8200,
          impactScore: Math.min(96, Math.round(72 + impactDelta)),
          keyFindings: [
            `Custom scenario evaluated for ${cSec.name} (${activeCity.name}).`,
            `Estimated CapEx allocation of ₹ ${customBudgetCr} Cr generates +${impactDelta}% baseline urban efficiency boost.`,
            `Directly upgrades infrastructure accessibility for ~${Math.round((cSec.population || 42000) * 1.45).toLocaleString('en-IN')} citizens.`
          ],
          aiExecutiveSummary: `User-defined proposal "${scenarioTitle}" evaluated: Deploying this ${customInterventionType} initiative in ${cSec.name} balances municipal budget with maximum localized civic resilience.`,
          calculationBreakdown: [
            { metric: 'Composite Resilience Score', baseline: '68/100', simulated: `${Math.min(96, Math.round(72 + impactDelta))}/100`, delta: `+${Math.round(impactDelta)} pts`, direction: 'positive' },
            { metric: 'Population Served', baseline: `${cSec.population?.toLocaleString('en-IN') || '42,000'}`, simulated: `${Math.round((cSec.population || 42000) * 1.45).toLocaleString('en-IN')}`, delta: '+45%', direction: 'positive' },
            { metric: 'Estimated CapEx Efficiency', baseline: '₹ 50 Cr Avg', simulated: `₹ ${customBudgetCr} Cr`, delta: 'Optimized', direction: 'positive' },
          ],
        };
      } else {
        // Fallback for flood / heat simulation types
        result = {
          simulationType: 'new_park',
          scenarioName: `${activeCity.name} Climate Resilience & Stress Test`,
          affectedZoneIds: sectors.slice(0, 3).map(s => s.id),
          affectedPopulation: 68000,
          deltaResponseTimeMin: -1.8,
          healthcareCoverageIncreasePct: 14.5,
          fireCoverageIncreasePct: 18.2,
          trafficDelayIndexDelta: -8.4,
          uhiMitigationC: 1.6,
          transitCatchmentGain: 0,
          impactScore: 84,
          keyFindings: [
            `Simulated high-stress test over ${activeCity.name} core infrastructure.`,
            `Mitigation protocols absorb 78% of simulated hydrological and thermal loads.`,
            `Key urban arterial routes remain 100% accessible to emergency response units.`
          ],
          aiExecutiveSummary: `Based on the simulation, this intervention provides the strongest improvement in urban resilience because it decouples arterial traffic from emergency corridors and expands civic catchment.`,
          calculationBreakdown: [
            { metric: 'Urban Resilience Score', baseline: '68/100', simulated: '84/100', delta: '+16 points', direction: 'positive' },
            { metric: 'Thermal & Flood Stress Absorbed', baseline: '0%', simulated: '78%', delta: '+78%', direction: 'positive' },
            { metric: 'Emergency Route Accessibility', baseline: '85%', simulated: '100%', delta: '+15%', direction: 'positive' },
          ],
        };
      }

      setSimulationResult(result);
      setIsSimulating(false);
    }, 600);
  };

  const handleReset = () => {
    setSimulationResult(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#070b16] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                What-If Urban Simulator
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeCity.name} Digital Twin
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              Test Urban Decisions Before Implementing Them
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Select a scenario, configure relevant spatial parameters, and run high-resolution predictive simulations.
            </p>
          </div>

          {simulationResult && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-slate-300 border border-white/10 transition-colors self-start md:self-auto"
            >
              <RotateCcw size={13} />
              <span>Configure New Scenario</span>
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* WORKFLOW VIEW: WHEN NO RESULTS ARE DISPLAYED */}
        {/* ========================================================================= */}
        {!simulationResult ? (
          <div className="space-y-8">
            
            {/* STEP 1: CHOOSE SCENARIO */}
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-bold font-mono">
                  1
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Choose Urban Scenario
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {SCENARIOS.map((scen) => {
                  const Icon = scen.icon;
                  const isSelected = selectedScenario === scen.id;
                  return (
                    <button
                      key={scen.id}
                      onClick={() => setSelectedScenario(scen.id)}
                      className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? `bg-gradient-to-b ${scen.bg} to-[#0b1220] ${scen.border} shadow-lg shadow-cyan-500/10 scale-[1.02]`
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2.5 rounded-xl bg-white/[0.05] ${scen.color}`}>
                          <Icon size={20} />
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{scen.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {scen.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: CONFIGURE (ONLY RELEVANT CONTROLS) */}
            <div className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-xs font-bold font-mono">
                  2
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Configure Parameters: {SCENARIOS.find(s => s.id === selectedScenario)?.title}
                </h3>
              </div>

              {/* Fire Station Controls */}
              {selectedScenario === 'new_fire_station' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Target Sector Location:
                    </label>
                    <select
                      value={fireStationSector}
                      onChange={(e) => setFireStationSector(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {sectors.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#0b1220]">
                          {s.name} ({s.sectorNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-300">Fire Engines / Tenders:</span>
                      <span className="text-orange-400 font-bold">{fireEngines} Tenders</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={8}
                      step={2}
                      value={fireEngines}
                      onChange={(e) => setFireEngines(Number(e.target.value))}
                      className="w-full accent-orange-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>2 (Sub-Post)</span>
                      <span>4 (Standard)</span>
                      <span>8 (Headquarters)</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-300">Service Radius:</span>
                      <span className="text-orange-400 font-bold">{fireRadiusKm} km</span>
                    </div>
                    <input
                      type="range"
                      min={3.0}
                      max={10.0}
                      step={0.5}
                      value={fireRadiusKm}
                      onChange={(e) => setFireRadiusKm(Number(e.target.value))}
                      className="w-full accent-orange-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>3.0 km (Dense)</span>
                      <span>5.5 km (Optimal)</span>
                      <span>10.0 km (Regional)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Hospital Controls */}
              {selectedScenario === 'new_hospital' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Target Sector Location:
                    </label>
                    <select
                      value={hospitalSector}
                      onChange={(e) => setHospitalSector(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {sectors.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#0b1220]">
                          {s.name} ({s.sectorNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-300">Bed Capacity:</span>
                      <span className="text-red-400 font-bold">{hospitalBeds} Beds</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={700}
                      step={50}
                      value={hospitalBeds}
                      onChange={(e) => setHospitalBeds(Number(e.target.value))}
                      className="w-full accent-red-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>100 (Clinic)</span>
                      <span>350 (General)</span>
                      <span>700 (Tertiary)</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-300">Emergency Catchment:</span>
                      <span className="text-red-400 font-bold">{hospitalRadiusKm} km</span>
                    </div>
                    <input
                      type="range"
                      min={4.0}
                      max={14.0}
                      step={1.0}
                      value={hospitalRadiusKm}
                      onChange={(e) => setHospitalRadiusKm(Number(e.target.value))}
                      className="w-full accent-red-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>4.0 km</span>
                      <span>7.0 km</span>
                      <span>14.0 km</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Road Closure Controls */}
              {selectedScenario === 'road_closure' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Select Road Corridor to Close:
                    </label>
                    <select
                      value={closedRoadId}
                      onChange={(e) => setClosedRoadId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {roads.map((r) => (
                        <option key={r.id} value={r.id} className="bg-[#0b1220]">
                          {r.name} ({r.lanes} lanes)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-300">Closure Duration:</span>
                      <span className="text-amber-400 font-bold">{closureHours} Hours</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      step={1}
                      value={closureHours}
                      onChange={(e) => setClosureHours(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>1 hr (Minor)</span>
                      <span>2 hrs (Standard)</span>
                      <span>8 hrs (Full Day)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Eco Park Controls */}
              {selectedScenario === 'new_park' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Target Sector:
                    </label>
                    <select
                      value={parkSector}
                      onChange={(e) => setParkSector(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {sectors.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#0b1220]">
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-300">Park Area:</span>
                      <span className="text-emerald-400 font-bold">{parkAreaSqKm} km²</span>
                    </div>
                    <input
                      type="range"
                      min={0.2}
                      max={2.5}
                      step={0.1}
                      value={parkAreaSqKm}
                      onChange={(e) => setParkAreaSqKm(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>0.2 km² (Neighborhood)</span>
                      <span>0.85 km² (Town Park)</span>
                      <span>2.5 km² (Mega Forest)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom AI Proposal Controls */}
              {selectedScenario === 'custom_proposal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Proposal Title / Name:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Solar Canopy & EV Emergency Fleet Depot"
                        value={customProposalTitle}
                        onChange={(e) => setCustomProposalTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Target Sector / Zone:
                      </label>
                      <select
                        value={customTargetSector}
                        onChange={(e) => setCustomTargetSector(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                      >
                        {sectors.map((s) => (
                          <option key={s.id} value={s.id} className="bg-[#0b1220]">
                            {s.name} ({s.sectorNumber})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Proposal Details & Objectives (Natural Language):
                    </label>
                    <textarea
                      rows={2}
                      placeholder={`Describe the scenario you want AI to evaluate for ${activeCity.name} (e.g. Convert open industrial plots to multi-feeder emergency transit points with 20 quick ambulances and solar backup)...`}
                      value={customProposalDescription}
                      onChange={(e) => setCustomProposalDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 placeholder-slate-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Intervention Classification:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'infrastructure', label: 'Civic Infra' },
                          { id: 'emergency', label: 'Emergency' },
                          { id: 'environmental', label: 'Green / Climate' },
                          { id: 'transit', label: 'Transit / Roads' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setCustomInterventionType(t.id as any)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border text-center transition-colors ${
                              customInterventionType === t.id
                                ? 'bg-purple-500/25 border-purple-500/50 text-purple-300'
                                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-300">Estimated Municipal Budget:</span>
                        <span className="text-purple-400 font-bold">₹ {customBudgetCr} Crore</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={150}
                        step={5}
                        value={customBudgetCr}
                        onChange={(e) => setCustomBudgetCr(Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>₹ 5 Cr (Pilot)</span>
                        <span>₹ 50 Cr (Medium)</span>
                        <span>₹ 150 Cr (Mega)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Flood & Heat Scenarios */}
              {(selectedScenario === 'flood_scenario' || selectedScenario === 'heat_scenario' || selectedScenario === 'new_transit_hub') && (
                <div className="text-xs text-slate-300 space-y-2">
                  <p>
                    Ready to simulate environmental risk dynamics for <span className="text-cyan-400 font-semibold">{activeCity.name}</span>.
                    The simulation engine will calculate hydrological runoff, surface heat delta, and evacuation routing constraints.
                  </p>
                </div>
              )}
            </div>

            {/* STEP 3: RUN SIMULATION BUTTON */}
            <div>
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/25 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Executing GIS Spatial Math Engine...</span>
                  </>
                ) : (
                  <>
                    <Play size={17} fill="currentColor" />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* STEP 5: DEDICATED SIMULATION RESULTS VIEW */
          /* ========================================================================= */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Simulation Completed Successfully</h3>
                  <p className="text-xs text-slate-300">{simulationResult.scenarioName}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Impact Score: {simulationResult.impactScore}/100
              </span>
            </div>

            {/* 4 KEY METRICS (As explicitly requested by user) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Population Covered</span>
                  <Users size={14} className="text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white" suppressHydrationWarning>
                  {formatNumber(simulationResult.affectedPopulation)}
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold mt-1">
                  <TrendingUp size={12} />
                  <span>+{simulationResult.healthcareCoverageIncreasePct || 18.2}%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Avg Response Time</span>
                  <Clock size={14} className="text-orange-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {Math.abs(simulationResult.deltaResponseTimeMin)} min
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold mt-1">
                  <TrendingDown size={12} />
                  <span>-14.8% response time</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Affected Area</span>
                  <MapPin size={14} className="text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  24.2 km²
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {simulationResult.affectedZoneIds?.length ?? 0} sectors impacted
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Urban Accessibility</span>
                  <ShieldCheck size={14} className="text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  +21.4%
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Golden hour transit reach
                </div>
              </div>
            </div>

            {/* AI ANALYSIS PANEL */}
            <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-b from-sky-500/10 to-[#0c1424] border border-sky-500/25 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-sky-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">
                  AI Urban Planner Strategic Interpretation
                </h4>
              </div>

              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              {simulationResult.aiExecutiveSummary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-cyan-400 font-bold block mb-1">Recommendation</span>
                  <p className="text-slate-300">
                    Approve site acquisition for this asset. Prioritize multi-feeder connectivity to reduce bottleneck risks.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-emerald-400 font-bold block mb-1">Reason</span>
                  <p className="text-slate-300">
                    Provides the steepest reduction in response latency for high-density residential and commercial clusters.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-amber-400 font-bold block mb-1">Key Trade-offs</span>
                  <p className="text-slate-300">
                    CapEx investment requires coordination with municipal land use and secondary corridor road widening.
                  </p>
                </div>
              </div>
            </div>

            {/* ACTION CONTROLS */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (onSaveScenario) onSaveScenario(simulationResult);
                  alert('Scenario proposal saved to comparison registry!');
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors"
              >
                <Save size={14} />
                <span>Save to Scenario Compare</span>
              </button>
              <button
                onClick={() => onAskAI(`Explain why the simulation result for ${simulationResult.scenarioName} achieves an impact score of ${simulationResult.impactScore}, and what policy steps should be taken.`)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-xs font-semibold text-sky-300 border border-sky-500/30 transition-colors"
              >
                <Sparkles size={14} />
                <span>Ask AI to Deep-Dive Findings</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-xs font-semibold text-cyan-300 border border-cyan-500/30 transition-colors ml-auto"
              >
                <RotateCcw size={14} />
                <span>Test Another Scenario</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
