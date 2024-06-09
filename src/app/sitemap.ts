import { siteConfig } from "@/config/site";
import { type MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteRoutes = [
    "",
    "/dashboard",
    "/calendar",
    "/terms",
    "/privacy",
    "/contact",
    "/about",
    "/sign-in",
  ];

  const routes = siteRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}
