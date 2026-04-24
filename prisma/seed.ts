import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  try {
    const existing = await prisma.admin.findFirst();
    if (existing) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@certifyeasy.com',
        password: hashedPassword,
      },
    });

    console.log('Admin user created:', admin.email);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
