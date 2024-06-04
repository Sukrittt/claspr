"use client";
import { useState } from "react";
import superjson from "superjson";
import { toast } from "sonner";
import { Provider as JotaiProvider } from "jotai";
import { httpBatchLink } from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { trpc } from "@/trpc/client";
import { ToastProvider } from "./toast-provider";
import { ThemeProvider } from "./theme-providers";

interface IError {
  code: string;
  message: string;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: (error) => {
              const { message } = error as IError;

              toast.error(message);
            },
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/trpc`,
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <>
              <ToastProvider />
              {children}
            </>
          </ThemeProvider>
        </JotaiProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
