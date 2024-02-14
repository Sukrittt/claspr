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
import { useAtom } from "jotai";

import { folderAtom } from "@/atoms";
import { createPortal } from "react-dom";
import { ExtendedFolder } from "@/types";
import { FolderCard } from "./folder-cards";
import { useReorderFolder } from "@/hooks/folder";
import { getSortedFoldersByOrder } from "@/lib/utils";

interface FolderContextProps {
  folders: ExtendedFolder[];
  setActiveFolderId: (folderId: string) => void;
}

export const FolderContext: React.FC<FolderContextProps> = ({
  folders,
  setActiveFolderId,
}) => {
  const [, setFolders] = useAtom(folderAtom);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [activeFolderEl, setActiveFolderEl] = useState<ExtendedFolder | null>(
    null
  );

  const listOfFolderIds = useMemo(
    () => folders?.map((folder) => folder.id),
    [folders]
  );

  const { mutate: reorderFolder } = useReorderFolder();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveFolderEl(active.data.current?.content as ExtendedFolder);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const overFolderId = active.data.current?.content?.id; // where the folder was dropped to
    const activeFolderId = active.data.current?.content?.id; //folder being dragged

    if (!over || overFolderId === over.id) return;

    const overId = over.id as string;

    if (activeFolderId === overId) return;

    handleReorderFolder(activeFolderId, overId);
  };

  const handleReorderFolder = (
    activeFolderId: string,
    overFolderId: string
  ) => {
    setFolders((prev) => {
      const currentFolders = [...prev];

      const activeFolderIndex = currentFolders.findIndex(
        (folder) => folder.id === activeFolderId
      );

      const overFolderIndex = currentFolders.findIndex(
        (folder) => folder.id === overFolderId
      );

      if (activeFolderIndex === -1 || overFolderIndex === -1) return prev;

      const { shiftFolders, reversed } = getShiftFolders(
        activeFolderIndex,
        overFolderIndex,
        currentFolders
      );

      const shiftFolderPayload = shiftFolders.map((folder) => {
        return {
          folderId: folder.id,
          order: folder.order,
        };
      });

      //SERVER UPDATE
      reorderFolder({
        activeFolderId,
        overFolderId,
        shiftFolders: shiftFolderPayload,
        shiftDirection: reversed ? "DOWN" : "UP",
      });

      //updating the order of the active folder
      const updatedActiveFolder = {
        ...currentFolders[activeFolderIndex],
        order: currentFolders[overFolderIndex].order,
      };

      currentFolders[activeFolderIndex] = updatedActiveFolder;

      //updating the order of the shifted folders
      const updatedShiftFolders = shiftFolders.map((folder) => {
        return {
          ...folder,
          order: reversed ? folder.order - 1 : folder.order + 1,
        };
      });

      updatedShiftFolders.forEach((folder) => {
        const shiftFolderIndex = currentFolders.findIndex(
          (s) => s.id === folder.id
        );

        currentFolders[shiftFolderIndex] = folder;
      });

      const sortedFolders = getSortedFoldersByOrder(
        currentFolders
      ) as ExtendedFolder[];

      return sortedFolders;
    });
  };

  //To get the folders that need to be shifted in between the active and over folders
  const getShiftFolders = (
    activeFolderIndex: number,
    overFolderIndex: number,
    currentFolders: ExtendedFolder[]
  ) => {
    let sliceIndexOne: number, sliceIndexTwo: number;
    let reversed = false;

    if (activeFolderIndex < overFolderIndex) {
      sliceIndexOne = activeFolderIndex + 1;
      sliceIndexTwo = overFolderIndex + 1;
    } else {
      sliceIndexOne = overFolderIndex;
      sliceIndexTwo = activeFolderIndex;

      reversed = true;
    }

    const shiftFolders = currentFolders.slice(sliceIndexOne, sliceIndexTwo);

    return { shiftFolders, reversed };
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <SortableContext
        items={listOfFolderIds ?? []}
        strategy={verticalListSortingStrategy}
      >
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            setFolderActive={(folderId: string) => setActiveFolderId(folderId)}
          />
        ))}
      </SortableContext>
      {createPortal(
        <DragOverlay>
          {activeFolderEl && (
            <FolderCard
              folder={activeFolderEl}
              isHolding
              setFolderActive={(folderId: string) =>
                setActiveFolderId(folderId)
              }
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
