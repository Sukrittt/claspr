import { toast } from "sonner";
import { useAtom } from "jotai";
import { useState } from "react";
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

import { trpc } from "@/trpc/client";
import { ExtendedMembership } from "@/types";
import { joinedClassSections } from "@/atoms";
import { JoinedMembership } from "./joined-membership";
import { MembershipSectionCard } from "./membership-section-card";

export const MembershipContext = () => {
  const [sectionsForJoinedClassrooms, setJoinedClassSections] =
    useAtom(joinedClassSections);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [activeDocEl, setActiveDocEl] = useState<ExtendedMembership | null>(
    null
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveDocEl(active.data.current?.content as ExtendedMembership);
  };

  const { mutate: moveClass } = trpc.class.moveClass.useMutation({
    onError: () => {
      toast.error("Your changes were not saved. Please refresh your page.");
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const oldSectionId = active.data.current?.content?.sectionId;
    const activeMembershipId = active.data.current?.content?.id;

    if (!over || oldSectionId === over.id) return;

    //SERVER UPDATE
    moveClass({
      containerType: "MEMBERSHIP",
      classContainerId: activeMembershipId,
      sectionId: over.id as string,
    });

    //CLIENT UPDATE
    handleOptimisticUpdate(activeMembershipId, oldSectionId, over.id as string);
  };

  const handleOptimisticUpdate = (
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

    if (!recentNewSection || !activeDocEl) return;

    const newRecentNewSection = {
      ...recentNewSection,
      memberships: [
        ...recentNewSection.memberships,
        {
          ...activeDocEl,
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

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      {sectionsForJoinedClassrooms.map((section) => (
        <MembershipSectionCard key={section.id} section={section} />
      ))}
      {createPortal(
        <DragOverlay>
          {activeDocEl && (
            <JoinedMembership membership={activeDocEl} isHolding />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
