"use client";
import { useEffect } from "react";

import { Breadcrumb } from "@/types/breadcrumb";
import { useMounted } from "@/hooks/use-mounted";
import { useBreadCrumbs } from "@/hooks/use-breadcrumbs";

interface BreadcrumbProviderProps {
  children: React.ReactNode;
  breadcrumbs: Breadcrumb[];
}

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({
  breadcrumbs,
  children,
}) => {
  const mounted = useMounted();
  const { handleAddBreadcrumb } = useBreadCrumbs();

  useEffect(() => {
    if (!mounted) return;

    handleAddBreadcrumb([...breadcrumbs]);
  }, [mounted, breadcrumbs]);

  return <>{children}</>;
};
