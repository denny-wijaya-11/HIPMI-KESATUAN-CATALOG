import { NextResponse } from 'next/server';
import { getUserPayload } from '@/lib/auth';

export async function GET() {
  const payload = await getUserPayload();
  return NextResponse.json({ user: payload });
}