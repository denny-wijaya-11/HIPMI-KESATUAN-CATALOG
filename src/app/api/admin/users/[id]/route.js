import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

// Helper to ensure DB connection
async function connectDB() {
  await dbConnect();
}

// Helper to get current user payload from token
async function getUserPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    const { payload } = await jwtVerify(token, secret);
    return payload; // { userId, email, role }
  } catch (err) {
    return null;
  }
}

// Ensure the request is coming from Admin, Developer, or Operator
function isAuthorized(user) {
  return user && (user.role === 'admin' || user.role === 'developer' || user.role === 'operator');
}

export async function GET(request, { params }) {
  const user = await getUserPayload();
  if (!isAuthorized(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const userToFetch = await User.findById(id).select('-password');
    if (!userToFetch) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'operator') {
      if (userToFetch.role !== 'tenant' || userToFetch.university !== user.university) {
        return NextResponse.json({ error: 'Forbidden. You can only view tenants from your campus.' }, { status: 403 });
      }
    }

    return NextResponse.json({ user: userToFetch });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const user = await getUserPayload();
  if (!isAuthorized(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'operator') {
      if (userToUpdate.role !== 'tenant' || userToUpdate.university !== user.university) {
        return NextResponse.json({ error: 'Forbidden. You can only edit tenants from your campus.' }, { status: 403 });
      }
    }

    // Only developers can change another developer's role/details
    if (userToUpdate.role === 'developer' && user.role !== 'developer') {
      return NextResponse.json({ error: 'Forbidden. Only developers can edit developer accounts.' }, { status: 403 });
    }

    // Prepare update data (do not update password through this route)
    let finalRole = body.role;
    if (user.role === 'operator') {
      finalRole = 'tenant';
    }

    const updateData = {
      name: body.name,
      email: body.email,
      role: finalRole,
      whatsapp: body.whatsapp,
      university: body.university,
      city: body.city,
      isStudent: body.isStudent,
      paymentMethods: body.paymentMethods
    };

    if (body.tenantStatus) {
      updateData.tenantStatus = body.tenantStatus;
    }

    if (body.password && body.password.trim() !== '') {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await getUserPayload();
  if (!isAuthorized(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Prevent self-deletion
    if (id === user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'operator') {
      if (userToDelete.role !== 'tenant' || userToDelete.university !== user.university) {
        return NextResponse.json({ error: 'Forbidden. You can only delete tenants from your campus.' }, { status: 403 });
      }
    }

    // Only developers can delete developers
    if (userToDelete.role === 'developer' && user.role !== 'developer') {
      return NextResponse.json({ error: 'Forbidden. Only developers can delete developer accounts.' }, { status: 403 });
    }

    // Delete all products owned by this user to prevent "orphan" products
    const Product = require('@/models/Product').default || require('@/models/Product');
    await Product.deleteMany({ owner: id });

    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
