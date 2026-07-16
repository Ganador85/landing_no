/**
 * Rename reserved/conflicting Leads columns for Payload admin stability.
 * Usage: node --env-file=.env scripts/migrate-leads-columns.mjs
 */
import pg from "pg";

const url = process.env.DATABASE_URL?.replace(/[&?]channel_binding=require/g, "");
if (!url?.startsWith("postgres")) {
  console.error("DATABASE_URL must be postgres");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: url,
  max: 1,
  connectionTimeoutMillis: 20000,
});

async function renameIfNeeded(from, to) {
  const existsFrom = await pool.query(
    `select 1 from information_schema.columns
     where table_schema='public' and table_name='leads' and column_name=$1`,
    [from],
  );
  const existsTo = await pool.query(
    `select 1 from information_schema.columns
     where table_schema='public' and table_name='leads' and column_name=$1`,
    [to],
  );

  if (existsFrom.rowCount && !existsTo.rowCount) {
    await pool.query(`alter table leads rename column "${from}" to "${to}"`);
    console.log(`renamed ${from} -> ${to}`);
  } else if (existsTo.rowCount) {
    console.log(`ok: ${to} already exists`);
    if (existsFrom.rowCount) {
      await pool.query(`alter table leads drop column "${from}"`);
      console.log(`dropped leftover ${from}`);
    }
  } else {
    console.log(`skip: neither ${from} nor ${to} found as expected`);
  }
}

try {
  await renameIfNeeded("type", "inquiry_type");
  await renameIfNeeded("locale", "language");
  const cols = await pool.query(
    `select column_name from information_schema.columns
     where table_schema='public' and table_name='leads' order by ordinal_position`,
  );
  console.log(
    "leads columns:",
    cols.rows.map((r) => r.column_name).join(", "),
  );
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
