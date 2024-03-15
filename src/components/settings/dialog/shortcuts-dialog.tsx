"use client";
import { useState } from "react";
import { Zap } from "lucide-react";

import { shortcuts } from "@/config/shortcuts";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const ShortcutsDialog = () => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <p className="flex cursor-pointer items-center gap-x-2 hover:bg-neutral-100 text-muted-foreground transition rounded-md py-1 px-2">
          <Zap className="h-3.5 w-3.5" />
          <span className="tracking-tight font-medium text-[13px]">
            Shortcuts
          </span>
        </p>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <div className="flex flex-col gap-y-6">
          <ScrollArea className="h-[50vh]">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {shortcuts.map((shortcut, index) => (
                <div className="space-y-4" key={index}>
                  <div className="space-y-2">
                    <p className="text-[15px] font-semibold tracking-tight text-neutral-800">
                      {shortcut.label}
                    </p>
                    <Separator />
                  </div>

                  {shortcut.shortcuts.map((item, i) => (
                    <div key={i} className="flex flex-col gap-y-2">
                      <p className="text-sm">{item.description}</p>
                      <kbd className="font-semibold text-sm">{item.keys}</kbd>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
