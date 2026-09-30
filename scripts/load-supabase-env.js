/**
 * Load .env and .env.local, then set process.env.DATABASE_URL from Supabase env vars
 * (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_DB_PASSWORD, optional SUPABASE_POOLER_HOST/PORT).
 * Require this at the top of scripts that need a database connection so they work without DATABASE_URL.
 */
const path = require('path')
const fs = require('fs')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf8')
  content.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const match = trimmed.match(/^([^=:#]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      let value = match[2].trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  })
}

loadEnvFile(path.join(__dirname, '..', '.env'))
loadEnvFile(path.join(__dirname, '..', '.env.local'))

function getSupabaseProjectRef() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname
    const m = host.match(/^([a-z0-9]+)\.supabase\.(co|com)$/i)
    return m ? m[1] : null
  } catch {
    return null
  }
}

function getSupabaseDatabaseUrl() {
  const ref = getSupabaseProjectRef()
  const password = process.env.SUPABASE_DB_PASSWORD
  if (!ref || !password) return null
  const encoded = encodeURIComponent(password)
  const poolerHost = (process.env.SUPABASE_POOLER_HOST || '').trim()
  if (poolerHost) {
    const port = process.env.SUPABASE_POOLER_PORT || '5432'
    return `postgresql://postgres.${ref}:${encoded}@${poolerHost}:${port}/postgres?sslmode=require`
  }
  return `postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres?sslmode=require`
}

const dbUrl = getSupabaseDatabaseUrl()
if (dbUrl) {
  process.env.DATABASE_URL = dbUrl
}

module.exports = { getSupabaseDatabaseUrl, getSupabaseProjectRef }
