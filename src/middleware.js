import { NextResponse } from 'next/server';

const protectedUserRoutes = ['/services', '/education', '/medical', '/domestic', '/career', '/legal-aid', '/mental-health', '/help-request', '/my-requests', '/profile'];
const protectedAdminRoutes = ['/admin/dashboard'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check user-protected routes
  if (protectedUserRoutes.some(route => pathname.startsWith(route))) {
    const session = request.cookies.get('kanya_session');
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Check admin-protected routes
  if (protectedAdminRoutes.some(route => pathname.startsWith(route))) {
    const adminSession = request.cookies.get('kanya_admin_session');
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/services/:path*', '/education/:path*', '/medical/:path*', '/domestic/:path*', '/career/:path*', '/legal-aid/:path*', '/mental-health/:path*', '/help-request/:path*', '/my-requests/:path*', '/profile/:path*', '/admin/dashboard/:path*'],
};
