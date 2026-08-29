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

// POST: Add a new saved address
export async function POST(request) {
  try {
    const payload = await getUserPayload();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { label, name, phone, address, city, postalCode, notes } = body;

    if (!label || !name || !phone || !address || !city) {
      return NextResponse.json({ error: 'Label, nama penerima, nomor HP, alamat, dan kota wajib diisi.' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(payload.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.savedAddresses && user.savedAddresses.length >= 5) {
      return NextResponse.json({ error: 'Maksimal 5 alamat tersimpan.' }, { status: 400 });
    }

    user.savedAddresses.push({ label, name, phone, address, city, postalCode, notes });
    await user.save();

    return NextResponse.json({ message: 'Alamat berhasil disimpan.', savedAddresses: user.savedAddresses }, { status: 201 });
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
