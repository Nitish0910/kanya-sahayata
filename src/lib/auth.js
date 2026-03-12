import { cookies } from 'next/headers';

const SESSION_COOKIE = 'kanya_session';
const ADMIN_COOKIE = 'kanya_admin_session';

export async function createSession(userData) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(userData), {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
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
  cookieStore.set(ADMIN_COOKIE, JSON.stringify(adminData), {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
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
