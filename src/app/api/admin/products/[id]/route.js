import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import Product from '@/models/Product';

// Helper to ensure DB connection
async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// Helper to transform Google Drive URLs to direct image links
function transformImageUrl(url) {
  if (!url) return '';
  const driveRegex = /drive\.google\.com\/file\/d\/([^\/]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}

// Helper to get current user payload from token
async function getUserPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    const { payload } = await jwtVerify(token, secret);
    return payload; // { userId, email, role }
  } catch (err) {
    return null;
  }
}

export async function GET(request, { params }) {
  const user = await getUserPayload();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Check if operator owns it
    if (user.role === 'operator' && product.owner.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const user = await getUserPayload();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Role check for update
    if (user.role === 'operator' && product.owner.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden. You can only edit your own products.' }, { status: 403 });
    }

    if (body.image) {
      body.image = transformImageUrl(body.image);
    }
    
    // Set fields individually to guarantee schema validation and save
    if (body.name !== undefined) product.name = body.name;
    if (body.description !== undefined) product.description = body.description;
    if (body.price !== undefined) product.price = body.price;
    if (body.category !== undefined) product.category = body.category;
    if (body.region !== undefined) product.region = body.region;
    if (body.image !== undefined) product.image = body.image;
    
    // Only admins/developers can alter isFeatured
    if (user.role !== 'operator' && body.isFeatured !== undefined) {
      product.isFeatured = body.isFeatured;
    }

    const updatedProduct = await product.save();

    // Revalidate the cache so the homepage and products page update instantly
    revalidatePath('/', 'layout');
    revalidatePath('/admin/products', 'page');

    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await getUserPayload();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Only Admin or Developer can delete
  if (user.role === 'operator') {
    return NextResponse.json({ error: 'Forbidden. Only Admins can delete products.' }, { status: 403 });
  }

  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Revalidate paths so UI updates instantly
    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'layout');
    revalidatePath('/admin/products', 'page');
    revalidatePath('/products', 'page');

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
