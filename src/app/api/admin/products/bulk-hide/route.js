import { NextResponse } from 'next/server';
import { getJwtSecret } from '@/lib/auth';
import mongoose from 'mongoose';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import Product from '@/models/Product';
import dbConnect from '@/lib/mongodb';
import { logAuditEvent, getClientInfo } from '@/lib/audit';

async function connectDB() {
  await dbConnect();
}

async function getUserPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const secret = await getJwtSecret();
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

        // Log audit event
        const { ipAddress, userAgent } = getClientInfo(request);
        await logAuditEvent({
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
          action: 'PRODUCT_BULK_HIDE',
          resourceType: 'Product',
          details: { productIds, isHidden, modifiedCount: result.modifiedCount },
          ipAddress,
          userAgent,
          success: true,
        });

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
