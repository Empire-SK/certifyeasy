import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { certificates } = body;

    if (!certificates || !Array.isArray(certificates) || certificates.length === 0) {
      return NextResponse.json(
        { message: 'No certificates data provided' },
        { status: 400 }
      );
    }

    // Filter out rows that don't have all required fields (e.g., empty rows at the end of a CSV)
    const validCertificates = certificates.filter((cert: any) => 
      cert.name && cert.eventName && cert.certificateId && cert.issueDate
    );

    if (validCertificates.length === 0) {
      return NextResponse.json(
        { message: 'No valid certificate rows found. Ensure headers match: name, eventName, certificateId, issueDate' },
        { status: 400 }
      );
    }

    const existingIds = await prisma.certificate.findMany({
      where: {
        certificateId: { in: validCertificates.map((c: any) => c.certificateId) },
      },
      select: { certificateId: true },
    });
    const existingSet = new Set(existingIds.map((c) => c.certificateId));

    const toInsert = validCertificates.filter((c: any) => !existingSet.has(c.certificateId));
    const skipped = validCertificates.filter((c: any) => existingSet.has(c.certificateId));

    let uploadedCount = 0;
    if (toInsert.length > 0) {
      const result = await prisma.certificate.createMany({
        data: toInsert.map((c: any) => ({
          name: c.name.trim(),
          eventName: c.eventName.trim(),
          certificateId: c.certificateId.trim(),
          issueDate: c.issueDate.trim(),
        })),
      });
      uploadedCount = result.count;
    }

    return NextResponse.json(
      {
        message: 'Certificates uploaded successfully',
        uploadedCount,
        skippedCount: skipped.length,
        totalCount: validCertificates.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading certificates:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: `Error uploading certificates: ${errorMessage}` },
      { status: 500 }
    );
  }
}
