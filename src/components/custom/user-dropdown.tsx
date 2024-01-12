"use client";
import { useState, useTransition } from "react";
import { Loader, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserDropdown = ({ children }: { children: React.ReactNode }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isLoggingOut ? <Loader className="h-5 w-5 " /> : children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="p-0"
          onClick={() => setIsLoggingOut(true)}
        >
          <LogOut className="h-5 w-5 mr-2" /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
