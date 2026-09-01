'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/UI/Header';
import RealTimeTelemetry from '@/components/Panels/RealTimeTelemetry';
import DigitalTwinMap from '@/components/Map/DigitalTwinMap';
import ZoneInspector from '@/components/Panels/ZoneInspector';
import WhatIfSimulator from '@/components/Panels/WhatIfSimulator';
import EmergencyDispatcher from '@/components/Panels/EmergencyDispatcher';
import AIAdvisorPanel from '@/components/Panels/AIAdvisorPanel';
import ScenarioComparison from '@/components/Panels/ScenarioComparison';
import DataTransparencyModal from '@/components/Panels/DataTransparencyModal';
import ReportGeneratorModal from '@/components/Panels/ReportGeneratorModal';
import GuidedTourModal from '@/components/Panels/GuidedTourModal';

import { SUPPORTED_CITIES, getActiveCity } from '@/data/cities';
import { GURUGRAM_SECTORS } from '@/data/gurugram/sectors';
import { GURUGRAM_HOSPITALS } from '@/data/gurugram/hospitals';
import { GURUGRAM_FIRE_STATIONS } from '@/data/gurugram/fireStations';
import { GURUGRAM_POLICE_STATIONS } from '@/data/gurugram/policeStations';
import { GURUGRAM_PARKS } from '@/data/gurugram/parks';
import { GURUGRAM_TRANSIT_NODES } from '@/data/gurugram/transit';
import { GURUGRAM_ROADS } from '@/data/gurugram/roads';
import { GURUGRAM_FLOOD_RISK_ZONES } from '@/data/gurugram/floodRiskZones';
import { GURUGRAM_HEAT_RISK_ZONES } from '@/data/gurugram/heatRiskZones';
import { runWhatIfSimulation } from '@/lib/simulation/engine';

import { 
  City, 
  Zone, 
  UserRole, 
  SimulationResult, 
  EmergencyIncident, 
  RealTimeCityTelemetry,
  ScenarioItem 
} from '@/types';

