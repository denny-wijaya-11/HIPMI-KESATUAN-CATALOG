import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required but not set');
  }
  return new TextEncoder().encode(secret);
}

export async function getUserPayload() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) return null;
    
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload; // { id, email, name, role }
  } catch (err) {
    return null;
  }
}

export { getJwtSecret };
