import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata (192x192 multiple of 48px)
export const size = {
  width: 192,
  height: 192,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 104,
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 48,
          fontWeight: 900,
          fontFamily: "sans-serif",
          letterSpacing: "-3px",
          border: "4px solid rgba(255, 255, 255, 0.4)",
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
