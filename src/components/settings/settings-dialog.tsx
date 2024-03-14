"use client";
import { useState } from "react";
import { Settings } from "lucide-react";

import { Support } from "./support";
import { Appearance } from "./appearance";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const SettingsDialog = ({ sessionId }: { sessionId: string }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <p className="flex cursor-pointer items-center gap-x-2 hover:bg-neutral-100 text-muted-foreground transition rounded-md py-1 px-2">
          <Settings className="h-3.5 w-3.5" />
          <span className="tracking-tight font-medium text-[13px]">
            Settings
          </span>
        </p>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <div className="flex flex-col gap-y-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-[15px] font-semibold tracking-tight text-neutral-800">
                My settings
              </p>
              <Separator />
            </div>
            <Appearance />
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-[15px] font-semibold tracking-tight text-neutral-800">
                Support
              </p>
              <Separator />
            </div>
            <Support sessionId={sessionId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
