import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { analyzeSOSReport } from '@/lib/gemini';
import { EmergencyReport } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const disaster_type = searchParams.get('disaster_type');
  const search = searchParams.get('search');

  let reports = globalStore.emergencies;

  if (status && status !== 'All') {
    reports = reports.filter((r) => r.status === status);
  }
  if (disaster_type && disaster_type !== 'All') {
    reports = reports.filter((r) => r.disaster_type === disaster_type);
  }
  if (search) {
    const q = search.toLowerCase();
    reports = reports.filter(
      (r) => r.description.toLowerCase().includes(q) || r.location_name.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ reports });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const disaster_type = body.disaster_type || 'Flood';
    const description = body.description || 'Emergency assistance needed';
    const people_affected = Number(body.people_affected || 1);
    const urgency = body.urgency || 'High';

    // Perform AI triage using Gemini Service
    const ai_analysis = await analyzeSOSReport(disaster_type, description, people_affected, urgency);

    const newReport: EmergencyReport = {
      id: Math.floor(Math.random() * 90000) + 10000,
      user_name: body.user_name || 'Citizen SOS User',
      disaster_type,
      description,
      lat: Number(body.lat || 28.6139),
      lng: Number(body.lng || 77.2090),
      location_name: body.location_name || 'Emergency Location',
      people_affected,
      urgency,
      ai_severity: ai_analysis.severity,
      ai_category: ai_analysis.category,
      ai_recommended_team: ai_analysis.recommended_team,
      ai_summary: ai_analysis.summary,
      status: 'Pending',
      created_at: new Date().toISOString()
    };

    globalStore.addReport(newReport);

    return NextResponse.json({
      message: 'SOS emergency report triaged and saved successfully.',
      report: newReport,
      ai_analysis
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process report' }, { status: 500 });
  }
}
