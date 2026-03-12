import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { createAdminSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { userid, password } = await request.json();

    if (!userid?.trim() || !password) {
      return NextResponse.json({ success: false, message: 'Admin ID and password are required' }, { status: 400 });
    }

    await dbConnect();

    // Find admin by userid (e.g., ADMIN-001)
    const admin = await Admin.findOne({ userid });

    if (!admin) {
      return NextResponse.json({ success: false, message: 'Username or password is incorrect' }, { status: 401 });
    }

    // Compare password with bcrypt hash
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Username or password is incorrect' }, { status: 401 });
    }

    await createAdminSession({ userid: admin.userid, username: admin.username });
    return NextResponse.json({ success: true, message: 'Admin login successful' });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
