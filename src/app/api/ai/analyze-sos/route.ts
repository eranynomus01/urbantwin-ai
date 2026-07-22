import { NextResponse } from 'next/server';
import { analyzeSOSReport } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await analyzeSOSReport(
      body.disaster_type || 'Flood',
      body.description || '',
      Number(body.people_affected || 1),
      body.urgency || 'High'
    );
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 });
  }
}
