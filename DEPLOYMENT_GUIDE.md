# CertifyEasy - Deployment Guide

Complete guide to deploying the CertifyEasy certificate verification system to Vercel with PostgreSQL.

## Prerequisites

- GitHub repository with the CertifyEasy code
- Vercel account (free tier available)
- Neon PostgreSQL account (free tier available at neon.tech)
- Node.js 18+ installed locally

## Step-by-Step Deployment

### Step 1: Prepare the Codebase

Ensure all files are committed to Git:

```bash
git add .
git commit -m "feat: Add full certificate verification system"
git push origin main
```

### Step 2: Create Neon PostgreSQL Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up / Log in
3. Create a new project
4. Copy the connection string (looks like):
   ```
   postgresql://user:password@...neon.tech/dbname
   ```

### Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option B: Using GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings
5. Click "Deploy"

### Step 4: Configure Environment Variables

In Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add the following variables:

```
DATABASE_URL = postgresql://user:password@...neon.tech/dbname
NEXTAUTH_URL = https://yourdomain.vercel.app
NEXTAUTH_SECRET = (generate with: openssl rand -base64 32)
```

**Important**: Replace the placeholders with your actual values

### Step 5: Run Database Migrations

After deployment, you need to run migrations on the production database:

```bash
# Option A: Using Vercel CLI
vercel env pull
npx prisma migrate deploy
npm run prisma:seed

# Option B: Manual migration
# Set your DATABASE_URL to production
export DATABASE_URL="postgresql://..."
npx prisma migrate deploy
npm run prisma:seed
```

### Step 6: Verify Deployment

1. Visit your Vercel deployment URL
2. Test the home page (certificate search)
3. Test admin login: `/admin/login`
   - Email: `admin@certifyeasy.com`
   - Password: `admin123`
4. Upload a test CSV file
5. Verify a certificate

## Updating Admin Credentials (Important!)

After first deployment, change the default admin password:

### Option 1: Using Prisma Studio

```bash
# Locally
DATABASE_URL="postgresql://..." npx prisma studio

# Update the password via the GUI
```

### Option 2: Using a Script

Create a temporary script to update password:

```typescript
// scripts/change-admin-password.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const newPassword = "your-new-password";
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const admin = await prisma.admin.update({
    where: { email: "admin@certifyeasy.com" },
    data: { password: hashedPassword }
  });
  
  console.log("Password updated:", admin.email);
}

main();
```

## Troubleshooting

### Build Failures

**Issue**: "Module not found" errors during build

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Connection Issues

**Issue**: "Unexpected token P in JSON at position 0"

**Solution**: Ensure `DATABASE_URL` is correctly set in Vercel environment variables

### Migration Errors

**Issue**: "Relation does not exist"

**Solution**: Run migrations on the production database:

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### Authentication Issues

**Issue**: Login redirects to login page repeatedly

**Solution**: Ensure:
- `NEXTAUTH_URL` matches your deployment URL exactly
- `NEXTAUTH_SECRET` is set
- Cookies are enabled in browser

## Monitoring & Maintenance

### Check Server Logs

```bash
# View logs
vercel logs --prod
```

### Database Maintenance

Monitor database usage at https://console.neon.tech:
- Check storage usage
- Monitor active connections
- View query performance

### Backup Strategy

Neon automatically maintains backups. To export data:

```bash
# Dump database
pg_dump DATABASE_URL > backup.sql

# Restore
psql DATABASE_URL < backup.sql
```

## Scaling Considerations

### Database Optimization

1. **Add indexes** for frequently queried fields:
   ```prisma
   model Certificate {
     id             String @id @default(uuid())
     certificateId  String @unique
     // Add index for certificate ID searches
     @@index([certificateId])
   }
   ```

2. **Archive old certificates** to reduce database size

3. **Monitor query performance** in Neon dashboard

### API Rate Limiting

Consider adding rate limiting to prevent abuse:

```typescript
// middleware.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

## Reverting to Previous Deployment

If something goes wrong:

```bash
# View deployments
vercel list

# Rollback to previous deployment
vercel rollback
```

## Security Checklist

- [ ] Changed default admin password
- [ ] Updated `NEXTAUTH_SECRET` to a strong random value
- [ ] Ensured `NEXTAUTH_URL` uses HTTPS
- [ ] Configured CORS if needed
- [ ] Added rate limiting to API routes
- [ ] Enabled database backups
- [ ] Set up monitoring and alerts

## Production Best Practices

1. **Enable HTTPS**: Vercel does this automatically
2. **Monitor performance**: Use Vercel Analytics
3. **Set up alerts**: Get notified of errors
4. **Regular backups**: Neon provides automatic backups
5. **Keep dependencies updated**: Run `npm audit` regularly
6. **Use environment variables** for all sensitive data

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon PostgreSQL Documentation](https://neon.tech/docs/introduction)
- [Next.js Deployment](https://nextjs.org/docs/deployment/vercel)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment/edge)

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Prisma operations
npx prisma studio              # Open Prisma Studio
npx prisma migrate dev         # Create migration locally
npx prisma migrate deploy      # Run migrations on production
npm run prisma:seed            # Seed admin user

# Vercel operations
vercel                         # Deploy to staging
vercel --prod                  # Deploy to production
vercel logs --prod             # View production logs
vercel env ls                  # List environment variables
```

## Contact & Support

For issues or questions:
1. Check the main [CERTIFICATE_SYSTEM_README.md](./CERTIFICATE_SYSTEM_README.md)
2. Review error logs in Vercel dashboard
3. Check database status in Neon console
