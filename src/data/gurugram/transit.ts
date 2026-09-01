import { TransitNode } from '@/types';

export const GURUGRAM_TRANSIT_NODES: TransitNode[] = [
  {
    id: 'transit-metro-millennium-city-centre',
    cityId: 'gurugram',
    name: 'Millennium City Centre (HUDA City Centre) Metro',
    stopType: 'metro_station',
    lineName: 'Delhi Metro Yellow Line',
    dailyFootfall: 145000,
    coordinates: [28.4593, 77.0725],
    source: 'Delhi Metro Rail Corporation (DMRC) & OSM'
  },
  {
    id: 'transit-metro-iffco-chowk',
    cityId: 'gurugram',
    name: 'IFFCO Chowk Metro Station & Bus Interchange',
    stopType: 'metro_station',
    lineName: 'Delhi Metro Yellow Line',
    dailyFootfall: 110000,
    coordinates: [28.4721, 77.0725],
    source: 'DMRC & Haryana Roadways'
  },
  {
    id: 'transit-metro-sikanderpur',
    cityId: 'gurugram',
    name: 'Sikanderpur Interchange (Yellow Line / Rapid Metro)',
    stopType: 'metro_station',
    lineName: 'Yellow Line & Rapid Metro Interchange',
    dailyFootfall: 180000,
    coordinates: [28.4818, 77.0925],
    source: 'DMRC & Rapid Metro Gurugram'
  },
  {
    id: 'transit-metro-cyber-city',
    cityId: 'gurugram',
    name: 'Cyber City Rapid Metro Station',
    stopType: 'metro_station',
    lineName: 'Rapid Metro Gurugram',
    dailyFootfall: 85000,
    coordinates: [28.4965, 77.0890],
    source: 'Rapid Metro Gurugram & OSM'
  },
  {
    id: 'transit-metro-phase-3',
    cityId: 'gurugram',
    name: 'DLF Phase 3 Rapid Metro',
    stopType: 'metro_station',
    lineName: 'Rapid Metro Gurugram',
    dailyFootfall: 45000,
    coordinates: [28.4915, 77.0988],
    source: 'Rapid Metro Gurugram'
  },
  {
    id: 'transit-metro-sector-55-56',
    cityId: 'gurugram',
    name: 'Sector 55-56 Rapid Metro Terminal',
    stopType: 'metro_station',
    lineName: 'Rapid Metro Gurugram',
    dailyFootfall: 62000,
    coordinates: [28.4285, 77.1070],
    source: 'Rapid Metro Gurugram'
  },
  {
    id: 'transit-railway-gurugram-station',
    cityId: 'gurugram',
    name: 'Gurugram Railway Station (GGN)',
    stopType: 'railway_station',
    lineName: 'Northern Railway / Delhi-Jaipur Line',
    dailyFootfall: 52000,
    coordinates: [28.4712, 77.0162],
    source: 'Indian Railways & OSM'
  },
  {
    id: 'transit-bus-old-gurugram-stand',
    cityId: 'gurugram',
    name: 'Old Gurugram Interstate Bus Terminal (ISBT)',
    stopType: 'bus_terminal',
    lineName: 'Haryana Roadways & GMCBL Gurugaman',
    dailyFootfall: 75000,
    coordinates: [28.4630, 77.0310],
    source: 'GMCBL & GMDA Mobility Plan'
  }
];
