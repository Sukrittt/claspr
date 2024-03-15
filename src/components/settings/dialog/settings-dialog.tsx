"use client";
import { Settings } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Support } from "@/components/settings/support";
import { Appearance } from "@/components/settings/appearance";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const SettingsDialog = ({ sessionId }: { sessionId: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="flex cursor-pointer items-center gap-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 text-muted-foreground transition rounded-md py-1 px-2">
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
              <p className="text-[15px] font-semibold tracking-tight text-neutral-800 dark:text-foreground">
                My settings
              </p>
              <Separator />
            </div>
            <Appearance />
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-[15px] font-semibold tracking-tight text-neutral-800 dark:text-foreground">
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
