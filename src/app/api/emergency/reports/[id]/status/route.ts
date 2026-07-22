import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reportId = Number(id);
    const body = await request.json();
    const { status, assigned_team } = body;

    globalStore.updateReportStatus(reportId, status, assigned_team);

    return NextResponse.json({ message: 'Status updated successfully' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
