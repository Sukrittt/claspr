"use client";
import Link from "next/link";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

import { getShortenedText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetAllSubmissions } from "@/hooks/submission";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { StudentWorkSkeleton } from "@/components/skeletons/student-work-skeleton";

interface StudentWorkProps {
  classroomId: string;
}

export const StudentWork: React.FC<StudentWorkProps> = ({ classroomId }) => {
  const [open, setOpen] = useState(false);
  const { data: submissions, isLoading } = useGetAllSubmissions(classroomId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" && (e.metaKey || e.altKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Sheet open={open} onOpenChange={(val) => setOpen(val)}>
      <SheetTrigger asChild>
        <div>
          <CustomTooltip text="Alt + w">
            <Button>Your Work</Button>
          </CustomTooltip>
        </div>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex flex-col gap-y-4 pl-3 w-[350px] md:w-[400px]"
      >
        <div>
          <h4 className="font-semibold tracking-tight">Your submissions</h4>
          <p className="text-[13px] text-muted-foreground">
            View all your submissions for this class
          </p>
        </div>

        <Separator />

        <ScrollArea className="h-[80vh]">
          <div className="space-y-4">
            {isLoading ? (
              <StudentWorkSkeleton />
            ) : !submissions || submissions.length === 0 ? (
              <p className="text-center text-[13px] pt-4 font-medium text-muted-foreground">
                No work submitted yet.
              </p>
            ) : (
              submissions.map((submission) => (
                <div key={submission.id} className="border-b pb-2 space-y-2">
                  <Link
                    className="tracking-tight font-semibold hover:underline underline-offset-4 hover:text-neutral-700 dark:hover:text-neutral-400 transition"
                    href={`/c/${classroomId}/a/${submission.assignment.id}`}
                  >
                    {getShortenedText(submission.assignment.title, 30)}
                  </Link>

                  <div className="space-y-1">
                    {submission.media.map((media) => (
                      <Link
                        target="_blank"
                        key={media.id}
                        href={media.url}
                        className="text-[13px] text-muted-foreground hover:text-neutral-700 dark:hover:text-neutral-400 transition flex items-center gap-x-2 w-fit"
                      >
                        <span>{getShortenedText(media.label ?? "", 25)}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>

                  <div className="flex justify-end text-[11px] pt-1 text-muted-foreground">
                    {format(submission.createdAt, "do MMM, yyyy")}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
