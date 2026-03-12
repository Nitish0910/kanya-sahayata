import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getSession, createSession } from '@/lib/auth';

export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Not logged in' }, { status: 401 });
    }

    const { name, email, phone, address } = await request.json();

    // Validation
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ success: false, message: 'Name and email are required' }, { status: 400 });
    }
    if (phone && !/^\d{10}$/.test(phone)) {
      return NextResponse.json({ success: false, message: 'Phone must be 10 digits' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Check if new email is already taken by another user
    if (email !== session.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return NextResponse.json({ success: false, message: 'Email already in use' }, { status: 409 });
      }
    }

    user.name = name;
    user.email = email;
    if (phone) user.mobile_number = phone;
    if (address) user.address = address;
    
    await user.save();

    // Update session
    await createSession({ id: session.id, name, email });

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

