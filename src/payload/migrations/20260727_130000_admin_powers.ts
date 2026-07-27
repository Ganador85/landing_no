import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Phase 3: editable navigation, media, structured testimonials, UI copy,
 * and LocalBusiness schema settings.
 *
 * The two Payload array join tables are created here as well, so production
 * does not depend on drizzle push for navItems or testimonialsItems.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "logo_id" integer;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "area_served_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "area_served_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "opening_days" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "opening_time" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "closing_time" varchar;

    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_nav_locale_no_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_nav_locale_no_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_nav_locale_en_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_nav_locale_en_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_references_comparison_hint_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_references_comparison_hint_en" varchar;

    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_choose_photos_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_choose_photos_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_no_photos_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_no_photos_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photos_selected_one_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photos_selected_one_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photos_selected_many_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photos_selected_many_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photos_too_many_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photos_too_many_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photos_limit_inline_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photos_limit_inline_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photo_too_large_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photo_too_large_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photo_uploading_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photo_uploading_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photo_queued_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photo_queued_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photo_ready_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photo_ready_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photo_failed_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_photo_failed_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_roof_size_invalid_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_roof_size_invalid_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_partial_upload_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_partial_upload_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_security_required_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_security_required_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_privacy_required_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_contact_form_privacy_required_en" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_footer_org_label_no" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copy_footer_org_label_en" varchar;

    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "image_id" integer;
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings_nav_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label_no" varchar NOT NULL,
      "label_en" varchar NOT NULL,
      "href" varchar NOT NULL,
      "visible" boolean DEFAULT true
    );
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "site_settings_nav_items_order_idx"
      ON "site_settings_nav_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_nav_items_parent_id_idx"
      ON "site_settings_nav_items" USING btree ("_parent_id");
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings_testimonials_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "quote_no" varchar,
      "quote_en" varchar,
      "author_no" varchar,
      "author_en" varchar,
      "service_no" varchar,
      "service_en" varchar
    );
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "site_settings_testimonials_items_order_idx"
      ON "site_settings_testimonials_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_testimonials_items_parent_id_idx"
      ON "site_settings_testimonials_items" USING btree ("_parent_id");
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "site_settings_logo_idx"
      ON "site_settings" USING btree ("logo_id");
    CREATE INDEX IF NOT EXISTS "products_image_idx"
      ON "products" USING btree ("image_id");
  `);

  await db.execute(sql`
    DO $migration$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'site_settings_logo_id_media_id_fk'
      ) THEN
        ALTER TABLE "site_settings"
          ADD CONSTRAINT "site_settings_logo_id_media_id_fk"
          FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'products_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "products"
          ADD CONSTRAINT "products_image_id_media_id_fk"
          FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'site_settings_nav_items_parent_id_fk'
      ) THEN
        ALTER TABLE "site_settings_nav_items"
          ADD CONSTRAINT "site_settings_nav_items_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'site_settings_testimonials_items_parent_id_fk'
      ) THEN
        ALTER TABLE "site_settings_testimonials_items"
          ADD CONSTRAINT "site_settings_testimonials_items_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END
    $migration$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_settings_testimonials_items" CASCADE;
    DROP TABLE IF EXISTS "site_settings_nav_items" CASCADE;

    ALTER TABLE "site_settings"
      DROP CONSTRAINT IF EXISTS "site_settings_logo_id_media_id_fk";
    ALTER TABLE "products"
      DROP CONSTRAINT IF EXISTS "products_image_id_media_id_fk";
    DROP INDEX IF EXISTS "site_settings_logo_idx";
    DROP INDEX IF EXISTS "products_image_idx";

    ALTER TABLE "products" DROP COLUMN IF EXISTS "image_id";

    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_footer_org_label_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_footer_org_label_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_privacy_required_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_privacy_required_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_security_required_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_security_required_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_partial_upload_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_partial_upload_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_roof_size_invalid_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_roof_size_invalid_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photo_failed_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photo_failed_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photo_ready_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photo_ready_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photo_queued_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photo_queued_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photo_uploading_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photo_uploading_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photo_too_large_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photo_too_large_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photos_limit_inline_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photos_limit_inline_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photos_too_many_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photos_too_many_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photos_selected_many_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photos_selected_many_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photos_selected_one_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_photos_selected_one_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_no_photos_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_no_photos_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_choose_photos_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_contact_form_choose_photos_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_references_comparison_hint_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_references_comparison_hint_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_nav_locale_en_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_nav_locale_en_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_nav_locale_no_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "copy_nav_locale_no_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "closing_time";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "opening_time";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "opening_days";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "area_served_en";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "area_served_no";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "logo_id";
  `);
}
