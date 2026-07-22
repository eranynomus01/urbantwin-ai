import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371.0; // km
  const dlat = (lat2 - lat1) * (Math.PI / 180);
  const dlon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dlon / 2) * Math.sin(dlon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lat = Number(body.lat || 28.6139);
    const lng = Number(body.lng || 77.2090);

    const centers = globalStore.reliefCenters;
    let nearest = centers[0];
    let minDist = Infinity;

    for (const c of centers) {
      const dist = haversine(lat, lng, c.lat, c.lng);
      if (dist < minDist) {
        minDist = dist;
        nearest = c;
      }
    }

    const nearestWithDist = { ...nearest, distance_km: Number(minDist.toFixed(2)) };

    return NextResponse.json({
      nearest_center: nearestWithDist,
      recommendation: `AI recommends heading to ${nearest.name} (${minDist.toFixed(1)} km away). Available Beds: ${nearest.available_beds}.`
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to calculate nearest center' }, { status: 500 });
  }
}
