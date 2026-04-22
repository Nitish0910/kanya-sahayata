import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { createAdminSessionResponse } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { userid, password } = await request.json();

    if (!userid?.trim() || !password) {
      return NextResponse.json({ success: false, message: 'Admin ID and password are required' }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ success: false, message: 'Database not configured. Please set MONGODB_URI environment variable.' }, { status: 500 });
    }

    await dbConnect();

    const admin = await Admin.findOne({ userid });

    if (!admin) {
      return NextResponse.json({ success: false, message: 'Username or password is incorrect' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Username or password is incorrect' }, { status: 401 });
    }

    return createAdminSessionResponse(
      { userid: admin.userid, username: admin.username },
      { message: 'Admin login successful' }
    );
  } catch (error) {
    console.error('Admin login error:', error.message || error);
    return NextResponse.json({ success: false, message: 'Server error: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}
