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
import { assignmentStatusAtom } from "@/atoms";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/components/ui/skeleton";
import { ExtendedAssignmentDetails } from "@/types";
import { useQueryChange } from "@/hooks/use-query-change";

interface AssignmentFilterProps {
  assignment: ExtendedAssignmentDetails;
}

const statuses = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Evaluated",
    value: "evaluated",
  },
  {
    label: "Changes Requested",
    value: "changes-requested",
  },
  {
    label: "Not Submitted",
    value: "not-submitted",
  },
] as const;

export type AssignmentStatus = (typeof statuses)[number]["value"];

export const AssignmentFilter: React.FC<AssignmentFilterProps> = ({
  assignment,
}) => {
  const [, setAssignmentStatus] = useAtom(assignmentStatusAtom);

  const mounted = useMounted();
  const params = useSearchParams();

  const handleQueryChange = useQueryChange();
  const activeStatus = params.get("status") as AssignmentStatus;

  function isValidStatus(status: string) {
    if (!status) return true;

    return statuses.some((s) => s.value === status);
  }

  useEffect(() => {
    if (activeStatus) return;

    const initialUrl = `/c/${assignment.classRoomId}/a/${assignment.id}`;

    handleQueryChange(initialUrl, {
      status: "pending",
    });
  }, [activeStatus]);

  if (!isValidStatus(activeStatus)) {
    notFound();
  }

  return (
    <Select
      defaultValue={activeStatus ?? "pending"}
      onValueChange={(val) => {
        const initialUrl = `/c/${assignment.classRoomId}/a/${assignment.id}`;

        handleQueryChange(initialUrl, { status: val });
        setAssignmentStatus(val as AssignmentStatus);
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
