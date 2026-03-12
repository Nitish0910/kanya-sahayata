import { NextResponse } from 'next/server';
import { readData } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const allRequests = readData('help_request');
    const ngos = readData('ngos').filter(n => n.status === 'approved');

    // Filter requests for this user
    const userRequests = allRequests.filter(r => r.user_email === session.email || r.id_number === session.id);

    // Attach NGO details to assigned requests
    const enriched = userRequests.map(r => {
      if (r.assigned_ngo) {
        const ngo = ngos.find(n => n.name === r.assigned_ngo);
        return { ...r, ngo_details: ngo || null };
      }
      return r;
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error('My requests fetch error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
