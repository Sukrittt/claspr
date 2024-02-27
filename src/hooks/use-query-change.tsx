import qs from "query-string";
import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useQueryChange() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

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

      if (pathname === initialUrl) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [params]
  );

  return handleQueryChange;
}
