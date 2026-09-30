import { PrismaClient } from '@prisma/client';
import { resolveDatabaseUrl } from './supabase';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

declare global {
  var prisma: PrismaClient | undefined;
}

// Configure Prisma Client for Supabase connection pooling
const getPrismaClient = () => {
  const dbUrl = resolveDatabaseUrl();
  if (!dbUrl) {
    throw new Error(
      'Database URL not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_DB_PASSWORD (optional: SUPABASE_POOLER_HOST, SUPABASE_POOLER_PORT) in .env'
    );
  }
  // For Supabase pooler, add connection_limit=1 to prevent "Tenant or user not found" errors
  if (dbUrl.includes('supabase.co') || dbUrl.includes('supabase.com')) {
    let finalUrl = dbUrl;
    
    // Add connection_limit=1 for Supabase pooler compatibility with Prisma
    if (dbUrl.includes('pooler.supabase.com') && !dbUrl.includes('connection_limit=')) {
      const separator = dbUrl.includes('?') ? '&' : '?';
      finalUrl = `${dbUrl}${separator}connection_limit=1`;
    }
    
    return new PrismaClient({
      datasources: {
        db: {
          url: finalUrl,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

const prisma = global.prisma || getPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };
