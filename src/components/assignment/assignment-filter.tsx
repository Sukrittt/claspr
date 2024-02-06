import qs from "query-string";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtendedAssignment } from "@/types";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/components/ui/skeleton";

interface AssignmentFilterProps {
  assignment: ExtendedAssignment;
}

export const AssignmentFilter: React.FC<AssignmentFilterProps> = ({
  assignment,
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const mounted = useMounted();

  const handleQueryChange = useCallback(
    (value: string) => {
      let currentQuery = {};

      if (params) {
        currentQuery = qs.parse(params.toString());
      }

      const updatedQuery: any = {
        ...currentQuery,
        status: value,
      };

      const url = qs.stringifyUrl(
        {
          url: `/c/${assignment.classRoomId}/a/${assignment.id}`,
          query: updatedQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [params]
  );

  return (
    <Select
      defaultValue={params?.get("status") ?? "pending"}
      onValueChange={handleQueryChange}
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