"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2, LogOut as LogoutIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export const Logout = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);

    signOut({
      callbackUrl: `${window.location.origin}/sign-in`,
    });
  };

  return (
    <div
      onClick={handleLogout}
      className={cn(
        "text-xs text-muted-foreground flex items-center gap-x-2 hover:bg-neutral-100 cursor-pointer transition rounded-md py-1 px-2 font-medium",
        {
          "opacity-50 cursor-default": loading,
        }
      )}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <LogoutIcon className="h-3.5 w-3.5" />
      )}
      Logout
    </div>
  );
};
