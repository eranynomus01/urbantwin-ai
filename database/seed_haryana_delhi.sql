-- ============================================================================
-- UrbanTwin AI — Comprehensive Database Seed Script
-- Covers Delhi (NCT) and All Major Cities of Haryana, India
-- Compatible with PostgreSQL 14+ and PostGIS 3+
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CITIES INSERT (Delhi NCT + 9 Haryana Regional Hubs)
-- ----------------------------------------------------------------------------
INSERT INTO cities (id, name, state, country, center_lat, center_lng, default_zoom, is_active, tagline, total_population, total_area_sqkm)
VALUES
  ('delhi', 'Delhi (NCT)', 'Delhi', 'India', 28.6139, 77.2090, 12, TRUE, 'National Capital Territory — High-Density Urban Megacity Digital Twin', 16787941, 1484.0),
  ('gurugram', 'Gurugram', 'Haryana', 'India', 28.4595, 77.0266, 13, TRUE, 'Millennium City Digital Twin — High-Density Commercial, Industrial & Tech Corridor', 1514085, 232.0),
  ('faridabad', 'Faridabad', 'Haryana', 'India', 28.4089, 77.3178, 13, TRUE, 'Industrial & Manufacturing Hub Digital Twin', 1414050, 215.0),
  ('panipat', 'Panipat', 'Haryana', 'India', 29.3909, 76.9635, 13, TRUE, 'Historic Textile City & Industrial Hub Digital Twin', 442277, 64.0),
  ('karnal', 'Karnal', 'Haryana', 'India', 29.6857, 76.9905, 13, TRUE, 'Smart City & Agricultural Research Capital Digital Twin', 401420, 87.0),
  ('ambala', 'Ambala', 'Haryana', 'India', 30.3782, 76.7767, 13, TRUE, 'Northern Transit Gateway & Defence Aviation Twin', 207934, 78.0),
  ('rohtak', 'Rohtak', 'Haryana', 'India', 28.8955, 76.6066, 13, TRUE, 'Institutional, Medical & Educational Capital Digital Twin', 374292, 114.0),
  ('hisar', 'Hisar', 'Haryana', 'India', 29.1492, 75.7217, 13, TRUE, 'Western Haryana Industrial & Aviation Corridor Twin', 307222, 92.0),
  ('sonipat', 'Sonipat', 'Haryana', 'India', 28.9931, 77.0151, 13, TRUE, 'NCR Logistics, Manufacturing & Education Corridor Twin', 278149, 85.0),
  ('panchkula', 'Panchkula', 'Haryana', 'India', 30.6942, 76.8606, 13, TRUE, 'Chandigarh Tri-City Capital Region & Eco-Zone Twin', 211355, 68.0)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  state = EXCLUDED.state,
  center_lat = EXCLUDED.center_lat,
  center_lng = EXCLUDED.center_lng,
  is_active = EXCLUDED.is_active,
  total_population = EXCLUDED.total_population,
  total_area_sqkm = EXCLUDED.total_area_sqkm;

