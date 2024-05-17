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
      <BreadcrumbList>
        <BreadcrumbPage className="md:hidden">
          <Link href="/dashboard">Dashboard</Link>
        </BreadcrumbPage>

        {breadcrumbs.map((breadcrumb, index) => {
          const isLastPath = index === breadcrumbs.length - 1;

          return (
            <Fragment key={breadcrumb.href}>
              <BreadcrumbItem className="hidden md:inline-flex">
                {pathname === breadcrumb.href ? (
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="hidden md:block">
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
                <BreadcrumbSeparator className="hidden md:block">
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
