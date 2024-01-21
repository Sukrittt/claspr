"use client";
import { useState } from "react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { Loader, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserDropdown = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    signOut({
      callbackUrl: `${window.location.origin}`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isLoggingOut ? (
          <div className="py-2">
            <Loader className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          children
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="flex items-center justify-start gap-2 p-2 text-sm">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="h-5 w-5 mr-2" /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
