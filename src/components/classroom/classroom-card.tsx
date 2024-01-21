"use client";
import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";
import { useAtom } from "jotai";
import { Check, Copy, Info, Pencil } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, timeAgo } from "@/lib/utils";
import { descriptionAtom } from "@/atoms";
import { ExtendedClassroom } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddDescriptionDialog } from "./add-description-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface ClassroomCardProps {
  classroom: ExtendedClassroom;
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
      title: "Created",
      description: format(classroom.createdAt, "dd MMM, yy"),
    },
    {
      title: "Class Code",
      description: classroom.classCode,
      action: handleCopyCode,
    },
    {
      title: "Joined",
      description: timeAgo(studentDetails?.createdAt ?? classroom.createdAt),
    },
  ];

  return (
    <Card className="overflow-hidden border border-neutral-300 bg-neutral-100">
      <CardHeader className="bg-neutral-200 py-3 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
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
            {description ?? classroom.description}
            <AddDescriptionDialog
              classroomId={classroom.id}
              description={description ?? classroom.description ?? ""}
            >
              <Pencil className="w-3 h-3 hover:text-neutral-800 cursor-pointer transition" />
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
          {classDetails.map((details, index) => (
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
                    <div className="flex items-center gap-x-2">
                      <span className="opacity-0 group-hover:opacity-100 transition">
                        {copied ? (
                          <Check className="w-2.5 h-2.5 duration-500" />
                        ) : (
                          <Copy className="w-2.5 h-2.5" />
                        )}
                      </span>
                      <p className="text-[13px]">{details.description}</p>
                    </div>
                  </CustomTooltip>
                ) : (
                  <p className="text-[13px]">{details.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => toast.message("Coming Soon.")}
        >
          Make Announcement
        </Button>
      </CardFooter>
    </Card>
  );
};