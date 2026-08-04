import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import Product from '@/models/Product';
import User from '@/models/User';

// Helper to ensure DB connection
async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
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

export async function GET(request) {
  const user = await getUserPayload();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    let query = {};
    
    // Jika role operator, hanya ambil produk miliknya sendiri
    if (user.role === 'operator') {
      query = { owner: user.userId };
    }

    // Ambil data produk dan relasi ke nama pemiliknya
    const products = await Product.find(query)
      .populate('owner', 'name email role')
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getUserPayload();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { name, description, price, category, image } = await request.json();

    if (!name || !description || !price) {
      return NextResponse.json({ error: 'Name, description, and price are required' }, { status: 400 });
    }

    // Create product
    const newProduct = await Product.create({
      name,
      description,
      price: Number(price),
      category: category || 'Lainnya',
      image: image || '/images/placeholder.png',
      owner: user.userId // Tautkan ke ID user yang sedang login
    });

    return NextResponse.json({ message: 'Product created successfully', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
