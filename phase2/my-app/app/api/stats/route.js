import { NextResponse } from 'next/server';
import { getAllStats } from '@/app/actions/stats';

export async function GET() {
  try {
    const data = await getAllStats();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API /stats] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load stats' }, { status: 500 });
  }
}
