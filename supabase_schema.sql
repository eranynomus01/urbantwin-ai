-- ============================================================================
-- UrbanTwin AI — Supabase PostgreSQL Database Schema & Haryana Seed Data
-- Run this script directly in the Supabase Dashboard -> SQL Editor -> Run
-- ============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CITIES TABLE
CREATE TABLE IF NOT EXISTS public.cities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Haryana',
    country TEXT NOT NULL DEFAULT 'India',
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    default_zoom NUMERIC(4, 1) NOT NULL DEFAULT 12.5,
    tagline TEXT,
    total_population INTEGER,
    total_area_sq_km NUMERIC(8, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MUNICIPAL SERVICES & INFRASTRUCTURE ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.municipal_services (
    id TEXT PRIMARY KEY,
    city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    service_type TEXT NOT NULL CHECK (service_type IN (
        'healthcare',
        'fire_rescue',
        'police_safety',
        'water_drainage',
        'power_grid',
        'waste_sanitation',
        'disaster_shelter',
        'transit_roads'
    )),
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Operational' CHECK (status IN ('Operational', 'Standby', 'Maintenance', 'Critical Alert')),
    capacity_or_load TEXT,
    phone TEXT,
    address TEXT,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    coverage_radius_km NUMERIC(6, 2) DEFAULT 5.0,
    source TEXT DEFAULT 'Haryana State Municipal Directory',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EMERGENCY INCIDENTS TABLE
CREATE TABLE IF NOT EXISTS public.emergency_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    incident_type TEXT NOT NULL CHECK (incident_type IN (
        'structure_fire',
        'medical_emergency',
        'traffic_collision',
        'urban_flooding',
        'power_grid_failure',
        'hazardous_spill'
    )),
    severity TEXT NOT NULL DEFAULT 'ELEVATED' CHECK (severity IN ('LOW', 'ELEVATED', 'CRITICAL', 'DISASTER')),
    title TEXT NOT NULL,
    description TEXT,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    address TEXT,
    caller_phone TEXT,
    assigned_unit_name TEXT,
    status TEXT NOT NULL DEFAULT 'dispatched' CHECK (status IN ('reported', 'dispatched', 'on_scene', 'resolved')),
    reported_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WHAT-IF SCENARIOS & SIMULATIONS TABLE
CREATE TABLE IF NOT EXISTS public.simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    scenario_name TEXT NOT NULL,
    simulation_type TEXT NOT NULL,
    impact_score NUMERIC(5, 2),
    affected_population INTEGER,
    delta_response_time_min NUMERIC(5, 2),
    calculation_breakdown JSONB DEFAULT '{}'::jsonb,
    created_by TEXT DEFAULT 'Urban Planner',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INDEXES FOR HIGH-SPEED LOOKUP
CREATE INDEX IF NOT EXISTS idx_municipal_services_city ON public.municipal_services(city_id);
CREATE INDEX IF NOT EXISTS idx_municipal_services_type ON public.municipal_services(service_type);
CREATE INDEX IF NOT EXISTS idx_incidents_city ON public.emergency_incidents(city_id);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.municipal_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read municipal_services" ON public.municipal_services FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read emergency_incidents" ON public.emergency_incidents FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read simulations" ON public.simulations FOR SELECT USING (true);

-- Allow anonymous insert for demo reports and simulations
CREATE POLICY "Allow anon insert emergency_incidents" ON public.emergency_incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon insert simulations" ON public.simulations FOR INSERT WITH CHECK (true);

-- 8. PRE-SEED HARYANA CITIES
INSERT INTO public.cities (id, name, state, country, latitude, longitude, default_zoom, tagline, total_population, total_area_sq_km)
VALUES
('gurugram', 'Gurugram', 'Haryana', 'India', 28.4595, 77.0266, 12.5, 'Millennium City — High-Density Tech, Financial & Rapid Urban Growth Hub', 1514085, 232.0),
('faridabad', 'Faridabad', 'Haryana', 'India', 28.4089, 77.3178, 12.5, 'Largest Industrial & Heavy Manufacturing Hub of Haryana', 1414050, 215.0),
('panipat', 'Panipat', 'Haryana', 'India', 29.3909, 76.9635, 12.8, 'Textile Capital of India — Weaver City & Petrochemical Refinery Zone', 442277, 64.0),
('ambala', 'Ambala', 'Haryana', 'India', 30.3782, 76.7767, 12.8, 'Twin City — Major Railway Junction, Defense Airbase & Scientific Instrument Hub', 207934, 80.0),
('yamunanagar', 'Yamunanagar & Jagadhri', 'Haryana', 'India', 30.1290, 77.2674, 12.8, 'Plywood & Paper Manufacturing Cluster along the Yamuna River Basin', 383318, 92.0),
('rohtak', 'Rohtak', 'Haryana', 'India', 28.8955, 76.6066, 12.8, 'Educational & Medical Capital — PGIMS Regional Healthcare Nexus', 374292, 139.0),
('hisar', 'Hisar', 'Haryana', 'India', 29.1492, 75.7217, 12.8, 'Steel City & Western Agricultural Innovation Center', 307222, 104.0),
('karnal', 'Karnal', 'Haryana', 'India', 29.6857, 76.9905, 12.8, 'Smart Rice City & National Dairy Research Institute (NDRI) Center', 302140, 87.0),
('sonipat', 'Sonipat', 'Haryana', 'India', 28.9931, 77.0151, 12.8, 'NCR Higher Education & Industrial Corridor (KMP Expressway)', 289333, 89.0),
('panchkula', 'Panchkula', 'Haryana', 'India', 30.6942, 76.8606, 12.8, 'Planned Foothills Urban Center — Administrative & Shivalik Gateway', 211355, 60.0),
('sirsa', 'Sirsa', 'Haryana', 'India', 29.5321, 75.0318, 12.8, 'Westernmost Agro-Trade Center & Disaster Emergency Relay Point', 183282, 78.0),
('rewari', 'Rewari', 'Haryana', 'India', 28.1920, 76.6191, 12.8, 'Brass City & Southern Haryana Freight Logistics Junction', 143021, 55.0),
('bhiwani', 'Bhiwani', 'Haryana', 'India', 28.7932, 76.1390, 12.8, 'Mini Cuba / Sports Capital & Historic Municipal Hub', 196057, 68.0),
('jhajjar', 'Jhajjar / Bahadurgarh', 'Haryana', 'India', 28.6063, 76.6565, 12.8, 'Power Transmission Corridor (Jhajjar Super Thermal Power) & Metro Link', 170426, 72.0),
('kurukshetra', 'Kurukshetra', 'Haryana', 'India', 29.9695, 76.8783, 12.8, 'Heritage Cultural Center & Northern Irrigation Water Management Hub', 154962, 59.0)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    tagline = EXCLUDED.tagline,
    total_population = EXCLUDED.total_population;

-- 9. PRE-SEED ESSENTIAL MUNICIPAL ASSETS
INSERT INTO public.municipal_services (id, city_id, name, service_type, category, status, capacity_or_load, phone, address, latitude, longitude, coverage_radius_km, source)
VALUES
('ggn-water-basai', 'gurugram', 'Basai Water Treatment Plant & Pumping Station', 'water_drainage', 'Water Treatment & Bulk Supply', 'Operational', '100 MGD Clean Water Capacity', '0124-2300120', 'Basai Village, Sector 9B, Gurugram', 28.4682, 76.9856, 14.0, 'GMDA Urban Water Division'),
('ggn-water-chandu', 'gurugram', 'Chandu Budhera Mega WTP & Storm Reservoir', 'water_drainage', 'Water Treatment & Storm Reservoir', 'Operational', '100 MGD Capacity · 1500M Liter Reserve', '0124-2300125', 'Chandu Budhera Corridor', 28.4612, 76.9248, 18.0, 'GMDA Urban Water Division'),
('ggn-drain-badshahpur', 'gurugram', 'Badshahpur Storm Drain Outfall', 'water_drainage', 'Stormwater Drainage & Flood Mitigation', 'Operational', '2400 Cusecs Discharge Capacity', '0124-2741122', 'Khandsa / Subhash Chowk Intersect', 28.4285, 77.0270, 8.5, 'GMDA Drainage & Flood Control'),
('ggn-power-sec56', 'gurugram', '220kV Grid Substation Sector 56', 'power_grid', 'High-Voltage Grid Substation', 'Operational', '220/66kV · 320 MVA Transmission', '0124-2571210', 'Golf Course Road, Sector 56', 28.4235, 77.1084, 9.0, 'HVPNL'),
('ggn-power-daulatabad', 'gurugram', '400kV Daulatabad Bulk Transmission Substation', 'power_grid', 'National Grid Infeed & Substation', 'Operational', '400/220kV · 630 MVA Core Feed', '0124-2255440', 'Daulatabad Industrial Sector', 28.4980, 76.9920, 22.0, 'HVPNL & Northern Regional Grid'),
('ggn-waste-bandhwari', 'gurugram', 'Bandhwari Integrated Waste Processing & WTE Plant', 'waste_sanitation', 'Solid Waste Processing & Bio-Mining', 'Operational', '2,000 Tonnes / Day Capacity', '0124-2570088', 'Bandhwari Toll Road', 28.3840, 77.1585, 25.0, 'MCG Solid Waste Division'),
('ggn-shelter-tau-devi-lal', 'gurugram', 'Tau Devi Lal Multi-Purpose Relief Shelter', 'disaster_shelter', 'Disaster Shelter & Evacuation Assembly', 'Standby', 'Capacity: 12,000 Persons · Backup Power', '0124-2222100', 'Sector 38, Gurugram', 28.4385, 77.0425, 12.0, 'Haryana SDMA & Red Cross'),
('fbd-water-renney', 'faridabad', 'Yamuna Riverbed Renney Well Water Works', 'water_drainage', 'Groundwater & Potable Water Extraction', 'Operational', '75 MGD Potable Supply', '0129-2415500', 'Basantpur Yamuna Bank', 28.4520, 77.3420, 12.0, 'Municipal Corporation Faridabad'),
('fbd-power-sec25', 'faridabad', '220kV Sector 25 Industrial Grid Substation', 'power_grid', 'Industrial Substation & Feed', 'Operational', '220kV · 240 MVA Industrial Capacity', '0129-2233110', 'Sector 25 Industrial Area', 28.3610, 77.3210, 8.0, 'DHBVN Faridabad'),
('fbd-shelter-nahar-singh', 'faridabad', 'Raja Nahar Singh Stadium Relief Shelter', 'disaster_shelter', 'Regional Disaster Evacuation Center', 'Standby', 'Capacity: 15,000 Persons', '0129-2287600', 'Neelam Flyover Link, Faridabad', 28.3980, 77.3090, 14.0, 'DDMA Faridabad'),
('fbd-health-bk', 'faridabad', 'B.K. Civil Hospital & Trauma Center', 'healthcare', 'District Civil General Hospital', 'Operational', '550 Beds · 24x7 Trauma & ICU', '0129-2415555', 'NIT 1, Faridabad', 28.3960, 77.3010, 12.0, 'Haryana Health Services'),
('rtk-health-pgims', 'rohtak', 'Pt. B.D. Sharma PGIMS Multi-Speciality Trauma Center', 'healthcare', 'Premier Medical College & Level-1 Trauma', 'Operational', '2,100 Beds · Level-1 Trauma & Helipad', '01262-281300', 'Medical Road, Rohtak', 28.8870, 76.6110, 30.0, 'Pt. B.D. Sharma University'),
('rtk-water-drain8', 'rohtak', 'Drain No. 8 Outfall Regulating Complex', 'water_drainage', 'Inter-District Storm Drain Control', 'Operational', '3,200 Cusecs Flow Capacity', '01262-254400', 'Delhi-Rohtak Bypass Link', 28.9110, 76.6340, 12.0, 'Irrigation & Flood Control Haryana'),
('knl-health-kalpana', 'karnal', 'Kalpana Chawla Govt Medical College & Hospital', 'healthcare', 'Government Medical College Hospital', 'Operational', '600 Beds · Super-Speciality ICU', '0184-2266000', 'Model Town, Karnal', 29.6910, 76.9850, 16.0, 'Haryana Medical Education'),
('pkl-shelter-tau', 'panchkula', 'Tau Devi Lal Multi-Sport Relief Shelter', 'disaster_shelter', 'Shivalik Disaster Shelter & Medical Relief', 'Standby', 'Capacity: 11,000 Persons', '0172-2580100', 'Sector 3, Panchkula', 30.7020, 76.8710, 14.0, 'DDMA Panchkula'),
('ymn-water-barrage', 'yamunanagar', 'Hathnikund Barrage & Flood Spillway', 'water_drainage', 'Interstate Flood Spillway & Barrage', 'Operational', '8,00,000 Cusecs Peak Capacity', '01732-251200', 'Hathnikund, Yamunanagar', 30.1850, 77.2950, 30.0, 'Central Water Commission & Haryana Irrigation')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    capacity_or_load = EXCLUDED.capacity_or_load,
    status = EXCLUDED.status;
