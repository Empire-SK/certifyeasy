import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path } = body;
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (path) {
      await prisma.pageView.create({
        data: { path, userAgent },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
