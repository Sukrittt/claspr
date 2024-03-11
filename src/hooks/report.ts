import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const useReports = () => {
  return trpc.report.getReports.useQuery();
};

export const useReportIssue = ({ cleanUp }: { cleanUp: () => void }) => {
  return trpc.report.reportIssue.useMutation({
    onSuccess: () => {
      toast.success("Your report has been submitted successfully.");
      cleanUp();
    },
  });
};
