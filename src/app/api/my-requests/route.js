import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HelpRequest from '@/models/HelpRequest';
import NGO from '@/models/NGO';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Fetch user requests directly from DB using lean() for POJOs
    const userRequests = await HelpRequest.find({
      $or: [{ user_email: session.email }, { id_number: session.id }]
    }).lean();

    const ngos = await NGO.find({ status: 'approved' }).lean();

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
