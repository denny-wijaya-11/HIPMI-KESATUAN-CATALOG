import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import Message from '@/models/Message';
import User from '@/models/User';
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
    return payload; // { id, email, role, name }
  } catch (err) {
    return null;
  }
}

// GET /api/chat - Get list of users the current user has chatted with
export async function GET(request) {
  const user = await getUserPayload();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const userId = new mongoose.Types.ObjectId(user.id);

    // Find all messages where current user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .populate('productContext', 'name image');

    // Group by contact (the other person in the chat)
    const contactsMap = new Map();

    messages.forEach((msg) => {
      const isSender = msg.sender._id.toString() === userId.toString();
      const contact = isSender ? msg.receiver : msg.sender;
      const contactId = contact._id.toString();

      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          contact,
          lastMessage: msg,
          unreadCount: 0
        });
      }

      // Count unread if I am the receiver and it's not read
      if (!isSender && !msg.isRead) {
        contactsMap.get(contactId).unreadCount++;
      }
    });

    const chatList = Array.from(contactsMap.values());
    
    return NextResponse.json(chatList);
  } catch (error) {
    console.error('Fetch chats error:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

// POST /api/chat - Send a new message
export async function POST(request) {
  const user = await getUserPayload();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { receiverId, content, productId } = await request.json();

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Receiver and content are required' }, { status: 400 });
    }

    const newMessage = await Message.create({
      sender: user.id,
      receiver: receiverId,
      content,
      productContext: productId || null
    });

    const populatedMsg = await Message.findById(newMessage._id)
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .populate('productContext', 'name');

    return NextResponse.json({ message: 'Message sent', data: populatedMsg }, { status: 201 });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
