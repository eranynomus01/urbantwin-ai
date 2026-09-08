// ============================================================================
// UrbanTwin AI — Core TypeScript Types & Spatial Interfaces
// ============================================================================

export type UserRole = 'urban_planner' | 'administrator' | 'public_viewer';

export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  center: [number, number]; // [lat, lng]
  defaultZoom: number;
  boundingBox: [[number, number], [number, number]]; // [[southLat, westLng], [northLat, eastLng]]
  isActive: boolean;
  tagline: string;
  totalPopulation: number;
  totalAreaSqKm: number;
}

export interface Zone {
  id: string;
  cityId: string;
  name: string;
  sectorNumber: string;
  zoneType: 'commercial' | 'residential' | 'industrial' | 'mixed' | 'special_economic_zone' | 'recreational';
  areaSqKm: number;
  population: number;
  populationDensity: number; // persons per sq km
  roadDensityKmPerSqKm: number;
  hospitalCount: number;
  schoolCount: number;
  fireStationCount: number;
  policeStationCount: number;
  parkCount: number;
  floodRiskScore: number; // 0 to 10 scale
  heatRiskScore: number;  // 0 to 10 scale
  boundary: [number, number][]; // Polygon vertices [lat, lng]
  center: [number, number]; // [lat, lng]
  avgAqi: number;
  trafficStressLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  infrastructureGaps: string[];
  keyLandmarks: string[];
}

export interface Hospital {
  id: string;
  cityId: string;
  name: string;
  hospitalType: 'Trauma Center & Multispeciality' | 'Super Speciality' | 'Civil General Hospital' | 'Community Health Center';
  totalBeds: number;
  icuBeds: number;
  emergencyAvailable: boolean;
  ambulanceCount: number;
  phone: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  coverageRadiusKm: number;
  source: string;
}

export interface FireStation {
  id: string;
  cityId: string;
  name: string;
  fireEngines: number;
  hydrantSupport: boolean;
  personnelCount: number;
  phone: string;
  address: string;
  coverageRadiusKm: number;
  responseSpeedKmh: number;
  coordinates: [number, number]; // [lat, lng]
  source: string;
}

export interface PoliceStation {
  id: string;
  cityId: string;
  name: string;
  patrolVehicles: number;
  jurisdictionRadiusKm: number;
  phone: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  source: string;
}

export interface School {
  id: string;
  cityId: string;
  name: string;
  schoolType: 'Public Secondary' | 'Private International' | 'University / Institute';
  capacity: number;
  coordinates: [number, number]; // [lat, lng]
  source: string;
}

export interface Park {
  id: string;
  cityId: string;
  name: string;
  areaAcres: number;
  canopyCoveragePct: number;
  coolingRadiusM: number; // Urban Heat mitigation radius
  uhiReductionC: number;  // Micro-climate temperature drop
  coordinates: [number, number]; // [lat, lng]
  boundary?: [number, number][];
  source: string;
}

export interface TransitNode {
  id: string;
  cityId: string;
  name: string;
  stopType: 'metro_station' | 'bus_terminal' | 'bus_stop' | 'railway_station';
  lineName?: string;
  dailyFootfall: number;
  coordinates: [number, number]; // [lat, lng]
  source: string;
}

export interface RoadCorridor {
  id: string;
  cityId: string;
  name: string;
  highwayType: 'motorway' | 'trunk' | 'primary' | 'secondary' | 'arterial';
  lanes: number;
  maxSpeedKmh: number;
  lengthKm: number;
  coordinates: [number, number][]; // LineString
  isClosed?: boolean;
  congestionLevel: 'Low' | 'Moderate' | 'Heavy' | 'Standstill';
  avgSpeedKmh: number;
  source: string;
}

export interface FloodRiskZone {
  id: string;
  cityId: string;
  name: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  elevationMeters: number;
  historicalWaterloggingDepthCm: number;
  drainageCorridor: string;
  drainCapacityAdequacyPct: number;
  coordinates: [number, number][]; // Polygon
  center: [number, number];
  primaryCauses: string[];
}

