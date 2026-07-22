import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const disaster_type = body.disaster_type || 'Flood';
    const people_affected = Number(body.people_affected || 500);

    const food_kits = people_affected * 3;
    const water_liters = people_affected * 4;
    const blankets = people_affected;
    const medical_kits = Math.max(10, Math.floor(people_affected / 20));
    const tents = Math.max(5, Math.floor(people_affected / 10));

    return NextResponse.json({
      disaster_type,
      people_affected,
      ai_predicted_resources: {
        food_kits_daily: food_kits,
        drinking_water_liters: water_liters,
        blankets_required: blankets,
        medical_emergency_kits: medical_kits,
        relief_tents: tents
      },
      ai_recommendation: `For ${people_affected} affected individuals, dispatch at least ${food_kits} food kits and ${water_liters}L clean water within 6 hours.`
    });
  } catch (e) {
    return NextResponse.json({ error: 'Resource prediction failed' }, { status: 500 });
  }
}
