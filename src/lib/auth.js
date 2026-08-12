'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function getUserPayload() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) return null;
    
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'default_secret_key_change_this_in_production'
    );
    
    const { payload } = await jwtVerify(token, secret);
    return payload; // { id, email, name, role }
  } catch (err) {
    return null;
  }
}
