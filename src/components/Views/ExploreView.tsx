'use client';

import React, { useState, useEffect } from 'react';
import { 
  City, 
  Zone, 
  Hospital, 
  FireStation, 
  PoliceStation, 
  Park, 
  TransitNode, 
  RoadCorridor, 
  FloodRiskZone, 
  HeatRiskZone, 
  SimulationResult, 
  EmergencyIncident, 
  UserLiveLocation,
  MunicipalServiceAsset,
  MunicipalServiceType
} from '@/types';
import DigitalTwinMap from '@/components/Map/DigitalTwinMap';
import { SUPPORTED_CITIES } from '@/data/cities';
import { 
  Layers, 
  Search, 
  Navigation, 
  X, 
  Building2, 
  ShieldAlert, 
  Thermometer, 
  Users, 
  Activity, 
  Sparkles, 
  Zap, 
  Check, 
  Sliders,
  ChevronRight,
  ChevronDown,
  Phone,
  MapPin,
  Flame,
  ArrowRight
} from 'lucide-react';

interface ExploreViewProps {
  activeCity: City;
  onSelectCity?: (city: City) => void;
  sectors: Zone[];
  hospitals: Hospital[];
  fireStations: FireStation[];
  policeStations: PoliceStation[];
  parks: Park[];
  transitNodes: TransitNode[];
  roads: RoadCorridor[];
  floodZones: FloodRiskZone[];
  heatZones: HeatRiskZone[];
  municipalServices: MunicipalServiceAsset[];
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone | null) => void;
  selectedAsset: MunicipalServiceAsset | null;
  onSelectAsset: (asset: MunicipalServiceAsset | null) => void;
  userLiveLocation: UserLiveLocation | null;
  onTriggerLocateMe: () => void;
  isLocating?: boolean;
  onSwitchToSimulator: (zone?: Zone) => void;
  onAskAI: (prompt: string) => void;
}

