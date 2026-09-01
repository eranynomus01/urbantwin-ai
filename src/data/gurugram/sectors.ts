import { Zone } from '@/types';

export const GURUGRAM_SECTORS: Zone[] = [
  {
    id: 'gurugram-cyber-city',
    cityId: 'gurugram',
    name: 'DLF Cyber City & DLF Phase 2',
    sectorNumber: 'Phase 2 / Cyber City',
    zoneType: 'commercial',
    areaSqKm: 4.8,
    population: 68500,
    populationDensity: 14270,
    roadDensityKmPerSqKm: 18.4,
    hospitalCount: 3,
    schoolCount: 4,
    fireStationCount: 1,
    policeStationCount: 1,
    parkCount: 5,
    floodRiskScore: 4.2,
    heatRiskScore: 8.9, // High glass/concrete thermal load
    center: [28.4947, 77.0886],
    boundary: [
      [28.5020, 77.0810],
      [28.5045, 77.0950],
      [28.4890, 77.0990],
      [28.4840, 77.0880],
      [28.4880, 77.0800],
      [28.5020, 77.0810]
    ],
    avgAqi: 182,
    trafficStressLevel: 'Severe',
    infrastructureGaps: [
      'Peak hour bottleneck at Shankar Chowk entry',
      'High surface runoff into Udyog Vihar stormwater channel',
      'Urban heat island intensity during summer months'
    ],
    keyLandmarks: ['DLF Cyber Hub', 'Building 10', 'Gateway Tower', 'Rapid Metro Cyber City', 'Infinity Towers']
  },
  {
    id: 'gurugram-dlf-phase-5',
    cityId: 'gurugram',
    name: 'DLF Phase 5 & Golf Course Road Hub',
    sectorNumber: 'Phase 5 / Sector 42-43',
    zoneType: 'mixed',
    areaSqKm: 5.6,
    population: 82400,
    populationDensity: 14714,
    roadDensityKmPerSqKm: 16.2,
    hospitalCount: 4,
    schoolCount: 6,
    fireStationCount: 1,
    policeStationCount: 1,
    parkCount: 7,
    floodRiskScore: 3.1,
    heatRiskScore: 6.4,
    center: [28.4682, 77.0975],
    boundary: [
      [28.4790, 77.0910],
      [28.4810, 77.1060],
      [28.4560, 77.1120],
      [28.4530, 77.0950],
      [28.4680, 77.0880],
      [28.4790, 77.0910]
    ],
    avgAqi: 165,
    trafficStressLevel: 'Moderate',
    infrastructureGaps: [
      'Underpass water ingress during extreme cloudbursts (>50mm/hr)',
      'Pedestrian crossing deficit along signal-free Golf Course Rd expressway'
    ],
    keyLandmarks: ['One Horizon Center', 'The Aralias / Magnolias', 'DLF Phase 5 Club', 'Sector 42-43 Metro', 'Sanar Hospital']
  },
  {
    id: 'gurugram-sector-29-huda',
    cityId: 'gurugram',
    name: 'Sector 29 & City Centre Commercial District',
    sectorNumber: 'Sector 29',
    zoneType: 'commercial',
    areaSqKm: 3.2,
    population: 34000,
    populationDensity: 10625,
    roadDensityKmPerSqKm: 15.0,
    hospitalCount: 2,
    schoolCount: 2,
    fireStationCount: 1,
    policeStationCount: 1,
    parkCount: 4,
    floodRiskScore: 5.5, // Low depression near Leisure Valley
    heatRiskScore: 5.8,
    center: [28.4674, 77.0620],
    boundary: [
      [28.4740, 77.0540],
      [28.4760, 77.0700],
      [28.4590, 77.0720],
      [28.4570, 77.0570],
      [28.4740, 77.0540]
    ],
    avgAqi: 174,
    trafficStressLevel: 'High',
    infrastructureGaps: [
      'Parking overflow spillover on IFFCO Chowk feeder roads',
      'Drainage surge capacity at Leisure Valley secondary storm canal'
    ],
    keyLandmarks: ['Millennium City Centre Metro', 'Leisure Valley Park', 'Sector 29 F&B Hub', 'Gymkhana Club', 'Fire Station Sec 29']
  },
  {
    id: 'gurugram-sector-38-medanta',
    cityId: 'gurugram',
    name: 'Sector 38 & Rajiv Chowk / Medicity Corridor',
    sectorNumber: 'Sector 38',
    zoneType: 'mixed',
    areaSqKm: 3.9,
    population: 74200,
    populationDensity: 19025,
    roadDensityKmPerSqKm: 14.5,
    hospitalCount: 3,
    schoolCount: 3,
    fireStationCount: 0,
    policeStationCount: 1,
    parkCount: 3,
    floodRiskScore: 6.8, // Low lying proximity to NH-48 Rajiv Chowk underpass
    heatRiskScore: 7.2,
    center: [28.4410, 77.0425],
    boundary: [
      [28.4480, 77.0320],
      [28.4510, 77.0520],
      [28.4320, 77.0550],
      [28.4310, 77.0360],
      [28.4480, 77.0320]
    ],
    avgAqi: 191,
    trafficStressLevel: 'Severe',
    infrastructureGaps: [
      'Ambulance corridor congestion at Rajiv Chowk & Sohna Road junction',
      'No dedicated fire station within 2.5km radius'
    ],
    keyLandmarks: ['Medanta The Medicity', 'Tau Devi Lal Stadium', 'Rajiv Chowk Underpass', 'Islampur Village Urban Extension']
  },
  {
    id: 'gurugram-sector-14-old',
    cityId: 'gurugram',
    name: 'Sector 14 & Old Gurugram Heritage Core',
    sectorNumber: 'Sector 14',
    zoneType: 'residential',
    areaSqKm: 4.1,
    population: 112000,
    populationDensity: 27317,
    roadDensityKmPerSqKm: 19.8,
    hospitalCount: 2,
    schoolCount: 8,
    fireStationCount: 0,
    policeStationCount: 1,
    parkCount: 5,
    floodRiskScore: 7.4, // Old storm drainage lines with high siltation
    heatRiskScore: 8.2,
    center: [28.4752, 77.0392],
    boundary: [
      [28.4830, 77.0310],
      [28.4850, 77.0480],
      [28.4680, 77.0490],
      [28.4660, 77.0330],
      [28.4830, 77.0310]
    ],
    avgAqi: 205,
    trafficStressLevel: 'Severe',
    infrastructureGaps: [
      'Narrow secondary roads impeding heavy fire tenders',
      'Aged municipal sewage lines needing desilting and diameter upgrades',
      'Severe parking deficit in Sector 14 market square'
    ],
    keyLandmarks: ['Sector 14 Market', 'Government Girls College', 'Civil Hospital (Old)', 'Sadar Police Station']
  },
  {
    id: 'gurugram-sector-56-golf-course-ext',
    cityId: 'gurugram',
    name: 'Sector 56 & Golf Course Extension Residential Hub',
    sectorNumber: 'Sector 56',
    zoneType: 'residential',
    areaSqKm: 6.2,
    population: 94500,
    populationDensity: 15241,
    roadDensityKmPerSqKm: 13.6,
    hospitalCount: 2,
    schoolCount: 5,
    fireStationCount: 0,
    policeStationCount: 1,
    parkCount: 6,
    floodRiskScore: 3.5, // Higher elevation close to Aravalli ridge
    heatRiskScore: 5.1, // Cooled by Aravalli foothills breeze
    center: [28.4312, 77.1008],
    boundary: [
      [28.4410, 77.0910],
      [28.4440, 77.1120],
      [28.4190, 77.1160],
      [28.4160, 77.0940],
      [28.4410, 77.0910]
    ],
    avgAqi: 152,
    trafficStressLevel: 'Moderate',
    infrastructureGaps: [
      'Dependence on Sector 29 fire station with >12 min transit in peak hours',
      'Need for second trauma care center near Southern Peripheral Road (SPR)'
    ],
    keyLandmarks: ['Sector 55-56 Rapid Metro Terminal', 'Sector 56 Huda Market', 'Kendriya Vihar', 'W Pratiksha Hospital']
  },
  {
    id: 'gurugram-sector-48-sohna-road',
    cityId: 'gurugram',
    name: 'Sector 48-49 & Sohna Road IT Corridor',
    sectorNumber: 'Sector 48-49',
    zoneType: 'mixed',
    areaSqKm: 5.1,
    population: 86000,
    populationDensity: 16862,
    roadDensityKmPerSqKm: 14.1,
    hospitalCount: 2,
    schoolCount: 4,
    fireStationCount: 0,
    policeStationCount: 1,
    parkCount: 4,
    floodRiskScore: 7.9, // Badshahpur drain crossing zone
    heatRiskScore: 7.4,
    center: [28.4208, 77.0435],
    boundary: [
      [28.4310, 77.0330],
      [28.4330, 77.0540],
      [28.4100, 77.0560],
      [28.4080, 77.0350],
      [28.4310, 77.0330]
    ],
    avgAqi: 188,
    trafficStressLevel: 'High',
    infrastructureGaps: [
      'Badshahpur primary drain embankment overflow during 60mm/hr rains',
      'Subhash Chowk traffic convergence delays emergency response'
    ],
    keyLandmarks: ['Vipul Tech Square', 'Omaxe Celebration Mall', 'Park Hospital', 'Subhash Chowk', 'Badshahpur Drain Overbridge']
  },
  {
    id: 'gurugram-udyog-vihar',
    cityId: 'gurugram',
    name: 'Udyog Vihar Phases 1-5 Industrial Hub',
    sectorNumber: 'Udyog Vihar',
    zoneType: 'industrial',
    areaSqKm: 7.4,
    population: 41000, // Day-time working population exceeds 220,000
    populationDensity: 5540,
    roadDensityKmPerSqKm: 17.5,
    hospitalCount: 1,
    schoolCount: 1,
    fireStationCount: 1,
    policeStationCount: 2,
    parkCount: 2,
    floodRiskScore: 6.2,
    heatRiskScore: 8.6,
    center: [28.5080, 77.0720],
    boundary: [
      [28.5200, 77.0600],
      [28.5240, 77.0850],
      [28.4960, 77.0870],
      [28.4920, 77.0630],
      [28.5200, 77.0600]
    ],
    avgAqi: 215,
    trafficStressLevel: 'Severe',
    infrastructureGaps: [
      'Heavy freight container congestion on Old Delhi-Gurugram road',
      'Industrial VOC & particulate emissions requiring localized scrubbers'
    ],
    keyLandmarks: ['Udyog Vihar Fire Station', 'Maruti Suzuki Plant Campus', 'Siris Road Tech Parks', 'Dundahera Border']
  },
  {
    id: 'gurugram-manesar-imt',
    cityId: 'gurugram',
    name: 'IMT Manesar Industrial & Auto Manufacturing Zone',
    sectorNumber: 'IMT Manesar',
    zoneType: 'industrial',
    areaSqKm: 14.5,
    population: 78000,
    populationDensity: 5379,
    roadDensityKmPerSqKm: 11.2,
    hospitalCount: 2,
    schoolCount: 3,
    fireStationCount: 1,
    policeStationCount: 1,
    parkCount: 3,
    floodRiskScore: 4.8,
    heatRiskScore: 8.8,
    center: [28.3620, 76.9280],
    boundary: [
      [28.3800, 76.9050],
      [28.3840, 76.9550],
      [28.3420, 76.9580],
      [28.3380, 76.9100],
      [28.3800, 76.9050]
    ],
    avgAqi: 220,
    trafficStressLevel: 'High',
    infrastructureGaps: [
      'Long distance (>18 km) from central Gurugram tertiary trauma centers',
      'Hazardous material response containment requirements'
    ],
    keyLandmarks: ['Manesar Fire Station', 'NSG Campus', 'Maruti Suzuki IMT', 'Kherki Daula Toll Plaza bypass', 'Rockland Hospital']
  },
  {
    id: 'gurugram-dwarka-expressway-sec102',
    cityId: 'gurugram',
    name: 'Dwarka Expressway & Sector 102 New Growth Corridor',
    sectorNumber: 'Sector 102-104',
    zoneType: 'residential',
    areaSqKm: 8.5,
    population: 58000, // Rapidly urbanizing corridor
    populationDensity: 6823,
    roadDensityKmPerSqKm: 9.8,
    hospitalCount: 1,
    schoolCount: 4,
    fireStationCount: 0,
    policeStationCount: 1,
    parkCount: 5,
    floodRiskScore: 8.2, // Proximity to Najafgarh jheel depression
    heatRiskScore: 6.1,
    center: [28.4890, 76.9740],
    boundary: [
      [28.5100, 76.9580],
      [28.5130, 76.9950],
      [28.4680, 76.9980],
      [28.4650, 76.9600],
      [28.5100, 76.9580]
    ],
    avgAqi: 172,
    trafficStressLevel: 'Moderate',
    infrastructureGaps: [
      'Critical absence of a dedicated Government Fire Station (nearest is Sector 37 > 8km away)',
      'Najafgarh drain feeder overflows during continuous monsoon spells',
      'Incomplete public transit feeder routes'
    ],
    keyLandmarks: ['Dwarka Expressway Cloverleaf', 'Sector 102 High-Rise Cluster', 'Conscient Heritage Max', 'Basai Wetlands Reserve']
  }
];
