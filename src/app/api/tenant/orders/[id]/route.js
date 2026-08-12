import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json({ error: 'Tidak ada akses' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    const { payload } = await jose.jwtVerify(token.value, secret);

    if (payload.role !== 'tenant' && payload.role !== 'admin' && payload.role !== 'developer') {
      return NextResponse.json({ error: 'Anda bukan penjual' }, { status: 403 });
    }

    const { status } = await request.json();

    await dbConnect();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    // Ensure tenant is updating their own order
    if (order.tenant.toString() !== payload.id && payload.role !== 'admin' && payload.role !== 'developer') {
      return NextResponse.json({ error: 'Anda tidak berhak mengubah pesanan ini' }, { status: 403 });
    }

    order.status = status;
    await order.save();

    return NextResponse.json({ success: true, message: 'Status berhasil diperbarui' });
  } catch (error) {
    console.error('Update tenant order error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui pesanan' }, { status: 500 });
  }
}
