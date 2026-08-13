import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import { SignJWT } from 'jose';
import dbConnect from '@/lib/mongodb';

async function connectDB() {
  await dbConnect();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=NoCodeProvided', request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/google/callback`;

  try {
    // 1. Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) throw new Error(tokenData.error_description || 'Failed to get token');

    // 2. Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    const googleUser = await userResponse.json();
    if (!googleUser.email) throw new Error('No email found in Google Profile');

    await connectDB();
    
    // 3. Check if user exists
    let existingUser = await User.findOne({ email: googleUser.email });
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');

    if (existingUser) {
      // User exists, log them in
      const jwtToken = await new SignJWT({
        id: existingUser._id.toString(),
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1d')
        .sign(secret);

      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.set({
        name: 'auth_token',
        value: jwtToken,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
      return response;
    } else {
      // User does not exist, send to complete profile page
      // Create a temporary token so they can't spoof their email
      const tempToken = await new SignJWT({
        email: googleUser.email,
        googleName: googleUser.name || '',
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h') // Valid for 1 hour to complete registration
        .sign(secret);

      const response = NextResponse.redirect(new URL('/register/complete-profile', request.url));
      response.cookies.set({
        name: 'google_reg_token',
        value: tempToken,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60, // 1 hour
      });
      return response;
    }

  } catch (error) {
    console.error('Google Auth Error:', error);
    return NextResponse.redirect(new URL('/login?error=' + encodeURIComponent(error.message || 'GoogleAuthFailed'), request.url));
  }
}
