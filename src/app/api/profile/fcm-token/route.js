import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    const { payload } = await jose.jwtVerify(token.value, secret);

    const { fcmToken } = await request.json();

    if (!fcmToken) {
      return NextResponse.json({ error: 'Token missing' }, { status: 400 });
    }

    await dbConnect();
    await User.findByIdAndUpdate(payload.id, { fcmToken });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save FCM token error:', error);
    return NextResponse.json({ error: 'Failed to save token' }, { status: 500 });
  }
}
