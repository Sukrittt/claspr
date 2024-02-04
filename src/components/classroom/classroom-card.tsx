"use client";
import { toast } from "sonner";
import { useAtom } from "jotai";
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
import { descriptionAtom } from "@/atoms";
import { ExtendedClassroomDetails } from "@/types";
import { Badge } from "@/components/ui/badge";
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
  const [description] = useAtom(descriptionAtom);

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
      description: classroom.students.length,
    },
    {
      title: "Class Code",
      description: classroom.classCode,
      action: handleCopyCode,
    },
    {
      title: "Assignments",
      description: "2", //change this
    },
    {
      title: "Pending",
      description: "0", //change this
      isStudent: true,
    },
    {
      title: "Study Materials",
      description: "5", //change this
    },
  ];

  return (
    <Card>
      <CardHeader className="border-b py-2.5 space-y-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
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
        {description || classroom.description ? (
          <div className="text-sm text-muted-foreground flex items-center gap-x-1">
            <AddDescriptionDialog
              classroomId={classroom.id}
              description={description ?? classroom.description ?? ""}
            >
              <span className="hover:underline underline-offset-4 cursor-pointer">
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
            if (details.isStudent && isTeacher) return null;
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
        </div>
      </CardContent>
    </Card>
  );
};
