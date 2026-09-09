import { NextRequest, NextResponse } from 'next/server';
import { chatWithUrbanAI, generateGroundedUrbanAdvice, UrbanChatPayload } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.userQuery) {
      return NextResponse.json(
        { error: 'Missing user query' },
        { status: 400 }
      );
    }

    const payload: UrbanChatPayload = {
      userQuery: body.userQuery,
      history: body.history || [],
      cityName: body.cityName || 'Hisar',
      cityId: body.cityId || 'hisar',
      selectedZone: body.selectedZone,
      activeSimulation: body.activeSimulation,
      currentTelemetry: body.currentTelemetry,
    };

    // Generate natural conversational response
    const replyText = await chatWithUrbanAI(payload);

    return NextResponse.json({
      reply: replyText,
      // Also provide backward compatibility if any legacy component looks for these fields
      query: body.userQuery,
      aiStrategicAssessment: {
        summary: replyText,
      },
    });
  } catch (error) {
    console.error('Error generating AI conversation reply:', error);
    return NextResponse.json(
      { 
        reply: "I encountered a temporary connection issue while querying the spatial AI engine. Please try asking again!",
        error: 'Failed to process AI conversation' 
      },
      { status: 500 }
    );
  }
}
