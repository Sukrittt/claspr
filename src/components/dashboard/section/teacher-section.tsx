"use client";
import { useAtom } from "jotai";
import { CopyMinus } from "lucide-react";

import { CreateSectionDialog } from "./dialog/create-section-dialog";
import {
  createdClassSections,
  isCloseAllMembershipToggle,
  isCloseAllCreationToggle,
  joinedClassSections,
} from "@/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MembershipContext } from "./membership-context";
import { CreatedClassContext } from "./created-class-context";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionSkeleton } from "@/components/skeletons/section-skeleton";

export const TeacherSection = () => {
  const [, setCloseAllCreationToggle] = useAtom(isCloseAllCreationToggle);
  const [, setCloseAllMembershipToggle] = useAtom(isCloseAllMembershipToggle);

  const [sectionsForCreatedClassrooms] = useAtom(createdClassSections);
  const [sectionsForJoinedClassrooms] = useAtom(joinedClassSections);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <Card className="space-y-4">
        <CardHeader className="border-b py-2.5 space-y-0.5">
          <div className="flex flex-col gap-y-2 sm:gap-y-0 sm:flex-row sm:justify-between sm:items-end">
            <div>
              <CardTitle className="text-base font-semibold">
                Your Sections
              </CardTitle>
              <CardDescription className="text-muted-foreground text-[13px]">
                Sections containing created classrooms
              </CardDescription>
            </div>
            <div className="flex justify-end items-center gap-x-2">
              <CustomTooltip text="Collapse All">
                <div
                  className="p-1 rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                  onClick={() => setCloseAllCreationToggle((prev) => !!!prev)}
                >
                  <CopyMinus className="w-3.5 h-3.5" />
                </div>
              </CustomTooltip>
              <CreateSectionDialog sectionType="CREATION" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-0 px-3">
          <ScrollArea className="h-[70vh]">
            <div className="flex flex-col gap-y-2">
              {!sectionsForCreatedClassrooms ||
              sectionsForCreatedClassrooms.length === 0 ? (
                <SectionSkeleton />
              ) : (
                <CreatedClassContext />
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="space-y-4">
        <CardHeader className="border-b py-2.5 space-y-0.5">
          <div className="flex flex-col gap-y-2 sm:gap-y-0 sm:flex-row sm:justify-between sm:items-end">
            <div>
              <CardTitle className="text-base font-semibold">
                Your Sections
              </CardTitle>
              <CardDescription className="text-muted-foreground text-[13px]">
                Sections containing joined classrooms
              </CardDescription>
            </div>
            <div className="flex justify-end items-center gap-x-2">
              <CustomTooltip text="Collapse All">
                <div
                  className="p-1 rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                  onClick={() => setCloseAllMembershipToggle((prev) => !!!prev)}
                >
                  <CopyMinus className="w-3.5 h-3.5" />
                </div>
              </CustomTooltip>
              <CreateSectionDialog sectionType="MEMBERSHIP" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-0 px-3">
          <ScrollArea className="h-[70vh]">
            <div className="flex flex-col gap-y-2">
              {!sectionsForJoinedClassrooms ||
              sectionsForJoinedClassrooms.length === 0 ? (
                <SectionSkeleton />
              ) : (
                <MembershipContext />
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
