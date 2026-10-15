import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `ToolKaj (টুলকাজ) - ${SITE_CONFIG.taglineBn}`,
    short_name: "ToolKaj",
    description: SITE_CONFIG.descriptionBn,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
