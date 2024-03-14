import { toast } from "sonner";
import { useAtom } from "jotai";
import { ReportStatus } from "@prisma/client";

import { trpc } from "@/trpc/client";
import { activeReportStatusAtom } from "@/atoms";

export const useReports = (reportStatus: ReportStatus) => {
  return trpc.report.getReports.useQuery({ reportStatus });
};

export const useReportIssue = ({ cleanUp }: { cleanUp: () => void }) => {
  return trpc.report.reportIssue.useMutation({
    onSuccess: () => {
      toast.success("Your report has been submitted successfully.");
      cleanUp();
    },
  });
};

export const useEditReport = ({ closeModal }: { closeModal: () => void }) => {
  const utils = trpc.useUtils();
  const [activeReportStatus] = useAtom(activeReportStatusAtom);

  return trpc.report.updateReport.useMutation({
    onMutate: async ({ reportId, reportStatus }) => {
      closeModal();

      await utils.report.getReports.cancel({
        reportStatus: activeReportStatus ?? "PENDING",
      });

      const prevReports = utils.report.getReports.getData();

      utils.report.getReports.setData(
        { reportStatus: activeReportStatus ?? "PENDING" },
        (prev) =>
          prev?.map((report) =>
            report.id === reportId
              ? {
                  ...report,
                  reportStatus,
                }
              : report
          )
      );

      return { prevReports };
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      utils.report.getReports.setData(
        { reportStatus: activeReportStatus ?? "PENDING" },
        ctx?.prevReports
      );
    },
    onSettled: () => {
      utils.report.getReports.invalidate({
        reportStatus: activeReportStatus ?? "PENDING",
      });
    },
  });
};

export const useRemoveReport = ({ closeModal }: { closeModal: () => void }) => {
  const utils = trpc.useUtils();
  const [activeReportStatus] = useAtom(activeReportStatusAtom);

  return trpc.report.removeReport.useMutation({
    onMutate: async ({ reportId }) => {
      closeModal();

      await utils.report.getReports.cancel({
        reportStatus: activeReportStatus ?? "PENDING",
      });

      const prevReports = utils.report.getReports.getData();

      utils.report.getReports.setData(
        { reportStatus: activeReportStatus ?? "PENDING" },
        (prev) => prev?.filter((report) => report.id !== reportId)
      );

      return { prevReports };
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      utils.report.getReports.setData(
        { reportStatus: activeReportStatus ?? "PENDING" },
        ctx?.prevReports
      );
    },
    onSettled: () => {
      utils.report.getReports.invalidate({
        reportStatus: activeReportStatus ?? "PENDING",
      });
    },
  });
};
