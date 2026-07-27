import { describe, expect, it } from "vitest";
import { sniffImageMime } from "@/lib/image-mime";

describe("sniffImageMime", () => {
  it.each([
    [
      "JPEG",
      Buffer.from([0xff, 0xd8, 0xff, ...Array(9).fill(0)]),
      "image/jpeg",
    ],
    [
      "PNG",
      Buffer.from([0x89, 0x50, 0x4e, 0x47, ...Array(8).fill(0)]),
      "image/png",
    ],
    [
      "GIF",
      Buffer.from([0x47, 0x49, 0x46, 0x38, ...Array(8).fill(0)]),
      "image/gif",
    ],
    ["WebP", Buffer.from("RIFF0000WEBP"), "image/webp"],
    ["HEIC", Buffer.from("\0\0\0\0ftypheic"), "image/heic"],
    ["HEIF", Buffer.from("\0\0\0\0ftypmif1"), "image/heif"],
  ])("detects %s magic bytes", (_name, bytes, expected) => {
    expect(sniffImageMime(bytes)).toBe(expected);
  });

  it("returns null for short or unknown data", () => {
    expect(sniffImageMime(Buffer.from("short"))).toBeNull();
    expect(sniffImageMime(Buffer.alloc(12))).toBeNull();
  });
});
