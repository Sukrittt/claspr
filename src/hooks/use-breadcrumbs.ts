import { useAtom } from "jotai";

import { breadcrumbsAtom } from "@/atoms";
import { Breadcrumb } from "@/types/breadcrumb";

export const useBreadCrumbs = () => {
  const [breadcrumbs, setBreadcrumbs] = useAtom(breadcrumbsAtom);

  const handleAddBreadcrumb = (newBreadCrumb: Breadcrumb[]) => {
    setBreadcrumbs(() => {
      const dashboardBreadCrumb = {
        label: "Dashboard",
        href: "/dashboard",
      };

      return [dashboardBreadCrumb, ...newBreadCrumb];
    });
  };

  const handleChangeBreadcrumb = (visitedBreadcrumb: Breadcrumb) => {
    setBreadcrumbs((prev) => {
      const index = prev.findIndex(
        (breadcrumb) => breadcrumb.href === visitedBreadcrumb.href
      );

      if (index === -1) {
        return prev;
      }

      return prev.slice(0, index + 1);
    });
  };

  return { breadcrumbs, handleAddBreadcrumb, handleChangeBreadcrumb };
};
