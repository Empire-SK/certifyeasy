import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params;

    const certificate = await prisma.certificate.findUnique({
      where: { certificateId },
    });

    // Log the attempt asynchronously (don't block the response)
    prisma.verificationLog.create({
      data: { certificateId, success: !!certificate }
    }).catch(console.error);

    if (!certificate) {
      return NextResponse.json(
        { message: 'Certificate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(certificate, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error verifying certificate';
    return NextResponse.json(
      { message },
      { status: 400 }
    );
  }
}
