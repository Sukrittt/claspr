"use client";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { CopyMinus, MonitorX } from "lucide-react";

import { trpc } from "@/trpc/client";
import { CreateSectionDialog } from "./create-section-dialog";
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
    <div className="grid grid-cols-2 gap-4">
      <Card className="space-y-4">
        <CardHeader className="border-b py-2.5 space-y-0.5">
          <div className="flex justify-between items-end">
            <div>
              <CardTitle className="text-base font-semibold text-gray-800">
                Your Sections
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Sections containing created classrooms
              </CardDescription>
            </div>
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
        </CardHeader>
        <CardContent className="mt-0 px-3">
          <ScrollArea className="h-[30vh]">
            <div className="flex flex-col gap-y-2">
              {isFetchingFirstSection || isFetchingFirstSectionRefetch ? (
                <SectionSkeleton />
              ) : !sectionsForCreatedClassrooms ||
                sectionsForCreatedClassrooms.length === 0 ? (
                <div className="pt-12 flex flex-col items-center justify-center gap-y-2">
                  <MonitorX className="h-10 w-10 text-neutral-800" />
                  <div className="space-y-1 text-center">
                    <p className="text-sm text-muted-foreground">
                      You shouldn&rsquo;t be seeing this.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We are working on fixing your issue.
                    </p>
                  </div>
                </div>
              ) : (
                <CreatedClassContext />
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="space-y-4">
        <CardHeader className="border-b py-2.5 space-y-0.5">
          <div className="flex justify-between items-end">
            <div>
              <CardTitle className="text-base font-semibold text-gray-800">
                Your Sections
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Sections containing joined classrooms
              </CardDescription>
            </div>
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
        </CardHeader>
        <CardContent className="mt-0 px-3">
          <ScrollArea className="h-[30vh]">
            <div className="flex flex-col gap-y-2">
              {isFetchingSecondSection || isFetchingSecondSectionRefetch ? (
                <SectionSkeleton />
              ) : !sectionsForJoinedClassrooms ||
                sectionsForJoinedClassrooms.length === 0 ? (
                <div className="pt-12 flex flex-col items-center justify-center gap-y-2">
                  <MonitorX className="h-10 w-10 text-neutral-800" />
                  <div className="space-y-1 text-center">
                    <p className="text-sm text-muted-foreground">
                      You shouldn&rsquo;t be seeing this.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We are working on fixing your issue.
                    </p>
                  </div>
                </div>
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
