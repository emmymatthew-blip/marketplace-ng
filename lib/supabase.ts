import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Get Supabase project ref from NEXT_PUBLIC_SUPABASE_URL (e.g. https://xxx.supabase.co -> xxx)
 */
export function getSupabaseProjectRef(): string | null {
  if (!supabaseUrl) return null
  try {
    const u = new URL(supabaseUrl)
    const host = u.hostname
    const match = host.match(/^([a-z0-9]+)\.supabase\.(co|com)$/i)
    return match ? match[1] : null
  } catch {
    return null
  }
}

/**
 * Build PostgreSQL connection string from Supabase env vars.
 * Prefers pooler if SUPABASE_POOLER_HOST is set (e.g. aws-1-eu-west-1.pooler.supabase.com),
 * otherwise uses direct: postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres
 * Set SUPABASE_DB_PASSWORD (your database password from Supabase dashboard) to use this.
 */
export function getSupabaseDatabaseUrl(): string | null {
  const ref = getSupabaseProjectRef()
  const password = process.env.SUPABASE_DB_PASSWORD
  if (!ref || !password) return null
  const encoded = encodeURIComponent(password)
  const poolerHost = process.env.SUPABASE_POOLER_HOST?.trim()
  if (poolerHost) {
    const port = process.env.SUPABASE_POOLER_PORT || "5432"
    return `postgresql://postgres.${ref}:${encoded}@${poolerHost}:${port}/postgres?sslmode=require`
  }
  return `postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres?sslmode=require`
}

/**
 * Resolve database URL from Supabase env vars only (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_DB_PASSWORD).
 * DATABASE_URL is not used; everything uses Supabase configuration.
 */
export function resolveDatabaseUrl(): string | undefined {
  const derived = getSupabaseDatabaseUrl()
  if (derived) {
    process.env.DATABASE_URL = derived
    return derived
  }
  return undefined
}

/**
 * Server-side Supabase client (uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY).
 * Use for Supabase REST API, Auth, Storage, or Realtime.
 */
export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Singleton server Supabase client (for use in API routes / server components).
 */
let serverClient: ReturnType<typeof createClient> | null = null

export function getSupabaseServerClient() {
  if (!serverClient) {
    serverClient = createSupabaseClient()
  }
  return serverClient
}

/**
 * Create a Supabase client for use in client components (browser).
 * Uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (inlined at build time).
 */
export function createSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}
