import { RoadCorridor } from '@/types';

export const GURUGRAM_ROADS: RoadCorridor[] = [
  {
    id: 'road-nh48-delhi-jaipur-expy',
    cityId: 'gurugram',
    name: 'NH-48 (Delhi-Jaipur Expressway)',
    highwayType: 'motorway',
    lanes: 8,
    maxSpeedKmh: 80,
    lengthKm: 24.5,
    congestionLevel: 'Heavy',
    avgSpeedKmh: 34.0,
    coordinates: [
      [28.5140, 77.0860], // Delhi Border / Siris
      [28.4980, 77.0780], // Shankar Chowk
      [28.4820, 77.0720], // IFFCO Chowk
      [28.4680, 77.0600], // Signature Tower
      [28.4480, 77.0400], // Rajiv Chowk
      [28.4350, 77.0180], // Hero Honda Chowk
      [28.4050, 76.9880], // Kherki Daula Toll
      [28.3650, 76.9320]  // Manesar IMT entry
    ],
    source: 'OpenStreetMap (way/2381920) & GMDA Traffic Command'
  },
  {
    id: 'road-golf-course-road',
    cityId: 'gurugram',
    name: 'Golf Course Road (Signal-Free Corridor)',
    highwayType: 'trunk',
    lanes: 6,
    maxSpeedKmh: 60,
    lengthKm: 9.2,
    congestionLevel: 'Moderate',
    avgSpeedKmh: 48.0,
    coordinates: [
      [28.4890, 77.0980], // Shankar Chowk / Cyber City link
      [28.4810, 77.0930], // Sikanderpur Underpass
      [28.4690, 77.0940], // DLF Phase 1 / Genpact
      [28.4550, 77.0990], // One Horizon Underpass
      [28.4380, 77.1040], // Sector 54 Chowk
      [28.4280, 77.1070]  // Sector 55-56 Terminal Roundabout
    ],
    source: 'OpenStreetMap (way/4819283)'
  },
  {
    id: 'road-mg-road-mehrauli-gurgaon',
    cityId: 'gurugram',
    name: 'MG Road (Mehrauli-Gurgaon Road)',
    highwayType: 'primary',
    lanes: 6,
    maxSpeedKmh: 50,
    lengthKm: 7.8,
    congestionLevel: 'Severe',
    avgSpeedKmh: 22.0,
    coordinates: [
      [28.4850, 77.1080], // Aya Nagar / Delhi Border
      [28.4810, 77.0930], // Sikanderpur
      [28.4790, 77.0810], // MG Road Metro Station / MGF Mall
      [28.4720, 77.0720], // IFFCO Chowk
      [28.4690, 77.0540], // Sukhrali
      [28.4650, 77.0350]  // Old Gurugram / Mahaveer Chowk
    ],
    source: 'OpenStreetMap (way/9821049)'
  },
  {
    id: 'road-sohna-road-nh248a',
    cityId: 'gurugram',
    name: 'Sohna Road (Elevated Corridor NH-248A)',
    highwayType: 'trunk',
    lanes: 6,
    maxSpeedKmh: 70,
    lengthKm: 14.2,
    congestionLevel: 'Heavy',
    avgSpeedKmh: 36.0,
    coordinates: [
      [28.4480, 77.0400], // Rajiv Chowk
      [28.4380, 77.0420], // Medanta / Bakhtawar Chowk
      [28.4220, 77.0440], // Subhash Chowk
      [28.4050, 77.0460], // Badshahpur Elevated Start
      [28.3820, 77.0510], // Badshahpur Market
      [28.3450, 77.0580]  // Bhondsi / Sohna direction
    ],
    source: 'OpenStreetMap (way/7481920)'
  },
  {
    id: 'road-golf-course-ext-spr',
    cityId: 'gurugram',
    name: 'Golf Course Extension Road & SPR',
    highwayType: 'primary',
    lanes: 6,
    maxSpeedKmh: 60,
    lengthKm: 11.5,
    congestionLevel: 'Moderate',
    avgSpeedKmh: 42.0,
    coordinates: [
      [28.4280, 77.1070], // Sector 55-56
      [28.4180, 77.0850], // Sector 62 / Pioneer
      [28.4110, 77.0650], // Sector 65 / M3M Urban
      [28.4060, 77.0460], // Vatika Chowk / Sohna Rd crossing
      [28.4020, 77.0180], // SPR Sector 70
      [28.4050, 76.9880]  // Kherki Daula Cloverleaf
    ],
    source: 'OpenStreetMap (way/1928472)'
  },
  {
    id: 'road-dwarka-expressway-nh248bb',
    cityId: 'gurugram',
    name: 'Dwarka Expressway (Northern Peripheral Road)',
    highwayType: 'motorway',
    lanes: 8,
    maxSpeedKmh: 80,
    lengthKm: 18.1,
    congestionLevel: 'Low',
    avgSpeedKmh: 68.0,
    coordinates: [
      [28.5250, 77.0120], // Bijwasan / Delhi Border
      [28.5080, 76.9920], // Sector 110
      [28.4880, 76.9720], // Sector 102
      [28.4620, 76.9650], // Sector 99
      [28.4350, 76.9740], // Sector 88
      [28.4050, 76.9880]  // Kherki Daula Cloverleaf
    ],
    source: 'NHAI & OpenStreetMap (way/9284710)'
  }
];
