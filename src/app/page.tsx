'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AppHeader, { AppViewMode } from '@/components/UI/AppHeader';
import HomeView from '@/components/Views/HomeView';
import ExploreView from '@/components/Views/ExploreView';
import ServicesView from '@/components/Views/ServicesView';
import SimulatorView from '@/components/Views/SimulatorView';
import EmergencyView from '@/components/Views/EmergencyView';
import CompareView from '@/components/Views/CompareView';
import AIPlannerView from '@/components/Views/AIPlannerView';
import DataTransparencyModal from '@/components/Panels/DataTransparencyModal';

import { SUPPORTED_CITIES, getActiveCity } from '@/data/cities';
import { HARYANA_MUNICIPAL_SERVICES } from '@/data/haryanaServices';
import { calculateHaversineDistance } from '@/lib/routing/osrm';

// Hisar GIS Data (Primary City)
import { 
  HISAR_SECTORS, 
  HISAR_HOSPITALS, 
  HISAR_FIRE_STATIONS, 
  HISAR_POLICE_STATIONS, 
  HISAR_PARKS, 
  HISAR_TRANSIT_NODES, 
  HISAR_ROADS, 
  HISAR_FLOOD_RISK_ZONES, 
  HISAR_HEAT_RISK_ZONES 
} from '@/data/hisar';

// Gurugram GIS Data (Secondary / District Data)
import { GURUGRAM_SECTORS } from '@/data/gurugram/sectors';
import { GURUGRAM_HOSPITALS } from '@/data/gurugram/hospitals';
import { GURUGRAM_FIRE_STATIONS } from '@/data/gurugram/fireStations';
import { GURUGRAM_POLICE_STATIONS } from '@/data/gurugram/policeStations';
import { GURUGRAM_PARKS } from '@/data/gurugram/parks';
import { GURUGRAM_TRANSIT_NODES } from '@/data/gurugram/transit';
import { GURUGRAM_ROADS } from '@/data/gurugram/roads';
import { GURUGRAM_FLOOD_RISK_ZONES } from '@/data/gurugram/floodRiskZones';
import { GURUGRAM_HEAT_RISK_ZONES } from '@/data/gurugram/heatRiskZones';

import { 
  City, 
  Zone, 
  SimulationResult, 
  RealTimeCityTelemetry, 
  ScenarioItem, 
  UserLiveLocation,
  MunicipalServiceAsset
} from '@/types';

