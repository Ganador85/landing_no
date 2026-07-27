import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const exitURL = new URL(request.url);
  const locale = exitURL.searchParams.get("locale") === "en" ? "en" : "no";
  const draft = await draftMode();
  draft.disable();

  const response = NextResponse.redirect(new URL(`/${locale}`, exitURL));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
