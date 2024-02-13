"use client";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { CopyMinus } from "lucide-react";

import { trpc } from "@/trpc/client";
import { CreateSectionDialog } from "./create-section-dialog";
import {
  createdClassSections,
  isCloseAllMembershipToggle,
  isCloseAllCreationToggle,
  joinedClassSections,
} from "@/atoms";
import { MembershipContext } from "./membership-context";
import { CreatedClassContext } from "./created-class-context";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { SectionSkeleton } from "@/components/skeletons/section-skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TeacherSection = () => {
  const [, setCloseAllCreationToggle] = useAtom(isCloseAllCreationToggle);
  const [, setCloseAllMembershipToggle] = useAtom(isCloseAllMembershipToggle);

  const [sectionsForCreatedClassrooms, setCreatedClassSections] =
    useAtom(createdClassSections);
  const [sectionsForJoinedClassrooms, setJoinedClassSections] =
    useAtom(joinedClassSections);

  const {
    data: sectionsForCreatedClassroomsData,
    isLoading: isFetchingFirstSection,
    isFetching: isFetchingFirstSectionRefetch,
  } = trpc.section.getSectionsForCreatedClassrooms.useQuery();

  const {
    data: sectionsForJoinedClassroomsData,
    isLoading: isFetchingSecondSection,
    isFetching: isFetchingSecondSectionRefetch,
  } = trpc.section.getSectionsForJoinedClassrooms.useQuery();

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

  return (
    <div className="flex flex-col gap-y-4">
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-semibold text-gray-800">Your Sections</h1>
            <p className="text-muted-foreground text-sm">
              Sections containing created classrooms
            </p>
          </div>
          <div className="flex items-center">
            <CustomTooltip text="Collapse All">
              <div
                className="p-2 rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200"
                onClick={() => setCloseAllCreationToggle((prev) => !!!prev)}
              >
                <CopyMinus className="w-4 h-4" />
              </div>
            </CustomTooltip>
            <CreateSectionDialog sectionType="CREATION" />
          </div>
        </div>
        <ScrollArea className="h-[30vh]">
          <div className="flex flex-col gap-y-2">
            {isFetchingFirstSection || isFetchingFirstSectionRefetch ? (
              <SectionSkeleton />
            ) : !sectionsForCreatedClassrooms ||
              sectionsForCreatedClassrooms.length === 0 ? (
              <p>No results</p>
            ) : (
              <CreatedClassContext />
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-semibold text-gray-800">Your Sections</h1>
            <p className="text-muted-foreground text-sm">
              Sections containing joined classrooms
            </p>
          </div>
          <div className="flex items-center">
            <CustomTooltip text="Collapse All">
              <div
                className="p-2 rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200"
                onClick={() => setCloseAllMembershipToggle((prev) => !!!prev)}
              >
                <CopyMinus className="w-4 h-4" />
              </div>
            </CustomTooltip>
            <CreateSectionDialog sectionType="MEMBERSHIP" />
          </div>
        </div>
        <ScrollArea className="h-[30vh]">
          <div className="flex flex-col gap-y-2">
            {isFetchingSecondSection || isFetchingSecondSectionRefetch ? (
              <SectionSkeleton />
            ) : !sectionsForJoinedClassrooms ||
              sectionsForJoinedClassrooms.length === 0 ? (
              <p>No results</p>
            ) : (
              <MembershipContext />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
