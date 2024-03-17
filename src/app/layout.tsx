import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./styles/globals.css";

import { Providers } from "@/components/providers/providers";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scribe.",
  description: "The only classroom companion you will ever need.",
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
