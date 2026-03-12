import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HelpRequest from '@/models/HelpRequest';
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

    await dbConnect();
    const helpReq = await HelpRequest.findOne({ id });

    if (!helpReq) {
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }

    switch (action) {
      case 'verify':
        helpReq.status = 'verified';
        if (admin_remarks) helpReq.admin_remarks = admin_remarks;
        break;

      case 'reject':
        helpReq.status = 'rejected';
        if (admin_remarks) helpReq.admin_remarks = admin_remarks;
        break;

      case 'assign':
        if (!assigned_ngo) {
          return NextResponse.json({ success: false, message: 'Please select an NGO' }, { status: 400 });
        }
        helpReq.status = 'assigned';
        helpReq.assigned_ngo = assigned_ngo;
        if (admin_remarks) helpReq.admin_remarks = admin_remarks;
        break;

      case 'complete':
        helpReq.status = 'completed';
        if (admin_remarks) helpReq.admin_remarks = admin_remarks;
        break;

      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }

    await helpReq.save();

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

