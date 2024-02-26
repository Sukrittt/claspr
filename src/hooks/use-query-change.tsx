import qs from "query-string";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useQueryChange() {
  const router = useRouter();
  const params = useSearchParams();

  const handleQueryChange = useCallback(
    (initialUrl: string, query: any) => {
      let currentQuery = {};

      if (params) {
        currentQuery = qs.parse(params.toString());
      }

      const updatedQuery: any = {
        ...currentQuery,
        ...query,
      };

      const url = qs.stringifyUrl(
        {
          url: initialUrl,
          query: updatedQuery,
        },
        { skipNull: true }
      );

      router.replace(url);
    },
    [params]
  );

  return handleQueryChange;
}
