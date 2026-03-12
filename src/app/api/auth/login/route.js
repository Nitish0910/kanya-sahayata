import { NextResponse } from 'next/server';
import { findWhere } from '@/lib/db';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email?.trim() || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    // Rate limit: 5 login attempts per 15 minutes per email
    const limit = rateLimit(`login:${email}`, 5, 15 * 60 * 1000);
    if (!limit.allowed) {
      const mins = Math.ceil(limit.resetIn / 60000);
      return NextResponse.json({ success: false, message: `Too many login attempts. Try again in ${mins} minute(s).` }, { status: 429 });
    }

    // Find user by email only (not password, since it's hashed)
    const users = findWhere('kanya_register', { email });

    if (users.length === 0) {
      return NextResponse.json({ success: false, message: 'Email or password is incorrect' }, { status: 401 });
    }

    const user = users[0];

    // Compare password with bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Email or password is incorrect' }, { status: 401 });
    }

    await createSession({ id: user.id_number, name: user.name, email: user.email });
    return NextResponse.json({ success: true, message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
