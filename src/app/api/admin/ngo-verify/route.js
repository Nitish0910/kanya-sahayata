import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
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

    // Update in ngo_applications
    const apps = readData('ngo_applications');
    const idx = apps.findIndex(n => n.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: 'NGO application not found' }, { status: 404 });
    }

    apps[idx].status = status;
    apps[idx].verified_at = new Date().toISOString();
    writeData('ngo_applications', apps);

    // If approved, also add to ngos list (so it shows up for users)
    if (status === 'approved') {
      const ngos = readData('ngos');
      // Avoid duplicates
      if (!ngos.some(n => n.id === id)) {
        ngos.push({ ...apps[idx] });
        writeData('ngos', ngos);
      }
    }

    return NextResponse.json({
      success: true,
      message: `NGO ${apps[idx].name} has been ${status} successfully`
    });
  } catch (error) {
    console.error('NGO verify error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
