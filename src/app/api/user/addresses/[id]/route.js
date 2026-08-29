import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

async function getUserPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

// DELETE: Remove a saved address
export async function DELETE(request, { params }) {
  try {
    const payload = await getUserPayload();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: addressId } = await params;
    
    if (!addressId) {
      return NextResponse.json({ error: 'Address ID diperlukan' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(payload.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    user.savedAddresses = user.savedAddresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();

    return NextResponse.json({ message: 'Alamat berhasil dihapus.', savedAddresses: user.savedAddresses }, { status: 200 });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
