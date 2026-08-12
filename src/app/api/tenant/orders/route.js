import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product'; // needed for populate
import User from '@/models/User'; // needed for populate

export async function GET(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json({ error: 'Tidak ada akses' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    const { payload } = await jose.jwtVerify(token.value, secret);

    // Ensure user has tenant privileges
    if (payload.role !== 'tenant' && payload.role !== 'admin' && payload.role !== 'developer') {
      return NextResponse.json({ error: 'Anda bukan penjual' }, { status: 403 });
    }

    await dbConnect();

    // Fetch orders where tenant matches payload.id
    const orders = await Order.find({ tenant: payload.id })
      .populate({
        path: 'items.product',
        select: 'name image price'
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch tenant orders error:', error);
    return NextResponse.json({ error: 'Gagal mengambil pesanan' }, { status: 500 });
  }
}
