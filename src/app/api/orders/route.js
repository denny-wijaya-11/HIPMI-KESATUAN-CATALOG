import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json({ error: 'Tidak ada akses' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    const { payload } = await jose.jwtVerify(token.value, secret);

    if (!payload) {
      return NextResponse.json({ error: 'Sesi tidak valid' }, { status: 401 });
    }

    const { items, shippingAddress } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 });
    }

    await dbConnect();

    // Group items by tenant
    const itemsByTenant = {};

    for (const item of items) {
      // Validasi produk
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ error: `Produk tidak ditemukan` }, { status: 404 });
      }

      const tenantId = product.owner.toString();
      
      if (!itemsByTenant[tenantId]) {
        itemsByTenant[tenantId] = {
          tenant: tenantId,
          items: [],
          totalAmount: 0
        };
      }

      itemsByTenant[tenantId].items.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
      itemsByTenant[tenantId].totalAmount += (product.price * item.quantity);
    }

    // Create an order for each tenant
    const orderPromises = Object.values(itemsByTenant).map(tenantOrder => {
      const newOrder = new Order({
        buyer: payload.id,
        tenant: tenantOrder.tenant,
        items: tenantOrder.items,
        totalAmount: tenantOrder.totalAmount,
        shippingAddress
      });
      return newOrder.save();
    });

    await Promise.all(orderPromises);

    // Empty user cart after checkout
    await User.findByIdAndUpdate(payload.id, { $set: { cart: [] } });

    return NextResponse.json({ success: true, message: 'Pesanan berhasil dibuat' });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Gagal memproses pesanan' }, { status: 500 });
  }
}
