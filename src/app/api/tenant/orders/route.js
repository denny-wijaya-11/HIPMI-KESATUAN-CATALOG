import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product'; // needed for populate
import User from '@/models/User'; // needed for populate

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json({ error: 'Tidak ada akses' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    const { payload } = await jose.jwtVerify(token.value, secret);

    // Ensure user has privileges
    if (!['tenant', 'operator', 'admin', 'developer'].includes(payload.role)) {
      return NextResponse.json({ error: 'Anda tidak memiliki akses' }, { status: 403 });
    }

    await dbConnect();

    // Fetch orders based on role
    let query = {};
    if (payload.role === 'operator') {
      const User = mongoose.models.User || mongoose.model('User');
      const tenants = await User.find({ role: 'tenant', university: payload.university }).select('_id');
      const tenantIds = tenants.map(t => t._id);
      query = { tenant: { $in: tenantIds } };
    } else if (payload.role === 'admin' || payload.role === 'developer') {
      query = {}; // Admin sees all
    } else {
      query = { tenant: payload.id }; // Tenant sees their own
    }

    const orders = await Order.find(query)
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
