-- AI Disaster Emergency Portal Schema (Supabase / PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'citizen', -- citizen, volunteer, officer, ngo, admin
    phone VARCHAR(20),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS volunteers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
    skills TEXT DEFAULT '[]',
    availability BOOLEAN DEFAULT TRUE,
    completed_missions INTEGER DEFAULT 0,
    performance_score DOUBLE PRECISION DEFAULT 4.8,
    certificate_url VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS emergency_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(120) DEFAULT 'Anonymous Citizen',
    disaster_type VARCHAR(50) NOT NULL, -- Flood, Fire, Earthquake, Cyclone, Heatwave, Landslide, Medical Emergency
    description TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    location_name VARCHAR(256) DEFAULT 'Disaster Zone',
    people_affected INTEGER DEFAULT 1,
    urgency VARCHAR(50) DEFAULT 'High',
    ai_severity INTEGER DEFAULT 5,
    ai_category VARCHAR(100) DEFAULT 'General Emergency',
    ai_recommended_team VARCHAR(100) DEFAULT 'NDRF Quick Response Team',
    ai_summary TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Assigned, In Progress, Resolved, Cancelled
    assigned_team VARCHAR(120),
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS relief_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location_name VARCHAR(256) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    capacity INTEGER DEFAULT 500,
    current_occupancy INTEGER DEFAULT 120,
    available_beds INTEGER DEFAULT 380,
    medical_staff INTEGER DEFAULT 12,
    food_stock_days INTEGER DEFAULT 14,
    water_stock_days INTEGER DEFAULT 10,
    medicines VARCHAR(100) DEFAULT 'Adequate',
    generator_status VARCHAR(50) DEFAULT 'Operational',
    contact_phone VARCHAR(20) DEFAULT '+91 1800-112-911'
);

CREATE TABLE IF NOT EXISTS resources (
    id SERIAL PRIMARY KEY,
    owner VARCHAR(100) DEFAULT 'District Disaster Authority',
    item_type VARCHAR(100) NOT NULL,
    quantity INTEGER DEFAULT 100,
    unit VARCHAR(50) DEFAULT 'Units',
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(150) NOT NULL,
    performed_by VARCHAR(120) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
