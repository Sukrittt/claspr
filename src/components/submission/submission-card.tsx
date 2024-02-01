"use client";
import { isAfter } from "date-fns";
import { MediaType } from "@prisma/client";
import { LinkIcon, File, FileX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Unsubmit } from "./unsubmit";
import { useGetMedia } from "@/hooks/media";
import { getShortenedText } from "@/lib/utils";
import { ExtendedAnnouncement } from "@/types";
import { ContainerVariants } from "@/lib/motion";
import { useGetSubmission } from "@/hooks/submission";
import { SubmissionDropdown } from "./submission-dropdown";
import {
  SubmissionFooterSkeleton,
  SubmissionSkeleton,
} from "@/components/skeletons/submission-skeleton";
import { CreateSubmission } from "./create-submission";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaDropdown } from "@/components/media/media-dropdown";

interface SubmissionCardProps {
  announcement: ExtendedAnnouncement;
}

export const SubmissionCard: React.FC<SubmissionCardProps> = ({
  announcement,
}) => {
  const { data: submission, isLoading: isFetching } = useGetSubmission(
    announcement.id
  );
  const { data: media, isLoading } = useGetMedia(announcement.id);

  const getSubmissionLabel = (
    label: string | null,
    type: "LINK" | "DOCUMENT"
  ) => {
    if (!label || label === "") {
      const formattedType = type === "LINK" ? "Link" : "Document";

      return `Untitled ${formattedType}`;
    }

    return getShortenedText(label, 27);
  };

  const deadlinePassed = isAfter(new Date(), announcement.dueDate);
  const preventSubmission =
    !!submission ||
    !!(announcement.lateSubmission && !submission && deadlinePassed);

  const Icon = {
    [MediaType.LINK]: <LinkIcon className="h-4 w-4" />,
    [MediaType.DOCUMENT]: <File className="h-4 w-4" />,
  };

  const disabled =
    !!submission ||
    preventSubmission ||
    isFetching ||
    isLoading ||
    (!!media && media.length === 0);

  const handleRedirect = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Card className="overflow-hidden border border-neutral-300 bg-neutral-100">
      <CardHeader className="bg-neutral-200 py-3 pl-4 pr-3 space-y-0">
        <CardTitle className="text-lg">Submit your work</CardTitle>
        <CardDescription>
          Attach files or links to submit your work.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-5 pb-3 pl-4 pr-3">
        <div className="text-sm text-muted-foreground">
          <ScrollArea className="h-[90px]">
            {isLoading || isFetching ? (
              <SubmissionSkeleton />
            ) : !media || media.length === 0 ? (
              <div className="pt-10 flex justify-center items-center gap-x-2">
                <FileX className="h-4 w-4" />
                <p>No work attached yet.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  variants={ContainerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col gap-y-2"
                >
                  {media?.map((m) => (
                    <div
                      onClick={() => handleRedirect(m.url)}
                      key={m.id}
                      className="flex items-center cursor-pointer justify-between border border-neutral-300 rounded-md py-1.5 px-1.5 text-neutral-500 hover:text-neutral-600 transition font-medium"
                    >
                      <div className="flex items-center gap-x-2">
                        {Icon[m.mediaType]}
                        {getSubmissionLabel(m.label, m.mediaType)}
                      </div>
                      {!submission && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <MediaDropdown media={m} />
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="py-3 pl-4 pr-3 flex gap-x-2">
        {isFetching ? (
          <SubmissionFooterSkeleton />
        ) : submission ? (
          <Unsubmit
            announcementId={announcement.id}
            submissionId={submission.id}
          />
        ) : (
          <>
            <SubmissionDropdown announcementId={announcement.id}>
              <Button
                className="h-8 text-xs w-full"
                variant="outline"
                disabled={preventSubmission}
              >
                Attach Work
              </Button>
            </SubmissionDropdown>
            <CreateSubmission
              announcementId={announcement.id}
              disabled={disabled}
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
};
