import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    
    // Check if an admin/developer already exists to prevent open registration
    const existingUserCount = await User.countDocuments();
    if (existingUserCount > 0) {
      return NextResponse.json(
        { error: 'Initial account already exists. Please use the login page.' },
        { status: 400 }
      );
    }
    
    // Extract credentials from request
    const { email, password, name } = await req.json();
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Please provide email, password, and name' },
        { status: 400 }
      );
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new developer account
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'developer'
    });
    
    return NextResponse.json(
      { message: 'Developer account created successfully', user: { email: user.email, name: user.name, role: user.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Setup Admin Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
