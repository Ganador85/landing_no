import { NextResponse } from "next/server";

/**
 * Legacy client-upload token endpoint — disabled.
 * Use POST /api/lead/upload-ticket + /api/lead/photo-upload instead.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "This upload path is disabled. Use /api/lead/photo-upload with an upload ticket.",
    },
    { status: 410 },
  );
}
