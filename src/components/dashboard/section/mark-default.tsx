import { useAtom } from "jotai";
import { BadgeCheck } from "lucide-react";
import { SectionType } from "@prisma/client";

import { trpc } from "@/trpc/client";
import { createdClassSections, joinedClassSections } from "@/atoms";

interface MarkDefaultProps {
  sectionId: string;
  sectionType: SectionType;
}

export const MarkDefault: React.FC<MarkDefaultProps> = ({
  sectionId,
  sectionType,
}) => {
  const [, setCreatedClassSections] = useAtom(createdClassSections);
  const [, setJoinedClassSections] = useAtom(joinedClassSections);

  const { mutate: markAsDefault } = trpc.section.updateSection.useMutation({
    onMutate: () => {
      handleOptimisticUpdate();
    },
  });

  const handleOptimisticUpdate = () => {
    if (sectionType === "CREATION") {
      setCreatedClassSections((prev) => {
        const index = prev.findIndex((section) => section.id === sectionId);
        const defaultSectionIndex = prev.findIndex(
          (section) => section.isDefault
        );

        if (defaultSectionIndex === -1 || index === defaultSectionIndex)
          return prev;

        if (index !== -1) {
          const updatedSections = [...prev];

          //mark the existing default section as false
          updatedSections[defaultSectionIndex] = {
            ...updatedSections[defaultSectionIndex],
            isDefault: false,
          };

          //mark the section as true
          updatedSections[index] = {
            ...updatedSections[index],
            isDefault: true,
          };

          return updatedSections;
        }

        return prev;
      });
    } else {
      setJoinedClassSections((prev) => {
        const index = prev.findIndex((section) => section.id === sectionId);
        const defaultSectionIndex = prev.findIndex(
          (section) => section.isDefault
        );

        if (defaultSectionIndex === -1 || index === defaultSectionIndex)
          return prev;

        if (index !== -1) {
          const updatedSections = [...prev];

          //mark the existing default section as false
          updatedSections[defaultSectionIndex] = {
            ...updatedSections[defaultSectionIndex],
            isDefault: false,
          };

          //mark the section as true
          updatedSections[index] = {
            ...updatedSections[index],
            isDefault: true,
          };

          return updatedSections;
        }

        return prev;
      });
    }
  };

  return (
    <div
      className="flex items-center"
      onClick={() => markAsDefault({ sectionId, isDefault: true, sectionType })}
    >
      <BadgeCheck className="h-3.5 w-3.5 text-gray-700 mr-2" />
      <p>Mark as default</p>
    </div>
  );
};
