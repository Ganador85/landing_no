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
          max: 1,
        },
        push: true,
      })
    : sqliteAdapter({
        client: {
          url: databaseUrl,
        },
      }),
  sharp,
});
