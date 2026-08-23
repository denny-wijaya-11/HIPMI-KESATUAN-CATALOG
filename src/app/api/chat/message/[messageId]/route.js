import { NextResponse } from 'next/server';
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

// DELETE /api/chat/message/[messageId] - Soft delete a message
export async function DELETE(request, { params }) {
  const user = await getUserPayload();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const resolvedParams = await params;
    const messageId = resolvedParams.messageId;

    const message = await Message.findById(messageId);
    
    if (!message) {
      return NextResponse.json({ error: 'Pesan tidak ditemukan' }, { status: 404 });
    }

    // Hanya pengirim yang bisa menghapus pesannya sendiri
    if (message.sender.toString() !== user.id) {
      return NextResponse.json({ error: 'Tidak dapat menghapus pesan orang lain' }, { status: 403 });
    }

    message.isDeleted = true;
    await message.save();

    return NextResponse.json({ message: 'Pesan berhasil dihapus', data: message }, { status: 200 });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json({ error: 'Gagal menghapus pesan' }, { status: 500 });
  }
}
