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
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/components/ui/skeleton";

export const ClassroomSorting = ({ classroomId }: { classroomId: string }) => {
  const router = useRouter();
  const mounted = useMounted();
  const params = useSearchParams();

  const handleQueryChange = useCallback(
    (value: string) => {
      let currentQuery = {};

      if (params) {
        currentQuery = qs.parse(params.toString());
      }

      const updatedQuery: any = {
        ...currentQuery,
        filter: value,
      };

      const url = qs.stringifyUrl(
        {
          url: `/c/${classroomId}`,
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
      defaultValue={params?.get("filter") ?? "date-created"}
      onValueChange={handleQueryChange}
    >
      <SelectTrigger className="w-[220px] font-medium text-[12px]">
        {mounted ? (
          <div className="flex items-center gap-x-1">
            <span className="text-muted-foreground font-semibold">
              Sort by:{" "}
            </span>
            <SelectValue placeholder="Sort by" />
          </div>
        ) : (
          <Skeleton className="h-4 w-3/4" />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date-created">Date created</SelectItem>
        <SelectItem value="past-day">Top: Past day</SelectItem>
        <SelectItem value="past-week">Top: Past week</SelectItem>
        <SelectItem value="past-month">Top: Past month</SelectItem>
        <SelectItem value="past-year">Top: Past year</SelectItem>
      </SelectContent>
    </Select>
  );
};
