import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id, action, assigned_ngo, admin_remarks } = await request.json();

    if (!id || !action) {
      return NextResponse.json({ success: false, message: 'Request ID and action are required' }, { status: 400 });
    }

    const data = readData('help_request');
    const index = data.findIndex(r => r.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }

    switch (action) {
      case 'verify':
        data[index].status = 'verified';
        data[index].updated_at = new Date().toISOString();
        if (admin_remarks) data[index].admin_remarks = admin_remarks;
        break;

      case 'reject':
        data[index].status = 'rejected';
        data[index].updated_at = new Date().toISOString();
        if (admin_remarks) data[index].admin_remarks = admin_remarks;
        break;

      case 'assign':
        if (!assigned_ngo) {
          return NextResponse.json({ success: false, message: 'Please select an NGO' }, { status: 400 });
        }
        data[index].status = 'assigned';
        data[index].assigned_ngo = assigned_ngo;
        data[index].updated_at = new Date().toISOString();
        if (admin_remarks) data[index].admin_remarks = admin_remarks;
        break;

      case 'complete':
        data[index].status = 'completed';
        data[index].updated_at = new Date().toISOString();
        if (admin_remarks) data[index].admin_remarks = admin_remarks;
        break;

      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }

    writeData('help_request', data);

    const actionMsg = {
      verify: 'verified',
      reject: 'rejected',
      assign: `assigned to ${assigned_ngo}`,
      complete: 'marked as completed'
    };

    return NextResponse.json({ success: true, message: `Request ${actionMsg[action] || action} successfully` });
  } catch (error) {
    console.error('Help request update error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
