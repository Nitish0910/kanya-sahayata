import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'kanya_session';
const ADMIN_COOKIE = 'kanya_admin_session';
const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  maxAge,
  path: '/',
});

export async function createSession(userData) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(userData), cookieOptions(60 * 60 * 24 * 7));
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session) return null;
  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(ADMIN_COOKIE);
}

export async function createAdminSession(adminData) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, JSON.stringify(adminData), cookieOptions(60 * 60 * 24));
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);
  if (!session) return null;
  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

// Helper: create response with cookie header (for API routes where cookieStore.set may not work)
export function createSessionResponse(userData, body = {}) {
  const response = NextResponse.json({ success: true, ...body });
  response.cookies.set(SESSION_COOKIE, JSON.stringify(userData), cookieOptions(60 * 60 * 24 * 7));
  return response;
}

export function createAdminSessionResponse(adminData, body = {}) {
  const response = NextResponse.json({ success: true, ...body });
  response.cookies.set(ADMIN_COOKIE, JSON.stringify(adminData), cookieOptions(60 * 60 * 24));
  return response;
}
