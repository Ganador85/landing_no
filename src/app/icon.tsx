import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 18,
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        T
      </div>
    ),
    size,
  );
}
