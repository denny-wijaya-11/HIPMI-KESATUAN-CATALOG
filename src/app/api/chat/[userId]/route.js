import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import Message from '@/models/Message';
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
    return payload; // { id, email, role, name }
  } catch (err) {
    return null;
  }
}

// GET /api/chat/[userId] - Get chat history with a specific user
export async function GET(request, { params }) {
  const user = await getUserPayload();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const resolvedParams = await params;
    const otherUserId = resolvedParams.userId;
    const myUserId = user.id;

    // Fetch messages between me and otherUserId
    if (!otherUserId || otherUserId === 'undefined' || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const messages = await Message.find({
      $or: [
        { sender: myUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: myUserId }
      ]
    })
      .sort({ createdAt: 1 }) // Chronological order
      .populate('productContext', 'name image price');

    // Mark messages as read where I am the receiver
    await Message.updateMany(
      { sender: otherUserId, receiver: myUserId, isRead: false },
      { $set: { isRead: true } }
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Fetch chat history error:', error);
    return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
  }
}
