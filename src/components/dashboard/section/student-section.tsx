"use client";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { CopyMinus } from "lucide-react";

import { trpc } from "@/trpc/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MembershipContext } from "./membership-context";
import { CreateSectionDialog } from "./create-section-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isCloseAllMembershipToggle, joinedClassSections } from "@/atoms";
import { SectionSkeleton } from "@/components/skeletons/section-skeleton";

export const StudentSection = () => {
  const [, setCloseAllMembershipToggle] = useAtom(isCloseAllMembershipToggle);

  const [sectionsForJoinedClassrooms, setJoinedClassSections] =
    useAtom(joinedClassSections);

  const {
    data: sectionsForJoinedClassroomsData,
    isLoading: isFetchingSecondSection,
    isFetching: isFetchingSecondSectionRefetch,
  } = trpc.section.getSectionsForJoinedClassrooms.useQuery();

  useEffect(() => {
    if (sectionsForJoinedClassroomsData) {
      setJoinedClassSections(sectionsForJoinedClassroomsData);
    }
  }, [sectionsForJoinedClassroomsData]);

  return (
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
          <div className="flex items-center gap-x-2 pr-4">
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
              <p>No results</p>
            ) : (
              <MembershipContext />
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