-- ----------------------------------------------------------------------------
-- 2. MAJOR URBAN ZONES / SECTORS
-- ----------------------------------------------------------------------------
INSERT INTO zones (id, city_id, name, zone_type, sector_number, area_sqkm, population, population_density, road_density_km_per_sqkm, hospital_count, school_count, fire_station_count, police_station_count, park_count, flood_risk_score, heat_risk_score, center_point)
VALUES
  -- DELHI (NCT)
  ('del-cp', 'delhi', 'Connaught Place & Central Secretariat', 'commercial', 'CP-01', 12.2, 112000, 9180, 18.4, 3, 14, 2, 4, 8, 2.8, 7.8, ST_SetSRID(ST_MakePoint(77.2167, 28.6315), 4326)),
  ('del-south', 'delhi', 'South Delhi (Saket, Hauz Khas, AIIMS)', 'mixed', 'SD-02', 28.5, 485000, 17017, 14.2, 6, 42, 3, 6, 16, 4.2, 6.8, ST_SetSRID(ST_MakePoint(77.2060, 28.5355), 4326)),
  ('del-dwarka', 'delhi', 'Dwarka Sub-City', 'residential', 'DW-03', 56.0, 620000, 11071, 12.8, 4, 38, 2, 5, 19, 5.8, 6.2, ST_SetSRID(ST_MakePoint(77.0500, 28.5800), 4326)),
  ('del-rohini', 'delhi', 'Rohini Sub-City', 'residential', 'RH-04', 30.1, 860000, 28571, 13.5, 5, 52, 2, 6, 14, 6.4, 7.5, ST_SetSRID(ST_MakePoint(77.1100, 28.7100), 4326)),
  ('del-east', 'delhi', 'East Delhi (Yamuna Floodplain, Mayur Vihar)', 'mixed', 'ED-05', 24.0, 720000, 30000, 11.2, 3, 31, 2, 4, 9, 8.8, 7.2, ST_SetSRID(ST_MakePoint(77.2900, 28.6100), 4326)),

  -- GURUGRAM (HARYANA)
  ('ggn-cybercity', 'gurugram', 'DLF Cyber City & Udyog Vihar', 'commercial', 'SEC-CYBER', 6.4, 68500, 10703, 16.8, 1, 6, 1, 2, 4, 3.8, 8.5, ST_SetSRID(ST_MakePoint(77.0890, 28.4950), 4326)),
  ('ggn-sec29', 'gurugram', 'Sector 29 & City Centre Corridor', 'commercial', 'SEC-29', 4.2, 34200, 8142, 14.5, 2, 8, 1, 1, 5, 4.2, 7.2, ST_SetSRID(ST_MakePoint(77.0620, 28.4680), 4326)),
  ('ggn-sec38', 'gurugram', 'Sector 38 Medanta & Subhash Chowk Corridor', 'mixed', 'SEC-38', 5.8, 86400, 14896, 13.2, 2, 12, 1, 2, 3, 7.4, 7.8, ST_SetSRID(ST_MakePoint(77.0420, 28.4420), 4326)),
  ('ggn-sec56', 'gurugram', 'Sector 56 & Golf Course Extn Road', 'residential', 'SEC-56', 5.2, 94000, 18076, 12.8, 1, 18, 1, 1, 6, 3.2, 5.5, ST_SetSRID(ST_MakePoint(77.1008, 28.4312), 4326)),
  ('ggn-manesar', 'gurugram', 'IMT Manesar Industrial Township', 'industrial', 'IMT-MAN', 18.5, 112000, 6054, 11.5, 1, 7, 1, 2, 2, 5.2, 8.8, ST_SetSRID(ST_MakePoint(76.9250, 28.3550), 4326)),
  ('ggn-sec102', 'gurugram', 'Sector 102 Dwarka Expressway Corridor', 'residential', 'SEC-102', 7.4, 52000, 7027, 8.4, 0, 9, 0, 1, 3, 6.8, 6.8, ST_SetSRID(ST_MakePoint(76.9850, 28.4850), 4326)),

  -- FARIDABAD (HARYANA)
  ('fbd-nit', 'faridabad', 'NIT Faridabad (New Industrial Town)', 'mixed', 'NIT-01', 14.5, 340000, 23448, 13.8, 3, 24, 2, 4, 6, 6.2, 8.2, ST_SetSRID(ST_MakePoint(77.3000, 28.3850), 4326)),
  ('fbd-sec15', 'faridabad', 'Sector 15 & Central Business District', 'residential', 'SEC-15', 6.2, 98000, 15806, 12.4, 2, 14, 1, 2, 5, 4.0, 6.5, ST_SetSRID(ST_MakePoint(77.3200, 28.4100), 4326)),
  ('fbd-grfbd', 'faridabad', 'Greater Faridabad (Neharpar Sectors 75-89)', 'residential', 'NEHARPAR', 32.0, 210000, 6562, 8.8, 2, 19, 1, 2, 8, 7.5, 7.0, ST_SetSRID(ST_MakePoint(77.3600, 28.4150), 4326)),

  -- PANIPAT (HARYANA)
  ('pan-sec25', 'panipat', 'Sector 25 Industrial Area & Transport Nagar', 'industrial', 'SEC-25', 12.4, 98000, 7903, 11.2, 1, 8, 1, 2, 2, 6.8, 8.5, ST_SetSRID(ST_MakePoint(76.9800, 29.3800), 4326)),
  ('pan-model', 'panipat', 'Model Town & GT Road Commercial Belt', 'mixed', 'MOD-TWN', 8.2, 145000, 17682, 13.4, 2, 16, 1, 2, 4, 5.0, 7.2, ST_SetSRID(ST_MakePoint(76.9600, 29.3950), 4326)),

  -- KARNAL (HARYANA)
  ('kar-sec12', 'karnal', 'Sector 12 & City Administrative Complex', 'mixed', 'SEC-12', 7.5, 78000, 10400, 14.1, 2, 12, 1, 2, 6, 3.5, 6.2, ST_SetSRID(ST_MakePoint(76.9950, 29.6880), 4326)),
  ('kar-gt', 'karnal', 'GT Road Corridor & Kalpana Chawla Medical Zone', 'commercial', 'MED-CORR', 9.2, 114000, 12391, 13.8, 2, 15, 1, 2, 5, 4.2, 6.8, ST_SetSRID(ST_MakePoint(76.9820, 29.6920), 4326)),

  -- AMBALA (HARYANA)
  ('amb-cantt', 'ambala', 'Ambala Cantt Railway & Defence Zone', 'special_economic_zone', 'CANTT-01', 22.0, 105000, 4772, 15.2, 2, 16, 2, 3, 9, 3.0, 5.8, ST_SetSRID(ST_MakePoint(76.8300, 30.3400), 4326)),
  ('amb-city', 'ambala', 'Ambala City Commercial & Cloth Market', 'commercial', 'CITY-02', 14.0, 102000, 7285, 12.0, 2, 14, 1, 2, 4, 5.8, 6.8, ST_SetSRID(ST_MakePoint(76.7800, 30.3800), 4326)),

  -- ROHTAK (HARYANA)
  ('roh-pgi', 'rohtak', 'PGIMS Medical Campus & Sector 14', 'mixed', 'PGI-14', 12.5, 128000, 10240, 13.5, 3, 18, 1, 2, 7, 4.8, 7.2, ST_SetSRID(ST_MakePoint(76.6150, 28.8850), 4326)),

  -- HISAR (HARYANA)
  ('his-sec14', 'hisar', 'Sector 14 & Jindal Industrial Township', 'industrial', 'SEC-14', 16.0, 118000, 7375, 12.2, 2, 12, 1, 2, 5, 3.8, 8.8, ST_SetSRID(ST_MakePoint(75.7350, 29.1600), 4326)),

  -- SONIPAT (HARYANA)
  ('son-rai', 'sonipat', 'Rai & Kundli Industrial / Education Corridor', 'industrial', 'RAI-01', 24.0, 135000, 5625, 11.8, 1, 14, 1, 2, 4, 5.5, 7.8, ST_SetSRID(ST_MakePoint(77.0850, 28.9300), 4326)),

  -- PANCHKULA (HARYANA)
  ('pkl-sec5', 'panchkula', 'Sector 5 Town Centre & Mansa Devi Foothills', 'recreational', 'SEC-05', 9.5, 84000, 8842, 15.0, 2, 15, 1, 2, 12, 2.5, 4.8, ST_SetSRID(ST_MakePoint(76.8550, 30.6950), 4326))
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  population = EXCLUDED.population,
  population_density = EXCLUDED.population_density,
  flood_risk_score = EXCLUDED.flood_risk_score,
  heat_risk_score = EXCLUDED.heat_risk_score;

