import { FloodRiskZone } from '@/types';

export const GURUGRAM_FLOOD_RISK_ZONES: FloodRiskZone[] = [
  {
    id: 'flood-badshahpur-drain-basin',
    cityId: 'gurugram',
    name: 'Badshahpur Drain Primary Basin (Sector 48-72)',
    riskLevel: 'Critical',
    elevationMeters: 216.0,
    historicalWaterloggingDepthCm: 95.0, // Historical 2016 / 2021 inundation
    drainageCorridor: 'Badshahpur Main Outfall Drain to Najafgarh Basin',
    drainCapacityAdequacyPct: 48.0, // Major bottleneck during >50mm/hr rains
    center: [28.4120, 77.0380],
    coordinates: [
      [28.4250, 77.0250],
      [28.4300, 77.0520],
      [28.4000, 77.0580],
      [28.3950, 77.0300],
      [28.4250, 77.0250]
    ],
    primaryCauses: [
      'Natural depression receiving discharge from Aravalli eastern catchment',
      'Encroachment of storm channels and siltation along Khandsa culvert',
      'Heavy surface runoff from concretized sectors upstream'
    ]
  },
  {
    id: 'flood-hero-honda-chowk-underpass',
    cityId: 'gurugram',
    name: 'Hero Honda Chowk & Khandsa Spillway (NH-48)',
    riskLevel: 'High',
    elevationMeters: 218.5,
    historicalWaterloggingDepthCm: 75.0,
    drainageCorridor: 'Khandsa Sump & Sub-drain feeder',
    drainCapacityAdequacyPct: 62.0,
    center: [28.4350, 77.0180],
    coordinates: [
      [28.4420, 77.0100],
      [28.4450, 77.0280],
      [28.4280, 77.0300],
      [28.4250, 77.0120],
      [28.4420, 77.0100]
    ],
    primaryCauses: [
      'Underpass invert level is 3.8m below natural grade',
      'High vehicle momentum zone with quick backflow if pumps lose grid power'
    ]
  },
  {
    id: 'flood-subhash-chowk-sohna-rd',
    cityId: 'gurugram',
    name: 'Subhash Chowk & Sector 38 Inundation Basin',
    riskLevel: 'High',
    elevationMeters: 221.0,
    historicalWaterloggingDepthCm: 55.0,
    drainageCorridor: 'Sector 38 - Islampur Storm Interceptor',
    drainCapacityAdequacyPct: 58.0,
    center: [28.4280, 77.0430],
    coordinates: [
      [28.4350, 77.0350],
      [28.4370, 77.0500],
      [28.4200, 77.0520],
      [28.4180, 77.0370],
      [28.4350, 77.0350]
    ],
    primaryCauses: [
      'Junction of runoff from Medicity ridge and South City-II',
      'Construction debris restricting lateral inlet grates'
    ]
  },
  {
    id: 'flood-najafgarh-jheel-depression',
    cityId: 'gurugram',
    name: 'Najafgarh Jheel / Basai Wetlands Basin (Sector 102)',
    riskLevel: 'Critical',
    elevationMeters: 210.0,
    historicalWaterloggingDepthCm: 110.0,
    drainageCorridor: 'Najafgarh Inter-state Basin',
    drainCapacityAdequacyPct: 42.0,
    center: [28.4780, 76.9680],
    coordinates: [
      [28.4950, 76.9500],
      [28.5020, 76.9850],
      [28.4650, 76.9900],
      [28.4580, 76.9550],
      [28.4950, 76.9500]
    ],
    primaryCauses: [
      'Lowest topographical elevation in the Gurugram municipal boundary',
      'Natural wetland floodplain receiving unchannelized runoff from Sector 99-106'
    ]
  }
];
