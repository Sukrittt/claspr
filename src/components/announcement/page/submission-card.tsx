"use client";
import Link from "next/link";
import { toast } from "sonner";
import { MediaType } from "@prisma/client";
import { LinkIcon, File } from "lucide-react";
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
import { useGetMedia } from "@/hooks/media";
import { getShortenedText } from "@/lib/utils";
import { ContainerVariants } from "@/lib/motion";
import { useGetSubmission } from "@/hooks/submission";
import { SubmissionDropdown } from "./submission-dropdown";
import {
  SubmissionFooterSkeleton,
  SubmissionSkeleton,
} from "@/components/skeletons/submission-skeleton";
import { CreateSubmission } from "./create-submission";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SubmissionCard = ({
  announcementId,
}: {
  announcementId: string;
}) => {
  const { data: submission, isLoading: isFetching } =
    useGetSubmission(announcementId);
  const { data: media, isLoading } = useGetMedia(announcementId);

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

  const Icon = {
    [MediaType.LINK]: <LinkIcon className="h-4 w-4" />,
    [MediaType.DOCUMENT]: <File className="h-4 w-4" />,
  };

  const disabled = isFetching || isLoading || (!!media && media.length === 0);

  return (
    <Card className="overflow-hidden border border-neutral-300 bg-neutral-100">
      <CardHeader className="bg-neutral-200 py-3 space-y-0">
        <CardTitle className="text-lg">Submit your work</CardTitle>
        <CardDescription>
          Attach files or links to submit your work.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-5 pb-3">
        <div className="text-sm text-muted-foreground">
          {isLoading || isFetching ? (
            <SubmissionSkeleton />
          ) : !media || media.length === 0 ? (
            <p className="text-center">No media attached yet.</p>
          ) : (
            <ScrollArea className="h-[150px]">
              <AnimatePresence mode="wait">
                <motion.div
                  variants={ContainerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col gap-y-2"
                >
                  {media?.map((m) => (
                    <Link
                      href={m.url}
                      target="_blank"
                      key={m.id}
                      className="flex items-center gap-x-2 border border-neutral-300 rounded-md py-1.5 px-1.5 text-neutral-500 hover:text-neutral-600 transition font-medium"
                    >
                      {Icon[m.mediaType]}
                      {getSubmissionLabel(m.label, m.mediaType)}
                    </Link>
                  ))}
                </motion.div>
              </AnimatePresence>
            </ScrollArea>
          )}
        </div>
      </CardContent>
      <CardFooter className="py-3 flex gap-x-2">
        {isFetching ? (
          <SubmissionFooterSkeleton />
        ) : submission ? (
          <Button
            className="h-8 text-xs w-full"
            variant="outline"
            onClick={() => toast.message("Coming soon...")}
          >
            Unsubmit
          </Button>
        ) : (
          <>
            <SubmissionDropdown announcementId={announcementId}>
              <Button className="h-8 text-xs w-full" variant="outline">
                Attach Work
              </Button>
            </SubmissionDropdown>
            <CreateSubmission
              announcementId={announcementId}
              disabled={disabled}
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
};
