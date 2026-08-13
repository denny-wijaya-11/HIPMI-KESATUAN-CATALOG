import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getUserPayload } from '@/lib/auth';
import Notification from '@/models/Notification';
import dbConnect from '@/lib/mongodb';

export async function GET(request) {
  try {
    const user = await getUserPayload();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const notifications = await Notification.find({ recipient: user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Notifications GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getUserPayload();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Mark all as read
    await Notification.updateMany(
      { recipient: user.id, isRead: false },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notifications PATCH Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
