# UrbanTwin AI — Real-Time Urban Digital Twin & Decision Support Platform

**UrbanTwin AI** is a production-ready spatial decision support platform designed for urban planners, disaster response teams, and city engineers. Built on real GIS data, public environmental feeds, open routing graphs, and grounded AI, the initial deployment is configured for **Gurugram, Haryana, India** (28.4595° N, 77.0266° E), with an extensible architecture for other Indian cities.

---

## 🌟 Core Architecture & Pillars

1. **Real GIS Infrastructure Data (PostgreSQL + PostGIS & OpenStreetMap)**:
   - Real sector polygons & demographics across Gurugram (Cyber City, DLF Phase 1–5, Sector 29, Sector 14 Old Gurugram, Sector 38 Medanta, Sector 56 Golf Course Ext, Sector 48 Sohna Rd, IMT Manesar, Sector 102 Dwarka Expy).
   - Real hospitals (Medanta The Medicity, Fortis, Artemis, Max, Civil Hospital) with bed and ICU capacity.
   - Real fire stations (Sector 29, Udyog Vihar, Sector 37 Pace City, Manesar, DLF Phase 5).
   - Real arterial highway corridors (NH-48, MG Road, Golf Course Road, Sohna Road, SPR, Dwarka Expressway).
   - Real drainage corridors & flood vectors (Badshahpur drain basin, Najafgarh depression, Hero Honda Chowk & Subhash Chowk underpasses).
   - Urban Heat Island (UHI) vulnerability zones.

2. **Live Environmental Telemetry**:
   - Live Weather & Precipitation API (Open-Meteo High-Resolution Model).
   - Real-time Air Quality (CPCB National AQI / OpenAQ live feed).
   - Explicit **Source Attribution** and **Last Updated (IST)** timestamps on every data point.

3. **What-If Urban Simulation Engine**:
   - **Road Closure**: Simulate 30m, 1h, 2h, 6h closures on arterial highways (NH-48, MG Rd) -> calculates traffic delay index %, parallel corridor spillover, and OSRM detour bypasses.
   - **New Hospital**: Simulate 5km/10-min golden-hour isochrones, population newly served, and ambulance response time reduction.
   - **New Fire Station**: Simulate sub-6 minute response isochrone expansion, high-rise sector protection, and emergency dispatch time drops.
   - **New Eco-Park / Urban Forest**: Simulate microclimate Urban Heat Island (UHI) temperature drop (-1.2°C to -2.5°C) and storm runoff absorption.
   - **New Transit Hub**: Simulate 15-minute pedestrian catchment population gains and vehicular traffic diversion.

4. **Emergency Dispatch & Open Routing (OSRM)**:
   - Point-and-click incident dispatcher for Fire, Trauma, and Waterlogging emergencies.
   - Automatically computes nearest fire station, nearest hospital, real OSRM road route geometry, estimated ETA, and population at risk within 500m.

5. **Grounded AI Urban Planner (Google Gemini)**:
   - Grounded strictly in calculated spatial metrics, active telemetry, and simulation deltas.
   - Produces structured planning memos with Observed Data, Calculated Spatial Metrics, Strategic Assessments (Pros/Risks/Policy Recommendations), and Actionable Roadmap steps with estimated INR budgets and implementing agencies.

6. **Scenario Comparison Studio & Executive Reporting**:
   - Side-by-side KPI comparison: Baseline Gurugram vs Scenario A vs Scenario B.
   - One-click exportable / printable executive briefing report.
   - Data Source Transparency Catalog & 94.5% Data Quality Audit dashboard.

---

## 📁 Project Structure

```
├── database/
│   └── schema.sql                   # Complete PostgreSQL + PostGIS spatial schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/advisor/route.ts  # Gemini AI urban decision engine
│   │   │   ├── environmental/       # Live Open-Meteo & CPCB API proxy
│   │   │   ├── routing/route.ts     # OSRM road graph router
│   │   │   └── simulation/route.ts  # What-if numerical simulation endpoint
│   │   ├── globals.css              # Leaflet styles & command center theme
│   │   ├── layout.tsx               # App root shell
│   │   └── page.tsx                 # UrbanTwin Command Center Dashboard
│   ├── components/
│   │   ├── Map/
│   │   │   ├── DigitalTwinMap.tsx   # Dynamic SSR-safe Leaflet map
│   │   │   └── MapInner.tsx         # Vector layers, choropleths & isochrones
│   │   ├── Panels/
│   │   │   ├── RealTimeTelemetry.tsx # Live weather & AQI ticker with timestamps
│   │   │   ├── ZoneInspector.tsx    # Sector click-to-inspect drawer
│   │   │   ├── WhatIfSimulator.tsx  # Decision simulation studio
│   │   │   ├── EmergencyDispatcher.tsx # Real-time emergency router
│   │   │   ├── AIAdvisorPanel.tsx   # Grounded Gemini AI chat & memos
│   │   │   ├── ScenarioComparison.tsx # Baseline vs Scenario A vs B deck
│   │   │   ├── DataTransparencyModal.tsx # Data sources catalog & 94.5% quality audit
│   │   │   └── ReportGeneratorModal.tsx # Printable executive briefing
│   │   └── UI/
│   │       └── Header.tsx           # City selector, role switcher & tabs
│   ├── data/
│   │   ├── cities.ts                # Multi-city registry
│   │   └── gurugram/                # Real Gurugram GIS datasets
│   ├── lib/
│   │   ├── routing/osrm.ts          # OSRM open routing client
│   │   ├── services/environmental.ts # Live telemetry service
│   │   ├── simulation/engine.ts     # Numerical simulation models
│   │   └── gemini.ts                # Grounded Gemini AI client
│   └── types/
│       └── index.ts                 # Full TypeScript interfaces
```

---

## ⚙️ Environment Variables

Create `.env.local` with:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to access the **UrbanTwin AI Command Center**.
