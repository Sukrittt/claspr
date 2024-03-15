"use client";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

type Theme = "light" | "dark" | "system";

export const ToastProvider = () => {
  const { theme } = useTheme();

  const getToastBackground = () => {
    switch (theme) {
      case "dark":
      case "system":
        return "#262626";
      default:
        break;
    }
  };

  return (
    <Toaster
      toastOptions={{
        style: {
          background: getToastBackground(),
        },
      }}
      theme={theme as Theme}
      loadingIcon={<Loader2 className="h-3 w-3 animate-spin mt-1" />}
    />
  );
};
