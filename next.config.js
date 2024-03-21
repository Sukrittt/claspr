/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "**/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "**/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "**/**",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
        pathname: "**/**",
      },
    ],
  },
};

module.exports = nextConfig;
