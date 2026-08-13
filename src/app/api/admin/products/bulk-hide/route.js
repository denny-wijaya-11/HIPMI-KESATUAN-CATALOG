import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import Product from '@/models/Product';
import dbConnect from '@/lib/mongodb';

async function connectDB() {
  await dbConnect();
}

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
  const user = await getUserPayload();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await request.json();
    const { productIds, isHidden } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'No product IDs provided' }, { status: 400 });
    }

    if (typeof isHidden !== 'boolean') {
      return NextResponse.json({ error: 'isHidden boolean flag is required' }, { status: 400 });
    }

    // Filter product IDs based on user role (operators can only update their own products)
    let filter = { _id: { $in: productIds } };
    if (user.role === 'operator') {
      filter.owner = user.id;
    }

    // Update all matching products
    const result = await Product.updateMany(filter, { $set: { isHidden: isHidden } });

    // Revalidate paths so UI updates instantly
    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'layout');
    revalidatePath('/admin/products', 'page');
    revalidatePath('/products', 'page');

    return NextResponse.json({ message: `${result.modifiedCount} products updated successfully` });
  } catch (error) {
    console.error('Error during bulk update:', error);
    return NextResponse.json({ error: 'Failed to update products' }, { status: 500 });
  }
}
