/**
 * Load Supabase env and set DATABASE_URL, then run the given command.
 * Use for Prisma CLI: node scripts/with-supabase-env.js npx prisma migrate deploy
 */
require('./load-supabase-env.js');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_DB_PASSWORD in .env');
  process.exit(1);
}

const { spawnSync } = require('child_process');
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/with-supabase-env.js <command> [args...]');
  process.exit(1);
}

const result = spawnSync(args[0], args.slice(1), {
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
