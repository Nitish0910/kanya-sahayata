import { NextResponse } from 'next/server';

// In-memory store for development (Map is auto-cleared on server restart)
// Key: identifier (e.g., email or mobile number), Value: { otp: string, expiresAt: number }
global.otpStore = global.otpStore || new Map();

export async function POST(request) {
  try {
    const { type, value } = await request.json();

    if (!type || !value) {
      return NextResponse.json({ success: false, message: 'Type and value are required' }, { status: 400 });
    }

    // Generate a secure-looking 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration to 5 minutes from now
    const expiresAt = Date.now() + 5 * 60 * 1000;

    // Store the OTP
    global.otpStore.set(`${type}:${value}`, { otp, expiresAt });

    // Format a message based on the type
    let message = '';
    if (type === 'email') message = `Verification OTP sent to ${value}`;
    else if (type === 'mobile') message = `Verification OTP sent via SMS to ${value}`;
    else if (type === 'Aadhar Card' || type === 'PAN Number') message = `Verification OTP sent to registered mobile for ${type}`;
    else message = `Verification OTP generated`;

    // In a real app, you would integrate Twilio or SendGrid here.
    // For our simulation, we return the OTP in the response dev_field so the frontend can alert it.
    
    return NextResponse.json({ 
      success: true, 
      message, 
      dev_otp: otp // IMPORTANT: Only for simulation testing!
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
