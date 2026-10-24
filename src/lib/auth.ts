import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { IUserPayload } from '@/types';

export async function getJwtSecret(): Promise<Uint8Array> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required but not set');
  }
  return new TextEncoder().encode(secret);
}

export async function getUserPayload(): Promise<IUserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) return null;
    
    const secret = await getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as IUserPayload;
  } catch (err) {
    return null;
  }
}
