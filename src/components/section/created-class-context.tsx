import { useAtom } from "jotai";
import { useState } from "react";
import { toast } from "sonner";
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
import { createPortal } from "react-dom";

import { trpc } from "@/trpc/client";
import { ExtendedClassroom } from "@/types";
import { SectionCard } from "./section-card";
import { createdClassSections } from "@/atoms";
import { CreatedClassroom } from "./created-classroom";

export const CreatedClassContext = () => {
  const [sectionsForCreatedClassrooms, setCreatedClassSections] =
    useAtom(createdClassSections);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [activeDocEl, setActiveDocEl] = useState<ExtendedClassroom | null>(
    null
  );

  const { mutate: moveClass } = trpc.class.moveClass.useMutation({
    onError: () => {
      toast.error("Your changes were not saved. Please refresh your page.");
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveDocEl(active.data.current?.content as ExtendedClassroom);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const oldSectionId = active.data.current?.content?.sectionId;
    const activeClassId = active.data.current?.content?.id;

    if (!over || oldSectionId === over.id) return;

    //SERVER UPDATE
    moveClass({
      containerType: "CREATION",
      classContainerId: activeClassId,
      sectionId: over.id as string,
    });

    //CLIENT UPDATE
    handleOptimisticUpdate(activeClassId, oldSectionId, over.id as string);
  };

  const handleOptimisticUpdate = (
    activeClassId: string,
    oldSectionId: string,
    newSectionId: string
  ) => {
    const newSections = [...sectionsForCreatedClassrooms];

    const oldSection = newSections.find(
      (section) => section.id === oldSectionId
    );

    if (!oldSection) return;

    const filteredOldSection = oldSection.classrooms.filter((classroom) => {
      return classroom.id !== activeClassId;
    });

    const newOldSection = {
      ...oldSection,
      classrooms: filteredOldSection,
    };

    const recentNewSection = newSections.find(
      (section) => section.id === newSectionId
    );

    if (!recentNewSection || !activeDocEl) return;

    const newRecentNewSection = {
      ...recentNewSection,
      classrooms: [
        ...recentNewSection.classrooms,
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

    setCreatedClassSections(newSections);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      {sectionsForCreatedClassrooms.map((section) => (
        <SectionCard key={section.id} section={section} />
      ))}
      {createPortal(
        <DragOverlay>
          {activeDocEl && (
            <CreatedClassroom classroom={activeDocEl} isHolding />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
