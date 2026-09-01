import { NextRequest, NextResponse } from 'next/server';
import { calculateRoute } from '@/lib/routing/osrm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { start, end, avoidRoadId } = body;

    if (!start || !end || !Array.isArray(start) || !Array.isArray(end)) {
      return NextResponse.json(
        { error: 'Invalid coordinates. Expected start and end as [lat, lng]' },
        { status: 400 }
      );
    }

    const route = await calculateRoute(start, end, avoidRoadId);
    return NextResponse.json(route);
  } catch (error) {
    console.error('Error calculating route:', error);
    return NextResponse.json(
      { error: 'Failed to calculate route' },
      { status: 500 }
    );
  }
}
