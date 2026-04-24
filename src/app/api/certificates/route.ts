import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, eventName, certificateId, issueDate } = body;

    if (!name || !eventName || !certificateId || !issueDate) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.certificate.findUnique({
      where: { certificateId },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'Certificate ID already exists' },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.create({
      data: { name, eventName, certificateId, issueDate },
    });

    return NextResponse.json(
      { message: 'Certificate issued successfully', certificate },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error creating certificate';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const take = parseInt(searchParams.get('take') ?? '50', 10);

    const certificates = await prisma.certificate.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { eventName: { contains: search } },
              { certificateId: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      take,
    });

    return NextResponse.json(certificates, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching certificates';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { certificateId } = body;

    if (!certificateId) {
      return NextResponse.json({ message: 'certificateId is required' }, { status: 400 });
    }

    await prisma.certificate.delete({ where: { certificateId } });

    return NextResponse.json({ message: 'Certificate deleted successfully' }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error deleting certificate';
    return NextResponse.json({ message }, { status: 400 });
  }
}
