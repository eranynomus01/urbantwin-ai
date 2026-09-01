import { NextRequest, NextResponse } from 'next/server';
import { runWhatIfSimulation } from '@/lib/simulation/engine';
import { SimulationType } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, params } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Missing simulation type' },
        { status: 400 }
      );
    }

    const result = runWhatIfSimulation(type as SimulationType, params);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error running simulation:', error);
    return NextResponse.json(
      { error: 'Simulation calculation failed' },
      { status: 500 }
    );
  }
}
