import { siteConfig } from "@/lib/site";
import { inquiryTypeLabelNo, languageLabelNo } from "@/lib/inquiry-labels";

export type LeadEmailInput = {
  id: string | number;
  token: string;
  name: string;
  phone: string;
  postal: string;
  type: string;
  locale: string;
  email?: string;
  address?: string;
  approxSqm?: number;
  message?: string;
  photoUrls: string[];
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function leadGalleryUrl(id: string | number, token: string) {
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}/henvendelse/${id}?token=${encodeURIComponent(token)}`;
}

export function leadBlobUrl(opts: {
  id: string | number;
  token: string;
  url: string;
  download?: boolean;
}) {
  const base = siteConfig.url.replace(/\/$/, "");
  const params = new URLSearchParams({
    id: String(opts.id),
    token: opts.token,
    url: opts.url,
  });
  if (opts.download) params.set("download", "1");
  return `${base}/api/lead/blob?${params.toString()}`;
}

export function leadAdminUrl(id: string | number) {
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}/admin/collections/leads/${id}`;
}

function row(label: string, valueHtml: string) {
  return `
    <tr>
      <td style="padding:8px 0;color:#9aa3b2;font-size:13px;width:120px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#f4f6f8;font-size:15px;font-weight:600;vertical-align:top;">${valueHtml}</td>
    </tr>`;
}

export function buildLeadEmailSubject(input: LeadEmailInput) {
  const typeLabel = inquiryTypeLabelNo(input.type);
  return `Ny henvendelse: ${input.name} (${typeLabel})`;
}

export function buildLeadEmailText(input: LeadEmailInput) {
  const gallery = leadGalleryUrl(input.id, input.token);
  const lines = [
    "Ny henvendelse – Takfornyelse",
    "",
    `Navn: ${input.name}`,
    `Telefon: ${input.phone}`,
    `Postnummer: ${input.postal}`,
    input.email ? `E-post: ${input.email}` : null,
    input.address ? `Adresse: ${input.address}` : null,
    input.approxSqm ? `Ca. m²: ${input.approxSqm}` : null,
    `Tjeneste: ${inquiryTypeLabelNo(input.type)}`,
    `Språk: ${languageLabelNo(input.locale)}`,
    input.photoUrls.length ? `Bilder: ${input.photoUrls.length} – ${gallery}` : null,
    "",
    input.message?.trim() || null,
    "",
    `Åpne bilder: ${gallery}`,
    `Admin: ${leadAdminUrl(input.id)}`,
    "",
    "PDF-vedlegg med henvendelsesinfo er inkludert (uten bilder).",
  ];
  return lines.filter((line) => line !== null).join("\n");
}

export function buildLeadEmailHtml(input: LeadEmailInput) {
  const typeLabel = inquiryTypeLabelNo(input.type);
  const gallery = leadGalleryUrl(input.id, input.token);
  const admin = leadAdminUrl(input.id);
  const preview = input.photoUrls.slice(0, 4);
  const more = Math.max(0, input.photoUrls.length - preview.length);

  const thumbs = preview
    .map((url, i) => {
      const src = leadBlobUrl({ id: input.id, token: input.token, url });
      return `
        <td style="padding:4px;width:25%;">
          <a href="${escapeHtml(gallery)}" style="display:block;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);">
            <img src="${escapeHtml(src)}" alt="Bilde ${i + 1}" width="140" height="105" style="display:block;width:100%;height:auto;object-fit:cover;" />
          </a>
        </td>`;
    })
    .join("");

  const phoneHref = `tel:${input.phone.replace(/\s+/g, "")}`;
  const emailHref = input.email ? `mailto:${input.email}` : null;

  return `<!DOCTYPE html>
<html lang="no">
<body style="margin:0;padding:0;background:#0b0d10;font-family:Manrope,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0d10;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#12151c;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 12px;">
              <p style="margin:0 0 6px;color:#e8a317;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Takfornyelse</p>
              <h1 style="margin:0;color:#ffffff;font-size:24px;line-height:1.25;">Ny henvendelse</h1>
              <p style="margin:12px 0 0;">
                <span style="display:inline-block;background:rgba(232,163,23,0.18);color:#e8a317;border:1px solid rgba(232,163,23,0.35);border-radius:999px;padding:6px 12px;font-size:13px;font-weight:700;">${escapeHtml(typeLabel)}</span>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 28px 20px;">
              <p style="margin:0 0 8px;color:#9aa3b2;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">Kontakt</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row("Navn", escapeHtml(input.name))}
                ${row("Telefon", `<a href="${escapeHtml(phoneHref)}" style="color:#e8a317;text-decoration:none;">${escapeHtml(input.phone)}</a>`)}
                ${row("Postnr", escapeHtml(input.postal))}
                ${
                  input.email && emailHref
                    ? row(
                        "E-post",
                        `<a href="${escapeHtml(emailHref)}" style="color:#e8a317;text-decoration:none;">${escapeHtml(input.email)}</a>`,
                      )
                    : ""
                }
                ${input.address ? row("Adresse", escapeHtml(input.address)) : ""}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 20px;">
              <p style="margin:0 0 8px;color:#9aa3b2;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">Detaljer</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${input.approxSqm ? row("Ca. m²", String(input.approxSqm)) : ""}
                ${row("Språk", languageLabelNo(input.locale))}
                ${
                  input.message?.trim()
                    ? row(
                        "Melding",
                        `<span style="font-weight:500;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;">${escapeHtml(input.message.trim())}</span>`,
                      )
                    : ""
                }
              </table>
            </td>
          </tr>

          ${
            input.photoUrls.length
              ? `<tr>
            <td style="padding:0 28px 24px;">
              <p style="margin:0 0 8px;color:#9aa3b2;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">Bilder (${input.photoUrls.length})</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${thumbs}</tr></table>
              ${
                more
                  ? `<p style="margin:8px 0 0;color:#9aa3b2;font-size:13px;">+${more} flere bilder i galleriet</p>`
                  : ""
              }
              <p style="margin:16px 0 0;">
                <a href="${escapeHtml(gallery)}" style="display:inline-block;background:#e8a317;color:#0c0e12;text-decoration:none;font-weight:700;font-size:14px;padding:12px 18px;border-radius:10px;">Se alle bilder</a>
              </p>
            </td>
          </tr>`
              : ""
          }

          <tr>
            <td style="padding:0 28px 28px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:16px 0 0;color:#9aa3b2;font-size:12px;line-height:1.5;">
                Lead #${escapeHtml(String(input.id))}
                · <a href="${escapeHtml(admin)}" style="color:#9aa3b2;">Åpne i admin</a>
                ${input.email ? " · Svar på denne e-posten for å kontakte kunden" : ""}
                <br />PDF-vedlegg med henvendelsesinfo er inkludert (uten bilder).
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
