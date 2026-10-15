import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_CONFIG.nameBn} - ${SITE_CONFIG.taglineBn}`,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.descriptionBn,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
