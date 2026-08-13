import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { checkRateLimit } from '@/lib/rateLimit';

export async function middleware(request) {
  // --- 1. RATE LIMITING (Terbatas pada rute API) ---
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Gunakan IP pengunjung sebagai identifier (jika tidak ada, gunakan default)
    const ip = request.ip ?? '127.0.0.1';
    
    // Periksa batas request
    const { success, limit, reset, remaining } = await checkRateLimit(ip);

    // Jika melebihi batas, tolak request
    if (!success) {
      return new NextResponse(
        JSON.stringify({ error: 'Too Many Requests' }),
        { 
          status: 429, 
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString()
          }
        }
      );
    }
  }

  // --- 2. AUTHENTICATION & RBAC (Terbatas pada rute Admin) ---
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'default_secret_key_change_this_in_production'
      );
      const { payload } = await jwtVerify(token, secret);
      
      // Basic RBAC Example in Middleware
      const userRole = payload.role;
      const path = request.nextUrl.pathname;
      
      // If operator tries to access Admin/Developer-only settings
      if (userRole === 'operator' && (path.startsWith('/admin/settings') || path.startsWith('/admin/users'))) {
         return NextResponse.redirect(new URL('/admin', request.url));
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
  matcher: ['/admin/:path*', '/admin', '/api/:path*'],
};
