// Test database connection using Supabase env vars (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_DB_PASSWORD)
require('./scripts/load-supabase-env.js');
const { Pool } = require('pg');

const dbUrl = process.env.DATABASE_URL || '';
if (!dbUrl) {
  console.error('❌ Database URL not set. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_DB_PASSWORD in .env');
  process.exit(1);
}

console.log('🔌 Testing database connection...');
console.log('Connection string:', dbUrl.substring(0, 60) + '...\n');

// Parse connection string
const urlMatch = dbUrl.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?$/);
if (!urlMatch) {
  console.error('❌ Failed to parse connection string');
  process.exit(1);
}

const [, user, password, host, port, database] = urlMatch;

console.log('📋 Parsed connection details:');
console.log('   Host:', host);
console.log('   Port:', port);
console.log('   Database:', database);
console.log('   User:', user.substring(0, 25) + '...');
console.log('   Password length:', password.length);
console.log('');

// Decode password
let decodedPassword = password;
try {
  decodedPassword = decodeURIComponent(password);
} catch (e) {
  console.log('   (Password decoding skipped)');
}

// Create pool with explicit config (same as in lib/db.ts)
console.log('🔧 Creating pool with explicit SSL config...');
const pool = new Pool({
  host: host.trim(),
  port: parseInt(port),
  database: database.trim(),
  user: user.trim(),
  password: decodedPassword,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
console.log('🧪 Testing connection...\n');

pool.query('SELECT 1 as test')
  .then(result => {
    console.log('✅ Connection SUCCESS!');
    console.log('   Result:', result.rows);
    console.log('');
    
    // Test a real query
    return pool.query('SELECT COUNT(*) as count FROM "User"');
  })
  .then(result => {
    console.log('✅ Query SUCCESS!');
    console.log('   User count:', result.rows[0].count);
    console.log('');
    
    return pool.end();
  })
  .then(() => {
    console.log('✅ Test completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Connection FAILED!');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    console.error('   Detail:', error.detail);
    console.error('');
    console.error('Full error:', error);
    
    pool.end().then(() => {
      process.exit(1);
    }).catch(() => {
      process.exit(1);
    });
  });
