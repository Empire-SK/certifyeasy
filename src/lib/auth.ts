import bcrypt from "bcryptjs";
import prisma from "./prisma";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getAdminByEmail(email: string) {
  return prisma.admin.findUnique({
    where: { email },
  });
}

export async function createAdminIfNotExists() {
  const adminExists = await prisma.admin.findFirst();
  if (!adminExists) {
    const hashedPassword = await hashPassword("admin123");
    return prisma.admin.create({
      data: {
        email: "admin@certifyeasy.com",
        password: hashedPassword,
      },
    });
  }
  return adminExists;
}
