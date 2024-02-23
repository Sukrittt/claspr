import { Toaster } from "sonner";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";

import { Providers } from "@/components/providers";

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
        <Providers>
          <Suspense>{children}</Suspense>
        </Providers>
        <Toaster
          loadingIcon={<Loader2 className="h-3 w-3 animate-spin mt-1" />}
        />
      </body>
    </html>
  );
}
