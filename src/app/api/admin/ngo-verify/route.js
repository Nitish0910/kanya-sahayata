import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NGO from '@/models/NGO';
import { getAdminSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Valid ID and status (approved/rejected) required' }, { status: 400 });
    }

    await dbConnect();

    // Check if NGO exists
    const ngo = await NGO.findOne({ id: Number(id) });
    if (!ngo) {
      return NextResponse.json({ success: false, message: 'NGO application not found' }, { status: 404 });
    }

    ngo.status = status;
    await ngo.save();

    return NextResponse.json({
      success: true,
      message: `NGO ${ngo.name} has been ${status} successfully`
    });
  } catch (error) {
    console.error('NGO verify error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

