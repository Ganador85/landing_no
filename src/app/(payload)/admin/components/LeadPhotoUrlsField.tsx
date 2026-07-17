"use client";

import type { TextareaFieldClientComponent } from "payload";
import { FieldLabel, useField } from "@payloadcms/ui";

function parseUrls(value: unknown): string[] {
  if (typeof value !== "string" || !value.trim()) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function proxySrc(url: string) {
  return `/api/admin/blob?url=${encodeURIComponent(url)}`;
}

export const LeadPhotoUrlsField: TextareaFieldClientComponent = ({
  path,
  field,
}) => {
  const { value, setValue } = useField<string>({ path });
  const urls = parseUrls(value);

  return (
    <div className="field-type textarea">
      <FieldLabel label={field?.label || "Photo Urls"} path={path} />
      <p style={{ margin: "0 0 0.75rem", opacity: 0.7, fontSize: 13 }}>
        Private Blob store — open previews below (admin login required). Raw
        URLs will show Forbidden if opened directly.
      </p>

      {urls.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 12,
            marginBottom: 12,
          }}
        >
          {urls.map((url) => (
            <a
              key={url}
              href={proxySrc(url)}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.25)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proxySrc(url)}
                alt="Lead photo"
                style={{
                  display: "block",
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                }}
              />
            </a>
          ))}
        </div>
      ) : null}

      <textarea
        className="textarea-field"
        rows={8}
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default LeadPhotoUrlsField;
