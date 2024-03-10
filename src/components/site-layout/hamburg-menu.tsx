"use client";

import Link from "next/link";
import { useAtom } from "jotai";
import { Session } from "next-auth";
import { UserType } from "@prisma/client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CopyMinus, Menu } from "lucide-react";

import { Logout } from "./logout";
import { trpc } from "@/trpc/client";
import { otherItems } from "@/config/menu";
import { getShortenedText } from "@/lib/utils";
import { UserAvatar } from "@/components/custom/user-avatar";
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

interface HamburgMenuProps {
  role: UserType;
  session: Session;
}

export const HamburgMenu: React.FC<HamburgMenuProps> = ({ role, session }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const [, setCloseAllCreationToggle] = useAtom(isCloseAllCreationToggle);
  const [, setCloseAllMembershipToggle] = useAtom(isCloseAllMembershipToggle);

  const [sectionsForCreatedClassrooms, setCreatedClassSections] =
    useAtom(createdClassSections);
  const [sectionsForJoinedClassrooms, setJoinedClassSections] =
    useAtom(joinedClassSections);

  const { data: sectionsForCreatedClassroomsData } =
    trpc.section.getSectionsForCreatedClassrooms.useQuery({ role });

  const { data: sectionsForJoinedClassroomsData } =
    trpc.section.getSectionsForJoinedClassrooms.useQuery();

  useEffect(() => {
    if (sectionsForCreatedClassroomsData) {
      setCreatedClassSections(sectionsForCreatedClassroomsData);
    }
  }, [sectionsForCreatedClassroomsData]);

  useEffect(() => {
    if (sectionsForJoinedClassroomsData) {
      setJoinedClassSections(sectionsForJoinedClassroomsData);
    }
  }, [sectionsForJoinedClassroomsData]);

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
        <div className="pt-0 flex items-center gap-x-2">
          <UserAvatar user={session.user} className="h-6 w-6" />

          <div className="text-[13px] tracking-tight">
            <p>{getShortenedText(session.user?.name ?? "", 25)}</p>
            <p className="text-muted-foreground">
              {getShortenedText(session.user?.email ?? "", 25)}
            </p>
          </div>
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
            <div className="overflow-y-auto no-scrollbar max-h-[30vh]">
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

          <div className="overflow-y-auto no-scrollbar max-h-[30vh]">
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
