import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PATCH(request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    let payload;
    try {
      const verified = await jose.jwtVerify(token, secret);
      payload = verified.payload;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    // Verify order belongs to this user and is pending
    const order = await Order.findOne({ _id: orderId, buyer: payload.id });
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan atau akses ditolak' }, { status: 404 });
    }

    if (order.status !== 'Menunggu Pembayaran') {
      return NextResponse.json({ error: 'Pesanan tidak dapat dibatalkan pada status ini' }, { status: 400 });
    }

    order.status = 'Dibatalkan';
    await order.save();

    return NextResponse.json({ success: true, message: 'Pesanan berhasil dibatalkan' });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
