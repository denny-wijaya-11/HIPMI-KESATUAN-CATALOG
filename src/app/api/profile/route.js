import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

async function connectDB() {
  await dbConnect();
}

// Helper to get current user payload
async function getUserPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    const { payload } = await jwtVerify(token, secret);
    return payload; // { id, email, role, name, avatar }
  } catch (err) {
    return null;
  }
}

// Helper to transform Google Drive URLs to direct image links
function transformImageUrl(url) {
  if (!url) return '';
  const driveRegex = /drive\.google\.com\/file\/d\/([^\/]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}

export async function GET() {
  const payload = await getUserPayload();
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const user = await User.findById(payload.id).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
    const response = NextResponse.json(user);

    // Refresh token if role, name, avatar, or university changed
    if (user.role !== payload.role || user.avatar !== payload.avatar || user.university !== payload.university) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
      const token = await new SignJWT({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        university: user.university,
        avatar: user.avatar
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret);

      response.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      });
    }

    return response;
  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request) {
  const payload = await getUserPayload();
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const data = await request.json();
    
    // Transform avatar URL if provided
    if (data.avatar) {
      data.avatar = transformImageUrl(data.avatar);
    }
    
    // Clean up empty strings that might fail validation
    Object.keys(data).forEach(key => {
      if (data[key] === '') {
        delete data[key];
      }
    });

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      payload.id,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate new token with updated name/avatar/university
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    const token = await new SignJWT({
      id: updatedUser._id.toString(),
      email: updatedUser.email,
      role: updatedUser.role,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      university: updatedUser.university
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}
