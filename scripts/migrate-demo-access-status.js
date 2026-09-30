// Script to add demoAccessStatus fields to User table
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
    console.log('🔄 Running migration: add_demo_access_status...');
    
    // Add demoAccessStatus column
    console.log('  Adding demoAccessStatus column...');
    await pool.query(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "demoAccessStatus" TEXT DEFAULT 'NOT_APPLIED'
    `);
    console.log('  ✅ demoAccessStatus column added');

    // Add demoAccessRequestedAt column
    console.log('  Adding demoAccessRequestedAt column...');
    await pool.query(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "demoAccessRequestedAt" TIMESTAMP
    `);
    console.log('  ✅ demoAccessRequestedAt column added');

    // Add demoAccessApprovedAt column
    console.log('  Adding demoAccessApprovedAt column...');
    await pool.query(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "demoAccessApprovedAt" TIMESTAMP
    `);
    console.log('  ✅ demoAccessApprovedAt column added');

    // Add demoRequestTitle column
    console.log('  Adding demoRequestTitle column...');
    await pool.query(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "demoRequestTitle" TEXT
    `);
    console.log('  ✅ demoRequestTitle column added');

    // Add demoRequestDescription column
    console.log('  Adding demoRequestDescription column...');
    await pool.query(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "demoRequestDescription" TEXT
    `);
    console.log('  ✅ demoRequestDescription column added');

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
