"use client";

import Link from "next/link";
import { useAtom } from "jotai";
import { UserType } from "@prisma/client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CopyMinus, Menu } from "lucide-react";

import { Logout } from "./logout";
import { menuItems, otherItems } from "@/config/menu";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { SectionSkeleton } from "@/components/skeletons/section-skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MembershipContext } from "@/components/dashboard/section/membership-context";
import { CreatedClassContext } from "@/components/dashboard/section/created-class-context";
import { CreateSectionDialog } from "@/components/dashboard/section/dialog/create-section-dialog";
import {
  createdClassSections,
  isCloseAllCreationToggle,
  isCloseAllMembershipToggle,
  joinedClassSections,
} from "@/atoms";

export const MobileSidebar = ({ role }: { role: UserType }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const [, setCloseAllCreationToggle] = useAtom(isCloseAllCreationToggle);
  const [, setCloseAllMembershipToggle] = useAtom(isCloseAllMembershipToggle);

  const [sectionsForCreatedClassrooms] = useAtom(createdClassSections);
  const [sectionsForJoinedClassrooms] = useAtom(joinedClassSections);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "\\" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div>
          <CustomTooltip text="Ctrl + \">
            <div className="text-neutral-700 hover:bg-neutral-200 cursor-pointer p-1 rounded-md transition">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle Menu</span>
            </div>
          </CustomTooltip>
        </div>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col gap-y-4 pl-3 w-[250px] md:w-[300px]"
      >
        <div className="grid grid-cols-2 gap-2 pt-6">
          {menuItems.map((item, index) => (
            <CustomTooltip key={index} text={item.label}>
              <Link
                href={item.href}
                className="flex items-center justify-center h-8 border hover:bg-neutral-100 transition rounded-md"
              >
                <item.icon className="h-4 w-4 text-neutral-700" />
                <p className="sr-only">{item.label}</p>
              </Link>
            </CustomTooltip>
          ))}
        </div>

        {role === "TEACHER" && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-tighter font-semibold text-neutral-700">
                Your Sections
              </p>
              <div className="flex items-center gap-x-2">
                <CustomTooltip text="Collapse All">
                  <div
                    className="p-1 rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200"
                    onClick={() => setCloseAllCreationToggle((prev) => !!!prev)}
                  >
                    <CopyMinus className="w-3.5 h-3.5" />
                  </div>
                </CustomTooltip>
                <CreateSectionDialog sectionType="CREATION" />
              </div>
            </div>
            <div className="overflow-y-auto no-scrollbar max-h-[40vh]">
              <div className="flex flex-col gap-y-2">
                {!sectionsForCreatedClassrooms ||
                sectionsForCreatedClassrooms.length == 0 ? (
                  <SectionSkeleton />
                ) : (
                  <CreatedClassContext isMenu />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-tighter font-semibold text-neutral-700">
              Your Sections
            </p>
            <div className="flex items-center gap-x-2">
              <CustomTooltip text="Collapse All">
                <div
                  className="p-1 rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200"
                  onClick={() => setCloseAllMembershipToggle((prev) => !!!prev)}
                >
                  <CopyMinus className="w-3.5 h-3.5" />
                </div>
              </CustomTooltip>
              <CreateSectionDialog sectionType="MEMBERSHIP" />
            </div>
          </div>

          <div className="overflow-y-auto no-scrollbar max-h-[40vh]">
            <div className="flex flex-col gap-y-2">
              {!sectionsForJoinedClassrooms ||
              sectionsForJoinedClassrooms.length == 0 ? (
                <SectionSkeleton />
              ) : (
                <MembershipContext isMenu />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-6">
          {otherItems.map((item, index) => (
            <Link
              href={item.href}
              key={index}
              className="flex items-center gap-x-2 hover:bg-neutral-100 text-muted-foreground transition rounded-md py-1 px-2"
            >
              <item.icon className="h-3.5 w-3.5" />
              <p className="tracking-tight font-medium text-[13px]">
                {item.label}
              </p>
            </Link>
          ))}

          <Logout />
        </div>
      </SheetContent>
    </Sheet>
  );
};
