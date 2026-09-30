// Script to add headerImage and advertImage columns to DemoClass table
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
    console.log('🔄 Running migration: add_featured_demo_images...');
    
    // Add headerImage column
    console.log('  Adding headerImage column...');
    await pool.query(`
      ALTER TABLE "DemoClass" 
      ADD COLUMN IF NOT EXISTS "headerImage" TEXT
    `);
    console.log('  ✅ headerImage column added');

    // Add advertImage column
    console.log('  Adding advertImage column...');
    await pool.query(`
      ALTER TABLE "DemoClass" 
      ADD COLUMN IF NOT EXISTS "advertImage" TEXT
    `);
    console.log('  ✅ advertImage column added');

    // Add comments (optional, may fail on some PostgreSQL versions)
    try {
      console.log('  Adding column comments...');
      await pool.query(`
        COMMENT ON COLUMN "DemoClass"."headerImage" IS 'Header image for the demonstration detail page'
      `);
      await pool.query(`
        COMMENT ON COLUMN "DemoClass"."advertImage" IS 'Advertisement image for homepage Featured Live Demo section'
      `);
      console.log('  ✅ Column comments added');
    } catch (commentError) {
      console.log('  ⚠️  Could not add column comments (this is optional)');
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
