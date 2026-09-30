// Script to create DemoAccessRequest table
require('./load-supabase-env.js');
const { Pool } = require('pg');

// Parse connection string for Supabase (DATABASE_URL set by load-supabase-env.js)
const dbUrl = process.env.DATABASE_URL || '';
let poolConfig;

if (dbUrl.includes('supabase.co') || dbUrl.includes('supabase.com')) {
  const urlMatch = dbUrl.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?$/);
  if (urlMatch) {
    const [, user, password, host, port, database] = urlMatch;
    poolConfig = {
      host: host.trim(),
      port: parseInt(port),
      database: database.trim(),
      user: user.trim(),
      password: decodeURIComponent(password),
      ssl: { rejectUnauthorized: false }
    };
  } else {
    poolConfig = { connectionString: dbUrl };
  }
} else {
  poolConfig = { connectionString: dbUrl };
}

const pool = new Pool(poolConfig);

async function runMigration() {
  try {
    console.log('🔄 Running migration: add_demo_access_requests...');
    
    // Create DemoAccessRequest table
    console.log('  Creating DemoAccessRequest table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "DemoAccessRequest" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        "preferredDate" TIMESTAMP,
        "assignedDate" TIMESTAMP,
        "assignedDateId" TEXT,
        "requestedAt" TIMESTAMP DEFAULT NOW(),
        "approvedAt" TIMESTAMP,
        "rejectedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✅ DemoAccessRequest table created');

    // Add foreign key constraint
    console.log('  Adding foreign key constraint...');
    try {
      await pool.query(`
        ALTER TABLE "DemoAccessRequest" 
        ADD CONSTRAINT "DemoAccessRequest_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
      `);
      console.log('  ✅ Foreign key constraint added');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('  ℹ️  Foreign key constraint already exists');
      } else {
        throw error;
      }
    }

    // Create indexes
    console.log('  Creating indexes...');
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS "DemoAccessRequest_userId_idx" ON "DemoAccessRequest"("userId")
      `);
      await pool.query(`
        CREATE INDEX IF NOT EXISTS "DemoAccessRequest_status_idx" ON "DemoAccessRequest"("status")
      `);
      console.log('  ✅ Indexes created');
    } catch (error) {
      console.log('  ⚠️  Index creation warning:', error.message);
    }

    console.log('✅ Migration completed successfully!');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Error detail:', error.detail);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
