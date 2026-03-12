import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { getSession } from '@/lib/auth';

// GET: Fetch notifications for current user
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Not logged in' }, { status: 401 });
    }

    await dbConnect();
    const userNotifs = await Notification.find({ user_email: session.email })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: userNotifs });
  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// POST: Create a notification (internal use — called by other APIs)
export async function POST(request) {
  try {
    const { user_email, title, message, type } = await request.json();

    if (!user_email || !title || !message) {
      return NextResponse.json({ success: false, message: 'user_email, title, and message are required' }, { status: 400 });
    }

    await dbConnect();
    const notification = new Notification({
      id: Date.now().toString(),
      user_email,
      title,
      message,
      type: type || 'info', // info, success, warning
      read: false
    });

    await notification.save();

    return NextResponse.json({ success: true, message: 'Notification created' });
  } catch (error) {
    console.error('Notification POST error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// PUT: Mark notification as read
export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Not logged in' }, { status: 401 });
    }

    const { id, markAll } = await request.json();

    await dbConnect();

    if (markAll) {
      await Notification.updateMany(
        { user_email: session.email },
        { $set: { read: true } }
      );
    } else if (id) {
      await Notification.findOneAndUpdate(
        { id: id.toString(), user_email: session.email },
        { $set: { read: true } }
      );
    }

    return NextResponse.json({ success: true, message: 'Notifications updated' });
  } catch (error) {
    console.error('Notification PUT error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
