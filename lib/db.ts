import { Pool, PoolClient } from "pg"
import { resolveDatabaseUrl } from "./supabase"

// Convert MySQL-style ? placeholders to PostgreSQL $1, $2, etc.
function convertQuery(sql: string, params: any[]): { query: string; values: any[] } {
  let paramIndex = 1
  const values: any[] = []
  const query = sql.replace(/\?/g, () => {
    if (paramIndex > params.length) {
      throw new Error(`Not enough parameters provided. SQL has more ? placeholders than params array length. SQL: ${sql.substring(0, 100)}...`)
    }
    const value = params[paramIndex - 1]
    values.push(value)
    return `$${paramIndex++}`
  })
  return { query, values }
}

// Create a connection pool
// Configure SSL for Supabase connections
// For Supabase, always use explicit config (not connectionString) to avoid SSL protocol errors
const getPoolConfig = () => {
  const dbUrl = resolveDatabaseUrl()
  if (!dbUrl) {
    throw new Error(
      'Database URL not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_DB_PASSWORD (optional: SUPABASE_POOLER_HOST, SUPABASE_POOLER_PORT) in .env'
    )
  }
  console.log('🔌 Database connection string:', dbUrl.substring(0, 70) + '...')
  
  // For Supabase, parse connection string and use explicit config
  if (dbUrl.includes('supabase.co') || dbUrl.includes('supabase.com')) {
    try {
      // Parse: postgresql://user:password@host:port/database?params
      const urlMatch = dbUrl.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?$/)
      if (urlMatch) {
        const [, user, password, host, port, database] = urlMatch
        
        console.log('✅ Using explicit config for Supabase')
        console.log('   Host:', host)
        console.log('   Port:', port)
        console.log('   Database:', database)
        console.log('   User:', user.substring(0, 20) + '...')
        console.log('   SSL: { rejectUnauthorized: false }')
        
        // Decode password (handle URL encoding)
        let decodedPassword = password
        try {
          decodedPassword = decodeURIComponent(password)
        } catch (e) {
          // If decoding fails, use original password
          console.log('   Password decoding skipped, using original')
        }
        
        // Use explicit config - this is required for Supabase SSL to work correctly
        const config = {
          host: host.trim(),
          port: parseInt(port),
          database: database.trim(),
          user: user.trim(),
          password: decodedPassword,
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 30000,
          // SSL configuration for Supabase - confirmed working in test
          ssl: {
            rejectUnauthorized: false
          }
        }
        
        console.log('   Config created successfully')
        console.log('   Final config check:', {
          host: config.host,
          port: config.port,
          database: config.database,
          userLength: config.user.length,
          passwordLength: config.password.length,
          ssl: config.ssl
        })
        return config
      } else {
        console.error('❌ Failed to parse connection string with regex')
      }
    } catch (e) {
      console.error('❌ Error parsing connection string:', e)
      console.error('   Error stack:', e instanceof Error ? e.stack : 'No stack')
    }
  }
  
  // Fallback for non-Supabase databases
  let finalUrl = dbUrl
  if (!dbUrl.includes('sslmode=')) {
    finalUrl = dbUrl + (dbUrl.includes('?') ? '&' : '?') + 'sslmode=require'
  }
  
  return {
    connectionString: finalUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
  }
}

// Create pool lazily to ensure environment variables are loaded
// Use globalThis to persist across Next.js hot reloads
const globalForPool = globalThis as unknown as { dbPool: Pool | undefined }

function getPool(): Pool {
  if (!globalForPool.dbPool) {
    console.log('🔧 Initializing database pool...')
    const config = getPoolConfig()
    console.log('🔧 Pool config:', {
      hasHost: 'host' in config ? !!config.host : false,
      hasConnectionString: 'connectionString' in config ? !!config.connectionString : false,
      hasSSL: 'ssl' in config ? !!config.ssl : false,
      sslType: 'ssl' in config && config.ssl ? typeof config.ssl : 'none',
      sslConfig: 'ssl' in config ? config.ssl : undefined
    })
    
    // Create pool with explicit SSL config
    globalForPool.dbPool = new Pool(config)
    console.log('🔧 Pool created successfully')
    
    // Test connection on startup
    globalForPool.dbPool.on('error', (err: any) => {
      console.error('❌ Pool error:', err.message)
      console.error('   Error code:', err.code || 'N/A')
    })
    
    // Log pool events for debugging
    if (process.env.NODE_ENV === 'development') {
      globalForPool.dbPool.on('connect', () => {
        console.log('✅ Database client connected')
      })
      globalForPool.dbPool.on('acquire', () => {
        console.log('📥 Database client acquired from pool')
      })
      globalForPool.dbPool.on('remove', () => {
        console.log('📤 Database client removed from pool')
      })
    }
  }
  return globalForPool.dbPool
}

// Helper function to execute SQL queries
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    // Get pool (lazy initialization)
    const dbPool = getPool()
    
    // Use pool.query directly - this is simpler and the pool handles connection management
    const { query: pgQuery, values } = convertQuery(sql, params)
    
    const result = await dbPool.query(pgQuery, values)
    return result.rows as T[]
  } catch (error: any) {
    console.error("=== Database Query Error ===")
    console.error("Error name:", error?.name)
    console.error("Error message:", error?.message)
    console.error("Error code:", error?.code)
    console.error("Error detail:", error?.detail)
    console.error("Error stack:", error?.stack?.substring(0, 500))
    console.error("SQL (first 200 chars):", sql.substring(0, 200))
    const { query: pgQuery } = convertQuery(sql, params)
    console.error("Converted SQL (first 200 chars):", pgQuery.substring(0, 200))
    console.error("Params count:", params.length)
    throw error
  }
}

// Helper function to execute a transaction
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const dbPool = getPool()
  const client = await dbPool.connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

// Helper function for client queries (used in transactions)
export async function clientQuery<T = any>(client: PoolClient, sql: string, params: any[] = []): Promise<T[]> {
  const { query: pgQuery, values } = convertQuery(sql, params)
  const result = await client.query(pgQuery, values)
  return result.rows as T[]
}

// Export the pool for direct access if needed
export const db = {
  query,
  transaction,
  get pool() { return getPool() },
  clientQuery,
}
