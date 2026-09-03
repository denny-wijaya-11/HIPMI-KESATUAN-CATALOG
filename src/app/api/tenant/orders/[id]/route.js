import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function PATCH(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json({ error: 'Tidak ada akses' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    const { payload } = await jose.jwtVerify(token.value, secret);

    if (!['tenant', 'operator', 'admin', 'developer'].includes(payload.role)) {
      return NextResponse.json({ error: 'Anda tidak memiliki akses' }, { status: 403 });
    }

    const { status } = await request.json();

    await dbConnect();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    // Ensure tenant/operator is updating their own order
    let isAuthorized = false;
    
    if (payload.role === 'admin' || payload.role === 'developer') {
      isAuthorized = true;
    } else if (payload.role === 'operator') {
      const User = mongoose.models.User || mongoose.model('User');
      const tenantDoc = await User.findById(order.tenant);
      if (tenantDoc && tenantDoc.university === payload.university) {
        isAuthorized = true;
      }
    } else if (order.tenant.toString() === payload.id) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
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
