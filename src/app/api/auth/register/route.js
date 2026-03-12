import { NextResponse } from 'next/server';
import { findWhere, insertRow } from '@/lib/db';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      name, date, email, gender, mobile_number, age,
      id_name, id_number, id_issued_state, income, pwd_candidate,
      address, nationality, state, district, house_number, pincode,
      father_name, mother_name, password
    } = data;

    // Validation
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ success: false, message: 'Name, email, and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 });
    }
    if (id_name === 'Aadhar Card' && !/^\d{12}$/.test(id_number)) {
      return NextResponse.json({ success: false, message: 'Aadhar Card number must be exactly 12 digits' }, { status: 400 });
    }
    if (id_name === 'PAN Number' && !/^[A-Z0-9]{10}$/i.test(id_number)) {
      return NextResponse.json({ success: false, message: 'PAN Number must be exactly 10 alphanumeric characters' }, { status: 400 });
    }

    // Check if user already exists
    const byEmail = findWhere('kanya_register', { email });
    const byId = findWhere('kanya_register', { id_number });

    if (byEmail.length > 0 || byId.length > 0) {
      return NextResponse.json({ success: false, message: 'You already have an account with this email or ID' }, { status: 409 });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with hashed password
    insertRow('kanya_register', {
      name, date, email, gender, mobile_number, age,
      id_name, id_number, id_issued_state, income, pwd_candidate,
      address, nationality, state, district, house_number, pincode,
      father_name, mother_name, password: hashedPassword
    });

    await createSession({ id: id_number, name, email });

    return NextResponse.json({ success: true, message: 'Registration successful! Welcome to Kanya Sahayata.' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
