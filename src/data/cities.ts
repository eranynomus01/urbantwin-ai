import { City } from '@/types';

export const SUPPORTED_CITIES: City[] = [
  {
    id: 'gurugram',
    name: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    center: [28.4595, 77.0266],
    defaultZoom: 12.5,
    boundingBox: [
      [28.3500, 76.8800], // South-West (Manesar / Kherki Daula)
      [28.5300, 77.1300]  // North-East (Cyber City / Delhi Border)
    ],
    isActive: true,
    tagline: 'Millennium City Digital Twin — High-Density Commercial, Industrial & Tech Corridor',
    totalPopulation: 1514085, // Official Census + Municipal Ward projection
    totalAreaSqKm: 232.0
  },
  {
    id: 'delhi',
    name: 'New Delhi (NCR)',
    state: 'Delhi',
    country: 'India',
    center: [28.6139, 77.2090],
    defaultZoom: 12,
    boundingBox: [[28.4000, 76.8400], [28.8800, 77.3500]],
    isActive: false,
    tagline: 'National Capital Territory — Database Configuration in Progress',
    totalPopulation: 16787941,
    totalAreaSqKm: 1484.0
  },
  {
    id: 'noida',
    name: 'Noida (Gautam Buddha Nagar)',
    state: 'Uttar Pradesh',
    country: 'India',
    center: [28.5355, 77.3910],
    defaultZoom: 12,
    boundingBox: [[28.4000, 77.2500], [28.6500, 77.5200]],
    isActive: false,
    tagline: 'Planned Industrial City — Database Configuration in Progress',
    totalPopulation: 637272,
    totalAreaSqKm: 203.2
  },
  {
    id: 'faridabad',
    name: 'Faridabad',
    state: 'Haryana',
    country: 'India',
    center: [28.4089, 77.3178],
    defaultZoom: 12,
    boundingBox: [[28.2800, 77.2000], [28.5000, 77.4000]],
    isActive: false,
    tagline: 'Industrial & Manufacturing Hub — Database Configuration in Progress',
    totalPopulation: 1414050,
    totalAreaSqKm: 215.0
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    center: [12.9716, 77.5946],
    defaultZoom: 12,
    boundingBox: [[12.8000, 77.4500], [13.1500, 77.7500]],
    isActive: false,
    tagline: 'Silicon Valley of India — Database Configuration in Progress',
    totalPopulation: 8443675,
    totalAreaSqKm: 741.0
  }
];

export const getActiveCity = (id: string = 'gurugram'): City => {
  const found = SUPPORTED_CITIES.find(c => c.id === id);
  return (found && found.isActive) ? found : SUPPORTED_CITIES[0];
};