export interface HeatRiskZone {
  id: string;
  cityId: string;
  name: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  surfaceTempDeltaC: number;
  vegetationDeficitPct: number;
  imperviousSurfacePct: number;
  vulnerablePopulation: number;
  center: [number, number];
  coordinates: [number, number][];
  recommendedInterventions: string[];
}

// ----------------------------------------------------------------------------
// Telemetry & Real-Time Data Types
// ----------------------------------------------------------------------------
export interface WeatherTelemetry {
  temperatureC: number;
  feelsLikeC: number;
  humidityPct: number;
  rainfallMmPerHr: number;
  windSpeedKmh: number;
  windDirection: string;
  conditionText: string;
  uvIndex: number;
  sourceName: string;
  sourceUrl: string;
  lastUpdated: string;
  isRealTime: boolean;
}

export interface AirQualityTelemetry {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
  category: 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  stationName: string;
  sourceName: string;
  sourceUrl: string;
  lastUpdated: string;
  isRealTime: boolean;
}

export interface UserLiveLocation {
  lat: number;
  lng: number;
  accuracyM?: number;
  timestamp: string;
  nearestSectorName?: string;
  nearestHospitalName?: string;
  nearestHospitalDistKm?: number;
  nearestFireStationName?: string;
  nearestFireDistKm?: number;
}

export interface RealTimeCityTelemetry {
  cityId: string;
  cityName: string;
  isUserLiveLocation?: boolean;
  userCoords?: [number, number];
  weather: WeatherTelemetry;
  airQuality: AirQualityTelemetry;
  trafficSummary: {
    overallIndex: number; // 0 to 100 congestion
    congestedCorridorsCount: number;
    avgCitySpeedKmh: number;
    sourceName: string;
    lastUpdated: string;
  };
  emergencyStatus: {
    activeIncidentsCount: number;
    avgFireResponseTimeMin: number;
    avgAmbulanceResponseTimeMin: number;
    systemAlertLevel: 'NORMAL' | 'ELEVATED' | 'HIGH_ALERT';
  };
}

// ----------------------------------------------------------------------------
// Transparency & Data Quality Types
// ----------------------------------------------------------------------------
export interface DataSourceItem {
  id: string;
  datasetName: string;
  providerName: string;
  sourceUrl: string;
  licenseType: string;
  updateFrequency: 'Real-Time (5-15 min)' | 'Hourly' | 'Daily' | 'Continuous (GIS Sync)' | 'Annual Census / Survey';
  spatialCoverage: string;
  reliabilityScore: number; // 0-100%
  description: string;
  lastSyncedAt: string;
  isLive: boolean;
  attributesUsed: string[];
}

export interface DataQualityMetric {
  overallScorePct: number;
  completenessPct: number;
  spatialAccuracyPct: number;
  freshnessScorePct: number;
  schemaValidationPct: number;
  totalEntitiesCount: number;
  validationsRun: number;
  missingDataItems: {
    dataset: string;
    missingAttribute: string;
    reason: string;
    fallbackStrategy: string;
  }[];
}

// ----------------------------------------------------------------------------
// What-If Simulation Engine Types
// ----------------------------------------------------------------------------
export type SimulationType = 
  | 'road_closure' 
  | 'new_hospital' 
  | 'new_fire_station' 
  | 'new_park' 
  | 'new_transit_hub';

export interface RoadClosureParams {
  roadId: string;
  roadName: string;
  closureDurationHours: number;
  closureReason?: string;
  detourCorridors: string[];
}

export interface NewHospitalParams {
  proposedLocation: [number, number];
  name: string;
  targetBeds: number;
  icuBeds: number;
  coverageRadiusKm: number;
}

export interface NewFireStationParams {
  proposedLocation: [number, number];
  name: string;
  fireEngines: number;
  coverageRadiusKm: number;
}

export interface NewParkParams {
  proposedLocation: [number, number];
  name: string;
  areaAcres: number;
  canopyCoveragePct: number;
}

export interface NewTransitHubParams {
  proposedLocation: [number, number];
  name: string;
  transitType: 'metro_station' | 'bus_terminal' | 'multimodal_interchange';
  targetDailyCapacity: number;
}

