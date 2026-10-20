import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

async function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required but not set');
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(request) {
  // Check if it's the admin path, but NOT the login page or API routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
          const secret = await getJwtSecret();
          const { payload } = await jwtVerify(token, secret);
      
      // Strict RBAC: Hanya akun dengan role 'admin' yang boleh mengakses /admin
      const userRole = payload.role;
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware Token Error:', error);
      // Token is invalid or expired
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  // Allow access to other paths (like /login or public homepage)
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};
