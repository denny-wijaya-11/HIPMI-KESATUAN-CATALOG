import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import Product from '@/models/Product';
import User from '@/models/User';
import Notification from '@/models/Notification';
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
    return payload; // { id, email, role }
  } catch (err) {
    return null;
  }
}

export async function GET(request, { params }) {
  const user = await getUserPayload();
  if (!user || user.role !== 'tenant') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    if (product.owner.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const user = await getUserPayload();
  if (!user || user.role !== 'tenant') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.owner.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden. You can only edit your own products.' }, { status: 403 });
    }

    if (body.image) {
      body.image = transformImageUrl(body.image);
    }
    
    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.region !== undefined) updateData.region = body.region;
    if (body.image !== undefined) updateData.image = body.image;
    
    let isPriceDropped = false;
    if (body.price !== undefined) {
      const newPrice = Number(body.price);
      if (newPrice < product.price) {
        // Price dropped! Set originalPrice to previous price
        updateData.originalPrice = product.price;
        isPriceDropped = true;
      }
      updateData.price = newPrice;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    // Handle Wishlist Notifications
    if (isPriceDropped) {
      // Find all users who have this product in their wishlist
      const usersWithWishlist = await User.find({ wishlist: id });
      
      const notifications = usersWithWishlist.map(u => ({
        recipient: u._id,
        title: 'Harga Turun!',
        message: `Hore! Harga ${updatedProduct.name} yang ada di wishlist kamu turun dari Rp ${product.price.toLocaleString('id-ID')} menjadi Rp ${updatedProduct.price.toLocaleString('id-ID')}. Yuk checkout sekarang!`,
        type: 'price_drop',
        link: `/products/${id}`,
        isRead: false
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    // Revalidate the cache so the homepage and products page update instantly
    revalidatePath('/', 'layout');
    revalidatePath('/tenant/products', 'page');
    revalidatePath('/products', 'page');
    revalidatePath(`/products/${id}`, 'page');

    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
