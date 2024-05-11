import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./styles/globals.css";

import { siteConfig } from "@/config/site";
import { Providers } from "@/components/providers/providers";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - The only classroom companion you'll ever need`,
    template: `${siteConfig.name} - The only classroom companion you'll ever need`,
  },
  description: siteConfig.description,
  manifest: "/manifest.json",
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "black" }],
  keywords: [
    "Classroom management",
    "Education technology",
    "Learning platform",
    "AI-powered learning",
    "Collaborative learning",
    "Student engagement",
    "Assignment management",
    "Online education",
    "Interactive classrooms",
    "Organizational tools",
    "Digital learning",
    "Student-teacher interaction",
    "Virtual classrooms",
    "Educational innovation",
    "Academic productivity",
  ],
  authors: [
    {
      name: "Sukrit Saha",
      url: "https://github.com/Sukrittt",
    },
  ],
  creator: "Sukrittt",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@SukritSaha11",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<LoadingScreen fullHeight />}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
