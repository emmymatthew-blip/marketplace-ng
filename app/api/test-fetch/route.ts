import { NextResponse } from "next/server"
import { Pool } from "pg"
import { resolveDatabaseUrl } from "@/lib/supabase"

export async function GET() {
  let pool: Pool | null = null
  try {
    console.log('🧪 Testing direct database connection in API route...')
    
    // Use URL derived from NEXT_PUBLIC_SUPABASE_URL + SUPABASE_DB_PASSWORD
    const dbUrl = resolveDatabaseUrl() ?? ''
    console.log('🔍 Environment check:')
    console.log('  Resolved DB URL (Supabase):', dbUrl ? dbUrl.substring(0, 80) + '...' : '(not set)')
    console.log('  Is PostgreSQL?', dbUrl.includes('postgresql'))
    
    if (!dbUrl || !dbUrl.includes('postgresql')) {
      throw new Error(
        'Database not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_DB_PASSWORD (optional: SUPABASE_POOLER_HOST, SUPABASE_POOLER_PORT) in .env'
      )
    }
    
    // Parse connection string - handle both quoted and unquoted from .env
    let cleanUrl = dbUrl.trim()
    if (cleanUrl.startsWith('"') && cleanUrl.endsWith('"')) {
      cleanUrl = cleanUrl.slice(1, -1)
    }
    if (cleanUrl.startsWith("'") && cleanUrl.endsWith("'")) {
      cleanUrl = cleanUrl.slice(1, -1)
    }
    
    console.log('✅ Using PostgreSQL connection string')
    console.log('Cleaned connection string:', cleanUrl.substring(0, 70) + '...')
    
    // Parse connection string - more flexible regex
    const urlMatch = cleanUrl.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?$/)
    if (!urlMatch) {
      console.error('❌ Failed to parse. URL format:', cleanUrl.substring(0, 100))
      throw new Error('Failed to parse connection string. Format: ' + cleanUrl.substring(0, 50))
    }
    
    const [, user, password, host, port, database] = urlMatch
    
    console.log('Creating pool with explicit config...')
    pool = new Pool({
      host: host.trim(),
      port: parseInt(port),
      database: database.trim(),
      user: user.trim(),
      password: decodeURIComponent(password),
      max: 1,
      ssl: {
        rejectUnauthorized: false
      }
    })
    
    // Test 1: Simple query
    console.log('1. Testing SELECT 1...')
    const test1 = await pool.query('SELECT 1 as test')
    console.log('   ✅ Result:', test1.rows)
    
    // Test 2: Fetch users
    console.log('2. Fetching users...')
    const usersResult = await pool.query('SELECT id, name, email, role FROM "User" LIMIT 5')
    console.log('   ✅ Found', usersResult.rows.length, 'users')
    
    // Test 3: Fetch products
    console.log('3. Fetching products...')
    const productsResult = await pool.query('SELECT id, title, "categoryId", condition, brand FROM "Product" LIMIT 5')
    console.log('   ✅ Found', productsResult.rows.length, 'products')
    
    // Test 4: Fetch categories
    console.log('4. Fetching categories...')
    const categoriesResult = await pool.query('SELECT id, name, slug FROM "ProductCategory" LIMIT 5')
    console.log('   ✅ Found', categoriesResult.rows.length, 'categories')
    
    await pool.end()
    
    return NextResponse.json({ 
      success: true,
      message: "Database fetch successful",
      data: {
        test: test1.rows,
        users: usersResult.rows.length,
        products: productsResult.rows.length,
        categories: categoriesResult.rows.length,
        sampleUsers: usersResult.rows,
        sampleProducts: productsResult.rows,
        sampleCategories: categoriesResult.rows
      }
    })
  } catch (error: any) {
    console.error("❌ Fetch Error:")
    console.error("  Message:", error.message)
    console.error("  Code:", error.code)
    console.error("  Detail:", error.detail)
    console.error("  Stack:", error.stack?.substring(0, 500))
    
    if (pool) {
      await pool.end().catch(() => {})
    }
    
    return NextResponse.json({ 
      success: false,
      error: error.message,
      code: error.code,
      detail: error.detail
    }, { status: 500 })
  }
}

