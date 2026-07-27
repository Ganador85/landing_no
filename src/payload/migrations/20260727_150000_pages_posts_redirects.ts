import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Phase 7: Pages, Posts, Redirects (+ draft version tables).
 * Idempotent CREATE / ADD for safe deploys.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages" (
      "id" serial PRIMARY KEY NOT NULL,
      "slug" varchar,
      "title_no" varchar,
      "title_en" varchar,
      "excerpt_no" varchar,
      "excerpt_en" varchar,
      "content_no" varchar,
      "content_en" varchar,
      "seo_title_no" varchar,
      "seo_title_en" varchar,
      "seo_description_no" varchar,
      "seo_description_en" varchar,
      "published_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "_status" "enum_pages_status" DEFAULT 'draft'
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "posts" (
      "id" serial PRIMARY KEY NOT NULL,
      "slug" varchar,
      "title_no" varchar,
      "title_en" varchar,
      "excerpt_no" varchar,
      "excerpt_en" varchar,
      "content_no" varchar,
      "content_en" varchar,
      "hero_image_id" integer,
      "seo_title_no" varchar,
      "seo_title_en" varchar,
      "seo_description_no" varchar,
      "seo_description_en" varchar,
      "published_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "_status" "enum_posts_status" DEFAULT 'draft'
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "redirects" (
      "id" serial PRIMARY KEY NOT NULL,
      "from_path" varchar,
      "to_path" varchar,
      "to_url" varchar,
      "permanent" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_slug" varchar,
      "version_title_no" varchar,
      "version_title_en" varchar,
      "version_excerpt_no" varchar,
      "version_excerpt_en" varchar,
      "version_content_no" varchar,
      "version_content_en" varchar,
      "version_seo_title_no" varchar,
      "version_seo_title_en" varchar,
      "version_seo_description_no" varchar,
      "version_seo_description_en" varchar,
      "version_published_at" timestamp(3) with time zone,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version__status" "enum_pages_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "posts_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_slug" varchar,
      "version_title_no" varchar,
      "version_title_en" varchar,
      "version_excerpt_no" varchar,
      "version_excerpt_en" varchar,
      "version_content_no" varchar,
      "version_content_en" varchar,
      "version_hero_image_id" integer,
      "version_seo_title_no" varchar,
      "version_seo_title_en" varchar,
      "version_seo_description_no" varchar,
      "version_seo_description_en" varchar,
      "version_published_at" timestamp(3) with time zone,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version__status" "enum_posts_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );
  `);

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug")`);
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_unique" ON "pages" USING btree ("slug")`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at")`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at")`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages__status_idx" ON "pages" USING btree ("_status")`);

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts" USING btree ("slug")`);
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_unique" ON "posts" USING btree ("slug")`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "posts_updated_at_idx" ON "posts" USING btree ("updated_at")`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "posts" USING btree ("created_at")`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "posts__status_idx" ON "posts" USING btree ("_status")`);

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "redirects_from_path_idx" ON "redirects" USING btree ("from_path")`);
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS "redirects_from_path_unique" ON "redirects" USING btree ("from_path")`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at")`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "redirects_created_at_idx" ON "redirects" USING btree ("created_at")`);

  // locked docs rel columns for new collections
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "pages_id" integer`);
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "posts_id" integer`);
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "redirects_id" integer`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "posts_v" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "pages_v" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "redirects" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "posts" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "pages" CASCADE`);
}
