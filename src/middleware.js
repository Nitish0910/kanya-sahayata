import { NextResponse } from 'next/server';

// Only protect pages that require login - NOT service browsing pages
const protectedUserRoutes = ['/help-request', '/my-requests', '/profile'];
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
  matcher: ['/help-request/:path*', '/my-requests/:path*', '/profile/:path*', '/admin/dashboard/:path*'],
};
