import { 
  Zone, 
  Hospital, 
  FireStation, 
  PoliceStation, 
  Park, 
  TransitNode, 
  RoadCorridor, 
  FloodRiskZone, 
  HeatRiskZone 
} from '@/types';

// ============================================================================
// HISAR SECTORS & LOCALITIES (Real GIS Data)
// ============================================================================
export const HISAR_SECTORS: Zone[] = [
  {
    id: 'hisar-model-town',
    cityId: 'hisar',
    name: 'Model Town & Civil Lines',
    sectorNumber: 'Civil Lines / Model Town',
    zoneType: 'residential',
    areaSqKm: 5.2,
    population: 38400,
    populationDensity: 7385,
    roadDensityKmPerSqKm: 14.2,
    hospitalCount: 3,
    schoolCount: 5,
    fireStationCount: 1,
    policeStationCount: 2,
    parkCount: 4,
    floodRiskScore: 2.8,
    heatRiskScore: 6.4,
    center: [29.1560, 75.7220],
    boundary: [
      [29.1630, 75.7140],
      [29.1650, 75.7310],
      [29.1480, 75.7330],
      [29.1460, 75.7160],
      [29.1630, 75.7140]
    ],
    avgAqi: 168,
    trafficStressLevel: 'Moderate',
    infrastructureGaps: [
      'Peak-hour congestion at Camp Chowk intersection',
      'Underground stormwater drainage upgrade needed along Delhi Road',
      'Need for pedestrian green corridor'
    ],
    keyLandmarks: ['Civil Hospital', 'Camp Chowk', 'Jindal Hospital', 'Old Court Complex']
  },
  {
    id: 'hisar-sector-14',
    cityId: 'hisar',
    name: 'Sector 14 Institutional & Commercial Belt',
    sectorNumber: 'Sector 14',
    zoneType: 'commercial',
    areaSqKm: 4.1,
    population: 28600,
    populationDensity: 6975,
    roadDensityKmPerSqKm: 16.5,
    hospitalCount: 2,
    schoolCount: 4,
    fireStationCount: 1,
    policeStationCount: 1,
    parkCount: 6,
    floodRiskScore: 3.1,
    heatRiskScore: 7.2,
    center: [29.1380, 75.7310],
    boundary: [
      [29.1450, 75.7220],
      [29.1470, 75.7410],
      [29.1300, 75.7430],
      [29.1280, 75.7240],
      [29.1450, 75.7220]
    ],
    avgAqi: 172,
    trafficStressLevel: 'High',
    infrastructureGaps: [
      'Commercial parking spillover on arterial road',
      'EV fast-charging station shortage',
      'Rooftop solar adoption at 28%'
    ],
    keyLandmarks: ['Town Park Sector 14', 'Shopping Complex', 'HUDA Office', 'DAV Public School']
  },
  {
    id: 'hisar-urban-estate-2',
    cityId: 'hisar',
    name: 'Urban Estate II & Sector 13',
    sectorNumber: 'Urban Estate II',
    zoneType: 'residential',
    areaSqKm: 6.4,
    population: 41200,
    populationDensity: 6437,
    roadDensityKmPerSqKm: 15.1,
    hospitalCount: 2,
    schoolCount: 6,
    fireStationCount: 0,
    policeStationCount: 1,
    parkCount: 8,
    floodRiskScore: 2.2,
    heatRiskScore: 5.8,
    center: [29.1620, 75.7420],
    boundary: [
      [29.1710, 75.7320],
      [29.1730, 75.7530],
      [29.1530, 75.7550],
      [29.1510, 75.7340],
      [29.1710, 75.7320]
    ],
    avgAqi: 154,
    trafficStressLevel: 'Low',
    infrastructureGaps: [
      'Nearest fire station is 4.8 km away (response ETA 9.5 min)',
      'Tertiary water pressure fluctuates during summer peak',
      'Transit bus connectivity to Cantt'
    ],
    keyLandmarks: ['Community Center Sector 13', 'DPS Hisar', 'Green Belt Walkway']
  },
  {
    id: 'hisar-ccs-hau',
    cityId: 'hisar',
    name: 'CCS Haryana Agricultural University & Green Campus',
    sectorNumber: 'HAU Campus',
    zoneType: 'mixed',
    areaSqKm: 9.8,
    population: 22400,
    populationDensity: 2285,
    roadDensityKmPerSqKm: 9.8,
    hospitalCount: 1,
    schoolCount: 3,
    fireStationCount: 1,
    policeStationCount: 1,
    parkCount: 12,
    floodRiskScore: 2.0,
    heatRiskScore: 3.2,
    center: [29.1450, 75.7050],
    boundary: [
      [29.1580, 75.6900],
      [29.1600, 75.7180],
      [29.1320, 75.7200],
      [29.1300, 75.6920],
      [29.1580, 75.6900]
    ],
    avgAqi: 135,
    trafficStressLevel: 'Low',
    infrastructureGaps: [
      'Agro-climatic runoff harvesting system needs desilting',
      'Campus solar grid integration at 60%',
      'Perimeter emergency gate automation'
    ],
    keyLandmarks: ['Giri Centre Indoor Stadium', 'Gandhi Bhawan', 'HAU Research Fields', 'Nehru Library']
  },
  {
    id: 'hisar-industrial-area',
    cityId: 'hisar',
    name: 'Industrial Area Phase I & II (Steel & Pipe Cluster)',
    sectorNumber: 'Industrial Belt',
    zoneType: 'industrial',
    areaSqKm: 7.5,
    population: 19800,
    populationDensity: 2640,
    roadDensityKmPerSqKm: 12.8,
    hospitalCount: 1,
    schoolCount: 1,
    fireStationCount: 1,
    policeStationCount: 1,
    parkCount: 2,
    floodRiskScore: 4.8,
    heatRiskScore: 9.1,
    center: [29.1240, 75.7480],
    boundary: [
      [29.1330, 75.7350],
      [29.1350, 75.7600],
      [29.1120, 75.7620],
      [29.1100, 75.7370],
      [29.1330, 75.7350]
    ],
    avgAqi: 215,
    trafficStressLevel: 'Severe',
    infrastructureGaps: [
      'High surface heat retention from steel fabrication plants',
      'Heavy transport truck queuing on Balsamand Road',
      'Industrial wastewater effluent treatment capacity'
    ],
    keyLandmarks: ['Jindal Stainless Complex', 'Industrial Area Substation', 'ESIC Dispensary', 'Container Depot']
  },
  {
    id: 'hisar-cantt',
    cityId: 'hisar',
    name: 'Hisar Cantt & Military Logistics Station',
    sectorNumber: 'Cantt Zone',
    zoneType: 'institutional',
    areaSqKm: 12.4,
    population: 34200,
    populationDensity: 2758,
    roadDensityKmPerSqKm: 11.2,
    hospitalCount: 2,
    schoolCount: 4,
    fireStationCount: 1,
    policeStationCount: 2,
    parkCount: 8,
    floodRiskScore: 2.1,
    heatRiskScore: 4.5,
    center: [29.1760, 75.7720],
    boundary: [
      [29.1900, 75.7500],
      [29.1920, 75.7920],
      [29.1620, 75.7950],
      [29.1600, 75.7520],
      [29.1900, 75.7500]
    ],
    avgAqi: 142,
    trafficStressLevel: 'Low',
    infrastructureGaps: [
      'Access control corridor delays on NH-9 flyover junction',
      'Dedicated dual-source emergency power feeder required'
    ],
    keyLandmarks: ['Military Hospital Hisar', 'Army Public School', 'Cantt Railway Station', 'Parade Ground']
  }
];