export default function UrbanTwinCommandCenter() {
  // 1. APPLICATION VIEW STATE (Progressive Disclosure: Starts Clean on 'home')
  const [activeView, setActiveView] = useState<AppViewMode>('home');
  const [activeCity, setActiveCity] = useState<City>(getActiveCity('hisar'));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // 2. GIS ENTITY STATE
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MunicipalServiceAsset | null>(null);

  // 3. LIVE GPS STATE
  const [userLiveLocation, setUserLiveLocation] = useState<UserLiveLocation | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // 4. SIMULATION & SCENARIO REGISTRY
  const [activeSimulation, setActiveSimulation] = useState<SimulationResult | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<ScenarioItem[]>([]);

  // 5. AI PROMPT BRIDGE (Pass prompt into AI Planner when navigating)
  const [pendingAIPrompt, setPendingAIPrompt] = useState<string | null>(null);

  // 6. MODALS
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // 7. SYNC WITH URL HASH (allows direct linking: /#explore, /#services, etc.)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as AppViewMode;
      if (['home', 'explore', 'services', 'simulator', 'emergency', 'compare', 'ai_planner'].includes(hash)) {
        setActiveView(hash);
      }
    }
  }, []);

  const handleSelectView = (view: AppViewMode) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      window.location.hash = view === 'home' ? '' : view;
    }
  };

  // 8. RESOLVE CITY GIS LAYERS DYNAMICALLY
  const isHisar = activeCity.id === 'hisar';
  const currentSectors = useMemo(() => isHisar ? HISAR_SECTORS : GURUGRAM_SECTORS, [isHisar]);
  const currentHospitals = useMemo(() => isHisar ? HISAR_HOSPITALS : GURUGRAM_HOSPITALS, [isHisar]);
  const currentFireStations = useMemo(() => isHisar ? HISAR_FIRE_STATIONS : GURUGRAM_FIRE_STATIONS, [isHisar]);
  const currentPoliceStations = useMemo(() => isHisar ? HISAR_POLICE_STATIONS : GURUGRAM_POLICE_STATIONS, [isHisar]);
  const currentParks = useMemo(() => isHisar ? HISAR_PARKS : GURUGRAM_PARKS, [isHisar]);
  const currentTransitNodes = useMemo(() => isHisar ? HISAR_TRANSIT_NODES : GURUGRAM_TRANSIT_NODES, [isHisar]);
  const currentRoads = useMemo(() => isHisar ? HISAR_ROADS : GURUGRAM_ROADS, [isHisar]);
  const currentFloodZones = useMemo(() => isHisar ? HISAR_FLOOD_RISK_ZONES : GURUGRAM_FLOOD_RISK_ZONES, [isHisar]);
  const currentHeatZones = useMemo(() => isHisar ? HISAR_HEAT_RISK_ZONES : GURUGRAM_HEAT_RISK_ZONES, [isHisar]);

  // Municipal services for current active city
  const cityServices = useMemo(() => {
    return HARYANA_MUNICIPAL_SERVICES.filter((s) => s.cityId === activeCity.id);
  }, [activeCity.id]);

  // Set initial selected zone when city changes
  useEffect(() => {
    setSelectedZone(currentSectors[0] || null);
    setSelectedAsset(null);
  }, [currentSectors]);

  // 9. LIVE TELEMETRY
  const [telemetry, setTelemetry] = useState<RealTimeCityTelemetry>({
    cityId: activeCity.id,
    cityName: activeCity.name,
    weather: {
      temperatureC: 34.2,
      feelsLikeC: 38.4,
      humidityPct: 48,
      rainfallMmPerHr: 0.0,
      windSpeedKmh: 11.2,
      windDirection: 'NW',
      conditionText: 'Clear / Sunny',
      uvIndex: 7.1,
      sourceName: 'Open-Meteo High-Resolution Model',
      sourceUrl: 'https://open-meteo.com/',
      lastUpdated: '17:45 IST',
      isRealTime: true,
    },
    airQuality: {
      aqi: 168,
      pm25: 78.5,
      pm10: 152.0,
      no2: 38.4,
      o3: 26.2,
      so2: 12.1,
      co: 0.9,
      category: 'Moderate',
      stationName: `${activeCity.name} CAAQMS Central Station`,
      sourceName: 'CPCB / NAQI Open Data Feed',
      sourceUrl: 'https://cpcb.nic.in/',
      lastUpdated: '17:45 IST',
      isRealTime: true,
    },
    trafficSummary: {
      overallIndex: 62,
      congestedCorridorsCount: 2,
      avgCitySpeedKmh: 34.8,
      sourceName: 'GMDA / Smart City ICCC & OSM Graph',
      lastUpdated: '17:45 IST',
    },
    emergencyStatus: {
      activeIncidentsCount: 1,
      avgFireResponseTimeMin: 7.2,
      avgAmbulanceResponseTimeMin: 8.5,
      systemAlertLevel: 'NORMAL',
    },
  });

  // Fetch live weather/AQI telemetry from API route
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

  // 10. REAL-TIME GPS LOCATE ME
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

        let closestSec = currentSectors[0];
        let minD = Infinity;
        currentSectors.forEach((s) => {
          const d = calculateHaversineDistance([lat, lng], s.center);
          if (d < minD) {
            minD = d;
            closestSec = s;
          }
        });

        let nearestH = currentHospitals[0];
        let minHD = Infinity;
        currentHospitals.forEach((h) => {
          const d = calculateHaversineDistance([lat, lng], h.coordinates);
          if (d < minHD) {
            minHD = d;
            nearestH = h;
          }
        });

        let nearestF = currentFireStations[0];
        let minFD = Infinity;
        currentFireStations.forEach((f) => {
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
          nearestSectorName: closestSec?.name || 'Local Sector',
          nearestHospitalName: nearestH?.name.split('—')[0] || 'Civil Hospital',
          nearestHospitalDistKm: minHD,
          nearestFireStationName: nearestF?.name.split(' ')[0] || 'Central Fire Stn',
          nearestFireDistKm: minFD,
        };

        setUserLiveLocation(userLoc);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        alert('Could not detect location. Please check browser GPS permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // 11. NAVIGATION BRIDGES
  const handleAskAIWithPrompt = (promptText: string) => {
    setPendingAIPrompt(promptText);
    handleSelectView('ai_planner');
  };

  const handleFocusAssetOnMap = (asset: MunicipalServiceAsset) => {
    setSelectedAsset(asset);
    setSelectedZone(null);
    handleSelectView('explore');
  };

  const handleSimulateAssetDisruption = (asset: MunicipalServiceAsset) => {
    handleAskAIWithPrompt(`What is the cascade impact if ${asset.name} in ${activeCity.name} goes offline, and what contingency emergency protocols should be deployed?`);
  };

  const handleSaveScenario = (simResult: SimulationResult) => {
    const newScenario: ScenarioItem = {
      id: `scen-${Date.now()}`,
      name: simResult.scenarioName,
      description: simResult.keyFindings.join(' '),
      simulationType: simResult.simulationType,
      cityId: activeCity.id,
      createdAt: new Date().toLocaleDateString('en-IN'),
      author: 'Urban Planner',
      kpis: {
        avgEmergencyResponseMin: Math.max(4.0, Math.round((7.2 + simResult.deltaResponseTimeMin) * 10) / 10),
        healthcareCoveragePct: Math.min(98, Math.round((78.5 + simResult.healthcareCoverageIncreasePct) * 10) / 10),
        fireCoveragePct: Math.min(98, Math.round((74.2 + simResult.fireCoverageIncreasePct) * 10) / 10),
        trafficCongestionIndex: Math.max(30, Math.round((62.0 + simResult.trafficDelayIndexDelta) * 10) / 10),
        greenSpacePerCapitaSqM: simResult.uhiMitigationC > 0 ? 4.22 : 3.4,
        floodVulnerabilityScore: 5.8,
        uhiExtremeAreaPct: simResult.uhiMitigationC > 0 ? 28.0 : 38.0,
        overallUrbanResilienceScore: Math.min(99, Math.round(68.0 + (simResult.impactScore * 0.25))),
      },
      simulationDelta: simResult,
    };
    setSavedScenarios((prev) => [newScenario, ...prev]);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#070b16] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* 1. TOP APP HEADER (Persistent across all views) */}
      <AppHeader
        activeView={activeView}
        onSelectView={handleSelectView}
        activeCity={activeCity}
        onSelectCity={(city) => {
          setActiveCity(city);
          setSelectedZone(null);
          setSelectedAsset(null);
        }}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
      />

      {/* 2. DEDICATED VIEW CANVAS (Progressive Disclosure Architecture) */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* VIEW 1: HOME (Clean Dashboard with 6 Large Cards) */}
        {activeView === 'home' && (
          <HomeView
            activeCity={activeCity}
            onSelectView={handleSelectView}
            telemetry={telemetry}
            totalServicesCount={cityServices.length}
          />
        )}

        {/* VIEW 2: EXPLORE CITY (Dedicated Full-Screen Map) */}
        {activeView === 'explore' && (
          <ExploreView
            activeCity={activeCity}
            sectors={currentSectors}
            hospitals={currentHospitals}
            fireStations={currentFireStations}
            policeStations={currentPoliceStations}
            parks={currentParks}
            transitNodes={currentTransitNodes}
            roads={currentRoads}
            floodZones={currentFloodZones}
            heatZones={currentHeatZones}
            municipalServices={cityServices}
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            selectedAsset={selectedAsset}
            onSelectAsset={setSelectedAsset}
            userLiveLocation={userLiveLocation}
            onTriggerLocateMe={handleTriggerLocateMe}
            isLocating={isLocating}
            onSwitchToSimulator={(zone) => {
              if (zone) setSelectedZone(zone);
              handleSelectView('simulator');
            }}
            onAskAI={handleAskAIWithPrompt}
          />
        )}

        {/* VIEW 3: SERVICES PORTAL (8 Organized Category Cards) */}
        {activeView === 'services' && (
          <ServicesView
            activeCity={activeCity}
            services={cityServices}
            onFocusAssetOnMap={handleFocusAssetOnMap}
            onSimulateDisruption={handleSimulateAssetDisruption}
            onAskAI={handleAskAIWithPrompt}
          />
        )}

        {/* VIEW 4: WHAT-IF SIMULATOR (3-Step Workflow & Results State) */}
        {activeView === 'simulator' && (
          <SimulatorView
            activeCity={activeCity}
            sectors={currentSectors}
            roads={currentRoads}
            onSaveScenario={handleSaveScenario}
            onAskAI={handleAskAIWithPrompt}
          />
        )}

        {/* VIEW 5: EMERGENCY & RISK (4 Hazard Intelligence Cards) */}
        {activeView === 'emergency' && (
          <EmergencyView
            activeCity={activeCity}
            sectors={currentSectors}
            hospitals={currentHospitals}
            fireStations={currentFireStations}
            policeStations={currentPoliceStations}
            roads={currentRoads}
            floodZones={currentFloodZones}
            heatZones={currentHeatZones}
            onAskAI={handleAskAIWithPrompt}
          />
        )}

        {/* VIEW 6: SCENARIO COMPARE (Proposal A vs B Comparison Table) */}
        {activeView === 'compare' && (
          <CompareView
            activeCity={activeCity}
            savedScenarios={savedScenarios}
            onAskAI={handleAskAIWithPrompt}
          />
        )}

        {/* VIEW 7: AI URBAN PLANNER (Conversational Gemini Co-Pilot) */}
        {activeView === 'ai_planner' && (
          <AIPlannerView
            activeCity={activeCity}
            selectedZone={selectedZone}
            activeSimulation={activeSimulation}
            telemetry={telemetry}
            initialPrompt={pendingAIPrompt}
          />
        )}
      </main>

      {/* 3. MODALS */}
      <DataTransparencyModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />
    </div>
  );
}
