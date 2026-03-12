import { NextResponse } from 'next/server';
import { insertRow } from '@/lib/db';

export async function POST(request) {
  try {
    const { name, phone, email, subject, message } = await request.json();

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ success: false, message: 'Name, email, and message are required' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 });
    }
    if (phone && !/^\d{10}$/.test(phone)) {
      return NextResponse.json({ success: false, message: 'Phone must be 10 digits' }, { status: 400 });
    }

    insertRow('kanya_contact', {
      name: name.trim(),
      phone_no: phone || '',
      email_id: email.trim(),
      field: subject || 'General',
      message: message.trim(),
      submitted_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: 'Your query has been sent successfully. We will contact you soon.' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ success: false, message: 'Unable to send your query. Please try again.' }, { status: 500 });
  }
}
