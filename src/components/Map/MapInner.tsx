'use client';

import React, { useEffect, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polygon, 
  Polyline, 
  Circle, 
  useMap, 
  useMapEvents 
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
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
  EmergencyIncident 
} from '@/types';

// Fix default Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom SVG Icons for high-tech command center aesthetic
const createCustomIcon = (bgColor: string, symbol: string, size: number = 32) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${size * 0.45}px;
        box-shadow: 0 0 12px ${bgColor}99, 0 2px 6px rgba(0,0,0,0.6);
        border: 2px solid white;
      ">
        ${symbol}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const hospitalIcon = createCustomIcon('#ef4444', '🏥', 30);
const fireIcon = createCustomIcon('#f97316', '🚒', 30);
const policeIcon = createCustomIcon('#3b82f6', '👮', 28);
const parkIcon = createCustomIcon('#10b981', '🌳', 28);
const metroIcon = createCustomIcon('#8b5cf6', '🚇', 28);
const incidentIcon = createCustomIcon('#dc2626', '⚠️', 36);
const proposedIcon = createCustomIcon('#06b6d4', '✨', 34);

interface MapInnerProps {
  center: [number, number];
  zoom: number;
  isDarkMode: boolean;
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone | null) => void;
  layers: {
    roads: boolean;
    hospitals: boolean;
    fireStations: boolean;
    policeStations: boolean;
    parks: boolean;
    transit: boolean;
    floodZones: boolean;
    heatZones: boolean;
    populationDensity: boolean;
    coverageIsochrones: boolean;
  };
  sectors: Zone[];
  hospitals: Hospital[];
  fireStations: FireStation[];
  policeStations: PoliceStation[];
  parks: Park[];
  transitNodes: TransitNode[];
  roads: RoadCorridor[];
  floodZones: FloodRiskZone[];
  heatZones: HeatRiskZone[];
  activeSimulation: SimulationResult | null;
  activeIncident: EmergencyIncident | null;
  mapClickMode: 'inspect' | 'simulation_drop' | 'incident_drop';
  onMapClickCoord: (coord: [number, number]) => void;
}

// Controller component to smoothly pan/zoom when sector is selected
function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

