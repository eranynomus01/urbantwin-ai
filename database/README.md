# UrbanTwin AI — Database Setup & Deployment Guide
## Multi-City PostGIS Architecture: Delhi (NCT) & Haryana Regional Hubs

This directory contains the production-grade PostgreSQL + PostGIS spatial database architecture for **UrbanTwin AI**, covering **Delhi (NCT)** and **all 9 major urban and industrial centers of Haryana** (Gurugram, Faridabad, Panipat, Karnal, Ambala, Rohtak, Hisar, Sonipat, Panchkula).

---

## 📁 Files in This Directory

| File | Description |
| :--- | :--- |
| [`schema.sql`](./schema.sql) | Core DDL: PostGIS extensions, tables (`cities`, `zones`, `roads`, `hospitals`, `fire_stations`, `police_stations`, `environmental_data`, `scenarios`), and `GIST` spatial indexes. |
| [`seed_haryana_delhi.sql`](./seed_haryana_delhi.sql) | Data Seeder: Populates real geographic coordinates, populations, trauma centers (AIIMS, Medanta, PGIMS, Kalpana Chawla), fire stations, and roads for Delhi + 9 Haryana cities. |
| [`setup_database.bat`](./setup_database.bat) | 1-Click Windows execution script. |
| [`setup_database.sh`](./setup_database.sh) | 1-Click Linux / macOS / Docker execution script. |

---

## ⚡ Option 1: Quick Local Setup with PostgreSQL & PostGIS

### 1. Ensure PostGIS is installed:
```bash
# Ubuntu / Debian
sudo apt-get install -y postgresql-16 postgresql-16-postgis-3

# macOS (Homebrew)
brew install postgresql@16 postgis

# Windows
# Download PostgreSQL with PostGIS extension via EDB Installer: https://www.postgresql.org/download/windows/
```

### 2. Create the Database & Run Migrations:
```bash
# Create database
createdb -U postgres urbantwin

# Run Schema and Seed files
psql -U postgres -d urbantwin -f schema.sql
psql -U postgres -d urbantwin -f seed_haryana_delhi.sql
```

Or simply execute:
```bash
# On Windows:
setup_database.bat

# On Linux / macOS:
chmod +x setup_database.sh
./setup_database.sh
```

---

## 🐳 Option 2: 1-Command Docker Setup

Run a complete containerized PostGIS instance with schema pre-loaded:

```bash
docker run --name urbantwin-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=urbantwin -p 5432:5432 -d postgis/postgis:16-3.4

# Apply schema and seeds into container:
docker exec -i urbantwin-db psql -U postgres -d urbantwin < schema.sql
docker exec -i urbantwin-db psql -U postgres -d urbantwin < seed_haryana_delhi.sql
```

---

## ☁️ Option 3: Free Cloud Database (Supabase / Neon / AWS RDS)

1. Create a free project on [Supabase.com](https://supabase.com) or [Neon.tech](https://neon.tech).
2. Open the **SQL Editor** tab in your dashboard.
3. Paste the contents of [`schema.sql`](./schema.sql) and click **Run**.
4. Paste the contents of [`seed_haryana_delhi.sql`](./seed_haryana_delhi.sql) and click **Run**.
5. Copy your connection URI to `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:5432/postgres"
   ```

---

## 🔍 Useful PostGIS Spatial Queries

### Find the nearest Hospital to any GPS point (e.g. from Delhi or Gurugram):
```sql
SELECT name, hospital_type, total_beds, icu_beds,
       ROUND(ST_Distance(location::geography, ST_SetSRID(ST_MakePoint(77.2090, 28.5672), 4326)::geography) / 1000.0, 2) AS distance_km
FROM hospitals
WHERE city_id = 'delhi'
ORDER BY location <-> ST_SetSRID(ST_MakePoint(77.2090, 28.5672), 4326)
LIMIT 3;
```

### Find all sectors with Flood Risk Score >= 6.0:
```sql
SELECT name, city_id, sector_number, population, flood_risk_score
FROM zones
WHERE flood_risk_score >= 6.0
ORDER BY flood_risk_score DESC;
```
