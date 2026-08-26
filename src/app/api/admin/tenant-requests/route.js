import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

// Helper to check if user is an admin or operator
async function getAuthorizedPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    const { payload } = await jwtVerify(token, secret);
    if (payload.role === 'admin' || payload.role === 'developer' || payload.role === 'operator') {
      return payload;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function GET() {
  const payload = await getAuthorizedPayload();
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await dbConnect();
    
    let query = { tenantStatus: 'pending' };
    
    // Operators only see requests from their university
    if (payload.role === 'operator') {
      query.university = payload.university;
    }
    
    const requests = await User.find(query)
      .select('name email whatsapp university city address paymentMethods createdAt')
      .sort({ createdAt: -1 });
      
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tenant requests' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const payload = await getAuthorizedPayload();
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await dbConnect();
    const { userId, action } = await request.json(); // action: 'approve' or 'reject'
    
    if (!userId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Authorization check for operators
    if (payload.role === 'operator' && user.university !== payload.university) {
      return NextResponse.json({ error: 'Anda tidak berhak memodifikasi mahasiswa kampus lain' }, { status: 403 });
    }

    if (action === 'approve') {
      user.tenantStatus = 'approved';
      user.role = 'tenant';
    } else {
      user.tenantStatus = 'rejected';
      // Do not clear payment methods so they don't have to re-enter if they apply again
    }

    await user.save();
    return NextResponse.json({ message: `Request ${action}d successfully` }, { status: 200 });
  } catch (error) {
    console.error('Tenant request action error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
