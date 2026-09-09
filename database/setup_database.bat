@echo off
echo =======================================================
echo UrbanTwin AI - PostGIS Database Setup Script
echo Target: Delhi (NCT) and All Major Cities of Haryana
echo =======================================================

set PGUSER=postgres
set PGDATABASE=urbantwin
set PGPORT=5432
set PGHOST=localhost

echo 1. Creating database '%PGDATABASE%' if it does not exist...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -tc "SELECT 1 FROM pg_database WHERE datname = '%PGDATABASE%'" | findstr "1" >nul
if %errorlevel% neq 0 (
    psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -c "CREATE DATABASE %PGDATABASE%;"
    echo Created database '%PGDATABASE%'.
) else (
    echo Database '%PGDATABASE%' already exists.
)

echo 2. Applying schema (tables, extensions, PostGIS indexes)...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -f schema.sql

echo 3. Seeding Delhi and Haryana cities data...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -f seed_haryana_delhi.sql

echo =======================================================
echo Database setup complete! You can now run the platform.
echo =======================================================
pause
