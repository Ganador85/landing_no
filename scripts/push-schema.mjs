/**
 * Push Payload schema to Postgres (Neon).
 * Production skips drizzle push, so Vercel can end up with no tables
 * and /admin hangs on a black screen while queries wait.
 *
 * Usage:
 *   npm run db:push
 */
process.env.NODE_ENV = "development";
process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = "true";

const { getPayload } = await import("payload");
const { default: config } = await import("../src/payload.config.ts");

const payload = await getPayload({ config });

const client = await payload.db.pool.connect();
try {
  const { rows } = await client.query(
    `select tablename from pg_tables where schemaname = 'public' order by 1`,
  );
  console.log(
    "Schema push finished. Public tables:",
    rows.map((row) => row.tablename),
  );
} finally {
  client.release();
  await payload.db.destroy();
}

process.exit(0);
