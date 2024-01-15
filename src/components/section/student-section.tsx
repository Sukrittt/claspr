import { useAtom } from "jotai";
import { useEffect } from "react";

import { trpc } from "@/trpc/client";
import { joinedClassSections } from "@/atoms";
import { CreateSectionDialog } from "./create-section-dialog";
import { MembershipSectionCard } from "./membership-section-card";

export const StudentSection = () => {
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
        <CreateSectionDialog sectionType="MEMBERSHIP" />
      </div>
      <div className="flex flex-col gap-y-2">
        {isFetchingSecondSection ? (
          <p>Loading...</p>
        ) : !sectionsForJoinedClassrooms ||
          sectionsForJoinedClassrooms.length === 0 ? (
          <p>No results</p>
        ) : (
          sectionsForJoinedClassrooms.map((section) => (
            <MembershipSectionCard key={section.id} section={section} />
          ))
        )}
      </div>
    </div>
  );
};
