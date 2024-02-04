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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-semibold text-gray-800">Your Sections</h1>
            <p className="text-muted-foreground text-sm">
              These sections will contain the classrooms you have created.
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
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-semibold text-gray-800">Your Sections</h1>
            <p className="text-muted-foreground text-sm">
              These sections will contain the classrooms you have joined.
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
      </div>
    </div>
  );
};
