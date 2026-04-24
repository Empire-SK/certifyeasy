# CertifyEasy - Full Stack Certificate Verification System

A complete Next.js full-stack application for managing and verifying certificates. Built with modern technologies including NextAuth for authentication, Prisma ORM, and SQLite for development with PostgreSQL support for production.

## Features

- ✅ **Admin Authentication**: Secure login system with NextAuth
- ✅ **CSV Upload**: Bulk certificate uploads from CSV files
- ✅ **Certificate Verification**: Public-facing certificate lookup by ID
- ✅ **Database Integration**: SQLite for development, PostgreSQL (Neon) for production
- ✅ **Duplicate Prevention**: Prevents duplicate certificate IDs
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **Dark Mode Support**: Full dark mode support throughout the app
- ✅ **Ready for Vercel**: Optimized for Vercel deployment

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Authentication**: NextAuth v4
- **ORM**: Prisma v5
- **Database**: 
  - SQLite (development)
  - PostgreSQL/Neon (production)
- **CSV Parsing**: papaparse
- **Password Hashing**: bcryptjs
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Home - Certificate search
│   ├── admin/
│   │   ├── login/page.tsx               # Admin login page
│   │   └── dashboard/page.tsx           # Admin dashboard - CSV upload
│   ├── verify/[certificateId]/page.tsx  # Certificate verification page
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth configuration
│   │   ├── certificates/route.ts        # Certificate CRUD endpoints
│   │   ├── verify/[certificateId]/route.ts  # Certificate verification endpoint
│   │   └── upload/route.ts              # CSV upload endpoint
│   └── layout.tsx
├── components/
│   └── CertificateSearch.tsx            # Certificate search form
├── lib/
│   ├── prisma.ts                        # Prisma client singleton
│   └── auth.ts                          # Auth utilities
└── middleware.ts                        # Route protection
prisma/
├── schema.prisma                        # Database schema
├── seed.ts                              # Database seed script
└── migrations/                          # Database migrations
```

## Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Install Prisma CLI globally (optional)
npm install -g prisma
```

### 2. Database Setup

```bash
# Create SQLite database and run migrations
npx prisma migrate dev --name init

# Seed the database with default admin user
npm run prisma:seed
```

### 3. Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
```

Generate a strong secret for production:
```bash
openssl rand -base64 32
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Usage

### For Administrators

1. **Login**: Navigate to `/admin/login`
   - Email: `admin@certifyeasy.com`
   - Password: `admin123` (change in production)

2. **Upload Certificates**: 
   - Go to Admin Dashboard (`/admin/dashboard`)
   - Select a CSV file with columns: `name`, `eventName`, `certificateId`, `issueDate`
   - Click "Upload CSV"
   - View upload results with detailed status

3. **Sample CSV Format**:
   ```csv
   name,eventName,certificateId,issueDate
   John Doe,Annual Conference 2026,CERT-2026-001,2026-01-15
   Jane Smith,Technical Workshop,CERT-2026-002,2026-02-20
   ```

### For Users

1. **Verify Certificate**: 
   - Go to home page (`/`)
   - Enter certificate ID
   - View certificate details if valid

## Database Schema

### Admin
- `id`: UUID (primary key)
- `email`: String (unique)
- `password`: String (hashed with bcrypt)
- `createdAt`: DateTime

### Certificate
- `id`: UUID (primary key)
- `certificateId`: String (unique)
- `name`: String
- `eventName`: String
- `issueDate`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in (NextAuth)
- `POST /api/auth/signout` - Sign out (NextAuth)
- `GET /api/auth/session` - Get current session (NextAuth)

### Certificates
- `GET /api/certificates` - Get all certificates
- `POST /api/certificates` - Create certificate
- `GET /api/verify/[certificateId]` - Verify certificate

### Admin
- `POST /api/upload` - Upload CSV file (requires authentication)

## Production Deployment (Vercel)

### 1. Setup PostgreSQL (Neon)

1. Create a Neon account at https://neon.tech
2. Create a new project and get the connection string
3. Update your environment variable:

```env
DATABASE_URL="postgresql://user:password@...neon.tech/dbname"
NEXTAUTH_URL="https://yourdomain.vercel.app"
NEXTAUTH_SECRET="generate-random-secret"
```

### 2. Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Deploy to Vercel
vercel --prod
```

Or connect your GitHub repo directly to Vercel and set environment variables in the Vercel dashboard.

### 3. Run Migrations

After deployment, run migrations on Neon:

```bash
npm run build
npx prisma migrate deploy
npm run prisma:seed
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run prisma:seed      # Seed database with admin user
npm run prisma:studio    # Open Prisma Studio GUI
```

## Security Best Practices

1. **Change default credentials** after first deployment
2. **Use strong NEXTAUTH_SECRET** in production
3. **Enable HTTPS** on production
4. **Validate CSV uploads** - check file size and content
5. **Rate limiting** - consider adding rate limiting to API routes
6. **CSRF protection** - NextAuth handles CSRF automatically
7. **Password hashing** - bcryptjs is configured with salt rounds 10

## Troubleshooting

### Database connection issues
```bash
# Check database connection
npx prisma db push
```

### Migration errors
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### NextAuth issues
- Ensure `NEXTAUTH_URL` matches your deployment URL
- Check `NEXTAUTH_SECRET` is set
- Verify session callback is configured

### CSV upload fails
- Check CSV has required columns: `name`, `eventName`, `certificateId`, `issueDate`
- Ensure no duplicate certificate IDs
- Verify file is not corrupted

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Database connection string |
| `NEXTAUTH_URL` | Yes | Application URL for NextAuth |
| `NEXTAUTH_SECRET` | Yes | Secret for NextAuth encryption |

## Support & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth Documentation](https://next-auth.js.org/)
- [Neon PostgreSQL](https://neon.tech/docs/introduction)

## License

MIT
