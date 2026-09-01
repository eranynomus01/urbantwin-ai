import { HeatRiskZone } from '@/types';

export const GURUGRAM_HEAT_RISK_ZONES: HeatRiskZone[] = [
  {
    id: 'heat-cyber-city-glass-facade',
    cityId: 'gurugram',
    name: 'Cyber City & Udyog Vihar Concrete-Glass Thermal Core',
    riskLevel: 'Extreme',
    surfaceTempDeltaC: 4.8, // +4.8°C above suburban baseline
    vegetationDeficitPct: 84.0,
    imperviousSurfacePct: 92.0,
    vulnerablePopulation: 45000,
    center: [28.5010, 77.0820],
    coordinates: [
      [28.5150, 77.0680],
      [28.5200, 77.0950],
      [28.4880, 77.0980],
      [28.4850, 77.0700],
      [28.5150, 77.0680]
    ],
    recommendedInterventions: [
      'Mandatory High-Albedo Cool Roof coatings on flat commercial terraces',
      'Vertical green facades on multi-level parking structures',
      'Shaded pedestrian skywalk network along Cyber City loop'
    ]
  },
  {
    id: 'heat-old-city-dense-core',
    cityId: 'gurugram',
    name: 'Sector 14 & Sadar Bazaar High-Density Built Core',
    riskLevel: 'High',
    surfaceTempDeltaC: 3.9,
    vegetationDeficitPct: 76.0,
    imperviousSurfacePct: 88.0,
    vulnerablePopulation: 78000,
    center: [28.4680, 77.0340],
    coordinates: [
      [28.4800, 77.0250],
      [28.4820, 77.0450],
      [28.4600, 77.0470],
      [28.4580, 77.0270],
      [28.4800, 77.0250]
    ],
    recommendedInterventions: [
      'Street tree canopy planting along narrow right-of-ways (Neem/Amaltas)',
      'Public misting shelters and cooling stations near Old Bus Stand',
      'Permeable concrete pavers in community market squares'
    ]
  },
  {
    id: 'heat-manesar-industrial-roofs',
    cityId: 'gurugram',
    name: 'IMT Manesar Metallic & Industrial Warehouse Roof Zone',
    riskLevel: 'Extreme',
    surfaceTempDeltaC: 5.2,
    vegetationDeficitPct: 88.0,
    imperviousSurfacePct: 94.0,
    vulnerablePopulation: 38000,
    center: [28.3650, 76.9320],
    coordinates: [
      [28.3800, 76.9100],
      [28.3850, 76.9500],
      [28.3450, 76.9550],
      [28.3400, 76.9150],
      [28.3800, 76.9100]
    ],
    recommendedInterventions: [
      'Industrial green buffer zone requirement along plot perimeters',
      'Solar reflective membrane retrofit program for warehouse roofs',
      'Dedicated hydration and cooling shelters for shift transit workers'
    ]
  },
  {
    id: 'heat-sohna-road-commercial-strip',
    cityId: 'gurugram',
    name: 'Sohna Road Commercial Strip (Sector 48-49)',
    riskLevel: 'High',
    surfaceTempDeltaC: 3.4,
    vegetationDeficitPct: 70.0,
    imperviousSurfacePct: 82.0,
    vulnerablePopulation: 52000,
    center: [28.4190, 77.0440],
    coordinates: [
      [28.4320, 77.0360],
      [28.4340, 77.0520],
      [28.4060, 77.0540],
      [28.4040, 77.0380],
      [28.4320, 77.0360]
    ],
    recommendedInterventions: [
      'Green corridor integration along Badshahpur drain right-of-way',
      'Median plantation canopy along Sohna Road service lanes'
    ]
  }
];
