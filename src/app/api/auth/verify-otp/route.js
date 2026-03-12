import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { type, value, otp } = await request.json();

    if (!type || !value || !otp) {
      return NextResponse.json({ success: false, message: 'Type, value, and OTP are required' }, { status: 400 });
    }

    const key = `${type}:${value}`;
    const storedData = global.otpStore?.get(key);

    if (!storedData) {
      return NextResponse.json({ success: false, message: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Check expiration
    if (Date.now() > storedData.expiresAt) {
      global.otpStore.delete(key);
      return NextResponse.json({ success: false, message: 'OTP has expired' }, { status: 400 });
    }

    // Check match
    if (storedData.otp !== otp.toString()) {
      return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
    }

    // OTP matched successfully -> delete it so it can't be reused
    global.otpStore.delete(key);

    return NextResponse.json({ success: true, message: 'Verification successful' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
