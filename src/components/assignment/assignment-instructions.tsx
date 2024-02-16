import { toast } from "sonner";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Loader2, Pencil, Save } from "lucide-react";

import { cn } from "@/lib/utils";
import { ExtendedAssignmentDetails } from "@/types";
import { Editor } from "@/components/editor/Editor";
import { contentAtom, isSubmittingAtom } from "@/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useEditAssignmentDetails } from "@/hooks/assignment";
import { EditorOutput } from "@/components/editor/EditorOutput";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface AssignmentInstructionsProps {
  assignment: ExtendedAssignmentDetails;
}

export const AssignmentInstructions: React.FC<AssignmentInstructionsProps> = ({
  assignment,
}) => {
  const [isEditable, setIsEditable] = useState(false);

  const [content] = useAtom(contentAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const disableEditing = () => {
    setIsEditable(false);
  };

  const { mutate: editContent, isLoading } =
    useEditAssignmentDetails(disableEditing);

  const handleToggleEditingMode = () => {
    if (!isEditable) {
      setIsEditable(true);
      return;
    }

    setIsSubmitting(true);
  };

  const handleCreateAssignment = () => {
    if (!content) {
      toast.error("Please provide some instructions for better understanding.");
      return;
    }

    editContent({
      assignmentId: assignment.id,
      classroomId: assignment.classRoomId,
      content,
    });

    setIsSubmitting(undefined);
  };

  useEffect(() => {
    if (isSubmitting !== undefined && !isSubmitting) {
      handleCreateAssignment();
    }
  }, [isSubmitting]);

  return (
    <Card>
      <CardContent className="py-3 pr-1 relative">
        <ScrollArea className="h-[70vh]">
          <CustomTooltip text={`${isEditable ? "Save" : "Edit"} instructions`}>
            <div
              className={cn(
                "absolute top-4 right-4 h-8 w-8 grid place-items-center border z-50 rounded-md hover:bg-neutral-100 transition cursor-pointer",
                {
                  "pointer-events-none opacity-50": isLoading,
                }
              )}
              onClick={handleToggleEditingMode}
            >
              {isEditable ? (
                isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </div>
          </CustomTooltip>
          {isEditable ? (
            <div className="pl-12">
              <Editor
                classroom={assignment.classRoom}
                content={assignment.description}
              />
            </div>
          ) : (
            <EditorOutput content={assignment.description} />
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