// ============================================================================
// HOSPITALS (HISAR)
// ============================================================================
export const HISAR_HOSPITALS: Hospital[] = [
  {
    id: 'hsr-hosp-civil',
    cityId: 'hisar',
    name: 'Civil Hospital Hisar (Apex District Center)',
    type: 'government',
    beds: 450,
    icuBeds: 45,
    hasEmergencyService: true,
    hasTraumaCenter: true,
    hasBurnUnit: true,
    coordinates: [29.1550, 75.7280],
    address: 'Camp Chowk, Delhi Road, Hisar',
    phone: '01662-232100',
    ambulanceCount: 8,
    occupancyRate: 82
  },
  {
    id: 'hsr-hosp-jindal',
    cityId: 'hisar',
    name: 'O.P. Jindal Modern Hospital & Heart Institute',
    type: 'private',
    beds: 350,
    icuBeds: 50,
    hasEmergencyService: true,
    hasTraumaCenter: true,
    hasBurnUnit: false,
    coordinates: [29.1510, 75.7260],
    address: 'Model Town, Hisar',
    phone: '01662-281000',
    ambulanceCount: 6,
    occupancyRate: 76
  },
  {
    id: 'hsr-hosp-military',
    cityId: 'hisar',
    name: 'Military Hospital Hisar Cantt',
    type: 'government',
    beds: 220,
    icuBeds: 24,
    hasEmergencyService: true,
    hasTraumaCenter: true,
    hasBurnUnit: true,
    coordinates: [29.1780, 75.7680],
    address: 'Military Station, Hisar Cantt',
    phone: '01662-259100',
    ambulanceCount: 4,
    occupancyRate: 64
  },
  {
    id: 'hsr-hosp-aadhar',
    cityId: 'hisar',
    name: 'Aadhar Health Institute & Cancer Centre',
    type: 'private',
    beds: 200,
    icuBeds: 35,
    hasEmergencyService: true,
    hasTraumaCenter: false,
    hasBurnUnit: false,
    coordinates: [29.1360, 75.7330],
    address: 'Tosham Road, Near Sector 14, Hisar',
    phone: '01662-276600',
    ambulanceCount: 3,
    occupancyRate: 70
  }
];

