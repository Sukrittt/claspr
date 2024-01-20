import { useAtom } from "jotai";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
import { createdClassSections } from "@/atoms";
import { CreatedClassroom } from "./created-classroom";
import { getSortedSectionsByOrder } from "@/lib/utils";
import { SectionCard, SectionItem } from "./section-card";
import { ExtendedClassroom, ExtendedSectionWithClassrooms } from "@/types";

export const CreatedClassContext = () => {
  const [sectionsForCreatedClassrooms, setCreatedClassSections] =
    useAtom(createdClassSections);

  const listOfSectionIds = useMemo(
    () => sectionsForCreatedClassrooms?.map((section) => section.id),
    [sectionsForCreatedClassrooms]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [activeClassEl, setActiveClassEl] = useState<ExtendedClassroom | null>(
    null
  );

  const [activeSectionEl, setActiveSectionEl] =
    useState<ExtendedSectionWithClassrooms | null>(null);

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

    const dragType = active.data.current?.dragType;

    if (dragType === "SECTION") {
      setActiveClassEl(null);
      setActiveSectionEl(
        active.data.current?.content as ExtendedSectionWithClassrooms
      );
    } else if (dragType === "CLASSROOM") {
      setActiveSectionEl(null);
      setActiveClassEl(active.data.current?.content as ExtendedClassroom);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const overSectionId = active.data.current?.content?.sectionId; //section where element was dragged from
    const activeElementId = active.data.current?.content?.id; //element being dragged
    const dragType = active.data.current?.dragType; //type of element being dragged

    if (!over || overSectionId === over.id) return;

    //if dragging a section
    if (dragType === "SECTION") {
      const overId = over.id as string;

      if (activeElementId === overId) return;

      handleReorderingOfSections(activeElementId, overId);
    }
    //if dragging a classroom
    else if (dragType === "CLASSROOM") {
      //SERVER UPDATE
      moveClass({
        containerType: "CREATION",
        classContainerId: activeElementId,
        sectionId: over.id as string,
      });

      //CLIENT UPDATE
      handleOptimisticUpdateForClass(
        activeElementId,
        overSectionId,
        over.id as string
      );
    }
  };

  const handleOptimisticUpdateForClass = (
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

    if (!recentNewSection || !activeClassEl) return;

    const newRecentNewSection = {
      ...recentNewSection,
      classrooms: [
        ...recentNewSection.classrooms,
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

    setCreatedClassSections(newSections);
  };

  const handleReorderingOfSections = (
    activeSectionId: string,
    overSectionId: string
  ) => {
    setCreatedClassSections((prevSections) => {
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
      ) as ExtendedSectionWithClassrooms[];

      return sortedSections;
    });
  };

  //To get the sections that need to be shifted in between the active and over sections
  const getShiftSections = (
    activeSectionIndex: number,
    overSectionIndex: number,
    currentSections: ExtendedSectionWithClassrooms[]
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
        {sectionsForCreatedClassrooms.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </SortableContext>
      {createPortal(
        <DragOverlay>
          {activeClassEl && (
            <CreatedClassroom classroom={activeClassEl} isHolding />
          )}
        </DragOverlay>,
        document.body
      )}
      {createPortal(
        <DragOverlay>
          {activeSectionEl && (
            <SectionItem section={activeSectionEl} isHolding />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
