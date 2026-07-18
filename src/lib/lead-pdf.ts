import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import type { LeadEmailInput } from "@/lib/lead-email";
import { leadAdminUrl, leadGalleryUrl } from "@/lib/lead-email";
import { inquiryTypeLabelNo, languageLabelNo } from "@/lib/inquiry-labels";

/** Map common Unicode to WinAnsi-safe glyphs Helvetica can draw. */
function toPdfText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/\u2013|\u2014/g, "-") // en/em dash
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2022/g, "-")
    .replace(/\u00B7/g, "|") // middle dot
    .replace(/\u00A0/g, " ")
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

function wrapLines(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const safe = toPdfText(text);
  const paragraphs = safe.split(/\r?\n/);
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph) {
      lines.push("");
      continue;
    }

    let remaining = paragraph;
    while (remaining.length > 0) {
      if (font.widthOfTextAtSize(remaining, size) <= maxWidth) {
        lines.push(remaining);
        break;
      }

      // Prefer breaking at the last space that still fits
      let breakAt = -1;
      let low = 1;
      let high = remaining.length;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const chunk = remaining.slice(0, mid);
        if (font.widthOfTextAtSize(chunk, size) <= maxWidth) {
          breakAt = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      if (breakAt <= 0) {
        // Single glyph wider than page — force one char
        lines.push(remaining.slice(0, 1));
        remaining = remaining.slice(1);
        continue;
      }

      const window = remaining.slice(0, breakAt);
      const spaceIdx = window.lastIndexOf(" ");
      const cut = spaceIdx > 12 ? spaceIdx : breakAt;
      lines.push(remaining.slice(0, cut).trimEnd());
      remaining = remaining.slice(cut).trimStart();
    }
  }

  return lines;
}

export async function buildLeadPdf(input: LeadEmailInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  let page = doc.addPage([595.28, 841.89]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const margin = 48;
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  const maxWidth = pageWidth - margin * 2;
  let y = pageHeight - margin;

  const ink = rgb(0.08, 0.09, 0.11);
  const muted = rgb(0.4, 0.43, 0.48);
  const accent = rgb(0.85, 0.58, 0.05);
  const rule = rgb(0.86, 0.87, 0.89);

  const ensureSpace = (needed: number) => {
    if (y - needed >= margin) return;
    page = doc.addPage([595.28, 841.89]);
    y = pageHeight - margin;
  };

  const drawLines = (
    text: string,
    opts: {
      size?: number;
      bold?: boolean;
      color?: ReturnType<typeof rgb>;
      gapAfter?: number;
    } = {},
  ) => {
    const size = opts.size ?? 11;
    const f = opts.bold ? fontBold : font;
    const color = opts.color ?? ink;
    const lineHeight = size * 1.4;
    const lines = wrapLines(text, f, size, maxWidth);

    for (const line of lines) {
      ensureSpace(lineHeight + 4);
      if (line) {
        page.drawText(line, { x: margin, y, size, font: f, color });
      }
      y -= lineHeight;
    }
    if (opts.gapAfter) y -= opts.gapAfter;
  };

  const drawField = (label: string, value?: string | number | null) => {
    if (value === undefined || value === null || String(value).trim() === "") return;
    const size = 11;
    const labelText = `${label}: `;
    const labelWidth = fontBold.widthOfTextAtSize(toPdfText(labelText), size);
    const valueMax = Math.max(80, maxWidth - labelWidth);
    const valueLines = wrapLines(String(value), font, size, valueMax);
    const lineHeight = size * 1.4;

    valueLines.forEach((line, idx) => {
      ensureSpace(lineHeight + 4);
      if (idx === 0) {
        page.drawText(toPdfText(labelText), {
          x: margin,
          y,
          size,
          font: fontBold,
          color: muted,
        });
        page.drawText(line, {
          x: margin + labelWidth,
          y,
          size,
          font,
          color: ink,
        });
      } else {
        page.drawText(line, {
          x: margin + labelWidth,
          y,
          size,
          font,
          color: ink,
        });
      }
      y -= lineHeight;
    });
    y -= 6;
  };

  const drawRule = () => {
    ensureSpace(16);
    y -= 4;
    page.drawLine({
      start: { x: margin, y },
      end: { x: pageWidth - margin, y },
      thickness: 0.8,
      color: rule,
    });
    y -= 14;
  };

  const gallery = leadGalleryUrl(input.id, input.token);
  const admin = leadAdminUrl(input.id);
  const created = new Date().toLocaleString("nb-NO", {
    dateStyle: "long",
    timeStyle: "short",
  });

  drawLines("TAKFORNYELSE", { size: 10, bold: true, color: accent, gapAfter: 4 });
  drawLines("Ny henvendelse", { size: 20, bold: true, gapAfter: 2 });
  drawLines(`Lead #${input.id}  |  ${created}`, {
    size: 10,
    color: muted,
    gapAfter: 4,
  });
  drawLines(inquiryTypeLabelNo(input.type), {
    size: 12,
    bold: true,
    color: accent,
    gapAfter: 6,
  });
  drawRule();

  drawLines("KONTAKT", { size: 9, bold: true, color: muted, gapAfter: 6 });
  drawField("Navn", input.name);
  drawField("Telefon", input.phone);
  drawField("Postnummer", input.postal);
  drawField("E-post", input.email);
  drawField("Adresse", input.address);
  drawRule();

  drawLines("DETALJER", { size: 9, bold: true, color: muted, gapAfter: 6 });
  drawField("Tjeneste", inquiryTypeLabelNo(input.type));
  drawField("Ca. m2", input.approxSqm);
  drawField("Språk", languageLabelNo(input.locale));
  drawField("Antall bilder", String(input.photoUrls.length));

  if (input.message?.trim()) {
    y -= 4;
    drawLines("MELDING", { size: 9, bold: true, color: muted, gapAfter: 6 });
    drawLines(input.message.trim(), { size: 11, gapAfter: 8 });
  }

  drawRule();
  drawLines("LENKER", { size: 9, bold: true, color: muted, gapAfter: 6 });
  drawField("Bilder / galleri", gallery);
  drawField("Admin", admin);

  y -= 6;
  drawLines("Bilder er ikke inkludert i PDF - åpne gallerilenken over.", {
    size: 9,
    color: muted,
  });

  return doc.save();
}
