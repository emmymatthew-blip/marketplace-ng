import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { resolveDatabaseUrl } from "@/lib/supabase"

export async function GET() {
  try {
    const dbUrl = resolveDatabaseUrl() ?? ''
    console.log('🧪 Testing database connection...')
    console.log('Connection string:', dbUrl.substring(0, 60) + '...')
    
    // Try simple query
    console.log('Executing test query: SELECT 1')
    const result = await query('SELECT 1 as test', [])
    console.log('✅ Test query successful:', result)
    
    // Also test a table query
    console.log('Executing table query: SELECT COUNT(*) FROM User')
    const tableTest = await query('SELECT COUNT(*) as count FROM "User"', [])
    console.log('✅ Table query successful:', tableTest)
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      testQuery: result,
      tableQuery: tableTest
    })
  } catch (error: any) {
    console.error("❌ Test DB Error Details:")
    console.error("  Name:", error.name)
    console.error("  Message:", error.message)
    console.error("  Code:", error.code)
    console.error("  Detail:", error.detail)
    console.error("  Stack:", error.stack?.substring(0, 500))
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      code: error.code,
      detail: error.detail,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack?.substring(0, 500) : undefined
    }, { status: 500 })
  }
}