// ============================================================================
// FIRE STATIONS (HISAR)
// ============================================================================
export const HISAR_FIRE_STATIONS: FireStation[] = [
  {
    id: 'hsr-fire-central',
    cityId: 'hisar',
    name: 'Hisar Central Fire Headquarters',
    fireEngines: 6,
    hydraulicPlatforms: 1,
    personnelCount: 38,
    coverageRadiusKm: 8.5,
    coordinates: [29.1530, 75.7270],
    address: 'Camp Chowk / Old Court Road, Hisar',
    phone: '101 / 01662-232101',
    status: 'Operational'
  },
  {
    id: 'hsr-fire-industrial',
    cityId: 'hisar',
    name: 'Industrial Area Fire Station Phase I',
    fireEngines: 4,
    hydraulicPlatforms: 1,
    personnelCount: 24,
    coverageRadiusKm: 6.0,
    coordinates: [29.1260, 75.7460],
    address: 'Sector 27-28 / Industrial Belt, Hisar',
    phone: '01662-245101',
    status: 'Operational'
  },
  {
    id: 'hsr-fire-cantt',
    cityId: 'hisar',
    name: 'Cantt & Airport Emergency Fire Post',
    fireEngines: 4,
    hydraulicPlatforms: 1,
    personnelCount: 28,
    coverageRadiusKm: 9.0,
    coordinates: [29.1820, 75.7650],
    address: 'Hisar Cantt Airport Corridor',
    phone: '01662-259101',
    status: 'Operational'
  }
];

// ============================================================================
// POLICE STATIONS (HISAR)
// ============================================================================
export const HISAR_POLICE_STATIONS: PoliceStation[] = [
  {
    id: 'hsr-police-city',
    cityId: 'hisar',
    name: 'City Police Station & ICCC Command Link',
    type: 'station',
    personnel: 54,
    patrolVehicles: 6,
    coordinates: [29.1540, 75.7240],
    address: 'Near Nagori Gate, Hisar',
    phone: '01662-233100'
  },
  {
    id: 'hsr-police-civil-lines',
    cityId: 'hisar',
    name: 'Civil Lines Police Station',
    type: 'station',
    personnel: 42,
    patrolVehicles: 4,
    coordinates: [29.1580, 75.7290],
    address: 'Civil Lines, Camp Area, Hisar',
    phone: '01662-234100'
  },
  {
    id: 'hsr-police-urban-estate',
    cityId: 'hisar',
    name: 'Urban Estate Police Station Sector 13-14',
    type: 'station',
    personnel: 36,
    patrolVehicles: 4,
    coordinates: [29.1610, 75.7410],
    address: 'Sector 13, Urban Estate, Hisar',
    phone: '01662-241100'
  }
];

