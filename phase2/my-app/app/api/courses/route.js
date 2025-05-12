
import { NextResponse } from 'next/server';
import { getTopCourses } from '@/lib/repository/courseRepo.js';

export async function GET() {
  const top = await getTopCourses();
  return NextResponse.json(top);
}
