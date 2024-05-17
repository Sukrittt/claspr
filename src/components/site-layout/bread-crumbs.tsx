"use client";
import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadCrumbs } from "@/hooks/use-breadcrumbs";

export const BreadCrumbs = () => {
  const pathname = usePathname();
  const { breadcrumbs, handleChangeBreadcrumb } = useBreadCrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList className="hidden md:flex">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLastPath = index === breadcrumbs.length - 1;

          return (
            <Fragment key={breadcrumb.href}>
              <BreadcrumbItem>
                {pathname === breadcrumb.href ? (
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      onClick={() =>
                        handleChangeBreadcrumb({
                          href: breadcrumb.href,
                          label: breadcrumb.label,
                        })
                      }
                      href={breadcrumb.href}
                    >
                      {breadcrumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLastPath && (
                <BreadcrumbSeparator>
                  <span className="text-xs">/</span>
                </BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
