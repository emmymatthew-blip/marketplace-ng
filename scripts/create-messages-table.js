// Script to create the messages table
require('./load-supabase-env.js');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase') ? {
    rejectUnauthorized: false
  } : undefined
});

async function createMessagesTable() {
  try {
    console.log('Creating messages table...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "messages" (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        "senderId" TEXT NOT NULL,
        "receiverId" TEXT NOT NULL,
        "isRead" BOOLEAN DEFAULT FALSE,
        "productId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"(id) ON DELETE CASCADE,
        CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"(id) ON DELETE CASCADE,
        CONSTRAINT "messages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE SET NULL
      );
    `);
    
    console.log('Creating indexes...');
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "messages_senderId_idx" ON "messages"("senderId");
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "messages_receiverId_idx" ON "messages"("receiverId");
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "messages_createdAt_idx" ON "messages"("createdAt");
    `);
    
    console.log('✅ Messages table created successfully!');
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error creating messages table:', error);
    await pool.end();
    process.exit(1);
  }
}

createMessagesTable();
