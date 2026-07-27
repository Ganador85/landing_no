import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Phase 2: privacy/retention settings + lead consent fields.
 * Idempotent ADD COLUMN IF NOT EXISTS for safe re-runs.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "privacy_title_no" varchar`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "privacy_title_en" varchar`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "privacy_body_no" varchar`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "privacy_body_en" varchar`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "privacy_link_no" varchar`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "privacy_link_en" varchar`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "consent_label_no" varchar`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "consent_label_en" varchar`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "retention_months" numeric`)
  await db.execute(sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "consent_at" timestamp(3) with time zone`)
  await db.execute(sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "consent_text" varchar`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "privacy_title_no"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "privacy_title_en"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "privacy_body_no"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "privacy_body_en"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "privacy_link_no"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "privacy_link_en"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "consent_label_no"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "consent_label_en"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "retention_months"`)
  await db.execute(sql`ALTER TABLE "leads" DROP COLUMN IF EXISTS "consent_at"`)
  await db.execute(sql`ALTER TABLE "leads" DROP COLUMN IF EXISTS "consent_text"`)
}
