import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getUserPayload } from '@/lib/auth';

export async function POST(req, { params }) {
  try {
    const user = await getUserPayload();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ message: 'Rating dan komentar wajib diisi' }, { status: 400 });
    }

    await dbConnect();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === user.userId
    );

    if (alreadyReviewed) {
      return NextResponse.json({ message: 'Anda sudah memberikan ulasan untuk produk ini' }, { status: 400 });
    }

    const review = {
      user: user.userId,
      name: user.name || user.email.split('@')[0],
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    
    // Calculate average rating
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    return NextResponse.json({ message: 'Ulasan berhasil ditambahkan', review }, { status: 201 });
  } catch (error) {
    console.error('Review Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
