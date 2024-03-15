import { useAtom } from "jotai";
import { useEffect } from "react";
import { notFound, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { activeReportStatusAtom } from "@/atoms";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryChange } from "@/hooks/use-query-change";

const statuses = [
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Resolved",
    value: "RESOLVED",
  },
  {
    label: "Rejected",
    value: "REJECTED",
  },
] as const;

export type ReportStatus = (typeof statuses)[number]["value"];

export const ReportStatusFilter = () => {
  const [, setReportStatus] = useAtom(activeReportStatusAtom);

  const mounted = useMounted();
  const params = useSearchParams();

  const handleQueryChange = useQueryChange();
  const activeStatus = params.get("report-status") as ReportStatus;

  function isValidStatus(status: string) {
    if (!status) return true;

    return statuses.some((s) => s.value === status);
  }

  useEffect(() => {
    if (activeStatus) return;

    const initialUrl = "/dashboard";

    handleQueryChange(initialUrl, {
      "report-status": "PENDING",
    });
  }, [activeStatus]);

  if (!isValidStatus(activeStatus)) {
    notFound();
  }

  return (
    <Select
      defaultValue={activeStatus ?? "PENDING"}
      onValueChange={(val) => {
        const initialUrl = "/dashboard";

        handleQueryChange(initialUrl, { "report-status": val });
        setReportStatus(val as ReportStatus);
      }}
    >
      <SelectTrigger className="w-[200px] font-medium text-[12px]">
        {mounted ? (
          <SelectValue placeholder="Filter assignments" />
        ) : (
          <Skeleton className="h-4 w-28" />
        )}
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status, index) => (
          <SelectItem key={index} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
