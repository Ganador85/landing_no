import { del, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getPayload } from "@/lib/payload";
import { captureException } from "@/lib/monitoring";

export const runtime = "nodejs";
export const maxDuration = 60;

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

/**
 * Deletes leads older than Site Settings retentionMonths, and best-effort
 * cleans matching private Blob objects under leads/.
 *
 * Secure with CRON_SECRET (Vercel Cron sends Authorization: Bearer …).
 */
export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await getPayload();
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      draft: false,
      overrideAccess: true,
    });
    const months =
      typeof settings.retentionMonths === "number" &&
      settings.retentionMonths > 0
        ? settings.retentionMonths
        : 24;

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);

    const old = await payload.find({
      collection: "leads",
      where: {
        createdAt: { less_than: cutoff.toISOString() },
      },
      limit: 100,
      depth: 0,
      overrideAccess: true,
    });

    let deleted = 0;
    for (const lead of old.docs) {
      await payload.delete({
        collection: "leads",
        id: lead.id,
        overrideAccess: true,
      });
      deleted += 1;
    }

    let blobsDeleted = 0;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const listed = await list({
          prefix: "leads/",
          token: process.env.BLOB_READ_WRITE_TOKEN,
          limit: 200,
        });
        const stale = listed.blobs.filter(
          (b) => b.uploadedAt && b.uploadedAt < cutoff,
        );
        if (stale.length) {
          await del(
            stale.map((b) => b.url),
            { token: process.env.BLOB_READ_WRITE_TOKEN },
          );
          blobsDeleted = stale.length;
        }
      } catch (err) {
        captureException(err, {
          route: "GET /api/cron/purge-leads",
          operation: "blob-purge",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      retentionMonths: months,
      cutoff: cutoff.toISOString(),
      leadsDeleted: deleted,
      blobsDeleted,
    });
  } catch (err) {
    captureException(err, { route: "GET /api/cron/purge-leads" });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
