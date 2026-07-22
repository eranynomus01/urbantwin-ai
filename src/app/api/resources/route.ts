import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET() {
  return NextResponse.json({ resources: globalStore.resources });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRes = {
      id: Date.now(),
      owner: body.owner || 'NGO Action Force',
      item_type: body.item_type || 'Food Packets',
      quantity: Number(body.quantity || 100),
      unit: body.unit || 'Units'
    };
    globalStore.addResource(newRes);
    return NextResponse.json({ message: 'Resource cataloged', resource: newRes }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to add resource' }, { status: 500 });
  }
}
