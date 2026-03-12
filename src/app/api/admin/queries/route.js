import { NextResponse } from 'next/server';
import { readData } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const data = readData('kanya_contact');
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Queries fetch error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
