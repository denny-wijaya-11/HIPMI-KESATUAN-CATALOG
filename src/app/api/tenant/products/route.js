import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import Product from '@/models/Product';
import dbConnect from '@/lib/mongodb';

// Helper to ensure DB connection
async function connectDB() {
  await dbConnect();
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
    return payload; // { id, email, role, university }
  } catch (err) {
    return null;
  }
}

export async function GET(request) {
  const user = await getUserPayload();
  if (!user || user.role !== 'tenant') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    // Ambil data produk yang hanya dimiliki oleh tenant ini
    const products = await Product.find({ owner: user.id })
      .populate('owner', 'name email role')
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getUserPayload();
  if (!user || user.role !== 'tenant') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { name, description, price, category, image } = await request.json();

    if (!name || !description || !price) {
      return NextResponse.json({ error: 'Name, description, and price are required' }, { status: 400 });
    }
    
    let finalImage = image || '/images/placeholder.png';
    finalImage = transformImageUrl(finalImage);

    // Create product untuk tenant
    const newProduct = await Product.create({
      name,
      description,
      price: Number(price),
      category: category || 'Lainnya',
      region: user.university || 'HIPMORA',
      image: finalImage,
      isFromUniversity: true,
      university: user.university || 'HIPMORA',
      owner: user.id // Terkunci ke ID tenant yang sedang login
    });

    return NextResponse.json({ message: 'Product created successfully', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
