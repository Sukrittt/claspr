import { siteConfig } from "@/config/site";
import { type MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/dashboard", "/calendar", "/sign-in"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}
