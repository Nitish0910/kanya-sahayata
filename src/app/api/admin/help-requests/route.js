import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HelpRequest from '@/models/HelpRequest';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await HelpRequest.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Help requests fetch error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
