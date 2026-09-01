import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveCityTelemetry } from '@/lib/services/environmental';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('city') || 'gurugram';

    if (cityId !== 'gurugram') {
      return NextResponse.json(
        {
          error: 'Dataset not configured for this city. Currently Gurugram is fully active.',
          cityId,
          isSupported: false
        },
        { status: 400 }
      );
    }

    const telemetry = await fetchLiveCityTelemetry(cityId);
    return NextResponse.json(telemetry);
  } catch (error) {
    console.error('Error fetching environmental telemetry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch environmental data' },
      { status: 500 }
    );
  }
}
