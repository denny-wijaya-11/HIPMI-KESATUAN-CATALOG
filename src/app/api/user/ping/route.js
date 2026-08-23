import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    const { payload } = await jwtVerify(token, secret);
    
    if (!payload || !payload.id) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await dbConnect();
    
    // Update lastActive timestamp
    await User.findByIdAndUpdate(payload.id, {
      $set: { lastActive: new Date() }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
