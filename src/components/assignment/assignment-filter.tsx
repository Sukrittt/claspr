import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/components/ui/skeleton";
import { ExtendedAssignmentDetails } from "@/types";
import { useQueryChange } from "@/hooks/use-query-change";

interface AssignmentFilterProps {
  assignment: ExtendedAssignmentDetails;
}

export const AssignmentFilter: React.FC<AssignmentFilterProps> = ({
  assignment,
}) => {
  const params = useSearchParams();

  const mounted = useMounted();

  const handleQueryChange = useQueryChange();

  return (
    <Select
      defaultValue={params?.get("status") ?? "pending"}
      onValueChange={(val) => {
        const initialUrl = `/c/${assignment.classRoomId}/a/${assignment.id}`;

        handleQueryChange(initialUrl, { status: val });
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
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="evaluated">Evaluated</SelectItem>
        <SelectItem value="changes-requested">Changes Requested</SelectItem>
        <SelectItem value="not-submitted">Not Submitted</SelectItem>
      </SelectContent>
    </Select>
  );
};
