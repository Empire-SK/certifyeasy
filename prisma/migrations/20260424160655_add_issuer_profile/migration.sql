-- CreateTable
CREATE TABLE "IssuerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "name" TEXT NOT NULL DEFAULT 'CertifyEasy Official',
    "website" TEXT NOT NULL DEFAULT 'https://certifyeasy.com',
    "email" TEXT NOT NULL DEFAULT 'verify@certifyeasy.com',
    "address" TEXT NOT NULL DEFAULT '123 Tech Avenue, Silicon Valley, CA',
    "description" TEXT NOT NULL DEFAULT 'A global leader in secure digital credentialing and verification services.'
);
