#!/usr/bin/env bash
set -e

echo "======================================================="
echo "UrbanTwin AI - PostGIS Database Setup Script"
echo "Target: Delhi (NCT) and All Major Cities of Haryana"
echo "======================================================="

PGUSER="${PGUSER:-postgres}"
PGDATABASE="${PGDATABASE:-urbantwin}"
PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"

echo "1. Creating database '$PGDATABASE' if it does not exist..."
psql -U "$PGUSER" -h "$PGHOST" -p "$PGPORT" -tc "SELECT 1 FROM pg_database WHERE datname = '$PGDATABASE'" | grep -q 1 || \
psql -U "$PGUSER" -h "$PGHOST" -p "$PGPORT" -c "CREATE DATABASE $PGDATABASE;"

echo "2. Applying schema (tables, extensions, PostGIS indexes)..."
psql -U "$PGUSER" -h "$PGHOST" -p "$PGPORT" -d "$PGDATABASE" -f schema.sql

echo "3. Seeding Delhi and Haryana cities data..."
psql -U "$PGUSER" -h "$PGHOST" -p "$PGPORT" -d "$PGDATABASE" -f seed_haryana_delhi.sql

echo "======================================================="
echo "Database setup complete! You can now run the platform."
echo "======================================================="
