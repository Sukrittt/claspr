import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionType } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateSectionForm } from "./create-section-form";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

export const CreateSectionDialog = ({
  sectionType,
}: {
  sectionType: SectionType;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <CustomTooltip text="Create Section">
            <div className="p-2 flex items-center justify-center rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200">
              <Plus className="h-4 w-4" />
              <div className="sr-only">Create section</div>
            </div>
          </CustomTooltip>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a section</DialogTitle>
          <DialogDescription>
            Provide details to create a new section for your classrooms.
          </DialogDescription>
        </DialogHeader>

        <CreateSectionForm
          sectionType={sectionType}
          closeModal={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
