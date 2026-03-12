import { NextResponse } from 'next/server';
import { readData, writeData, insertRow } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET: Fetch notifications for current user
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Not logged in' }, { status: 401 });
    }

    const notifications = readData('notifications');
    const userNotifs = notifications
      .filter(n => n.user_email === session.email)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

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

    insertRow('notifications', {
      id: Date.now(),
      user_email,
      title,
      message,
      type: type || 'info', // info, success, warning
      read: false,
      created_at: new Date().toISOString()
    });

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

    const notifications = readData('notifications');

    if (markAll) {
      notifications.forEach(n => {
        if (n.user_email === session.email) n.read = true;
      });
    } else if (id) {
      const idx = notifications.findIndex(n => n.id === id && n.user_email === session.email);
      if (idx !== -1) notifications[idx].read = true;
    }

    writeData('notifications', notifications);

    return NextResponse.json({ success: true, message: 'Notifications updated' });
  } catch (error) {
    console.error('Notification PUT error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
