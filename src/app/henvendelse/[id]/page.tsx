import { Manrope } from "next/font/google";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "@/lib/payload";
import {
  parseLeadPhotoUrls,
  verifyLeadPhotoToken,
} from "@/lib/lead-photo-token";
import { inquiryTypeLabelNo, languageLabelNo } from "@/lib/inquiry-labels";
import { LeadGalleryClient } from "@/components/leads/lead-gallery-client";
import "../../globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export const metadata: Metadata = {
  title: "Henvendelse | Takfornyelse",
  robots: { index: false, follow: false },
};

export default async function LeadHenvendelsePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { token = "" } = await searchParams;

  if (!verifyLeadPhotoToken(id, token)) {
    notFound();
  }

  const payload = await getPayload();
  let lead: {
    id: string | number;
    name?: string | null;
    phone?: string | null;
    postal?: string | null;
    email?: string | null;
    address?: string | null;
    approxSqm?: number | null;
    inquiryType?: string | null;
    language?: string | null;
    message?: string | null;
    photoUrls?: string | null;
    createdAt?: string | null;
  } | null = null;

  try {
    lead = await payload.findByID({
      collection: "leads",
      id,
      overrideAccess: true,
    });
  } catch {
    notFound();
  }

  if (!lead) notFound();

  const photos = parseLeadPhotoUrls(lead.photoUrls);
  const typeLabel = inquiryTypeLabelNo(String(lead.inquiryType || ""));
  const created = lead.createdAt
    ? new Date(lead.createdAt).toLocaleString("nb-NO", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <html lang="no" className={manrope.variable}>
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 border-b border-white/10 pb-6">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">
              Takfornyelse
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Henvendelse #{String(lead.id)}
            </h1>
            {created ? (
              <p className="mt-1 text-sm text-muted-foreground">{created}</p>
            ) : null}
          </header>

          <section className="mb-10 grid gap-6 rounded-2xl border border-white/10 bg-[#12151c] p-5 sm:grid-cols-2 sm:p-6">
            <div className="min-w-0">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Kontakt
              </p>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Navn</dt>
                  <dd className="font-semibold">{lead.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Telefon</dt>
                  <dd>
                    <a
                      href={`tel:${String(lead.phone || "").replace(/\s+/g, "")}`}
                      className="font-semibold text-accent hover:underline"
                    >
                      {lead.phone}
                    </a>
                  </dd>
                </div>
                {lead.email ? (
                  <div>
                    <dt className="text-muted-foreground">E-post</dt>
                    <dd>
                      <a
                        href={`mailto:${lead.email}`}
                        className="font-semibold text-accent hover:underline"
                      >
                        {lead.email}
                      </a>
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-muted-foreground">Postnummer</dt>
                  <dd className="font-semibold">{lead.postal}</dd>
                </div>
                {lead.address ? (
                  <div>
                    <dt className="text-muted-foreground">Adresse</dt>
                    <dd className="font-semibold">{lead.address}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className="min-w-0">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Detaljer
              </p>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Tjeneste</dt>
                  <dd>
                    <span className="inline-flex rounded-full border border-accent/35 bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">
                      {typeLabel}
                    </span>
                  </dd>
                </div>
                {lead.approxSqm ? (
                  <div>
                    <dt className="text-muted-foreground">Ca. m²</dt>
                    <dd className="font-semibold">{lead.approxSqm}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-muted-foreground">Språk</dt>
                  <dd className="font-semibold">
                    {languageLabelNo(String(lead.language || "no"))}
                  </dd>
                </div>
                {lead.message?.trim() ? (
                  <div>
                    <dt className="text-muted-foreground">Melding</dt>
                    <dd className="max-w-full break-words whitespace-pre-wrap font-medium leading-relaxed [overflow-wrap:anywhere]">
                      {lead.message.trim()}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">Bilder</h2>
            <LeadGalleryClient leadId={String(lead.id)} token={token} photoUrls={photos} />
          </section>
        </div>
      </body>
    </html>
  );
}