-- ----------------------------------------------------------------------------
-- 3. MAJOR TERTIARY & TRAUMA HOSPITALS
-- ----------------------------------------------------------------------------
INSERT INTO hospitals (id, city_id, name, hospital_type, total_beds, icu_beds, ambulance_count, phone, coverage_radius_km, location)
VALUES
  -- Delhi
  ('hosp-aiims-del', 'delhi', 'AIIMS (All India Institute of Medical Sciences)', 'trauma_center', 2478, 420, 16, '011-26588500', 12.0, ST_SetSRID(ST_MakePoint(77.2090, 28.5672), 4326)),
  ('hosp-safdarjung', 'delhi', 'VMMC & Safdarjung Hospital Apex Trauma Center', 'trauma_center', 2800, 380, 14, '011-26165060', 10.0, ST_SetSRID(ST_MakePoint(77.2070, 28.5700), 4326)),
  ('hosp-max-saket', 'delhi', 'Max Super Speciality Hospital, Saket', 'multispeciality', 530, 115, 8, '011-26515050', 8.5, ST_SetSRID(ST_MakePoint(77.2140, 28.5280), 4326)),
  ('hosp-apollo-del', 'delhi', 'Indraprastha Apollo Hospitals, Sarita Vihar', 'multispeciality', 710, 140, 10, '011-26925858', 9.0, ST_SetSRID(ST_MakePoint(77.2830, 28.5390), 4326)),
  ('hosp-gangaram', 'delhi', 'Sir Ganga Ram Hospital, Rajinder Nagar', 'multispeciality', 675, 120, 8, '011-25750000', 8.0, ST_SetSRID(ST_MakePoint(77.1890, 28.6380), 4326)),

  -- Gurugram
  ('hosp-medanta-ggn', 'gurugram', 'Medanta — The Medicity', 'trauma_center', 1250, 300, 12, '0124-4141414', 9.5, ST_SetSRID(ST_MakePoint(77.0420, 28.4390), 4326)),
  ('hosp-fortis-ggn', 'gurugram', 'Fortis Memorial Research Institute', 'multispeciality', 1000, 220, 8, '0124-4962200', 8.0, ST_SetSRID(ST_MakePoint(77.0725, 28.4590), 4326)),
  ('hosp-artemis-ggn', 'gurugram', 'Artemis Hospital Gurugram', 'multispeciality', 600, 140, 6, '0124-4511111', 7.5, ST_SetSRID(ST_MakePoint(77.0865, 28.4360), 4326)),

  -- Faridabad
  ('hosp-asian-fbd', 'faridabad', 'Asian Institute of Medical Sciences, Sector 21A', 'multispeciality', 425, 95, 6, '0129-4253000', 7.5, ST_SetSRID(ST_MakePoint(77.2980, 28.4200), 4326)),
  ('hosp-sarvodaya-fbd', 'faridabad', 'Sarvodaya Hospital & Research Centre, Sector 8', 'multispeciality', 450, 110, 7, '0129-4194444', 8.0, ST_SetSRID(ST_MakePoint(77.3350, 28.3650), 4326)),

  -- Panipat
  ('hosp-civil-pan', 'panipat', 'Civil Hospital & Trauma Center Panipat', 'trauma_center', 250, 45, 5, '0180-2640102', 7.0, ST_SetSRID(ST_MakePoint(76.9680, 29.3900), 4326)),

  -- Karnal
  ('hosp-kcgmc-kar', 'karnal', 'Kalpana Chawla Govt Medical College & Hospital', 'trauma_center', 500, 90, 8, '0184-2266252', 8.5, ST_SetSRID(ST_MakePoint(76.9850, 29.6910), 4326)),

  -- Ambala
  ('amb-civil-hosp', 'ambala', 'Civil Hospital & Cantonment General Hospital', 'general', 300, 50, 6, '0171-2630100', 7.5, ST_SetSRID(ST_MakePoint(76.8250, 30.3450), 4326)),

  -- Rohtak
  ('hosp-pgims-roh', 'rohtak', 'Pt. B.D. Sharma PGIMS Rohtak (Apex Tertiary)', 'trauma_center', 2100, 280, 12, '01262-281307', 12.0, ST_SetSRID(ST_MakePoint(76.6180, 28.8890), 4326)),

  -- Hisar
  ('hosp-jindal-his', 'hisar', 'O.P. Jindal Modern Hospital & Research Centre', 'multispeciality', 350, 65, 5, '01662-232202', 8.0, ST_SetSRID(ST_MakePoint(75.7420, 29.1550), 4326)),

  -- Sonipat
  ('hosp-civil-son', 'sonipat', 'Civil Hospital Sonipat & Trauma Center', 'general', 250, 40, 4, '0130-2221200', 7.0, ST_SetSRID(ST_MakePoint(77.0120, 28.9950), 4326)),

  -- Panchkula
  ('hosp-civil-pkl', 'panchkula', 'Civil Hospital Sector 6 Panchkula', 'general', 300, 55, 5, '0172-2567890', 7.5, ST_SetSRID(ST_MakePoint(76.8620, 30.6980), 4326))
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. FIRE & RESCUE STATIONS
-- ----------------------------------------------------------------------------
INSERT INTO fire_stations (id, city_id, name, fire_engines, personnel_count, coverage_radius_km, phone, location)
VALUES
  ('fire-del-cp', 'delhi', 'Delhi Fire Service HQ, Connaught Place', 8, 48, 6.0, '101', ST_SetSRID(ST_MakePoint(77.2250, 28.6290), 4326)),
  ('fire-del-dwarka', 'delhi', 'Dwarka Sector 6 Fire Station', 4, 28, 5.5, '011-25086101', ST_SetSRID(ST_MakePoint(77.0600, 28.5850), 4326)),
  ('fire-del-nehru', 'delhi', 'Nehru Place Fire Station, South Delhi', 5, 34, 5.5, '011-26436101', ST_SetSRID(ST_MakePoint(77.2510, 28.5490), 4326)),
  ('fire-sec29-ggn', 'gurugram', 'Sector 29 Central Fire Station, Gurugram', 6, 38, 5.5, '0124-2320101', ST_SetSRID(ST_MakePoint(77.0640, 28.4680), 4326)),
  ('fire-fbd-nit', 'faridabad', 'NIT Central Fire Station, Faridabad', 5, 32, 5.5, '0129-2415101', ST_SetSRID(ST_MakePoint(77.2950, 28.3900), 4326)),
  ('fire-pan-gt', 'panipat', 'Panipat City Fire Station, GT Road', 4, 26, 5.0, '0180-2650101', ST_SetSRID(ST_MakePoint(76.9650, 29.3920), 4326)),
  ('fire-kar-sec12', 'karnal', 'Sector 12 Fire Station, Karnal', 4, 24, 5.0, '0184-2250101', ST_SetSRID(ST_MakePoint(76.9920, 29.6860), 4326)),
  ('fire-amb-cantt', 'ambala', 'Ambala Cantt Fire Brigade Station', 4, 28, 5.5, '0171-2640101', ST_SetSRID(ST_MakePoint(76.8320, 30.3380), 4326)),
  ('fire-roh-pgi', 'rohtak', 'Rohtak Central Fire Station', 4, 26, 5.0, '01262-250101', ST_SetSRID(ST_MakePoint(76.6080, 28.8920), 4326)),
  ('fire-his-sec14', 'hisar', 'Hisar Municipal Fire Station', 4, 24, 5.0, '01662-230101', ST_SetSRID(ST_MakePoint(75.7280, 29.1500), 4326)),
  ('fire-son-ind', 'sonipat', 'Kundli-Rai Industrial Fire Station', 4, 28, 6.0, '0130-2370101', ST_SetSRID(ST_MakePoint(77.0800, 28.9350), 4326)),
  ('fire-pkl-sec5', 'panchkula', 'Panchkula Sector 5 Fire Station', 4, 26, 5.0, '0172-2560101', ST_SetSRID(ST_MakePoint(76.8520, 30.6930), 4326))
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. MAJOR ARTERIAL HIGHWAYS & CORRIDORS
-- ----------------------------------------------------------------------------
INSERT INTO roads (id, city_id, name, highway_type, lanes, max_speed_kmh, geometry)
VALUES
  ('road-del-ring', 'delhi', 'Mahatma Gandhi Ring Road (Delhi Inner Ring Road)', 'trunk', 8, 70, ST_SetSRID(ST_GeomFromText('LINESTRING(77.1650 28.6800, 77.2000 28.6600, 77.2400 28.6100, 77.2300 28.5700, 77.1800 28.5600, 77.1500 28.6200)'), 4326)),
  ('road-del-outer', 'delhi', 'Outer Ring Road (Delhi-NCR Express Belt)', 'motorway', 8, 80, ST_SetSRID(ST_GeomFromText('LINESTRING(77.0800 28.6400, 77.1200 28.7100, 77.2200 28.7200, 77.3100 28.6100, 77.2700 28.5300, 77.1600 28.5400)'), 4326)),
  ('road-nh48-ggn', 'gurugram', 'NH-48 (Delhi-Jaipur Expressway Gurugram Corridor)', 'motorway', 8, 90, ST_SetSRID(ST_GeomFromText('LINESTRING(77.0950 28.5080, 77.0600 28.4680, 77.0400 28.4480, 77.0100 28.4100, 76.9200 28.3400)'), 4326)),
  ('road-nh44-gt-road', 'panipat', 'NH-44 (Grand Trunk Road — Delhi-Sonipat-Panipat-Karnal-Ambala)', 'motorway', 8, 90, ST_SetSRID(ST_GeomFromText('LINESTRING(77.1200 28.8500, 77.0800 28.9900, 76.9800 29.3900, 76.9900 29.6900, 76.8200 30.3400)'), 4326)),
  ('road-fbd-bypass', 'faridabad', 'Faridabad Bypass & Delhi-Agra NH-19 Express Corridor', 'motorway', 6, 80, ST_SetSRID(ST_GeomFromText('LINESTRING(77.3150 28.4700, 77.3200 28.4100, 77.3300 28.3600, 77.3400 28.3100)'), 4326))
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. REAL-TIME TELEMETRY SENSOR STATIONS
-- ----------------------------------------------------------------------------
INSERT INTO environmental_data (id, city_id, recorded_at, temperature_c, relative_humidity_pct, rainfall_mm_per_hr, wind_speed_kmh, aqi, pm25, pm10, data_source)
VALUES
  ('env-del-live', 'delhi', CURRENT_TIMESTAMP, 33.2, 58, 0.0, 14.5, 215, 108.4, 195.0, 'CPCB & Open-Meteo IFS Grid'),
  ('env-ggn-live', 'gurugram', CURRENT_TIMESTAMP, 32.4, 62, 0.0, 12.8, 178, 88.4, 164.2, 'CPCB & Open-Meteo IFS Grid'),
  ('env-fbd-live', 'faridabad', CURRENT_TIMESTAMP, 33.0, 60, 0.0, 13.2, 192, 94.2, 172.0, 'CPCB & Open-Meteo IFS Grid'),
  ('env-pan-live', 'panipat', CURRENT_TIMESTAMP, 31.8, 64, 0.0, 11.5, 168, 82.0, 152.0, 'CPCB & Open-Meteo IFS Grid'),
  ('env-kar-live', 'karnal', CURRENT_TIMESTAMP, 31.2, 65, 0.0, 10.8, 142, 68.5, 134.0, 'CPCB & Open-Meteo IFS Grid'),
  ('env-amb-live', 'ambala', CURRENT_TIMESTAMP, 30.5, 68, 0.0, 9.4, 125, 58.2, 118.0, 'CPCB & Open-Meteo IFS Grid'),
  ('env-roh-live', 'rohtak', CURRENT_TIMESTAMP, 32.6, 59, 0.0, 12.0, 172, 85.0, 158.0, 'CPCB & Open-Meteo IFS Grid'),
  ('env-his-live', 'hisar', CURRENT_TIMESTAMP, 34.0, 52, 0.0, 14.0, 185, 91.0, 166.0, 'CPCB & Open-Meteo IFS Grid'),
  ('env-son-live', 'sonipat', CURRENT_TIMESTAMP, 32.8, 61, 0.0, 13.0, 188, 92.5, 169.0, 'CPCB & Open-Meteo IFS Grid'),
  ('env-pkl-live', 'panchkula', CURRENT_TIMESTAMP, 29.8, 70, 0.0, 8.6, 98, 42.0, 88.0, 'CPCB & Open-Meteo IFS Grid')
ON CONFLICT (id) DO UPDATE SET
  recorded_at = CURRENT_TIMESTAMP,
  temperature_c = EXCLUDED.temperature_c,
  aqi = EXCLUDED.aqi;
