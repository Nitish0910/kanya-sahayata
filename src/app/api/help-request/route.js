import { NextResponse } from 'next/server';
import { insertRow } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { name, age, phone, email, address, aadhar, category, description, lat, lng } = await request.json();

    const id = 'HR-' + Date.now();

    insertRow('help_request', {
      id,
      name,
      id_number: session.id,
      user_email: session.email,
      age,
      phone,
      email,
      address,
      aadhar,
      service_type: category,
      description,
      user_lat: lat ? parseFloat(lat) : null,
      user_lng: lng ? parseFloat(lng) : null,
      status: 'pending',
      assigned_ngo: null,
      admin_remarks: '',
      submitted_at: new Date().toISOString(),
      updated_at: null
    });

    return NextResponse.json({ success: true, message: 'Your request has been sent successfully! Track your request status in "My Requests".', requestId: id });
  } catch (error) {
    console.error('Help request error:', error);
    return NextResponse.json({ success: false, message: 'Unable to send request. Please try again.' }, { status: 500 });
  }
}
