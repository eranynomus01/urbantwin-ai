'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/UI/Header';
import MobileBottomNav from '@/components/UI/MobileBottomNav';
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
import { calculateHaversineDistance } from '@/lib/routing/osrm';
import { ArrowLeft } from 'lucide-react';

import { 
  City, 
  Zone, 
  UserRole, 
  SimulationResult, 
  EmergencyIncident, 
  RealTimeCityTelemetry,
  ScenarioItem,
  UserLiveLocation
} from '@/types';

export default function UrbanTwinCommandCenter() {
  // Application State
  const [activeCity, setActiveCity] = useState<City>(getActiveCity('gurugram'));
  const [userRole, setUserRole] = useState<UserRole>('urban_planner');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'map' | 'inspector' | 'simulator' | 'emergency' | 'ai_advisor' | 'scenarios'>('inspector');

  // GIS Selection & Entities
  const [selectedZone, setSelectedZone] = useState<Zone | null>(GURUGRAM_SECTORS[0]); // Default DLF Cyber City
  const [mapCenter, setMapCenter] = useState<[number, number]>(activeCity.center);
  const [mapZoom, setMapZoom] = useState<number>(activeCity.defaultZoom);

  // Live User GPS
  const [userLiveLocation, setUserLiveLocation] = useState<UserLiveLocation | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

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
      stationName: 'Sector 51 CAAQMS, Gurugram',
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

  // Live Location Trigger
  const handleTriggerLocateMe = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracyM = pos.coords.accuracy;

        let closestSec = GURUGRAM_SECTORS[0];
        let minD = Infinity;
        GURUGRAM_SECTORS.forEach((s) => {
          const d = calculateHaversineDistance([lat, lng], s.center);
          if (d < minD) {
            minD = d;
            closestSec = s;
          }
        });

        let nearestH = GURUGRAM_HOSPITALS[0];
        let minHD = Infinity;
        GURUGRAM_HOSPITALS.forEach((h) => {
          const d = calculateHaversineDistance([lat, lng], h.coordinates);
          if (d < minHD) {
            minHD = d;
            nearestH = h;
          }
        });

        let nearestF = GURUGRAM_FIRE_STATIONS[0];
        let minFD = Infinity;
        GURUGRAM_FIRE_STATIONS.forEach((f) => {
          const d = calculateHaversineDistance([lat, lng], f.coordinates);
          if (d < minFD) {
            minFD = d;
            nearestF = f;
          }
        });

        const userLoc: UserLiveLocation = {
          lat,
          lng,
          accuracyM,
          timestamp: new Date().toLocaleTimeString(),
          nearestSectorName: closestSec.name,
          nearestHospitalName: nearestH.name.split('—')[0],
          nearestHospitalDistKm: minHD,
          nearestFireStationName: nearestF.name.split(' ')[0],
          nearestFireDistKm: minFD,
        };

        setUserLiveLocation(userLoc);
        setMapCenter([lat, lng]);
        setMapZoom(14.5);
        setIsLocating(false);

        try {
          const res = await fetch(`/api/environmental?lat=${lat}&lng=${lng}&city_name=My%20Location`);
          if (res.ok) {
            const liveData = await res.json();
            setTelemetry(liveData);
          }
        } catch (e) {
          console.warn('GPS weather fetch error:', e);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        alert('Could not detect location. Please check browser GPS permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSelectZone = (zone: Zone | null) => {
    setSelectedZone(zone);
    if (zone) {
      setMapCenter(zone.center);
      setMapZoom(13.8);
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

  const handleTourStepAction = (step: number) => {
    if (step === 1) {
      handleSelectZone(GURUGRAM_SECTORS[0]);
      setActiveTab('inspector');
    } else if (step === 2) {
      setActiveTab('map');
    } else if (step === 3) {
      handleTriggerQuickDemo('nh48_closure');
    } else if (step === 4) {
      setActiveTab('emergency');
    } else if (step === 5) {
      handleAskAI('Where should Gurugram add a new fire station for maximum coverage?');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0f1e] text-slate-100 overflow-hidden font-sans">
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
        activeTab={activeTab === 'map' ? 'inspector' : activeTab}
        onSelectTab={setActiveTab}
        onTriggerQuickDemo={handleTriggerQuickDemo}
      />

      {/* 2. REAL-TIME TELEMETRY TICKER */}
      <RealTimeTelemetry telemetry={telemetry} />

      {/* 3. MAIN COMMAND CANVAS */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative pb-14 md:pb-0">
        {/* MAP CANVAS */}
        <div className={`flex-1 h-full relative ${activeTab !== 'map' ? 'hidden md:block' : 'block w-full'}`}>
          <DigitalTwinMap
            center={mapCenter}
            zoom={mapZoom}
            isDarkMode={isDarkMode}
            selectedZone={selectedZone}
            onSelectZone={handleSelectZone}
            userLiveLocation={userLiveLocation}
            onTriggerLocateMe={handleTriggerLocateMe}
            isLocating={isLocating}
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

          {/* Mobile Bottom Quick Card when on Map view */}
          {selectedZone && activeTab === 'map' && (
            <div className="md:hidden absolute bottom-16 left-3 right-3 z-[1000] bg-[#0f172a]/95 border border-white/[0.1] backdrop-blur-2xl p-3.5 rounded-2xl shadow-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold text-sky-400 font-mono uppercase">{selectedZone.sectorNumber}</span>
                <h4 className="font-extrabold text-slate-100 truncate max-w-[190px]">{selectedZone.name}</h4>
                <div className="text-[10px] text-slate-400">
                  Pop: <b>{selectedZone.population.toLocaleString('en-IN')}</b> · AQI: <b>{selectedZone.avgAqi}</b>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('inspector')}
                className="btn-primary py-2 px-3 text-xs flex items-center gap-1 shrink-0"
              >
                <span>Inspect</span> →
              </button>
            </div>
          )}
        </div>

        {/* RIGHT / FULL-SCREEN STUDIO DRAWER */}
        <div className={`w-full md:w-[420px] lg:w-[460px] h-full bg-[#080d1a]/95 border-l border-white/[0.06] flex flex-col z-30 shadow-2xl backdrop-blur-2xl ${
          activeTab === 'map' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Mobile Back to Map Header */}
          <div className="md:hidden flex items-center justify-between p-3.5 border-b border-white/[0.06] bg-[#0f172a]/80">
            <button
              onClick={() => setActiveTab('map')}
              className="flex items-center gap-1.5 text-xs font-bold text-sky-400 bg-white/[0.05] px-3 py-1.5 rounded-xl"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to GIS Map
            </button>
            <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
              {activeTab.toUpperCase().replace('_', ' ')}
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
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
                onEnableMapDrop={(mode) => {
                  setMapClickMode(mode);
                  setActiveTab('map');
                }}
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
                onEnableMapDrop={(mode) => {
                  setMapClickMode(mode);
                  setActiveTab('map');
                }}
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
      </div>

      {/* 4. MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedZoneName={selectedZone?.name}
      />

      {/* 5. MODALS */}
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
