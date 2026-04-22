import { NextResponse } from 'next/server';

const protectedUserRoutes = ['/services', '/education', '/medical', '/domestic', '/career', '/legal-aid', '/mental-health', '/help-request', '/my-requests', '/profile'];
const protectedAdminRoutes = ['/admin/dashboard'];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Skip API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check user-protected routes
  if (protectedUserRoutes.some(route => pathname.startsWith(route))) {
    const session = request.cookies.get('kanya_session');
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
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
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|manifest.json|sw.js|hero-illustration.png|about-illustration.png).*)',
  ],
};
