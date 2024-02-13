import { toast } from "sonner";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { trpc } from "@/trpc/client";
import { JoinedMembership } from "./joined-membership";
import {
  MembershipItem,
  MembershipSectionCard,
} from "./membership-section-card";
import { getSortedSectionsByOrder } from "@/lib/utils";
import { isCloseAllMembershipToggle, joinedClassSections } from "@/atoms";
import { ExtendedMembership, ExtendedSectionWithMemberships } from "@/types";

export const MembershipContext = () => {
  const [sectionsForJoinedClassrooms, setJoinedClassSections] =
    useAtom(joinedClassSections);

  const [, setCloseAllToggle] = useAtom(isCloseAllMembershipToggle);

  const listOfSectionIds = useMemo(
    () => sectionsForJoinedClassrooms?.map((section) => section.id),
    [sectionsForJoinedClassrooms]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [activeClassEl, setActiveClassEl] = useState<ExtendedMembership | null>(
    null
  );
  const [activeSectionEl, setActiveSectionEl] =
    useState<ExtendedSectionWithMemberships | null>(null);

  const { mutate: moveClass } = trpc.class.moveClass.useMutation({
    onError: () => {
      toast.error("Your changes were not saved. Please refresh your page.");
    },
  });

  const { mutate: moveSection } = trpc.section.moveSection.useMutation({
    onError: () => {
      toast.error("Your changes were not saved. Please refresh your page.");
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setCloseAllToggle((prev) => !!!prev);

    const dragType = active.data.current?.dragType;

    if (dragType === "SECTION") {
      setActiveClassEl(null);
      setActiveSectionEl(
        active.data.current?.content as ExtendedSectionWithMemberships
      );
    } else if (dragType === "CLASSROOM") {
      setActiveSectionEl(null);
      setActiveClassEl(active.data.current?.content as ExtendedMembership);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const oldSectionId = active.data.current?.content?.sectionId;
    const activeElementId = active.data.current?.content?.id;
    const dragType = active.data.current?.dragType; //type of element being dragged

    if (!over || oldSectionId === over.id) return;

    if (dragType === "SECTION") {
      const overId = over.id as string;

      if (activeElementId === overId) return;

      handleReorderingOfSections(activeElementId, overId);
    } else {
      //SERVER UPDATE
      moveClass({
        containerType: "MEMBERSHIP",
        classContainerId: activeElementId,
        sectionId: over.id as string,
      });

      //CLIENT UPDATE
      handleOptimisticUpdateForClass(
        activeElementId,
        oldSectionId,
        over.id as string
      );
    }
  };

  const handleOptimisticUpdateForClass = (
    activeMembershipId: string,
    oldSectionId: string,
    newSectionId: string
  ) => {
    const newSections = [...sectionsForJoinedClassrooms];

    const oldSection = newSections.find(
      (section) => section.id === oldSectionId
    );

    if (!oldSection) return;

    const filteredOldSection = oldSection.memberships.filter((membership) => {
      return membership.id !== activeMembershipId;
    });

    const newOldSection = {
      ...oldSection,
      memberships: filteredOldSection,
    };

    const recentNewSection = newSections.find(
      (section) => section.id === newSectionId
    );

    if (!recentNewSection || !activeClassEl) return;

    const newRecentNewSection = {
      ...recentNewSection,
      memberships: [
        ...recentNewSection.memberships,
        {
          ...activeClassEl,
          sectionId: newSectionId,
        },
      ],
    };

    const oldSectionIndex = newSections.findIndex(
      (section) => section.id === oldSectionId
    );

    const newSectionIndex = newSections.findIndex(
      (section) => section.id === newSectionId
    );

    newSections[oldSectionIndex] = newOldSection;
    newSections[newSectionIndex] = newRecentNewSection;

    setJoinedClassSections(newSections);
  };

  const handleReorderingOfSections = (
    activeSectionId: string,
    overSectionId: string
  ) => {
    setJoinedClassSections((prevSections) => {
      const currentSections = [...prevSections];

      const activeSectionIndex = currentSections.findIndex(
        (section) => section.id === activeSectionId
      );

      const overSectionIndex = currentSections.findIndex(
        (section) => section.id === overSectionId
      );

      if (activeSectionIndex === -1 || overSectionIndex === -1)
        return prevSections;

      const { shiftSections, reversed } = getShiftSections(
        activeSectionIndex,
        overSectionIndex,
        currentSections
      );

      const shiftSectionPayload = shiftSections.map((section) => {
        return {
          sectionId: section.id,
          order: section.order,
        };
      });

      //SERVER UPDATE
      moveSection({
        activeSectionId,
        overSectionId,
        shiftSections: shiftSectionPayload,
        shiftDirection: reversed ? "DOWN" : "UP",
      });

      //updating the order of the active section
      const updatedActiveSection = {
        ...currentSections[activeSectionIndex],
        order: currentSections[overSectionIndex].order,
      };

      currentSections[activeSectionIndex] = updatedActiveSection;

      //updating the order of the shifted sections
      const updatedShiftedSections = shiftSections.map((section) => {
        return {
          ...section,
          order: reversed ? section.order + 1 : section.order - 1,
        };
      });

      updatedShiftedSections.forEach((section) => {
        const shiftSectionIndex = currentSections.findIndex(
          (s) => s.id === section.id
        );

        currentSections[shiftSectionIndex] = section;
      });

      const sortedSections = getSortedSectionsByOrder(
        currentSections
      ) as ExtendedSectionWithMemberships[];

      return sortedSections;
    });
  };

  //To get the sections that need to be shifted in between the active and over sections
  const getShiftSections = (
    activeSectionIndex: number,
    overSectionIndex: number,
    currentSections: ExtendedSectionWithMemberships[]
  ) => {
    let sliceIndexOne: number, sliceIndexTwo: number;
    let reversed = false;

    if (activeSectionIndex < overSectionIndex) {
      sliceIndexOne = activeSectionIndex + 1;
      sliceIndexTwo = overSectionIndex + 1;
    } else {
      sliceIndexOne = overSectionIndex;
      sliceIndexTwo = activeSectionIndex;

      reversed = true;
    }

    const shiftSections = currentSections.slice(sliceIndexOne, sliceIndexTwo);

    return { shiftSections, reversed };
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <SortableContext
        items={listOfSectionIds ?? []}
        strategy={verticalListSortingStrategy}
      >
        {sectionsForJoinedClassrooms.map((section) => (
          <MembershipSectionCard key={section.id} section={section} />
        ))}
        {createPortal(
          <DragOverlay>
            {activeClassEl && (
              <JoinedMembership membership={activeClassEl} isHolding />
            )}
          </DragOverlay>,
          document.body
        )}
        {createPortal(
          <DragOverlay>
            {activeSectionEl && (
              <MembershipItem section={activeSectionEl} isHolding />
            )}
          </DragOverlay>,
          document.body
        )}
      </SortableContext>
    </DndContext>
  );
};
