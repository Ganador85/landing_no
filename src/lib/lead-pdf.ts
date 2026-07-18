import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { LeadEmailInput } from "@/lib/lead-email";
import { leadAdminUrl, leadGalleryUrl } from "@/lib/lead-email";
import { inquiryTypeLabelNo, languageLabelNo } from "@/lib/inquiry-labels";

/** Helvetica / WinAnsi-safe text (NO æøå ok; other scripts → ?). */
function toPdfText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "?");
}

function slugName(name: string) {
  return (
    name
      .normalize("NFKD")
      .replace(/[^\w]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40)
      .toLowerCase() || "kunde"
  );
}

export function leadPdfFilename(input: LeadEmailInput) {
  return `henvendelse-${input.id}-${slugName(input.name)}.pdf`;
}

export async function buildLeadPdf(input: LeadEmailInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const margin = 48;
  const maxWidth = page.getWidth() - margin * 2;
  let y = page.getHeight() - margin;

  const ink = rgb(0.08, 0.09, 0.11);
  const muted = rgb(0.45, 0.48, 0.52);
  const accent = rgb(0.91, 0.64, 0.09);

  const draw = (
    text: string,
    opts: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; gap?: number } = {},
  ) => {
    const size = opts.size ?? 11;
    const f = opts.bold ? fontBold : font;
    const color = opts.color ?? ink;
    const lineHeight = size * 1.35;
    const safe = toPdfText(text);
    const words = safe.split(/\s+/);
    let line = "";

    const flush = (content: string) => {
      if (!content) return;
      if (y < margin + 40) return;
      page.drawText(content, { x: margin, y, size, font: f, color, maxWidth });
      y -= lineHeight;
    };

    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (f.widthOfTextAtSize(next, size) > maxWidth && line) {
        flush(line);
        line = word;
      } else {
        line = next;
      }
    }
    flush(line);
    if (opts.gap) y -= opts.gap;
  };

  const field = (label: string, value?: string | number | null) => {
    if (value === undefined || value === null || value === "") return;
    draw(`${label}:`, { size: 9, color: muted, gap: 2 });
    draw(String(value), { size: 12, bold: true, gap: 10 });
  };

  const gallery = leadGalleryUrl(input.id, input.token);
  const admin = leadAdminUrl(input.id);
  const created = new Date().toLocaleString("nb-NO", {
    dateStyle: "long",
    timeStyle: "short",
  });

  draw("TAKFORNYELSE", { size: 10, bold: true, color: accent, gap: 6 });
  draw("Ny henvendelse", { size: 22, bold: true, gap: 4 });
  draw(`Lead #${input.id}  ·  ${created}`, { size: 10, color: muted, gap: 8 });
  draw(inquiryTypeLabelNo(input.type), {
    size: 12,
    bold: true,
    color: accent,
    gap: 18,
  });

  draw("KONTAKT", { size: 9, bold: true, color: muted, gap: 8 });
  field("Navn", input.name);
  field("Telefon", input.phone);
  field("Postnummer", input.postal);
  field("E-post", input.email);
  field("Adresse", input.address);

  draw("DETALJER", { size: 9, bold: true, color: muted, gap: 8 });
  field("Tjeneste", inquiryTypeLabelNo(input.type));
  field("Ca. m²", input.approxSqm);
  field("Språk", languageLabelNo(input.locale));
  field("Antall bilder", input.photoUrls.length || "0");

  if (input.message?.trim()) {
    draw("MELDING", { size: 9, bold: true, color: muted, gap: 8 });
    draw(input.message.trim(), { size: 11, gap: 14 });
  }

  draw("LENKER", { size: 9, bold: true, color: muted, gap: 8 });
  field("Bilder / galleri", gallery);
  field("Admin", admin);

  y -= 8;
  page.drawLine({
    start: { x: margin, y },
    end: { x: page.getWidth() - margin, y },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.85),
  });
  y -= 16;
  draw("Bilder er ikke inkludert i PDF – åpne gallerilenken over.", {
    size: 9,
    color: muted,
  });

  return doc.save();
}
