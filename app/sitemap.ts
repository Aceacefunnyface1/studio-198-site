import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [""].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
