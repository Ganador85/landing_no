import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #d4a017 0%, #b45309 100%)",
          color: "#0b0d10",
          fontSize: 96,
          fontWeight: 700,
          borderRadius: 36,
        }}
      >
        T
      </div>
    ),
    size,
  );
}
