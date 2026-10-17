import { MetadataRoute } from "next";
import { TOOLS_DATA, CATEGORIES } from "@/lib/tools-data";
import { SEO_REGISTRY } from "@/config/seoRegistry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://toolkaj.vercel.app";
  const now = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.filter((c) => c.id !== "all").map((cat) => ({
    url: `${baseUrl}/category/${cat.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Tool specific routes from TOOLS_DATA and SEO_REGISTRY
  // Map all unique tool paths
  const toolPaths = new Set<string>();
  TOOLS_DATA.forEach((tool) => toolPaths.add(tool.href));
  
  // Also add any tool paths registered in SEO_REGISTRY
  Object.values(SEO_REGISTRY).forEach((entry) => {
    if (entry.path.startsWith("/tools/")) {
      toolPaths.add(entry.path);
    }
  });

  const toolRoutes: MetadataRoute.Sitemap = Array.from(toolPaths).map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
