import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [totalCerts, recentCerts, eventGroups, totalViews, totalLookups] = await Promise.all([
      prisma.certificate.count(),
      prisma.certificate.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { name: true, certificateId: true, eventName: true, createdAt: true },
      }),
      prisma.certificate.groupBy({
        by: ['eventName'],
        _count: { _all: true },
        orderBy: { _count: { certificateId: 'desc' } },
        take: 5,
      }),
      prisma.pageView.count(),
      prisma.verificationLog.count(),
    ]);

    const now = new Date();
    const weeklyData: number[] = [];
    for (let w = 11; w >= 0; w--) {
      const start = new Date(now);
      start.setDate(now.getDate() - (w + 1) * 7);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setDate(now.getDate() - w * 7);
      end.setHours(23, 59, 59, 999);
      const count = await prisma.certificate.count({
        where: { createdAt: { gte: start, lte: end } },
      });
      weeklyData.push(count);
    }

    return NextResponse.json({
      totalCerts,
      recentCerts,
      eventGroups,
      weeklyData,
      totalViews,
      totalLookups,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching stats';
    return NextResponse.json({ message }, { status: 500 });
  }
}
