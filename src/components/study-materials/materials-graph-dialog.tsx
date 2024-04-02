import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FormattedNote } from "@/types/note";
import { MaterialsGraph } from "./materials-graph";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface MaterialsGraphDialogProps {
  notes: FormattedNote[];
  classroomId: string;
}

export const MaterialsGraphDialog: React.FC<MaterialsGraphDialogProps> = ({
  notes,
  classroomId,
}) => {
  const [open, setOpen] = useState(false);

  const data = notes.map((note) => ({
    name: note.title,
    total: note.viewCount ?? 0,
  }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "g" && (e.metaKey || e.altKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Drawer open={open} onOpenChange={(val) => setOpen(val)}>
      <DrawerTrigger asChild>
        <div>
          <CustomTooltip text="Monitor Usage">
            <div className="p-1 flex items-center justify-center rounded-md cursor-pointer hover:text-gray-700 dark:text-gray-300 transition hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
              <BarChart3 className="h-3.5 w-3.5" />
              <div className="sr-only">Notes usage</div>
            </div>
          </CustomTooltip>
        </div>
      </DrawerTrigger>
      <DrawerContent className="pb-8">
        <div className="max-w-2xl mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle>Notes Usage</DrawerTitle>
            <DrawerDescription>
              Monitor student&rsquo;s note usage over time
            </DrawerDescription>
          </DrawerHeader>

          <MaterialsGraph data={data} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
