# Deployment Guide for PrintMarket NG Application

## Quick Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Add these environment variables:
     ```
     DATABASE_URL=your-mysql-connection-string
     NEXTAUTH_URL=https://your-app.vercel.app
     NEXTAUTH_SECRET=your-secret-key
     MYSQL_HOST=your-db-host
     MYSQL_USER=your-db-user
     MYSQL_PASSWORD=your-db-password
     MYSQL_DATABASE=printmarket_ng
     ```

### Option 2: Railway

1. **Connect your GitHub repository to Railway**
2. **Add environment variables in Railway dashboard**
3. **Deploy automatically**

### Option 3: Netlify

1. **Build command:** `npm run build`
2. **Publish directory:** `.next`
3. **Add environment variables in Netlify dashboard**

## Database Setup

### For Production Database:

1. **Use a cloud MySQL provider:**
   - PlanetScale (recommended)
   - AWS RDS
   - Google Cloud SQL
   - DigitalOcean Managed Databases

2. **Update your DATABASE_URL:**
   ```
   DATABASE_URL="mysql://username:password@host:port/database_name"
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

## Environment Variables Required

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="mysql://username:password@host:port/database_name"
MYSQL_HOST=your-db-host
MYSQL_USER=your-db-user
MYSQL_PASSWORD=your-db-password
MYSQL_DATABASE=printmarket_ng

# NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-here

# Email (for notifications)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Pre-deployment Checklist

- [ ] Update all environment variables
- [ ] Set up production database
- [ ] Run database migrations
- [ ] Test build locally: `npm run build`
- [ ] Ensure all images are optimized
- [ ] Check that file uploads work (if applicable)

## Post-deployment Steps

1. **Test all functionality:**
   - User registration/login
   - Product creation/viewing
   - Forum posting
   - Messaging system
   - Admin features

2. **Set up monitoring:**
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

3. **Configure custom domain (optional)**

## Troubleshooting

### Common Issues:

1. **Database connection errors:**
   - Check DATABASE_URL format
   - Ensure database is accessible from deployment platform

2. **Build errors:**
   - Check for missing environment variables
   - Verify all dependencies are installed

3. **Image upload issues:**
   - Configure cloud storage (AWS S3, Cloudinary, etc.)
   - Update upload configuration

## Support

For deployment issues, check:
- Vercel documentation: https://vercel.com/docs
- Next.js deployment guide: https://nextjs.org/docs/deployment
- Prisma deployment: https://www.prisma.io/docs/guides/deployment 