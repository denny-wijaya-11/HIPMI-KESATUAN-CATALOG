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

  // Only Admin or Developer can perform bulk delete
  if (user.role === 'operator') {
    return NextResponse.json({ error: 'Forbidden. Only Admins can delete products.' }, { status: 403 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const { productIds } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'No product IDs provided' }, { status: 400 });
    }

    // Delete all products that match the IDs in the array
    await Product.deleteMany({ _id: { $in: productIds } });

    // Revalidate paths so UI updates instantly
    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'layout');
    revalidatePath('/admin/products', 'page');
    revalidatePath('/products', 'page');

    return NextResponse.json({ message: `${productIds.length} products deleted successfully` });
  } catch (error) {
    console.error('Error during bulk delete:', error);
    return NextResponse.json({ error: 'Failed to delete products' }, { status: 500 });
  }
}
