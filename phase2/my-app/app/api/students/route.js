
import { NextResponse } from 'next/server';
import { getTotalStudents } from '@/lib/repository/studentRepo.js';

export async function GET() {
  const total = await getTotalStudents();
  return NextResponse.json({ total });
}