export default function UrbanTwinCommandCenter() {
  // Application State
  const [activeCity, setActiveCity] = useState<City>(getActiveCity('gurugram'));
  const [userRole, setUserRole] = useState<UserRole>('urban_planner');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'inspector' | 'simulator' | 'emergency' | 'ai_advisor' | 'scenarios'>('inspector');

  // GIS Selection & Entities
  const [selectedZone, setSelectedZone] = useState<Zone | null>(GURUGRAM_SECTORS[0]); // Default DLF Cyber City
  const [mapCenter, setMapCenter] = useState<[number, number]>(activeCity.center);
  const [mapZoom, setMapZoom] = useState<number>(activeCity.defaultZoom);

  // Active Simulation & Incidents
  const [activeSimulation, setActiveSimulation] = useState<SimulationResult | null>(null);
  const [activeIncident, setActiveIncident] = useState<EmergencyIncident | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<ScenarioItem[]>([]);

  // Map Click Mode
  const [mapClickMode, setMapClickMode] = useState<'inspect' | 'simulation_drop' | 'incident_drop'>('inspect');
  const [droppedCoords, setDroppedCoords] = useState<[number, number] | null>(null);

  // AI Prompt Bridge
  const [activeAIPrompt, setActiveAIPrompt] = useState<string | null>(null);

  // Modals
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  // Live Telemetry Stream
  const [telemetry, setTelemetry] = useState<RealTimeCityTelemetry>({
    cityId: 'gurugram',
    cityName: 'Gurugram',
    weather: {
      temperatureC: 32.4,
      feelsLikeC: 36.1,
      humidityPct: 62,
      rainfallMmPerHr: 0.0,
      windSpeedKmh: 12.8,
      windDirection: 'NW',
      conditionText: 'Partly Cloudy / Hazy',
      uvIndex: 6.2,
      sourceName: 'Open-Meteo High-Resolution Model',
      sourceUrl: 'https://open-meteo.com/',
      lastUpdated: '18:45 IST',
      isRealTime: true,
    },
    airQuality: {
      aqi: 178,
      pm25: 88.4,
      pm10: 164.2,
      no2: 42.1,
      o3: 28.5,
      so2: 14.2,
      co: 1.2,
      category: 'Poor',
      stationName: 'Sector 51 Continuous Ambient Air Quality Station, Gurugram',
      sourceName: 'CPCB / NAQI Open Data Feed',
      sourceUrl: 'https://cpcb.nic.in/',
      lastUpdated: '18:45 IST',
      isRealTime: true,
    },
    trafficSummary: {
      overallIndex: 68,
      congestedCorridorsCount: 3,
      avgCitySpeedKmh: 31.4,
      sourceName: 'GMDA ICCC & OSM Graph',
      lastUpdated: '18:45 IST',
    },
    emergencyStatus: {
      activeIncidentsCount: 2,
      avgFireResponseTimeMin: 8.4,
      avgAmbulanceResponseTimeMin: 9.6,
      systemAlertLevel: 'NORMAL',
    },
  });

  useEffect(() => {
    async function loadTelemetry() {
      try {
        const res = await fetch(`/api/environmental?city=${activeCity.id}`);
        if (res.ok) {
          const data = await res.json();
          setTelemetry(data);
        }
      } catch (err) {
        console.warn('Live telemetry initial fetch error:', err);
      }
    }
    loadTelemetry();
    const interval = setInterval(loadTelemetry, 120000);
    return () => clearInterval(interval);
  }, [activeCity.id]);

  const handleSelectZone = (zone: Zone | null) => {
    setSelectedZone(zone);
    if (zone) {
      setMapCenter(zone.center);
      setMapZoom(13.8);
      setActiveTab('inspector');
    }
  };

  const handleMapClickCoord = (coord: [number, number]) => {
    if (mapClickMode === 'simulation_drop') {
      setDroppedCoords(coord);
      setMapClickMode('inspect');
      setActiveTab('simulator');
    } else if (mapClickMode === 'incident_drop') {
      setDroppedCoords(coord);
      setMapClickMode('inspect');
      setActiveTab('emergency');
    } else {
      let closest = GURUGRAM_SECTORS[0];
      let minD = Infinity;
      GURUGRAM_SECTORS.forEach((s) => {
        const d = Math.hypot(s.center[0] - coord[0], s.center[1] - coord[1]);
        if (d < minD) {
          minD = d;
          closest = s;
        }
      });
      if (minD < 0.04) {
        handleSelectZone(closest);
      }
    }
  };

  const handleAskAI = (promptText: string) => {
    setActiveAIPrompt(promptText);
    setActiveTab('ai_advisor');
  };

  const handleStartSimulationInZone = (zone: Zone) => {
    setDroppedCoords(zone.center);
    setActiveTab('simulator');
  };

  const handleSaveScenario = (simResult: SimulationResult) => {
    const newScenario: ScenarioItem = {
      id: `scen-${Date.now()}`,
      name: simResult.scenarioName,
      description: simResult.keyFindings.join(' '),
      simulationType: simResult.simulationType,
      cityId: 'gurugram',
      createdAt: new Date().toLocaleDateString('en-IN'),
      author: 'Urban Planner',
      kpis: {
        avgEmergencyResponseMin: Math.max(4.0, Math.round((8.4 + simResult.deltaResponseTimeMin) * 10) / 10),
        healthcareCoveragePct: Math.min(98, Math.round((68.5 + simResult.healthcareCoverageIncreasePct) * 10) / 10),
        fireCoveragePct: Math.min(98, Math.round((64.2 + simResult.fireCoverageIncreasePct) * 10) / 10),
        trafficCongestionIndex: Math.max(30, Math.round((68.0 + simResult.trafficDelayIndexDelta) * 10) / 10),
        greenSpacePerCapitaSqM: simResult.uhiMitigationC > 0 ? 4.22 : 3.4,
        floodVulnerabilityScore: 6.8,
        uhiExtremeAreaPct: simResult.uhiMitigationC > 0 ? 34.0 : 42.0,
        overallUrbanResilienceScore: Math.min(99, Math.round(62.0 + (simResult.impactScore * 0.25))),
      },
      simulationDelta: simResult,
    };
    setSavedScenarios((prev) => [newScenario, ...prev]);
    setActiveTab('scenarios');
  };

  // Quick Demo Triggers
  const handleTriggerQuickDemo = (demoType: 'nh48_closure' | 'fire_sec65') => {
    if (demoType === 'nh48_closure') {
      const result = runWhatIfSimulation('road_closure', {
        roadId: 'road-nh48-delhi-jaipur-expy',
        roadName: 'NH-48 (Delhi-Jaipur Expressway)',
        closureDurationHours: 2,
      });
      setActiveSimulation(result);
      setMapCenter([28.4680, 77.0600]);
      setMapZoom(12.8);
      setActiveTab('simulator');
    } else if (demoType === 'fire_sec65') {
      const result = runWhatIfSimulation('new_fire_station', {
        proposedLocation: [28.4110, 77.0650],
        name: 'Sector 65 Southern Peripheral Fire Station',
        fireEngines: 4,
        coverageRadiusKm: 5.5,
      });
      setActiveSimulation(result);
      setMapCenter([28.4110, 77.0650]);
      setMapZoom(13.2);
      setActiveTab('simulator');
    }
  };

  // Guided Tour Step Action Handler
  const handleTourStepAction = (step: number) => {
    if (step === 1) {
      handleSelectZone(GURUGRAM_SECTORS[0]);
    } else if (step === 2) {
      setActiveTab('inspector');
    } else if (step === 3) {
      handleTriggerQuickDemo('nh48_closure');
    } else if (step === 4) {
      setActiveTab('emergency');
    } else if (step === 5) {
      handleAskAI('Where should we consider adding a new fire station in Gurugram?');
    }
  };

  return (
    <div className={`h-screen w-screen flex flex-col ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} overflow-hidden`}>
      {/* 1. HEADER */}
      <Header
        activeCity={activeCity}
        onSelectCity={(city) => {
          setActiveCity(city);
          setMapCenter(city.center);
          setMapZoom(city.defaultZoom);
        }}
        userRole={userRole}
        onSelectRole={setUserRole}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenTourModal={() => setIsTourModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onTriggerQuickDemo={handleTriggerQuickDemo}
      />

      {/* 2. REAL-TIME ENVIRONMENTAL TELEMETRY */}
      <RealTimeTelemetry telemetry={telemetry} />

      {/* 3. MAIN COMMAND CANVAS */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT / CENTER: GIS DIGITAL TWIN MAP */}
        <div className="flex-1 h-full relative">
          <DigitalTwinMap
            center={mapCenter}
            zoom={mapZoom}
            isDarkMode={isDarkMode}
            selectedZone={selectedZone}
            onSelectZone={handleSelectZone}
            sectors={GURUGRAM_SECTORS}
            hospitals={GURUGRAM_HOSPITALS}
            fireStations={GURUGRAM_FIRE_STATIONS}
            policeStations={GURUGRAM_POLICE_STATIONS}
            parks={GURUGRAM_PARKS}
            transitNodes={GURUGRAM_TRANSIT_NODES}
            roads={GURUGRAM_ROADS}
            floodZones={GURUGRAM_FLOOD_RISK_ZONES}
            heatZones={GURUGRAM_HEAT_RISK_ZONES}
            activeSimulation={activeSimulation}
            activeIncident={activeIncident}
            mapClickMode={mapClickMode}
            onMapClickCoord={handleMapClickCoord}
          />
        </div>

        {/* RIGHT: ANALYTICS & DECISION STUDIO DRAWER */}
        <div className="w-[430px] lg:w-[480px] h-full bg-slate-950/95 border-l border-slate-800 flex flex-col z-30 shadow-2xl backdrop-blur-xl">
          {activeTab === 'inspector' && (
            <ZoneInspector
              selectedZone={selectedZone}
              onClearSelection={() => setSelectedZone(null)}
              onAskAI={handleAskAI}
              onStartSimulationInZone={handleStartSimulationInZone}
              fireStations={GURUGRAM_FIRE_STATIONS}
              hospitals={GURUGRAM_HOSPITALS}
            />
          )}

          {activeTab === 'simulator' && (
            <WhatIfSimulator
              roads={GURUGRAM_ROADS}
              sectors={GURUGRAM_SECTORS}
              selectedZone={selectedZone}
              activeSimulation={activeSimulation}
              onSimulationComplete={setActiveSimulation}
              onClearSimulation={() => setActiveSimulation(null)}
              onSaveScenario={handleSaveScenario}
              onAskAI={handleAskAI}
              onEnableMapDrop={(mode) => setMapClickMode(mode)}
              droppedCoords={droppedCoords}
            />
          )}

          {activeTab === 'emergency' && (
            <EmergencyDispatcher
              hospitals={GURUGRAM_HOSPITALS}
              fireStations={GURUGRAM_FIRE_STATIONS}
              policeStations={GURUGRAM_POLICE_STATIONS}
              sectors={GURUGRAM_SECTORS}
              activeIncident={activeIncident}
              onDispatchIncident={setActiveIncident}
              onClearIncident={() => setActiveIncident(null)}
              onEnableMapDrop={(mode) => setMapClickMode(mode)}
              onAskAI={handleAskAI}
              droppedCoords={droppedCoords}
            />
          )}

          {activeTab === 'ai_advisor' && (
            <AIAdvisorPanel
              selectedZone={selectedZone}
              activeSimulation={activeSimulation}
              currentTelemetry={telemetry}
              activePrompt={activeAIPrompt}
              onClearActivePrompt={() => setActiveAIPrompt(null)}
            />
          )}

          {activeTab === 'scenarios' && (
            <ScenarioComparison
              scenarios={savedScenarios}
              activeSimulation={activeSimulation}
              onApplyScenario={(scen) => {
                if (scen.simulationDelta) {
                  setActiveSimulation(scen.simulationDelta);
                }
              }}
              onResetToBaseline={() => {
                setActiveSimulation(null);
                setActiveIncident(null);
              }}
            />
          )}
        </div>
      </div>

      {/* 4. MODALS */}
      <GuidedTourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        onSelectStepAction={handleTourStepAction}
      />

      <DataTransparencyModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />

      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        selectedZone={selectedZone}
        activeSimulation={activeSimulation}
        currentTelemetry={telemetry}
      />
    </div>
  );
}
