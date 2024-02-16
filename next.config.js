/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "**",
      },
    ],
    domains: ["utfs.io", "images.unsplash.com", "www.notion.so"],
  },
};

module.exports = nextConfig;
