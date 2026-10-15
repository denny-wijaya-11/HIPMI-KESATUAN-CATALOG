import { NextResponse } from 'next/server';
import { getJwtSecret } from '@/lib/auth';
import mongoose from 'mongoose';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import Product from '@/models/Product';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';
import { sanitizeProductDescription, sanitizeText, sanitizeAddressField, sanitizeLocationField } from '@/lib/sanitize';
import { logAuditEvent, getClientInfo } from '@/lib/audit';

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
    const secret = await getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload; // { userId, email, role }
  } catch (err) {
    return null;
  }
}

// Helper to verify operator's university ownership
function verifyOperatorUniversity(user, targetUniversity) {
  return user.role !== 'operator' || user.university === targetUniversity;
}

export async function GET(request) {
  const user = await getUserPayload();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    let query = {};
    
    // Jika role operator, ambil semua produk dari kampusnya dengan validasi
    if (user.role === 'operator') {
      if (!verifyOperatorUniversity(user, user.university)) {
        return NextResponse.json({ error: 'Forbidden: University mismatch' }, { status: 403 });
      }
      query = { university: user.university };
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
    const { name, description, price, category, region, image, isFromUniversity, university, address } = await request.json();

    if (!name || !description || !price || !region) {
      return NextResponse.json({ error: 'Name, description, price, and region are required' }, { status: 400 });
    }
    
    // Sanitize inputs
    const sanitizedName = sanitizeText(name, 100);
    const sanitizedDescription = sanitizeProductDescription(description);
    const sanitizedAddress = address ? sanitizeAddressField(address) : null;
    const sanitizedUniversity = university ? sanitizeLocationField(university) : null;

    let finalImage = image || '/images/placeholder.png';
    finalImage = transformImageUrl(finalImage);

    // Create product
        const newProduct = await Product.create({
          name: sanitizedName,
          description: sanitizedDescription,
          price: Number(price),
          category: category || 'Lainnya',
          region: region,
          image: finalImage,
          isFromUniversity: isFromUniversity,
          university: isFromUniversity ? sanitizedUniversity : null,
          address: !isFromUniversity ? sanitizedAddress : null,
          owner: user.id // Tautkan ke ID user yang sedang login
        });

        // Log audit event
        const { ipAddress, userAgent } = getClientInfo(request);
        await logAuditEvent({
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
          action: 'PRODUCT_CREATE',
          resourceType: 'Product',
          resourceId: newProduct._id.toString(),
          details: { name: sanitizedName, category: category || 'Lainnya' },
          ipAddress,
          userAgent,
          success: true,
        });

        return NextResponse.json({ message: 'Product created successfully', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
