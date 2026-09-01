-- ============================================================================
-- UrbanTwin AI — Real-Time Urban Digital Twin & Decision Support Platform
-- PostgreSQL + PostGIS Spatial Database Schema
-- Target City: Gurugram, Haryana, India (and extensible multi-city structure)
-- ============================================================================

-- Enable PostGIS extension for spatial data operations
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. CITIES & ADMINISTRATIVE ZONES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    default_zoom INTEGER DEFAULT 13,
    bounding_box GEOMETRY(Polygon, 4326),
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS zones (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    zone_type VARCHAR(50) NOT NULL, -- 'residential', 'commercial', 'industrial', 'mixed', 'special_economic_zone'
    sector_number VARCHAR(20),
    area_sqkm DOUBLE PRECISION NOT NULL,
    population INTEGER NOT NULL DEFAULT 0,
    population_density DOUBLE PRECISION, -- per sq km
    road_density_km_per_sqkm DOUBLE PRECISION DEFAULT 0.0,
    hospital_count INTEGER DEFAULT 0,
    school_count INTEGER DEFAULT 0,
    fire_station_count INTEGER DEFAULT 0,
    police_station_count INTEGER DEFAULT 0,
    park_count INTEGER DEFAULT 0,
    flood_risk_score DOUBLE PRECISION DEFAULT 0.0, -- 0.0 to 10.0 scale
    heat_risk_score DOUBLE PRECISION DEFAULT 0.0,  -- 0.0 to 10.0 scale
    boundary GEOMETRY(MultiPolygon, 4326),
    center_point GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial index for zone containment queries
CREATE INDEX IF NOT EXISTS idx_zones_boundary ON zones USING GIST(boundary);
CREATE INDEX IF NOT EXISTS idx_zones_center ON zones USING GIST(center_point);

-- ----------------------------------------------------------------------------
-- 2. INFRASTRUCTURE & AMENITIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roads (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    osm_id BIGINT,
    name VARCHAR(200),
    highway_type VARCHAR(50), -- 'motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'residential'
    lanes INTEGER DEFAULT 2,
    max_speed_kmh INTEGER DEFAULT 50,
    surface VARCHAR(50) DEFAULT 'asphalt',
    is_one_way BOOLEAN DEFAULT FALSE,
    length_km DOUBLE PRECISION,
    geometry GEOMETRY(LineString, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_roads_geometry ON roads USING GIST(geometry);

CREATE TABLE IF NOT EXISTS buildings (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    zone_id VARCHAR(50) REFERENCES zones(id) ON DELETE SET NULL,
    osm_id BIGINT,
    name VARCHAR(200),
    building_type VARCHAR(50), -- 'residential', 'commercial', 'office', 'industrial', 'public'
    height_meters DOUBLE PRECISION,
    floors INTEGER,
    footprint GEOMETRY(Polygon, 4326),
    location GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_buildings_footprint ON buildings USING GIST(footprint);
CREATE INDEX IF NOT EXISTS idx_buildings_location ON buildings USING GIST(location);

CREATE TABLE IF NOT EXISTS hospitals (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    zone_id VARCHAR(50) REFERENCES zones(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    hospital_type VARCHAR(50), -- 'multispeciality', 'trauma_center', 'general', 'clinic'
    total_beds INTEGER DEFAULT 0,
    icu_beds INTEGER DEFAULT 0,
    emergency_available BOOLEAN DEFAULT TRUE,
    ambulance_count INTEGER DEFAULT 2,
    phone VARCHAR(50),
    address TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON hospitals USING GIST(location);

CREATE TABLE IF NOT EXISTS fire_stations (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    zone_id VARCHAR(50) REFERENCES zones(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    fire_engines INTEGER DEFAULT 3,
    hydrant_support BOOLEAN DEFAULT TRUE,
    personnel_count INTEGER DEFAULT 20,
    phone VARCHAR(50),
    address TEXT,
    coverage_radius_km DOUBLE PRECISION DEFAULT 5.0,
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_fire_stations_location ON fire_stations USING GIST(location);

CREATE TABLE IF NOT EXISTS police_stations (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    zone_id VARCHAR(50) REFERENCES zones(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    patrol_vehicles INTEGER DEFAULT 5,
    jurisdiction_radius_km DOUBLE PRECISION DEFAULT 4.0,
    phone VARCHAR(50),
    address TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_police_stations_location ON police_stations USING GIST(location);

CREATE TABLE IF NOT EXISTS schools (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    zone_id VARCHAR(50) REFERENCES zones(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    school_type VARCHAR(50), -- 'primary', 'secondary', 'higher_secondary', 'university'
    capacity INTEGER DEFAULT 500,
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_schools_location ON schools USING GIST(location);

CREATE TABLE IF NOT EXISTS parks (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    zone_id VARCHAR(50) REFERENCES zones(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    area_acres DOUBLE PRECISION,
    canopy_coverage_pct DOUBLE PRECISION DEFAULT 60.0,
    cooling_radius_m DOUBLE PRECISION DEFAULT 500.0,
    boundary GEOMETRY(Polygon, 4326),
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_parks_boundary ON parks USING GIST(boundary);
CREATE INDEX IF NOT EXISTS idx_parks_location ON parks USING GIST(location);

CREATE TABLE IF NOT EXISTS shelters (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    capacity INTEGER DEFAULT 200,
    has_generator BOOLEAN DEFAULT TRUE,
    has_medical_supplies BOOLEAN DEFAULT TRUE,
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_shelters_location ON shelters USING GIST(location);

CREATE TABLE IF NOT EXISTS bus_stops (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    stop_type VARCHAR(50), -- 'bus_stop', 'bus_terminal', 'metro_station', 'railway_station'
    daily_footfall INTEGER DEFAULT 1000,
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_bus_stops_location ON bus_stops USING GIST(location);

-- ----------------------------------------------------------------------------
-- 3. REAL-TIME & ENVIRONMENTAL DATA
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weather_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    temperature_c DOUBLE PRECISION NOT NULL,
    feels_like_c DOUBLE PRECISION,
    humidity_pct DOUBLE PRECISION NOT NULL,
    rainfall_mm_per_hr DOUBLE PRECISION DEFAULT 0.0,
    wind_speed_kmh DOUBLE PRECISION,
    wind_direction VARCHAR(10),
    uv_index DOUBLE PRECISION,
    condition_text VARCHAR(100),
    source_name VARCHAR(100) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_weather_city_time ON weather_data(city_id, recorded_at DESC);

CREATE TABLE IF NOT EXISTS air_quality_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    zone_id VARCHAR(50) REFERENCES zones(id) ON DELETE SET NULL,
    aqi INTEGER NOT NULL,
    pm25 DOUBLE PRECISION,
    pm10 DOUBLE PRECISION,
    no2 DOUBLE PRECISION,
    o3 DOUBLE PRECISION,
    so2 DOUBLE PRECISION,
    co DOUBLE PRECISION,
    category VARCHAR(50), -- 'Good', 'Moderate', 'Poor', 'Very Poor', 'Severe'
    source_name VARCHAR(100) NOT NULL,
    station_name VARCHAR(150),
    location GEOMETRY(Point, 4326),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_aqi_city_time ON air_quality_data(city_id, recorded_at DESC);

CREATE TABLE IF NOT EXISTS traffic_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    road_id VARCHAR(50) REFERENCES roads(id) ON DELETE SET NULL,
    congestion_level VARCHAR(30), -- 'low', 'moderate', 'heavy', 'standstill'
    average_speed_kmh DOUBLE PRECISION,
    speed_drop_pct DOUBLE PRECISION DEFAULT 0.0,
    incident_report TEXT,
    source_name VARCHAR(100) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flood_risk_data (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    risk_level VARCHAR(30) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    elevation_meters DOUBLE PRECISION,
    historical_waterlogging_depth_cm DOUBLE PRECISION DEFAULT 0.0,
    drainage_corridor VARCHAR(150), -- e.g., 'Badshahpur Drain', 'Najafgarh Feeder'
    boundary GEOMETRY(Polygon, 4326),
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_flood_boundary ON flood_risk_data USING GIST(boundary);

CREATE TABLE IF NOT EXISTS emergency_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    emergency_type VARCHAR(50) NOT NULL, -- 'fire', 'medical', 'accident', 'waterlogging', 'structural'
    severity VARCHAR(30) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    description TEXT NOT NULL,
    assigned_fire_station_id VARCHAR(50) REFERENCES fire_stations(id),
    assigned_hospital_id VARCHAR(50) REFERENCES hospitals(id),
    assigned_police_station_id VARCHAR(50) REFERENCES police_stations(id),
    estimated_response_time_min DOUBLE PRECISION,
    status VARCHAR(30) DEFAULT 'active', -- 'active', 'responding', 'resolved'
    incident_location GEOMETRY(Point, 4326) NOT NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_emergency_location ON emergency_data USING GIST(incident_location);

-- ----------------------------------------------------------------------------
-- 4. WHAT-IF SCENARIOS & AI SIMULATION RESULTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scenarios (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    scenario_type VARCHAR(50) NOT NULL, -- 'road_closure', 'new_hospital', 'new_fire_station', 'new_park', 'new_transit_hub'
    parameters JSONB NOT NULL,
    created_by_user VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS simulation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_id VARCHAR(50) REFERENCES scenarios(id) ON DELETE CASCADE,
    baseline_metrics JSONB NOT NULL,
    simulated_metrics JSONB NOT NULL,
    impact_score DOUBLE PRECISION NOT NULL, -- 0 to 100
    affected_population INTEGER DEFAULT 0,
    delta_response_time_min DOUBLE PRECISION DEFAULT 0.0,
    traffic_delay_index DOUBLE PRECISION DEFAULT 0.0,
    uhi_mitigation_c DOUBLE PRECISION DEFAULT 0.0,
    computed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_id VARCHAR(50) REFERENCES scenarios(id) ON DELETE SET NULL,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    observed_data JSONB NOT NULL,
    calculated_metrics JSONB NOT NULL,
    ai_recommendation_text TEXT NOT NULL,
    confidence_rating VARCHAR(30) DEFAULT 'High',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS infrastructure_projects (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'healthcare', 'emergency', 'transit', 'environment', 'drainage'
    estimated_budget_inr_cr DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'proposed', -- 'proposed', 'approved', 'under_construction', 'completed'
    target_completion_year INTEGER,
    geometry GEOMETRY(Geometry, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. TRANSPARENCY, DATA UPDATE LOGS & AUDIT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS data_sources (
    id VARCHAR(50) PRIMARY KEY,
    dataset_name VARCHAR(150) NOT NULL,
    provider_name VARCHAR(150) NOT NULL,
    source_url TEXT NOT NULL,
    license_type VARCHAR(100) NOT NULL, -- 'ODbL', 'CC-BY-4.0', 'Open Government Data (OGD) India'
    update_frequency VARCHAR(50) NOT NULL, -- 'real-time', 'hourly', 'daily', 'monthly', 'annual'
    spatial_coverage VARCHAR(100) NOT NULL,
    reliability_score DOUBLE PRECISION DEFAULT 95.0, -- 0 to 100
    description TEXT,
    last_synced_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS data_update_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_source_id VARCHAR(50) REFERENCES data_sources(id) ON DELETE CASCADE,
    records_ingested INTEGER DEFAULT 0,
    records_valid INTEGER DEFAULT 0,
    records_invalid INTEGER DEFAULT 0,
    status VARCHAR(50) NOT NULL, -- 'success', 'partial_failure', 'failed'
    log_message TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'urban_planner', 'administrator', 'public_viewer'
    department VARCHAR(150),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
