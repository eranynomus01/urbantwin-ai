import { NextResponse } from 'next/server';
import { chatWithAIDA } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reply = await chatWithAIDA(
      body.message || 'Help',
      body.context || 'Disaster Relief'
    );
    return NextResponse.json({ response: reply, sender: 'AIDA AI Assistant' });
  } catch (e) {
    return NextResponse.json({ error: 'AI Chat failed' }, { status: 500 });
  }
}