// ============================================================================
// PARKS & GREEN SPACES (HISAR)
// ============================================================================
export const HISAR_PARKS: Park[] = [
  {
    id: 'hsr-park-town',
    cityId: 'hisar',
    name: 'Town Park Sector 14 (Green Urban Lung)',
    areaSqKm: 0.65,
    treeCoverPercentage: 78,
    hasWaterBody: true,
    coordinates: [29.1390, 75.7330],
    address: 'Sector 14, Hisar'
  },
  {
    id: 'hsr-park-jindal',
    cityId: 'hisar',
    name: 'O.P. Jindal Gyan Kendra & Eco Park',
    areaSqKm: 0.85,
    treeCoverPercentage: 82,
    hasWaterBody: true,
    coordinates: [29.1530, 75.7380],
    address: 'Delhi Road, Hisar'
  },
  {
    id: 'hsr-park-kranti',
    cityId: 'hisar',
    name: 'Kranti Maan Memorial Heritage Park',
    areaSqKm: 0.42,
    treeCoverPercentage: 72,
    hasWaterBody: false,
    coordinates: [29.1610, 75.7190],
    address: 'Near Old Bus Stand, Hisar'
  }
];

// ============================================================================
// TRANSIT NODES (HISAR)
// ============================================================================
export const HISAR_TRANSIT_NODES: TransitNode[] = [
  {
    id: 'hsr-transit-isbt',
    cityId: 'hisar',
    name: 'Hisar Interstate Bus Terminal (ISBT)',
    type: 'bus_terminal',
    linesServed: ['Haryana Roadways Inter-District', 'Delhi-Hisar Express Line', 'Jaipur-Hisar Superfast'],
    dailyFootfall: 45000,
    coordinates: [29.1580, 75.7260],
    address: 'Delhi Road, Camp Chowk, Hisar'
  },
  {
    id: 'hsr-transit-rail',
    cityId: 'hisar',
    name: 'Hisar Junction Railway Terminal',
    type: 'metro_station',
    linesServed: ['Northern Railway Mainline', 'Ludhiana-Hisar-Rewari Line', 'Bhiwani-Hisar Express'],
    dailyFootfall: 38000,
    coordinates: [29.1660, 75.7170],
    address: 'Railway Station Road, Hisar'
  },
  {
    id: 'hsr-transit-airport',
    cityId: 'hisar',
    name: 'Maharaja Agrasen International Airport (Terminal 1)',
    type: 'bus_terminal',
    linesServed: ['UDAN Regional Commuter Flights', 'NCR Express Shuttle'],
    dailyFootfall: 6200,
    coordinates: [29.1860, 75.7560],
    address: 'Hisar Airport Road, NH-9 Link',
  }
];

// ============================================================================
// MAJOR ROADS (HISAR)
// ============================================================================
export const HISAR_ROADS: RoadCorridor[] = [
  {
    id: 'hsr-road-nh9',
    name: 'NH-9 (Delhi-Rohtak-Hisar-Sirsa Expressway Corridor)',
    type: 'expressway',
    lanes: 6,
    speedLimitKmh: 90,
    currentCongestionLevel: 'Moderate',
    averageSpeedKmh: 54.0,
    lengthKm: 18.5,
    criticalityScore: 9.8,
    coordinates: [
      [29.1880, 75.7800],
      [29.1760, 75.7620],
      [29.1640, 75.7420],
      [29.1550, 75.7250],
      [29.1460, 75.7020]
    ]
  },
  {
    id: 'hsr-road-delhi-rd',
    name: 'Delhi Road (Camp Chowk to Sector 14 / Town Park)',
    type: 'arterial',
    lanes: 4,
    speedLimitKmh: 50,
    currentCongestionLevel: 'High',
    averageSpeedKmh: 28.5,
    lengthKm: 7.2,
    criticalityScore: 8.9,
    coordinates: [
      [29.1550, 75.7280],
      [29.1480, 75.7330],
      [29.1380, 75.7350],
      [29.1280, 75.7420]
    ]
  },
  {
    id: 'hsr-road-tosham-rd',
    name: 'Tosham Road (Sector 14 to Balsamand Canal Link)',
    type: 'arterial',
    lanes: 4,
    speedLimitKmh: 60,
    currentCongestionLevel: 'Moderate',
    averageSpeedKmh: 42.0,
    lengthKm: 9.4,
    criticalityScore: 7.8,
    coordinates: [
      [29.1400, 75.7260],
      [29.1320, 75.7180],
      [29.1200, 75.7050]
    ]
  }
];

