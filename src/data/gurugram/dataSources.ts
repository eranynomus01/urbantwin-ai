import { DataSourceItem, DataQualityMetric } from '@/types';

export const GURUGRAM_DATA_SOURCES: DataSourceItem[] = [
  {
    id: 'src-osm',
    datasetName: 'OpenStreetMap (OSM) Road Network, Buildings & Critical Infrastructure',
    providerName: 'OpenStreetMap Contributors & Overpass API',
    sourceUrl: 'https://www.openstreetmap.org/',
    licenseType: 'Open Database License (ODbL 1.0)',
    updateFrequency: 'Continuous (GIS Sync)',
    spatialCoverage: 'Gurugram Municipal & Manesar Development Area (232 sq.km)',
    reliabilityScore: 96.5,
    description: 'Vector infrastructure features including primary & secondary highway network, building footprints, hospitals, fire stations, police stations, parks, and transit nodes.',
    lastSyncedAt: '2026-09-01T12:00:00.000Z',
    isLive: true,
    attributesUsed: ['highway', 'amenity', 'building', 'leisure', 'railway', 'geometry']
  },
  {
    id: 'src-open-meteo',
    datasetName: 'Open-Meteo High-Resolution Weather & Precipitation Model',
    providerName: 'Open-Meteo / ECMWF IFS & DWD ICON',
    sourceUrl: 'https://open-meteo.com/',
    licenseType: 'Creative Commons Attribution 4.0 International (CC-BY 4.0)',
    updateFrequency: 'Hourly',
    spatialCoverage: 'Lat 28.4595, Lon 77.0266 (Gurugram Grid)',
    reliabilityScore: 98.0,
    description: 'Hourly surface temperature (°C), relative humidity (%), precipitation rate (mm/h), wind velocity & direction, solar radiation, and 24-hr rain forecasts.',
    lastSyncedAt: new Date().toISOString(),
    isLive: true,
    attributesUsed: ['temperature_2m', 'relative_humidity_2m', 'precipitation', 'wind_speed_10m', 'uv_index']
  },
  {
    id: 'src-openaq-cpcb',
    datasetName: 'National Air Quality Index (NAQI) & OpenAQ Live Feed',
    providerName: 'Central Pollution Control Board (CPCB) India / OpenAQ API',
    sourceUrl: 'https://openaq.org/ / https://cpcb.nic.in/',
    licenseType: 'Open Government Data (OGD) India / OpenAQ ODbL',
    updateFrequency: 'Real-Time (5-15 min)',
    spatialCoverage: 'Sector 51, Teri Gram, Vikas Sadan & Gwal Pahari Monitoring Stations',
    reliabilityScore: 94.2,
    description: 'Real-time particulate matter (PM2.5, PM10), Nitrogen Dioxide (NO2), Ozone (O3), Sulfur Dioxide (SO2) and calculated NAQI category.',
    lastSyncedAt: new Date().toISOString(),
    isLive: true,
    attributesUsed: ['aqi', 'pm25', 'pm10', 'no2', 'o3', 'so2', 'category']
  },
  {
    id: 'src-osrm-routing',
    datasetName: 'Open Source Routing Machine (OSRM) Road Graph Engine',
    providerName: 'Project OSRM / OpenStreetMap Routing Graph',
    sourceUrl: 'https://project-osrm.org/',
    licenseType: 'BSD 2-Clause License',
    updateFrequency: 'Real-Time (5-15 min)',
    spatialCoverage: 'National Capital Region (NCR) Road Graph',
    reliabilityScore: 97.0,
    description: 'Shortest path computation, isochrone generation, detour travel time calculations during road closures, and emergency dispatch routing.',
    lastSyncedAt: new Date().toISOString(),
    isLive: true,
    attributesUsed: ['distance_meters', 'duration_seconds', 'geometry_polyline', 'step_instructions']
  },
  {
    id: 'src-gmda-census',
    datasetName: 'Gurugram Master Plan 2031 & Census Ward Population Profiles',
    providerName: 'Gurugram Metropolitan Development Authority (GMDA) & Census of India',
    sourceUrl: 'https://gmda.gov.in/',
    licenseType: 'Government Public Access Document',
    updateFrequency: 'Annual Census / Survey',
    spatialCoverage: 'Sectors 1 to 115, DLF Phases 1-5, IMT Manesar',
    reliabilityScore: 92.0,
    description: 'Demographic density per sector, municipal ward boundaries, land-use zoning classifications, and planned drainage master outfall vectors.',
    lastSyncedAt: '2026-08-15T00:00:00.000Z',
    isLive: false,
    attributesUsed: ['sector_population', 'zoning_classification', 'drainage_capacity', 'area_sqkm']
  }
];

export const GURUGRAM_DATA_QUALITY_METRIC: DataQualityMetric = {
  overallScorePct: 94.5,
  completenessPct: 96.0,
  spatialAccuracyPct: 98.2,
  freshnessScorePct: 92.8,
  schemaValidationPct: 99.0,
  totalEntitiesCount: 148,
  validationsRun: 740,
  missingDataItems: [
    {
      dataset: 'GMCBL City Bus Telemetry',
      missingAttribute: 'Real-time GPS AVL for all secondary feeder routes',
      reason: 'Live transit GTFS-RT feed undergoing API maintenance by provider',
      fallbackStrategy: 'Using scheduled timetable frequencies & fixed stop locations'
    },
    {
      dataset: 'Sub-surface Storm Drainage Sensors',
      missingAttribute: 'In-pipe water velocity telemetry along secondary arterial culverts',
      reason: 'IoT sensor network deployed at 12 primary outfalls only',
      fallbackStrategy: 'Numerical hydraulic runoff model based on terrain slope and rainfall rate'
    }
  ]
};
