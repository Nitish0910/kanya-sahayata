import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Step 1: Verify identity (email + id_number)
// Step 2: Set new password
export async function POST(request) {
  try {
    const { step, email, id_number, newPassword } = await request.json();
    await dbConnect();

    if (step === 'verify') {
      // Verify user identity
      if (!email?.trim() || !id_number?.trim()) {
        return NextResponse.json({ success: false, message: 'Email and ID number are required' }, { status: 400 });
      }

      const user = await User.findOne({ email, id_number });

      if (!user) {
        return NextResponse.json({ success: false, message: 'No account found with this email and ID number combination' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Identity verified! You can now set a new password.',
        verified: true,
        userName: user.name
      });
    }

    if (step === 'reset') {
      // Reset password
      if (!email?.trim() || !id_number?.trim() || !newPassword) {
        return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
      }

      const user = await User.findOne({ email, id_number });

      if (!user) {
        return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 400 });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return NextResponse.json({ success: true, message: 'Password reset successfully! You can now login with your new password.' });
    }

    return NextResponse.json({ success: false, message: 'Invalid step' }, { status: 400 });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
