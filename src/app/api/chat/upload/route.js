import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import path from 'path';
import { promises as fs } from 'fs';

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

export async function POST(request) {
  const user = await getUserPayload();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Hanya file gambar yang diperbolehkan' }, { status: 400 });
    }

    // Validasi ukuran (Max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Ukuran file maksimal adalah 10MB' }, { status: 400 });
    }

    const formDataApi = new FormData();
    formDataApi.append('image', file);

    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY || '2ef4c6bc48cb7fb77317eb664a773289'}`, {
      method: 'POST',
      body: formDataApi
    });

    const data = await imgbbRes.json();
    if (data.success) {
      return NextResponse.json({ message: 'File uploaded successfully', url: data.data.url }, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Gagal mengupload gambar ke server' }, { status: 500 });
    }
  } catch (error) {
    console.error('Upload file error:', error);
    return NextResponse.json({ error: 'Gagal mengupload file' }, { status: 500 });
  }
}
