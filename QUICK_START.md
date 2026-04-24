# Quick Setup Guide

Get CertifyEasy running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
# Create SQLite database
npx prisma migrate dev --name init

# Seed with admin user
npm run prisma:seed
```

### 3. Configure Environment

Create `.env.local`:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
```

Or on Windows:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string-here"
```

### 4. Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

## Try It Out

### 1. Admin Login
- Go to `/admin/login`
- Email: `admin@certifyeasy.com`
- Password: `admin123`

### 2. Upload Certificates
- In Admin Dashboard, upload `sample-certificates-full.csv`
- See upload results with success count

### 3. Verify Certificates
- Go to home page
- Enter certificate ID: `CERT-2026-001`
- See certificate details!

## Useful Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run prisma:studio    # Open database GUI
npm run prisma:seed      # Reseed admin user
```

## Next Steps

1. **Change Admin Password**: Update credentials in production
2. **Deploy to Vercel**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. **Read Full Docs**: See [CERTIFICATE_SYSTEM_README.md](./CERTIFICATE_SYSTEM_README.md)

## Troubleshooting

**Database not created?**
```bash
npx prisma migrate reset
npm run prisma:seed
```

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**TypeScript errors?**
```bash
npm install
npm run build
```

## Support

- Full documentation: [CERTIFICATE_SYSTEM_README.md](./CERTIFICATE_SYSTEM_README.md)
- Deployment guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Sample CSV: [sample-certificates-full.csv](./sample-certificates-full.csv)
