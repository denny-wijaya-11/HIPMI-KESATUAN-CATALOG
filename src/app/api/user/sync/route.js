import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import User from '@/models/User';
import Product from '@/models/Product'; // needed for population
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

// GET: Fetch user's wishlist and cart
export async function GET(request) {
  const payload = await getUserPayload();
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const user = await User.findById(payload.id).populate('wishlist').populate('cart.product');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Format the cart so it looks like the local storage cart (array of products with quantity)
    const formattedCart = user.cart
      .filter(item => item.product != null)
      .map(item => ({
        ...item.product.toObject(),
        quantity: item.quantity
      }));

    return NextResponse.json({
      wishlist: user.wishlist || [],
      cart: formattedCart || []
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}

// POST: Sync user's wishlist and cart to database
export async function POST(request) {
  const payload = await getUserPayload();
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { wishlist, cart } = body;

    await connectDB();
    const user = await User.findById(payload.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (wishlist !== undefined) {
      // Map frontend products to ObjectIds
      user.wishlist = wishlist.map(p => p._id);
    }

    if (cart !== undefined) {
      // Map frontend cart items to { product: ObjectId, quantity: Number }
      user.cart = cart.map(item => ({
        product: item._id,
        quantity: item.quantity || 1
      }));
    }

    await user.save();
    return NextResponse.json({ success: true, message: 'Synced successfully' });
  } catch (error) {
    console.error('Sync Error:', error);
    return NextResponse.json({ error: 'Failed to sync user data' }, { status: 500 });
  }
}
