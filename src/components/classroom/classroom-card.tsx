"use client";
import { toast } from "sonner";
import { useState } from "react";
import { Check, Copy, Info } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ExtendedClassroomDetails } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useClassroomDescription, usePendingAssignments } from "@/hooks/class";
import { AddDescriptionDialog } from "./add-description-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface ClassroomCardProps {
  classroom: ExtendedClassroomDetails;
  sessionId: string;
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({
  classroom,
  sessionId,
}) => {
  const [copied, setCopied] = useState(false);
  const { data: pendingAssignments, isLoading: isFetching } =
    usePendingAssignments(classroom.id);
  const { data: description, isLoading } = useClassroomDescription(
    classroom.id
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classroom.classCode);
    setCopied(true);

    toast.success("Code copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const studentDetails = classroom.students.find(
    (student) => student.userId === sessionId
  );

  const isTeacher =
    classroom.teacher.id === sessionId || studentDetails?.isTeacher;

  const classDetails = [
    {
      title: "Members",
      description: classroom.students.length + 1, // + 1 to include the creator
    },
    {
      title: "Class Code",
      description: classroom.classCode,
      action: handleCopyCode,
    },
    {
      title: "Assignments",
      description: classroom._count.assignments,
    },
    {
      title: "Study Materials",
      description: classroom._count.notes,
    },
  ];

  return (
    <Card>
      <CardHeader className="border-b py-2.5 space-y-1">
        <div className="flex justify-between">
          <CardTitle className="text-base pt-1">
            {studentDetails?.renamedClassroom ?? classroom.title}
          </CardTitle>
          {isTeacher ? (
            <CustomTooltip text="Joined as a teacher">
              <div>
                <Badge>Teacher</Badge>
              </div>
            </CustomTooltip>
          ) : (
            <CustomTooltip text="Joined as a student">
              <div>
                <Badge>Student</Badge>
              </div>
            </CustomTooltip>
          )}
        </div>
        {isLoading ? (
          <Skeleton className="h-4 w-1/2" />
        ) : description || classroom.description ? (
          <div className="text-sm text-muted-foreground flex items-center gap-x-1">
            <AddDescriptionDialog
              classroomId={classroom.id}
              description={description ?? classroom.description ?? ""}
            >
              <span className="hover:underline underline-offset-4 cursor-pointer text-[13px]">
                {description ?? classroom.description}
              </span>
            </AddDescriptionDialog>
          </div>
        ) : (
          isTeacher && (
            <CardDescription className="text-[13px] flex gap-x-1 items-center">
              <AddDescriptionDialog classroomId={classroom.id}>
                <span className="hover:underline underline-offset-4 cursor-pointer">
                  Click to add a description
                </span>
              </AddDescriptionDialog>
              <CustomTooltip text="It will help us provide more context to the AI.">
                <Info className="w-3 h-3" />
              </CustomTooltip>
            </CardDescription>
          )
        )}
      </CardHeader>
      <CardContent className="pt-6 text-sm">
        <div className="grid grid-cols-2 gap-4 text-gray-800">
          {classDetails.map((details, index) => {
            if (details.action && !isTeacher) return null;

            return (
              <div key={index} className="flex justify-between items-center">
                <p className="text-muted-foreground">{details.title}</p>
                <div
                  className={cn("flex items-center gap-x-1.5 group", {
                    "cursor-pointer": !!details.action,
                  })}
                  onClick={details.action}
                >
                  {details.action ? (
                    <CustomTooltip text="Click to copy">
                      <div className="relative">
                        <p className="text-[13px]">{details.description}</p>
                        <span className="opacity-0 group-hover:opacity-100 transition absolute -right-3.5 top-[5px]">
                          {copied ? (
                            <Check className="w-2.5 h-2.5 duration-500" />
                          ) : (
                            <Copy className="w-2.5 h-2.5" />
                          )}
                        </span>
                      </div>
                    </CustomTooltip>
                  ) : (
                    <p className="text-[13px]">{details.description}</p>
                  )}
                </div>
              </div>
            );
          })}
          {!isTeacher && (
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Pending</p>
              {isFetching ? (
                <Skeleton className="h-4 w-4" />
              ) : (
                <CustomTooltip text="View pending assignments">
                  <p className="text-[13px]">
                    {pendingAssignments?.length ?? 0}
                  </p>
                </CustomTooltip>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