export default function ExploreView({
  activeCity,
  onSelectCity,
  sectors,
  hospitals,
  fireStations,
  policeStations,
  parks,
  transitNodes,
  roads,
  floodZones,
  heatZones,
  municipalServices,
  selectedZone,
  onSelectZone,
  selectedAsset,
  onSelectAsset,
  userLiveLocation,
  onTriggerLocateMe,
  isLocating,
  onSwitchToSimulator,
  onAskAI,
}: ExploreViewProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(activeCity.center);
  const [mapZoom, setMapZoom] = useState<number>(activeCity.defaultZoom || 12.8);
  const [isCityOpen, setIsCityOpen] = useState<boolean>(false);
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapStyle, setMapStyle] = useState<'dark' | 'standard'>('dark');

  // Immediately fly map to new city when activeCity changes
  useEffect(() => {
    setMapCenter(activeCity.center);
    setMapZoom(activeCity.defaultZoom || 12.8);
  }, [activeCity.id, activeCity.center[0], activeCity.center[1], activeCity.defaultZoom]);

  // Active selective service types for the map
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<Set<MunicipalServiceType>>(
    new Set<MunicipalServiceType>([
      'healthcare',
      'fire_rescue',
      'police_safety',
      'water_drainage',
      'power_grid',
      'disaster_shelter',
      'waste_sanitation',
      'transit_roads',
    ])
  );

  const filteredSectors = sectors.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sectorNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSectorFromSearch = (sector: Zone) => {
    onSelectZone(sector);
    onSelectAsset(null);
    setMapCenter(sector.center);
    setMapZoom(14.2);
    setSearchQuery('');
  };

  const handleAssetClick = (asset: MunicipalServiceAsset) => {
    onSelectAsset(asset);
    onSelectZone(null);
    setMapCenter(asset.coordinates);
    setMapZoom(14.8);
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] flex overflow-hidden bg-[#070c18]">
      
      {/* 1. TOP FLOATING CONTROL BAR */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Search location bar */}
        <div className="relative pointer-events-auto w-72 md:w-84">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0a1020]/90 backdrop-blur-md border border-white/10 shadow-xl text-xs text-slate-200">
            <Search size={14} className="text-cyan-400 shrink-0" />
            <input
              type="text"
              placeholder={`Search ${activeCity.name} sectors & landmarks...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute left-0 top-11 w-full bg-[#0d1424] border border-white/10 rounded-xl shadow-2xl p-1.5 max-h-64 overflow-y-auto z-50">
              {filteredSectors.length === 0 ? (
                <div className="p-3 text-xs text-slate-400 text-center">No sectors matching "{searchQuery}"</div>
              ) : (
                filteredSectors.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSectorFromSearch(s)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/[0.06] text-slate-200 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-white">{s.name}</span>
                      <span className="text-[10px] text-slate-400 block">{s.sectorNumber} · {s.zoneType}</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono">Teleport →</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Quick City Switcher Dropdown on Map */}
        {onSelectCity && (
          <div className="relative pointer-events-auto">
            <button
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0a1020]/95 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400 text-xs font-semibold text-cyan-300 shadow-xl transition-all active:scale-95"
              title="Quickly teleport map to any of the 22 Haryana districts"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{activeCity.name}</span>
              <ChevronDown size={12} className={`text-slate-400 transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCityOpen && (
              <div className="absolute left-0 top-11 w-64 bg-[#0d1424] border border-white/10 rounded-xl shadow-2xl p-2 max-h-72 overflow-y-auto z-50">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10 mb-1">
                  Teleport to District (All 22 Haryana)
                </div>
                {SUPPORTED_CITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCity(c);
                      setMapCenter(c.center);
                      setMapZoom(c.defaultZoom || 12.8);
                      setIsCityOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      c.id === activeCity.id ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-[10px] text-slate-500">{c.totalPopulation?.toLocaleString()} pop</div>
                    </div>
                    {c.id === activeCity.id && <span className="text-[10px] text-cyan-400 font-bold">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Controls Group */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          {/* My GPS Button */}
          <button
            onClick={onTriggerLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a1020]/90 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 shadow-xl text-xs font-semibold text-cyan-300 transition-all active:scale-95"
            title="Detect My Real-Time GPS Location"
          >
            <Navigation size={13} className={isLocating ? 'animate-spin text-cyan-400' : 'text-cyan-400'} />
            <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My GPS'}</span>
          </button>

          {/* Collapsible Layers Panel Toggle */}
          <button
            onClick={() => setIsLayersOpen(!isLayersOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur-md border shadow-xl text-xs font-semibold transition-all ${
              isLayersOpen
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10'
                : 'bg-[#0a1020]/90 text-slate-300 border-white/10 hover:border-white/20'
            }`}
          >
            <Layers size={13} className={isLayersOpen ? 'text-cyan-400' : 'text-slate-400'} />
            <span>Layers</span>
          </button>
        </div>
      </div>

      {/* 2. COLLAPSIBLE LAYERS PANEL (Floating Drawer) */}
      {isLayersOpen && (
        <div className="absolute top-16 right-3 z-30 w-72 bg-[#0a1022]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 text-xs text-slate-300 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-cyan-400" />
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">GIS Layer Controls</span>
            </div>
            <button onClick={() => setIsLayersOpen(false)} className="text-slate-400 hover:text-white">
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {[
              { id: 'healthcare', label: 'Hospitals & Trauma Wings', count: hospitals.length, color: 'text-red-400' },
              { id: 'fire_rescue', label: 'Fire Stations & Headquarters', count: fireStations.length, color: 'text-orange-400' },
              { id: 'police_safety', label: 'Police Stations & ICCC', count: policeStations.length, color: 'text-blue-400' },
              { id: 'water_drainage', label: 'Water Plants & Storm Drains', count: municipalServices.filter(s => s.serviceType === 'water_drainage').length, color: 'text-cyan-400' },
              { id: 'power_grid', label: 'Power Grid Substations', count: municipalServices.filter(s => s.serviceType === 'power_grid').length, color: 'text-amber-400' },
              { id: 'waste_sanitation', label: 'Waste Management Plants', count: municipalServices.filter(s => s.serviceType === 'waste_sanitation').length, color: 'text-emerald-400' },
              { id: 'disaster_shelter', label: 'Emergency Shelters & Stadiums', count: municipalServices.filter(s => s.serviceType === 'disaster_shelter').length, color: 'text-purple-400' },
              { id: 'transit_roads', label: 'Transit Hubs & Rail Terminals', count: transitNodes.length, color: 'text-indigo-400' },
            ].map((layer) => {
              const active = selectedServiceTypes.has(layer.id as MunicipalServiceType);
              return (
                <button
                  key={layer.id}
                  onClick={() => {
                    setSelectedServiceTypes((prev) => {
                      const next = new Set(prev);
                      if (next.has(layer.id as MunicipalServiceType)) {
                        next.delete(layer.id as MunicipalServiceType);
                      } else {
                        next.add(layer.id as MunicipalServiceType);
                      }
                      return next;
                    });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                    active ? 'bg-white/[0.06] text-white' : 'text-slate-500 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                      active ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-white/20'
                    }`}>
                      {active && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span className={active ? layer.color : ''}>{layer.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{layer.count}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
            <button
              onClick={() => setSelectedServiceTypes(new Set<MunicipalServiceType>(['healthcare','fire_rescue','police_safety','water_drainage','power_grid','disaster_shelter','waste_sanitation','transit_roads']))}
              className="text-cyan-400 hover:underline font-medium"
            >
              Enable All
            </button>
            <button
              onClick={() => setSelectedServiceTypes(new Set())}
              className="text-slate-400 hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN FULL-SCREEN MAP CANVAS */}
      <div className="flex-1 w-full h-full">
        <DigitalTwinMap
          center={mapCenter}
          zoom={mapZoom}
          isDarkMode={mapStyle === 'dark'}
          selectedZone={selectedZone}
          onSelectZone={(z) => {
            onSelectZone(z);
            onSelectAsset(null);
          }}
          userLiveLocation={userLiveLocation}
          onTriggerLocateMe={onTriggerLocateMe}
          isLocating={isLocating}
          municipalServices={municipalServices}
          selectedServiceTypes={selectedServiceTypes}
          onSelectMunicipalAsset={handleAssetClick}
          sectors={sectors}
          hospitals={hospitals}
          fireStations={fireStations}
          policeStations={policeStations}
          parks={parks}
          transitNodes={transitNodes}
          roads={roads}
          floodZones={floodZones}
          heatZones={heatZones}
          activeSimulation={null}
          activeIncident={null}
          mapClickMode="inspect"
          onMapClickCoord={(coord) => {
            // Find closest sector
            let closest = sectors[0];
            let minD = Infinity;
            sectors.forEach((s) => {
              const d = Math.hypot(s.center[0] - coord[0], s.center[1] - coord[1]);
              if (d < minD) {
                minD = d;
                closest = s;
              }
            });
            if (minD < 0.04) {
              onSelectZone(closest);
              onSelectAsset(null);
            }
          }}
        />
      </div>

      {/* 4. OBJECT DETAIL SLIDE-OVER CARD (When a Sector or Facility is Clicked) */}
      {(selectedZone || selectedAsset) && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 z-40 bg-[#090e1c]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-5 text-slate-200 animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {selectedZone ? selectedZone.zoneType : selectedAsset?.serviceType.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Real GIS Object</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1 leading-tight">
                {selectedZone ? selectedZone.name : selectedAsset?.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedZone ? `${activeCity.name} Sector Unit` : selectedAsset?.address}
              </p>
            </div>
            <button
              onClick={() => {
                onSelectZone(null);
                onSelectAsset(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X size={15} />
            </button>
          </div>

          {/* Details Body */}
          <div className="mt-3.5 space-y-3 text-xs">
            {selectedZone && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-slate-400 block uppercase">Population</span>
                    <span className="text-sm font-bold text-white">{selectedZone.population.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-slate-400 block uppercase">Density</span>
                    <span className="text-sm font-bold text-white">{selectedZone.populationDensity} / km²</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-slate-400 block uppercase">Air Quality (AQI)</span>
                    <span className={`text-sm font-bold ${selectedZone.avgAqi > 200 ? 'text-red-400' : 'text-amber-400'}`}>
                      {selectedZone.avgAqi}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-slate-400 block uppercase">Traffic Stress</span>
                    <span className="text-sm font-bold text-cyan-300">{selectedZone.trafficStressLevel}</span>
                  </div>
                </div>

                {selectedZone.infrastructureGaps && selectedZone.infrastructureGaps.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Identified Urban Gaps:
                    </span>
                    <ul className="space-y-1">
                      {selectedZone.infrastructureGaps.map((gap, idx) => (
                        <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                          <span className="text-cyan-400 shrink-0">•</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {selectedAsset && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Capacity / Load:</span>
                    <span className="font-semibold text-white">{selectedAsset.capacityOrLoad}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Operational Status:</span>
                    <span className="text-emerald-400 font-semibold">{selectedAsset.status}</span>
                  </div>
                  {selectedAsset.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Emergency Desk:</span>
                      <span className="font-mono text-cyan-300">{selectedAsset.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Data Source:</span>
                    <span className="text-slate-300">{selectedAsset.source}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
            <button
              onClick={() => onSwitchToSimulator(selectedZone || undefined)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition-colors"
            >
              <Zap size={13} />
              <span>Simulate in What-If</span>
            </button>
            <button
              onClick={() => {
                const targetName = selectedZone ? selectedZone.name : selectedAsset?.name;
                onAskAI(`Assess urban infrastructure vulnerabilities and emergency accessibility for ${targetName} in ${activeCity.name}.`);
              }}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Ask AI Urban Planner"
            >
              <Sparkles size={14} className="text-sky-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
