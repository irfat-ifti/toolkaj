import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 9,
          fontWeight: 900,
          fontFamily: "sans-serif",
          letterSpacing: "-0.5px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
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
