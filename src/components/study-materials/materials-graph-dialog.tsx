import { BarChart3 } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FormattedNote } from "@/types/note";
import { useGetPartOfClass } from "@/hooks/class";
import { MaterialsGraph } from "./materials-graph";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface MaterialsGraphDialogProps {
  notes: FormattedNote[];
  classroomId: string;
}

export const MaterialsGraphDialog: React.FC<MaterialsGraphDialogProps> = ({
  notes,
  classroomId,
}) => {
  const { data: isTeacher, isLoading } = useGetPartOfClass({
    classroomId,
    isTeacher: true,
  });

  const data = notes.map((note) => ({
    name: note.title,
    total: note.viewCount ?? 0,
  }));

  if (isLoading) {
    return <Skeleton className="h-4 w-4" />;
  }

  if (!isTeacher) return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div>
          <CustomTooltip text="Notes Usage">
            <div className="p-1 flex items-center justify-center rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200">
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
              Monitor student note usage over time
            </DrawerDescription>
          </DrawerHeader>

          <MaterialsGraph data={data} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
