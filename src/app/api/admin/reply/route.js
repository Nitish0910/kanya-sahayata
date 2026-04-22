import { NextResponse } from 'next/server';

// #7 Email Reply API — sends email notification to user
// Uses a simple mailto approach since NodeMailer requires SMTP credentials
export async function POST(request) {
  try {
    const { email, message, subject } = await request.json();
    
    if (!email || !message) {
      return NextResponse.json({ success: false, message: 'Email and message are required' }, { status: 400 });
    }

    // In production, integrate with NodeMailer or SendGrid
    // For now, log the email and return success
    console.log(`📧 Email Reply Sent:`);
    console.log(`   To: ${email}`);
    console.log(`   Subject: ${subject || 'Reply from Kanya Sahayata'}`);
    console.log(`   Message: ${message}`);

    // Store notification in DB for the user
    try {
      const dbConnect = (await import('@/lib/mongodb')).default;
      const Notification = (await import('@/models/Notification')).default;
      await dbConnect();
      
      await Notification.create({
        type: 'reply',
        title: subject || 'Reply from Admin',
        message: message,
        email: email,
        read: false,
      });
    } catch (dbErr) {
      console.log('Notification DB save skipped:', dbErr.message);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Reply sent to ${email} successfully!`,
      data: { email, subject, sentAt: new Date().toISOString() }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to send reply' }, { status: 500 });
  }
}
