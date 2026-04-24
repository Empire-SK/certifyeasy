import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import Papa from 'papaparse';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    const text = await file.text();
    const { data, errors } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      return NextResponse.json(
        { message: 'CSV parsing error', errors },
        { status: 400 }
      );
    }

    const results = [];
    for (const row of data as any[]) {
      const { name, eventName, certificateId, issueDate } = row;

      if (!name || !eventName || !certificateId || !issueDate) {
        results.push({
          certificateId: certificateId || 'unknown',
          status: 'error',
          message: 'Missing required fields',
        });
        continue;
      }

      try {
        const existing = await prisma.certificate.findUnique({
          where: { certificateId },
        });

        if (existing) {
          results.push({
            certificateId,
            status: 'skipped',
            message: 'Certificate ID already exists',
          });
          continue;
        }

        await prisma.certificate.create({
          data: {
            name,
            eventName,
            certificateId,
            issueDate,
          },
        });

        results.push({
          certificateId,
          status: 'success',
          message: 'Certificate added',
        });
      } catch (error) {
        results.push({
          certificateId,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter((r) => r.status === 'success').length;
    const errorCount = results.filter((r) => r.status === 'error').length;
    const skippedCount = results.filter((r) => r.status === 'skipped').length;

    return NextResponse.json(
      {
        message: 'CSV upload completed',
        summary: {
          total: results.length,
          success: successCount,
          errors: errorCount,
          skipped: skippedCount,
        },
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error uploading file';
    return NextResponse.json(
      { message },
      { status: 400 }
    );
  }
}
