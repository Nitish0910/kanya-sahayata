import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Donation from '@/models/Donation';

export async function POST(request) {
  try {
    const { name, email, phone, donation_type, donation_description, donation_quantity } = await request.json();

    // Validation
    if (!name?.trim() || !email?.trim() || !donation_type?.trim()) {
      return NextResponse.json({ success: false, message: 'Name, email, and donation type are required' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 });
    }
    if (phone && !/^\d{10}$/.test(phone)) {
      return NextResponse.json({ success: false, message: 'Phone must be 10 digits' }, { status: 400 });
    }

    await dbConnect();

    const newDonation = new Donation({
      name: name.trim(),
      email: email.trim(),
      mobile: phone || '',
      donate_type: donation_type.trim(),
      description: donation_description?.trim() || '',
      quantity: donation_quantity || ''
    });

    await newDonation.save();

    return NextResponse.json({
      success: true,
      message: `Thank you for your donation, ${name.trim()}! We will contact you soon at ${email} to arrange pickup or delivery.`,
      data: { name: name.trim(), donation_type, donation_quantity, donation_description }
    });
  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Try again.' }, { status: 500 });
  }
}