// Click event handler
function MapEvents({ onMapClick, mode }: { onMapClick: (coord: [number, number]) => void; mode: string }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

export default function MapInner({
  center,
  zoom,
  isDarkMode,
  selectedZone,
  onSelectZone,
  layers,
  sectors,
  hospitals,
  fireStations,
  policeStations,
  parks,
  transitNodes,
  roads,
  floodZones,
  heatZones,
  activeSimulation,
  activeIncident,
  mapClickMode,
  onMapClickCoord,
}: MapInnerProps) {
  // Tile layer URL
  // Dark CartoDB vs Standard OpenStreetMap
  const tileUrl = isDarkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution = isDarkMode
    ? '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%', background: isDarkMode ? '#0f172a' : '#f1f5f9' }}
        zoomControl={false}
      >
        <MapRecenter center={center} zoom={zoom} />
        <MapEvents onMapClick={onMapClickCoord} mode={mapClickMode} />

        <TileLayer attribution={attribution} url={tileUrl} />

        {/* 1. SECTOR BOUNDARIES & POPULATION DENSITY */}
        {sectors.map((zone) => {
          const isSelected = selectedZone?.id === zone.id;
          // Choropleth color based on population density
          let fillColor = '#3b82f6';
          let fillOpacity = 0.15;

          if (layers.populationDensity) {
            if (zone.populationDensity > 20000) fillColor = '#ef4444';
            else if (zone.populationDensity > 14000) fillColor = '#f97316';
            else if (zone.populationDensity > 8000) fillColor = '#eab308';
            else fillColor = '#3b82f6';
            fillOpacity = isSelected ? 0.45 : 0.28;
          } else {
            fillOpacity = isSelected ? 0.35 : 0.1;
          }

          return (
            <Polygon
              key={zone.id}
              positions={zone.boundary}
              pathOptions={{
                color: isSelected ? '#06b6d4' : '#64748b',
                weight: isSelected ? 3 : 1.5,
                fillColor,
                fillOpacity,
                dashArray: isSelected ? undefined : '4, 4'
              }}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  onSelectZone(zone);
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="text-xs p-1 text-slate-800 dark:text-slate-100">
                  <div className="font-bold text-sm text-cyan-500 mb-1">{zone.name}</div>
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    <div><span className="text-slate-400">Sector:</span> {zone.sectorNumber}</div>
                    <div><span className="text-slate-400">Type:</span> {zone.zoneType}</div>
                    <div><span className="text-slate-400">Pop:</span> {zone.population.toLocaleString('en-IN')}</div>
                    <div><span className="text-slate-400">Density:</span> {zone.populationDensity}/km²</div>
                    <div><span className="text-slate-400">AQI:</span> {zone.avgAqi}</div>
                    <div><span className="text-slate-400">Flood:</span> {zone.floodRiskScore}/10</div>
                  </div>
                  <button
                    onClick={() => onSelectZone(zone)}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-1 px-2 rounded text-center transition"
                  >
                    Inspect Zone Details
                  </button>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* 2. FLOOD RISK VECTORS & BASINS */}
        {layers.floodZones &&
          floodZones.map((fz) => (
            <Polygon
              key={fz.id}
              positions={fz.coordinates}
              pathOptions={{
                color: fz.riskLevel === 'Critical' ? '#dc2626' : '#2563eb',
                fillColor: '#3b82f6',
                fillOpacity: 0.35,
                weight: 2,
                dashArray: '3, 6'
              }}
            >
              <Popup>
                <div className="text-xs p-1">
                  <div className="font-bold text-blue-600">{fz.name}</div>
                  <div className="text-slate-600 my-1">
                    Risk Level: <span className="font-semibold text-red-600">{fz.riskLevel}</span> (Elev: {fz.elevationMeters}m)
                  </div>
                  <div className="text-slate-500 text-[11px] mb-1">
                    Max Waterlogging: {fz.historicalWaterloggingDepthCm} cm
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Corridor: {fz.drainageCorridor}
                  </div>
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* 3. URBAN HEAT RISK HOTSPOTS */}
        {layers.heatZones &&
          heatZones.map((hz) => (
            <Polygon
              key={hz.id}
              positions={hz.coordinates}
              pathOptions={{
                color: '#ea580c',
                fillColor: '#f97316',
                fillOpacity: 0.3,
                weight: 2
              }}
            >
              <Popup>
                <div className="text-xs p-1">
                  <div className="font-bold text-orange-600">{hz.name}</div>
                  <div className="my-1">
                    UHI Thermal Delta: <span className="font-bold text-red-600">+{hz.surfaceTempDeltaC}°C</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Impervious Surface: {hz.imperviousSurfacePct}% | Veg Deficit: {hz.vegetationDeficitPct}%
                  </div>
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* 4. MAJOR ARTERIAL ROADS */}
        {layers.roads &&
          roads.map((road) => {
            const isClosed = activeSimulation?.affectedRoadIds?.includes(road.id);
            const roadColor = isClosed
              ? '#ef4444'
              : road.highwayType === 'motorway'
              ? '#f59e0b'
              : road.highwayType === 'trunk'
              ? '#06b6d4'
              : '#64748b';

            return (
              <Polyline
                key={road.id}
                positions={road.coordinates}
                pathOptions={{
                  color: roadColor,
                  weight: isClosed ? 6 : road.lanes >= 6 ? 4 : 2.5,
                  dashArray: isClosed ? '6, 6' : undefined,
                  opacity: 0.85
                }}
              >
                <Popup>
                  <div className="text-xs p-1">
                    <div className="font-bold">{road.name}</div>
                    <div>Type: {road.highwayType} ({road.lanes} lanes)</div>
                    <div>Speed: {road.avgSpeedKmh} km/h (Limit: {road.maxSpeedKmh} km/h)</div>
                    <div>Congestion: {road.congestionLevel}</div>
                    {isClosed && (
                      <div className="mt-1 text-red-600 font-bold bg-red-100 p-1 rounded">
                        ⛔ CLOSED UNDER SIMULATION
                      </div>
                    )}
                  </div>
                </Popup>
              </Polyline>
            );
          })}

        {/* 5. DETOUR ROUTE (IF ROAD CLOSED UNDER SIMULATION) */}
        {activeSimulation?.detourRouteCoordinates && (
          <Polyline
            positions={activeSimulation.detourRouteCoordinates}
            pathOptions={{
              color: '#10b981',
              weight: 5,
              dashArray: '8, 8',
              opacity: 0.95
            }}
          />
        )}

        {/* 6. EMERGENCY ROUTE LINE */}
        {activeIncident && activeIncident.primaryRouteCoordinates.length > 0 && (
          <Polyline
            positions={activeIncident.primaryRouteCoordinates}
            pathOptions={{
              color: '#ef4444',
              weight: 5,
              opacity: 0.9
            }}
          />
        )}

        {/* 7. EMERGENCY ISOCHRONES / COVERAGE BUFFERS */}
        {layers.coverageIsochrones && (
          <>
            {fireStations.map((fs) => (
              <Circle
                key={`iso-fire-${fs.id}`}
                center={fs.coordinates}
                radius={fs.coverageRadiusKm * 1000}
                pathOptions={{
                  color: '#f97316',
                  fillColor: '#f97316',
                  fillOpacity: 0.06,
                  weight: 1,
                  dashArray: '4, 8'
                }}
              />
            ))}
            {hospitals.map((hosp) => (
              <Circle
                key={`iso-hosp-${hosp.id}`}
                center={hosp.coordinates}
                radius={hosp.coverageRadiusKm * 1000}
                pathOptions={{
                  color: '#ef4444',
                  fillColor: '#ef4444',
                  fillOpacity: 0.04,
                  weight: 1,
                  dashArray: '3, 6'
                }}
              />
            ))}
          </>
        )}

        {/* 8. SIMULATION PROPOSED COVERAGE BUFFER */}
        {activeSimulation?.newCoveragePolygon && (
          <Polygon
            positions={activeSimulation.newCoveragePolygon}
            pathOptions={{
              color: '#06b6d4',
              fillColor: '#06b6d4',
              fillOpacity: 0.25,
              weight: 2,
              dashArray: '6, 6'
            }}
          />
        )}

        {/* 9. HOSPITALS */}
        {layers.hospitals &&
          hospitals.map((hosp) => (
            <Marker key={hosp.id} position={hosp.coordinates} icon={hospitalIcon}>
              <Popup>
                <div className="text-xs p-1">
                  <div className="font-bold text-red-600">{hosp.name}</div>
                  <div className="text-slate-600 text-[11px] mb-1">{hosp.hospitalType}</div>
                  <div className="grid grid-cols-2 gap-1 my-1">
                    <div>Beds: <b>{hosp.totalBeds}</b></div>
                    <div>ICU Beds: <b>{hosp.icuBeds}</b></div>
                    <div>Ambulances: <b>{hosp.ambulanceCount}</b></div>
                    <div>Radius: <b>{hosp.coverageRadiusKm} km</b></div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Source: {hosp.source}</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 10. FIRE STATIONS */}
        {layers.fireStations &&
          fireStations.map((fs) => (
            <Marker key={fs.id} position={fs.coordinates} icon={fireIcon}>
              <Popup>
                <div className="text-xs p-1">
                  <div className="font-bold text-orange-600">{fs.name}</div>
                  <div className="grid grid-cols-2 gap-1 my-1">
                    <div>Engines: <b>{fs.fireEngines}</b></div>
                    <div>Personnel: <b>{fs.personnelCount}</b></div>
                    <div>Coverage: <b>{fs.coverageRadiusKm} km</b></div>
                    <div>Hydrant: <b>{fs.hydrantSupport ? 'Yes' : 'No'}</b></div>
                  </div>
                  <div className="text-slate-500 text-[11px]">Phone: {fs.phone}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Source: {fs.source}</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 11. POLICE STATIONS */}
        {layers.policeStations &&
          policeStations.map((ps) => (
            <Marker key={ps.id} position={ps.coordinates} icon={policeIcon}>
              <Popup>
                <div className="text-xs p-1">
                  <div className="font-bold text-blue-600">{ps.name}</div>
                  <div className="my-1">
                    Patrol Vehicles: <b>{ps.patrolVehicles}</b> | Radius: <b>{ps.jurisdictionRadiusKm} km</b>
                  </div>
                  <div className="text-slate-500 text-[11px]">Phone: {ps.phone}</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 12. PARKS */}
        {layers.parks &&
          parks.map((park) => (
            <Marker key={park.id} position={park.coordinates} icon={parkIcon}>
              <Popup>
                <div className="text-xs p-1">
                  <div className="font-bold text-emerald-600">{park.name}</div>
                  <div className="my-1">
                    Area: <b>{park.areaAcres} Acres</b> | Canopy: <b>{park.canopyCoveragePct}%</b>
                  </div>
                  <div className="text-emerald-700 font-medium text-[11px]">
                    UHI Cooling Delta: -{park.uhiReductionC}°C (Buffer: {park.coolingRadiusM}m)
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 13. TRANSIT NODES */}
        {layers.transit &&
          transitNodes.map((tn) => (
            <Marker key={tn.id} position={tn.coordinates} icon={metroIcon}>
              <Popup>
                <div className="text-xs p-1">
                  <div className="font-bold text-purple-600">{tn.name}</div>
                  <div className="text-slate-600 text-[11px]">{tn.lineName || tn.stopType}</div>
                  <div className="mt-1">
                    Daily Footfall: <b>{tn.dailyFootfall.toLocaleString('en-IN')}</b>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 14. ACTIVE EMERGENCY INCIDENT PIN */}
        {activeIncident && (
          <Marker position={activeIncident.location} icon={incidentIcon}>
            <Popup>
              <div className="text-xs p-1 text-red-600 font-bold">
                🚨 {activeIncident.type.toUpperCase()} INCIDENT
                <div className="text-slate-800 text-[11px] font-normal mt-1">
                  Location: {activeIncident.sectorName}
                </div>
                <div className="text-slate-600 text-[11px]">
                  Population at Risk: <b>{activeIncident.populationWithin500m.toLocaleString('en-IN')}</b>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Mode Indicator Overlay */}
      {mapClickMode !== 'inspect' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-cyan-900/90 text-cyan-200 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-500/50 shadow-xl flex items-center gap-2 text-xs font-semibold animate-pulse">
          <span>🎯</span>
          <span>
            {mapClickMode === 'simulation_drop'
              ? 'Click anywhere on the map to place the Proposed Facility'
              : 'Click on the map to trigger an Emergency Incident Dispatch'}
          </span>
        </div>
      )}
    </div>
  );
}
