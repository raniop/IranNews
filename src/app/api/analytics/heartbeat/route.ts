import { NextResponse } from 'next/server';
import { heartbeat } from '@/lib/services/visitor-tracker';

export async function POST(request: Request) {
  try {
    const { visitorId, page, referrer } = await request.json();
    if (!visitorId || !page) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    heartbeat(visitorId, page, referrer);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
