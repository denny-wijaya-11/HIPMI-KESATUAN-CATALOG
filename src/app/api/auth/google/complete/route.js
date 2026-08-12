import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, city } = body;

    if (!name || !city) {
      return NextResponse.json({ error: 'Name and city are required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const regToken = cookieStore.get('google_reg_token')?.value;

    if (!regToken) {
      return NextResponse.json({ error: 'Registration session expired. Please login with Google again.' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    let email = '';
    
    try {
      const { payload } = await jwtVerify(regToken, secret);
      email = payload.email;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid registration session' }, { status: 401 });
    }

    await connectDB();

    // Verify again to avoid race conditions
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const newUser = await User.create({
      email,
      name,
      city,
      role: 'user', // Defaults to buyer/user
      authProvider: 'google',
    });

    // Create standard auth token
    const jwtToken = await new SignJWT({
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret);

    const response = NextResponse.json({ message: 'Registration complete' }, { status: 201 });
    
    response.cookies.set({
      name: 'auth_token',
      value: jwtToken,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Clear registration token
    response.cookies.delete('google_reg_token');

    return response;
  } catch (error) {
    console.error('Complete registration error:', error);
    return NextResponse.json({ error: 'Failed to complete registration' }, { status: 500 });
  }
}
