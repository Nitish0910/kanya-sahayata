import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (session) {
      return NextResponse.json({ loggedIn: true, user: session });
    }
    return NextResponse.json({ loggedIn: false });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}
