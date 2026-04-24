import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const SINGLETON_ID = 'singleton';

export async function GET() {
  try {
    let profile = await prisma.issuerProfile.findUnique({
      where: { id: SINGLETON_ID },
    });

    if (!profile) {
      profile = await prisma.issuerProfile.create({
        data: { id: SINGLETON_ID },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching profile';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, website, email, address, description } = body;

    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    const profile = await prisma.issuerProfile.upsert({
      where: { id: SINGLETON_ID },
      update: { name, website, email, address, description },
      create: { id: SINGLETON_ID, name, website, email, address, description },
    });

    return NextResponse.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error updating profile';
    return NextResponse.json({ message }, { status: 500 });
  }
}
