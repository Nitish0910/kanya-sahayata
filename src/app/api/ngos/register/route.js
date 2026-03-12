import { NextResponse } from 'next/server';
import { insertRow, readData } from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, description, services, phone, email, website, address, city, state, lat, lng } = data;

    // Validation
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ success: false, message: 'NGO name, email, and phone are required' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 });
    }
    if (!services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json({ success: false, message: 'At least one service type is required' }, { status: 400 });
    }
    if (!city?.trim() || !state?.trim()) {
      return NextResponse.json({ success: false, message: 'City and state are required' }, { status: 400 });
    }

    const id = Date.now();
    insertRow('ngo_applications', {
      id,
      name: name.trim(),
      description: description?.trim() || '',
      services,
      phone: phone.trim(),
      email: email.trim(),
      website: website || '',
      address: address?.trim() || '',
      city: city.trim(),
      state: state.trim(),
      lat: parseFloat(lat) || 0,
      lng: parseFloat(lng) || 0,
      status: 'pending',
      appliedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: 'Your NGO partnership application has been submitted! We will review and contact you soon.' });
  } catch (error) {
    console.error('NGO registration error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Try again.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const applications = readData('ngo_applications');
    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
