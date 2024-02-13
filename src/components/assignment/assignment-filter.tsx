import qs from "query-string";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isChangingQueryAtom } from "@/atoms";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/components/ui/skeleton";
import { ExtendedAssignmentDetails } from "@/types";

interface AssignmentFilterProps {
  assignment: ExtendedAssignmentDetails;
}

export const AssignmentFilter: React.FC<AssignmentFilterProps> = ({
  assignment,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const [, setIsChangingQuery] = useAtom(isChangingQueryAtom);

  const mounted = useMounted();

  useEffect(() => {
    setIsChangingQuery(false);
  }, [params]);

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
      onValueChange={(val) => {
        setIsChangingQuery(true);
        handleQueryChange(val);
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