// ============================================================================
// FLOOD RISK ZONES (HISAR)
// ============================================================================
export const HISAR_FLOOD_RISK_ZONES: FloodRiskZone[] = [
  {
    id: 'hsr-flood-canal',
    name: 'Western Yamuna Canal Overspill & Balsamand Branch Lowlands',
    riskLevel: 'High',
    depthEstimateM: 0.95,
    drainageCapacityScore: 4.8,
    affectedPopulation: 14500,
    criticalFacilitiesAtRisk: ['Industrial Area Pumping Station', 'Sector 27 Culvert Corridor'],
    historicalFloodingEvents: ['2023 Monsoon Canal Surge', '2021 Cloudburst Local Inundation'],
    coordinates: [
      [29.1320, 75.7420],
      [29.1360, 75.7580],
      [29.1240, 75.7620],
      [29.1200, 75.7460],
      [29.1320, 75.7420]
    ]
  },
  {
    id: 'hsr-flood-nagori',
    name: 'Nagori Gate & Old City Low-Elevation Natural Depression',
    riskLevel: 'Moderate',
    depthEstimateM: 0.45,
    drainageCapacityScore: 6.2,
    affectedPopulation: 8200,
    criticalFacilitiesAtRisk: ['Main Market Transformer Bay', 'Civil Hospital Outer Approach'],
    historicalFloodingEvents: ['2022 Flash Rainwater Stagnation'],
    coordinates: [
      [29.1580, 75.7200],
      [29.1620, 75.7250],
      [29.1550, 75.7290],
      [29.1510, 75.7220],
      [29.1580, 75.7200]
    ]
  }
];

// ============================================================================
// HEAT RISK ZONES (HISAR)
// ============================================================================
export const HISAR_HEAT_RISK_ZONES: HeatRiskZone[] = [
  {
    id: 'hsr-heat-industrial',
    name: 'Industrial Area & Steel Fabrication Thermal Island (UHI Extreme)',
    intensity: 'Extreme',
    surfaceTempDeltaC: 5.8,
    treeCanopyCoverPct: 6.2,
    imperviousSurfacePct: 88.5,
    vulnerablePopulation: 19800,
    mitigationPriority: 'Critical',
    recommendedInterventions: [
      'High-albedo reflective roof coatings on industrial sheds',
      'Dense green shelterbelts along Balsamand Road',
      'Industrial heat-recovery ventilation mandates'
    ],
    coordinates: [
      [29.1300, 75.7380],
      [29.1340, 75.7600],
      [29.1150, 75.7620],
      [29.1120, 75.7400],
      [29.1300, 75.7380]
    ]
  },
  {
    id: 'hsr-heat-automarket',
    name: 'Auto Market & Commercial Transport Concrete Core',
    intensity: 'High',
    surfaceTempDeltaC: 3.9,
    treeCanopyCoverPct: 9.8,
    imperviousSurfacePct: 81.0,
    vulnerablePopulation: 12400,
    mitigationPriority: 'High',
    recommendedInterventions: [
      'Permeable concrete paving in parking yards',
      'Shade tree planting on median strips'
    ],
    coordinates: [
      [29.1650, 75.7060],
      [29.1710, 75.7160],
      [29.1620, 75.7190],
      [29.1580, 75.7080],
      [29.1650, 75.7060]
    ]
  }
];
