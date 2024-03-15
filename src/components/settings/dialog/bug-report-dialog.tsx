"use client";
import { useState } from "react";
import { Bug } from "lucide-react";
import { Session } from "next-auth";

import { ReportForm } from "@/components/report/report-form";
import { ReportAnalysis } from "@/components/report/report-analysis";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;

export const BugReportDialog = ({ session }: { session: Session }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <p className="flex cursor-pointer items-center gap-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 text-muted-foreground transition rounded-md py-1 px-2">
          <Bug className="h-3.5 w-3.5" />
          <span className="tracking-tight font-medium text-[13px]">Report</span>
        </p>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        {session.user.email === ADMIN_EMAIL ? (
          <ReportAnalysis />
        ) : (
          <ReportForm closeModal={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};
