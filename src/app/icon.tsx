import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata (Google requires multiples of 48px: 48, 96, 144, 192)
export const size = {
  width: 96,
  height: 96,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 52,
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 26,
          fontWeight: 900,
          fontFamily: "sans-serif",
          letterSpacing: "-1.5px",
          border: "2px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        TK
      </div>
    ),
    {
      ...size,
    }
  );
}
