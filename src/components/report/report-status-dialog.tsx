"use client";
import { useState } from "react";
import { ReportStatus } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReportStatusForm } from "./report-status-form";

type ReportStatusDialogProps = {
  reportId: string;
  reportStatus: ReportStatus | null;
  children: React.ReactNode;
};

export const ReportStatusDialog = ({
  reportStatus,
  children,
  reportId,
}: ReportStatusDialogProps) => {
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-0.5">
          <DialogTitle className="text-base">Update report status</DialogTitle>
          <DialogDescription>Update the status of the report</DialogDescription>
        </DialogHeader>

        <ReportStatusForm
          closeModal={closeModal}
          reportStatus={reportStatus}
          reportId={reportId}
        />
      </DialogContent>
    </Dialog>
  );
};
