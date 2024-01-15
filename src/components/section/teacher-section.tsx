import { useAtom } from "jotai";
import { useEffect } from "react";

import { trpc } from "@/trpc/client";
import { SectionCard } from "./section-card";
import { CreateSectionDialog } from "./create-section-dialog";
import { MembershipSectionCard } from "./membership-section-card";
import { createdClassSections, joinedClassSections } from "@/atoms";

export const TeacherSection = () => {
  const [sectionsForCreatedClassrooms, setCreatedClassSections] =
    useAtom(createdClassSections);
  const [sectionsForJoinedClassrooms, setJoinedClassSections] =
    useAtom(joinedClassSections);

  const {
    data: sectionsForCreatedClassroomsData,
    isLoading: isFetchingFirstSection,
  } = trpc.section.getSectionsForCreatedClassrooms.useQuery();

  const {
    data: sectionsForJoinedClassroomsData,
    isLoading: isFetchingSecondSection,
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
          <CreateSectionDialog sectionType="CREATION" />
        </div>
        <div className="flex flex-col gap-y-2">
          {isFetchingFirstSection ? (
            <p>Loading...</p>
          ) : !sectionsForCreatedClassrooms ||
            sectionsForCreatedClassrooms.length === 0 ? (
            <p>No results</p>
          ) : (
            sectionsForCreatedClassrooms.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))
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
    </div>
  );
};
