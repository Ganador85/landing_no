import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Services } from "./payload/collections/Services";
import { Projects } from "./payload/collections/Projects";
import { Products } from "./payload/collections/Products";
import { Faq } from "./payload/collections/Faq";
import { Leads } from "./payload/collections/Leads";
import { SiteSettings } from "./payload/collections/SiteSettings";
import { migrations } from "./payload/migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const rawDatabaseUrl = process.env.DATABASE_URL || "file:./takfornying.db";
// Neon sometimes adds channel_binding=require which breaks node-pg on Vercel
const databaseUrl = rawDatabaseUrl.replace(/[&?]channel_binding=require/g, "");
const usePostgres = databaseUrl.startsWith("postgres");

const serverURL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const migrationDir = path.resolve(dirname, "payload/migrations");

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, "app/(payload)/admin"),
    },
  },
  collections: [Users, Media, Services, Projects, Products, Faq, Leads],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me-in-production",
  typescript: {
    outputFile: path.resolve(dirname, "payload", "payload-types.ts"),
  },
  db: usePostgres
    ? postgresAdapter({
        pool: {
          connectionString: databaseUrl,
          // max:1 deadlocks Payload (transactions + nested queries) on serverless.
          max: 10,
          idleTimeoutMillis: 20_000,
          connectionTimeoutMillis: 15_000,
        },
        // Avoid nested transaction connection grabs that stall with small pools.
        transactionOptions: false,
        // Production never auto-pushes; migrations handle schema.
        // Local/dev push stays available unless explicitly disabled.
        push: process.env.NODE_ENV !== "production",
        migrationDir,
        prodMigrations: migrations,
      })
    : sqliteAdapter({
        client: {
          url: databaseUrl,
        },
      }),
  sharp,
});
