import { useAtom } from "jotai";
import { useEffect } from "react";
import { CopyMinus } from "lucide-react";

import { trpc } from "@/trpc/client";
import { MembershipContext } from "./membership-context";
import { CreateSectionDialog } from "./create-section-dialog";
import { MembershipSectionCard } from "./membership-section-card";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { isCloseAllMembershipToggle, joinedClassSections } from "@/atoms";

export const StudentSection = () => {
  const [, setCloseAllMembershipToggle] = useAtom(isCloseAllMembershipToggle);

  const [sectionsForJoinedClassrooms, setJoinedClassSections] =
    useAtom(joinedClassSections);

  const {
    data: sectionsForJoinedClassroomsData,
    isLoading: isFetchingSecondSection,
  } = trpc.section.getSectionsForJoinedClassrooms.useQuery();

  useEffect(() => {
    if (sectionsForJoinedClassroomsData) {
      setJoinedClassSections(sectionsForJoinedClassroomsData);
    }
  }, [sectionsForJoinedClassroomsData]);

  return (
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
              className="p-2 rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-300"
              onClick={() => setCloseAllMembershipToggle((prev) => !!!prev)}
            >
              <CopyMinus className="w-4 h-4" />
            </div>
          </CustomTooltip>
          <CreateSectionDialog sectionType="MEMBERSHIP" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        {isFetchingSecondSection ? (
          <p>Loading...</p>
        ) : !sectionsForJoinedClassrooms ||
          sectionsForJoinedClassrooms.length === 0 ? (
          <p>No results</p>
        ) : (
          <MembershipContext />
        )}
      </div>
    </div>
  );
};
