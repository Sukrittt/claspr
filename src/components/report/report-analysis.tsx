"use client";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ReportStatus, ReportType } from "@prisma/client";
import { Bug, ClipboardX, Lightbulb, PersonStanding } from "lucide-react";

import { useReports } from "@/hooks/report";
import { ContainerVariants } from "@/lib/motion";
import { cn, getShortenedText } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReportStatusFilter } from "./report-status-filter";
import { ReportStatusDialog } from "./report-status-dialog";
import { UserAvatar } from "@/components/custom/user-avatar";
import { DeleteReportDialog } from "./report-delete-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { ReportSkeleton } from "@/components/skeletons/report-skeleton";

export const ReportAnalysis = () => {
  const params = useSearchParams();
  const activeStatus = params.get("report-status") as ReportStatus;

  const { data: reports, isLoading } = useReports(activeStatus ?? "PENDING");

  const getReportStatus = (status: ReportStatus | null) => {
    const statusClasses =
      "text-muted-foreground text-xs tracking-tight cursor-pointer";

    switch (status) {
      case ReportStatus.PENDING:
        return (
          <p
            className={cn(
              statusClasses,
              "text-yellow-600 hover:text-yellow-700 transition"
            )}
          >
            Pending
          </p>
        );
      case ReportStatus.RESOLVED:
        return (
          <p
            className={cn(
              statusClasses,
              "text-green-600 hover:text-green-700 transition"
            )}
          >
            Resolved
          </p>
        );
      case ReportStatus.REJECTED:
        return (
          <p
            className={cn(
              statusClasses,
              "text-destructive hover:text-destructive/80 transition"
            )}
          >
            Rejected
          </p>
        );
    }
  };

  const reportTypeIcon = {
    [ReportType.BUG_REPORT]: (
      <CustomTooltip text="Bug Report">
        <Bug className="h-4 w-4 text-muted-foreground cursor-pointer" />
      </CustomTooltip>
    ),
    [ReportType.FEATURE_REQUEST]: (
      <CustomTooltip text="Feature Request">
        <Lightbulb className="h-4 w-4 text-muted-foreground cursor-pointer" />
      </CustomTooltip>
    ),
    [ReportType.GENERAL]: (
      <CustomTooltip text="General">
        <PersonStanding className="h-4 w-4 text-muted-foreground cursor-pointer" />
      </CustomTooltip>
    ),
  };

  return (
    <div className="space-y-4 py-8 px-10 h-screen max-w-5xl mx-auto">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="font-extrabold text-2xl text-neutral-800">
            Report Analysis
          </h1>
          <p className="text-muted-foreground tracking-tight">
            Analyze the reports submitted by the users.
          </p>
        </div>

        <ReportStatusFilter />
      </div>

      <Separator />

      <ScrollArea className="h-[70vh]">
        {isLoading ? (
          <ReportSkeleton />
        ) : !reports || reports.length === 0 ? (
          <div className="h-[70vh] flex flex-col items-center justify-center gap-y-2">
            <ClipboardX className="h-10 w-10 text-neutral-800" />
            <p className="text-sm text-muted-foreground">
              Nothing to show here.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              variants={ContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-y-4"
            >
              {reports.map((report, index) => (
                <div
                  key={index}
                  className="border rounded-md py-3 px-4 relative"
                >
                  <div className="absolute top-2 right-4">
                    {reportTypeIcon[report.reportType]}
                  </div>

                  <div className="flex flex-col gap-y-2.5">
                    <div className="flex gap-x-2">
                      <UserAvatar user={report.user} className="h-5 w-5" />

                      <p className="tracking-tight font-medium text-neutral-800 text-sm">
                        {report.body}
                      </p>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="flex items-center gap-x-2 text-muted-foreground text-[13px] tracking-tight">
                        <p>{getShortenedText(report.user?.name ?? "", 30)}</p>

                        <Separator orientation="vertical" className="h-4" />

                        <p>{getShortenedText(report.user?.email ?? "", 40)}</p>
                      </div>

                      <div className="flex items-center gap-x-2">
                        <DeleteReportDialog reportId={report.id} />

                        <Separator orientation="vertical" className="h-4" />

                        <ReportStatusDialog
                          reportId={report.id}
                          reportStatus={report.reportStatus}
                        >
                          {getReportStatus(report.reportStatus)}
                        </ReportStatusDialog>

                        <Separator orientation="vertical" className="h-4" />

                        <p className="text-muted-foreground text-xs tracking-tight">
                          {format(report.createdAt, "do MMM, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </ScrollArea>
    </div>
  );
};
