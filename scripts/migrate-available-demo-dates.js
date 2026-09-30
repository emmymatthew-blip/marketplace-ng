// Script to create AvailableDemoDate table and add assignedDemoDate to User
require('./load-supabase-env.js');
const { Pool } = require('pg');

// DATABASE_URL set by load-supabase-env.js from Supabase env vars
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
    console.log('🔄 Running migration: add_available_demo_dates...');
    
    // Create AvailableDemoDate table
    console.log('  Creating AvailableDemoDate table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "AvailableDemoDate" (
        id TEXT PRIMARY KEY,
        date TIMESTAMP NOT NULL UNIQUE,
        time TEXT,
        "isAvailable" BOOLEAN DEFAULT true,
        "assignedTo" TEXT,
        "createdBy" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✅ AvailableDemoDate table created');

    // Add assignedDemoDate column to User table
    console.log('  Adding assignedDemoDate column to User table...');
    await pool.query(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "assignedDemoDate" TIMESTAMP
    `);
    console.log('  ✅ assignedDemoDate column added');

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
