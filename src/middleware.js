import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  // Check if it's the admin path, but NOT the login page or API routes
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
      if (userRole === 'operator' && path.startsWith('/admin/settings')) {
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
  matcher: ['/admin/:path*', '/admin'],
};
