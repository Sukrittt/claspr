import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionType } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { CreateSectionForm } from "@/components/dashboard/section/form/create-section-form";

export const CreateSectionDialog = ({
  sectionType,
}: {
  sectionType: SectionType;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const checkKey = sectionType === "CREATION" ? "c" : "j";

      if (e.key === checkKey && (e.metaKey || e.altKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sectionType]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <CustomTooltip text="Create Section">
            <div className="p-1 flex items-center justify-center rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
              <Plus className="h-3.5 w-3.5" />
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