export interface SimulationResult {
  simulationType: SimulationType;
  scenarioName: string;
  impactScore: number; // 0 to 100
  affectedPopulation: number;
  deltaResponseTimeMin: number; // e.g. -2.3 min
  trafficDelayIndexDelta: number; // e.g. +18.5%
  uhiMitigationC: number; // e.g. -1.8 °C
  transitCatchmentGain: number; // population gained
  healthcareCoverageIncreasePct: number;
  fireCoverageIncreasePct: number;
  newCoveragePolygon?: [number, number][];
  affectedRoadIds?: string[];
  detourRouteCoordinates?: [number, number][];
  keyFindings: string[];
  aiExecutiveSummary?: string;
  calculationBreakdown: {
    metric: string;
    baseline: string | number;
    simulated: string | number;
    delta: string | number;
    direction: 'positive' | 'negative' | 'neutral';
  }[];
}

// ----------------------------------------------------------------------------
// Emergency Response & Incident Dispatch Types
// ----------------------------------------------------------------------------
export type IncidentType = 'fire' | 'medical' | 'road_accident' | 'flash_flood' | 'structural_hazard';

export interface EmergencyIncident {
  id: string;
  type: IncidentType;
  severity: 'Critical (Tier 1)' | 'High (Tier 2)' | 'Moderate (Tier 3)';
  location: [number, number];
  addressDescription: string;
  sectorName: string;
  populationWithin500m: number;
  nearestFireStation: {
    id: string;
    name: string;
    distanceKm: number;
    estimatedDriveTimeMin: number;
    coordinates: [number, number];
  };
  nearestHospital: {
    id: string;
    name: string;
    type: string;
    distanceKm: number;
    estimatedDriveTimeMin: number;
    coordinates: [number, number];
  };
  nearestPoliceStation: {
    id: string;
    name: string;
    distanceKm: number;
    coordinates: [number, number];
  };
  primaryRouteCoordinates: [number, number][];
  alternativeRouteCoordinates?: [number, number][];
  trafficCongestionFactor: number;
  actionPlan: string[];
}

// ----------------------------------------------------------------------------
// Multi-Scenario Comparison Types
// ----------------------------------------------------------------------------
export interface ScenarioItem {
  id: string;
  name: string;
  description: string;
  simulationType: SimulationType;
  cityId: string;
  createdAt: string;
  author: string;
  kpis: {
    avgEmergencyResponseMin: number;
    healthcareCoveragePct: number;
    fireCoveragePct: number;
    trafficCongestionIndex: number;
    greenSpacePerCapitaSqM: number;
    floodVulnerabilityScore: number;
    uhiExtremeAreaPct: number;
    overallUrbanResilienceScore: number; // 0 to 100
  };
  simulationDelta?: SimulationResult;
}

// ----------------------------------------------------------------------------
// AI Urban Planner Grounded Schema
// ----------------------------------------------------------------------------
export interface AIAdvisorQueryPayload {
  cityId: string;
  cityName: string;
  userQuery: string;
  selectedZone?: Zone | null;
  activeSimulation?: SimulationResult | null;
  currentTelemetry?: RealTimeCityTelemetry | null;
  scenarioList?: ScenarioItem[];
}

export interface AIAdvisorResponse {
  query: string;
  groundedDataSummary: {
    city: string;
    zoneInspected?: string;
    populationEvaluated: number;
    activeConstraints: string[];
  };
  calculatedGisMetrics: {
    metric: string;
    value: string;
    sourceMethod: string;
  }[];
  aiStrategicAssessment: {
    summary: string;
    prosAndBenefits: string[];
    risksAndTradeoffs: string[];
    policyRecommendation: string;
  };
  priorityActionItems: {
    step: number;
    title: string;
    timeline: string;
    estimatedCostRangeInr: string;
    implementingAgency: string;
  }[];
  confidenceRating: 'High (Fully Grounded on Spatial DB)' | 'Medium (Interpolated)' | 'Model Projection';
}
