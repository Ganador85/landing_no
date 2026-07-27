import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Baseline migration for the existing Takfornyelse schema.
 *
 * Production tables were originally created via drizzle push + ensure-*.mjs
 * scripts. This file freezes that state so future schema changes go through
 * versioned migrations instead of ad-hoc ALTER scripts.
 *
 * UP is intentionally a no-op (safe on DBs that already have the schema).
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  payload.logger.info('Baseline migration: schema already present — recording only.')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('Baseline down is a no-op (will not drop existing tables).')
}
