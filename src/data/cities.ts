import { City } from '@/types';

/**
 * ALL 22 OFFICIAL DISTRICTS OF HARYANA, INDIA
 * Complete spatial definitions with coordinates, bounding boxes, populations, and tags.
 */
export const SUPPORTED_CITIES: City[] = [
  // 1. HISAR (Primary Default)
  {
    id: 'hisar',
    name: 'Hisar',
    state: 'Haryana',
    country: 'India',
    center: [29.1492, 75.7217],
    defaultZoom: 12.8,
    boundingBox: [
      [29.0700, 75.6400],
      [29.2200, 75.8000]
    ],
    isActive: true,
    tagline: 'Steel City, Maharaja Agrasen Airport & Agricultural Innovation Center (CCS HAU)',
    totalPopulation: 307222,
    totalAreaSqKm: 104.0
  },

  // 2. GURUGRAM
  {
    id: 'gurugram',
    name: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    center: [28.4595, 77.0266],
    defaultZoom: 12.5,
    boundingBox: [
      [28.3500, 76.8800],
      [28.5300, 77.1300]
    ],
    isActive: true,
    tagline: 'Millennium City — High-Density Tech, Financial & Rapid Urban Growth Hub',
    totalPopulation: 1514085,
    totalAreaSqKm: 232.0
  },

  // 3. FARIDABAD
  {
    id: 'faridabad',
    name: 'Faridabad',
    state: 'Haryana',
    country: 'India',
    center: [28.4089, 77.3178],
    defaultZoom: 12.5,
    boundingBox: [
      [28.2800, 77.2000],
      [28.5000, 77.4000]
    ],
    isActive: true,
    tagline: 'Largest Industrial & Heavy Manufacturing Hub of Haryana',
    totalPopulation: 1414050,
    totalAreaSqKm: 215.0
  },

  // 4. PANIPAT
  {
    id: 'panipat',
    name: 'Panipat',
    state: 'Haryana',
    country: 'India',
    center: [29.3909, 76.9635],
    defaultZoom: 12.8,
    boundingBox: [
      [29.3200, 76.8800],
      [29.4500, 77.0500]
    ],
    isActive: true,
    tagline: 'Textile Capital of India — Weaver City & IOCL Petrochemical Refinery Zone',
    totalPopulation: 442277,
    totalAreaSqKm: 64.0
  },

  // 5. AMBALA
  {
    id: 'ambala',
    name: 'Ambala',
    state: 'Haryana',
    country: 'India',
    center: [30.3782, 76.7767],
    defaultZoom: 12.8,
    boundingBox: [
      [30.3000, 76.7000],
      [30.4500, 76.8600]
    ],
    isActive: true,
    tagline: 'Twin City — Scientific Instruments Hub & Northern Airbase Defense Corridor',
    totalPopulation: 407112,
    totalAreaSqKm: 82.0
  },

  // 6. YAMUNANAGAR
  {
    id: 'yamunanagar',
    name: 'Yamunanagar & Jagadhri',
    state: 'Haryana',
    country: 'India',
    center: [30.1290, 77.2674],
    defaultZoom: 12.8,
    boundingBox: [
      [30.0500, 77.1800],
      [30.2000, 77.3500]
    ],
    isActive: true,
    tagline: 'Plywood & Paper Cluster along Hathnikund Barrage & Yamuna Basin',
    totalPopulation: 383318,
    totalAreaSqKm: 92.0
  },

  // 7. ROHTAK
  {
    id: 'rohtak',
    name: 'Rohtak',
    state: 'Haryana',
    country: 'India',
    center: [28.8955, 76.6066],
    defaultZoom: 12.8,
    boundingBox: [
      [28.8200, 76.5300],
      [28.9700, 76.6800]
    ],
    isActive: true,
    tagline: 'Educational & Medical Capital — PGIMS Regional Healthcare Nexus',
    totalPopulation: 374292,
    totalAreaSqKm: 139.0
  },

  // 8. KARNAL
  {
    id: 'karnal',
    name: 'Karnal',
    state: 'Haryana',
    country: 'India',
    center: [29.6857, 76.9905],
    defaultZoom: 12.8,
    boundingBox: [
      [29.6100, 76.9100],
      [29.7500, 77.0600]
    ],
    isActive: true,
    tagline: 'Smart Rice City & National Dairy Research Institute (NDRI) Center',
    totalPopulation: 302140,
    totalAreaSqKm: 87.0
  },

  // 9. SONIPAT
  {
    id: 'sonipat',
    name: 'Sonipat',
    state: 'Haryana',
    country: 'India',
    center: [28.9931, 77.0151],
    defaultZoom: 12.8,
    boundingBox: [
      [28.9200, 76.9400],
      [29.0600, 77.0900]
    ],
    isActive: true,
    tagline: 'NCR Higher Education & Industrial Corridor (KMP Expressway & Kundli)',
    totalPopulation: 289333,
    totalAreaSqKm: 89.0
  },

  // 10. PANCHKULA
  {
    id: 'panchkula',
    name: 'Panchkula',
    state: 'Haryana',
    country: 'India',
    center: [30.6942, 76.8606],
    defaultZoom: 12.8,
    boundingBox: [
      [30.6300, 76.8000],
      [30.7600, 76.9200]
    ],
    isActive: true,
    tagline: 'Planned Foothills Urban Center — Administrative & Shivalik Ecological Gateway',
    totalPopulation: 211355,
    totalAreaSqKm: 60.0
  },

  // 11. BHIWANI
  {
    id: 'bhiwani',
    name: 'Bhiwani',
    state: 'Haryana',
    country: 'India',
    center: [28.7932, 76.1390],
    defaultZoom: 12.8,
    boundingBox: [
      [28.7200, 76.0600],
      [28.8600, 76.2100]
    ],
    isActive: true,
    tagline: 'Sports Capital (Mini Cuba) & Historic Municipal Education Board HQ',
    totalPopulation: 196057,
    totalAreaSqKm: 68.0
  },

  // 12. SIRSA
  {
    id: 'sirsa',
    name: 'Sirsa',
    state: 'Haryana',
    country: 'India',
    center: [29.5321, 75.0318],
    defaultZoom: 12.8,
    boundingBox: [
      [29.4600, 74.9600],
      [29.6000, 75.1000]
    ],
    isActive: true,
    tagline: 'Westernmost Agro-Trade Center, Airbase & Emergency Relay Point',
    totalPopulation: 183282,
    totalAreaSqKm: 78.0
  },

  // 13. JHAJJAR / BAHADURGARH
  {
    id: 'jhajjar',
    name: 'Jhajjar / Bahadurgarh',
    state: 'Haryana',
    country: 'India',
    center: [28.6063, 76.6565],
    defaultZoom: 12.8,
    boundingBox: [
      [28.5300, 76.5800],
      [28.6800, 76.7300]
    ],
    isActive: true,
    tagline: 'Power Corridor (Jhajjar Super Thermal Power) & Metro Link',
    totalPopulation: 170426,
    totalAreaSqKm: 72.0
  },

  // 14. JIND
  {
    id: 'jind',
    name: 'Jind',
    state: 'Haryana',
    country: 'India',
    center: [29.3160, 76.3150],
    defaultZoom: 12.8,
    boundingBox: [
      [29.2400, 76.2400],
      [29.3900, 76.3900]
    ],
    isActive: true,
    tagline: 'Heart of Haryana — Central Agro-Rail Transit Junction & Dairy Belt',
    totalPopulation: 167592,
    totalAreaSqKm: 68.0
  },

  // 15. KURUKSHETRA
  {
    id: 'kurukshetra',
    name: 'Kurukshetra',
    state: 'Haryana',
    country: 'India',
    center: [29.9695, 76.8783],
    defaultZoom: 12.8,
    boundingBox: [
      [29.9000, 76.8000],
      [30.0400, 76.9500]
    ],
    isActive: true,
    tagline: 'Heritage Cultural Center & Northern Irrigation Water Management Hub',
    totalPopulation: 154962,
    totalAreaSqKm: 59.0
  },

  // 16. KAITHAL
  {
    id: 'kaithal',
    name: 'Kaithal',
    state: 'Haryana',
    country: 'India',
    center: [29.8015, 76.4030],
    defaultZoom: 12.8,
    boundingBox: [
      [29.7300, 76.3300],
      [29.8700, 76.4700]
    ],
    isActive: true,
    tagline: 'Historic Fort City & Northern Grain Mandi Rice Milling Cluster',
    totalPopulation: 144915,
    totalAreaSqKm: 55.0
  },

  // 17. REWARI
  {
    id: 'rewari',
    name: 'Rewari',
    state: 'Haryana',
    country: 'India',
    center: [28.1920, 76.6191],
    defaultZoom: 12.8,
    boundingBox: [
      [28.1200, 76.5400],
      [28.2600, 76.6900]
    ],
    isActive: true,
    tagline: 'Brass City, Bawal Industrial Smart City & DMIC Western Freight Hub',
    totalPopulation: 143021,
    totalAreaSqKm: 55.0
  },

  // 18. PALWAL
  {
    id: 'palwal',
    name: 'Palwal',
    state: 'Haryana',
    country: 'India',
    center: [28.1487, 77.3260],
    defaultZoom: 12.8,
    boundingBox: [
      [28.0800, 77.2500],
      [28.2200, 77.4000]
    ],
    isActive: true,
    tagline: 'Southern NCR Expressway Gateway — KMP & Delhi-Mumbai Expressway Node',
    totalPopulation: 131121,
    totalAreaSqKm: 58.0
  },

  // 19. NUH (MEWAT)
  {
    id: 'nuh',
    name: 'Nuh (Mewat)',
    state: 'Haryana',
    country: 'India',
    center: [28.1060, 77.0140],
    defaultZoom: 12.8,
    boundingBox: [
      [28.0300, 76.9400],
      [28.1800, 77.0900]
    ],
    isActive: true,
    tagline: 'Southern Aravalli Basin — Delhi-Mumbai Expressway Logistics & Rural Health Corridor',
    totalPopulation: 122500,
    totalAreaSqKm: 50.0
  },

  // 20. FATEHABAD
  {
    id: 'fatehabad',
    name: 'Fatehabad',
    state: 'Haryana',
    country: 'India',
    center: [29.5160, 75.4540],
    defaultZoom: 12.8,
    boundingBox: [
      [29.4400, 75.3800],
      [29.5900, 75.5200]
    ],
    isActive: true,
    tagline: 'Gorakhpur Nuclear Power Project Zone & Bhakra Canal Irrigation Grid',
    totalPopulation: 119836,
    totalAreaSqKm: 52.0
  },

  // 21. MAHENDRAGARH / NARNAUL
  {
    id: 'mahendragarh',
    name: 'Mahendragarh / Narnaul',
    state: 'Haryana',
    country: 'India',
    center: [28.0430, 76.1080],
    defaultZoom: 12.8,
    boundingBox: [
      [27.9700, 76.0300],
      [28.1100, 76.1800]
    ],
    isActive: true,
    tagline: 'Southern Mineral & Marble Belt — Central University & Water Conservation Hub',
    totalPopulation: 114350,
    totalAreaSqKm: 48.0
  },

  // 22. CHARKHI DADRI
  {
    id: 'charkhi_dadri',
    name: 'Charkhi Dadri',
    state: 'Haryana',
    country: 'India',
    center: [28.5920, 76.2670],
    defaultZoom: 12.8,
    boundingBox: [
      [28.5200, 76.1900],
      [28.6600, 76.3400]
    ],
    isActive: true,
    tagline: '22nd District of Haryana — Stone Quarrying, Cement & Western Freight Bypass',
    totalPopulation: 98400,
    totalAreaSqKm: 42.0
  }
];

export const getActiveCity = (id: string = 'hisar'): City => {
  const found = SUPPORTED_CITIES.find(c => c.id === id);
  return found || SUPPORTED_CITIES.find(c => c.id === 'hisar') || SUPPORTED_CITIES[0];
};
