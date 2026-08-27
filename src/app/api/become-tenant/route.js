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

export async function POST(request) {
  const payload = await getUserPayload();
  if (!payload || payload.role !== 'user') {
    return NextResponse.json({ error: 'Hanya akun User biasa yang bisa mengajukan diri sebagai Tenant' }, { status: 403 });
  }

  try {
    await dbConnect();
    const { storeName, address, paymentMethods } = await request.json();

    if (!paymentMethods || paymentMethods.length === 0) {
      return NextResponse.json({ error: 'Minimal 1 metode pembayaran harus ditambahkan' }, { status: 400 });
    }
    
    if (!storeName) {
      return NextResponse.json({ error: 'Nama Toko wajib diisi' }, { status: 400 });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    if (user.tenantStatus === 'pending') {
      return NextResponse.json({ error: 'Pengajuan Anda sebelumnya masih dalam status Pending' }, { status: 400 });
    }

    user.name = storeName;
    user.address = address || user.address;
    user.paymentMethods = paymentMethods;
    user.tenantStatus = 'pending';
    
    await user.save();

    return NextResponse.json({ message: 'Pengajuan berhasil dikirim' }, { status: 200 });
  } catch (error) {
    console.error('Become tenant API error:', error);
    return NextResponse.json({ error: 'Gagal mengirim pengajuan' }, { status: 500 });
  }
}
