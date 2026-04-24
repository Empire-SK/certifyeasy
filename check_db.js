const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const certs = await prisma.certificate.findMany();
  console.log("Total certs:", certs.length);
  console.log("Certs:", certs);
}
main().catch(console.error).finally(() => prisma.$disconnect());
