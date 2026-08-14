import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

// Helper to ensure DB connection
async function connectDB() {
  await dbConnect();
}

// Helper to check if user is an admin, developer, or operator
async function getAuthorizedPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    const { payload } = await jwtVerify(token, secret);
    if (payload.role === 'admin' || payload.role === 'developer' || payload.role === 'operator') {
      return payload;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function GET() {
  const payload = await getAuthorizedPayload();
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connectDB();
    
    let query = {};
    if (payload.role === 'operator') {
      query = { role: 'tenant', university: payload.university };
    }
    
    // Exclude password from results
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request) {
  const payload = await getAuthorizedPayload();
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connectDB();
    const { email, password, name, role, isStudent, university, city, address } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set forced data if the creator is an operator
    let finalRole = role;
    let finalUniversity = university;
    
    if (payload.role === 'operator') {
      finalRole = 'tenant';
      finalUniversity = payload.university;
    }

    // Create user object
    const userData = {
      email,
      password: hashedPassword,
      name,
      role: finalRole
    };

    if (finalRole === 'operator') {
      userData.isStudent = isStudent;
      if (isStudent) {
        userData.university = finalUniversity;
      } else {
        userData.city = city;
        userData.address = address;
      }
    } else if (finalRole === 'tenant') {
      userData.university = finalUniversity;
    }

    // Create user
    const newUser = await User.create(userData);

    return NextResponse.json({ message: 'User created successfully', user: { id: newUser._id, email: newUser.email } }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
