/**
 * Push Payload schema to Postgres (Neon).
 *
 * @deprecated Prefer versioned migrations (`npm run db:migrate`).
 * Use this only for brand-new empty databases or emergencies when a
 * migration was not created. Production builds should never rely on push.
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
