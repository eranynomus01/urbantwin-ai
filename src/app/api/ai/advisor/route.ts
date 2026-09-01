import { NextRequest, NextResponse } from 'next/server';
import { generateGroundedUrbanAdvice } from '@/lib/gemini';
import { AIAdvisorQueryPayload } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as AIAdvisorQueryPayload;

    if (!payload.userQuery) {
      return NextResponse.json(
        { error: 'Missing user query' },
        { status: 400 }
      );
    }

    const advice = await generateGroundedUrbanAdvice(payload);
    return NextResponse.json(advice);
  } catch (error) {
    console.error('Error generating grounded AI advice:', error);
    return NextResponse.json(
      { error: 'Failed to process AI urban planning assessment' },
      { status: 500 }
    );
  }
}
