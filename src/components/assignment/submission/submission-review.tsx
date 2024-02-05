import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Session } from "next-auth";
import { ExternalLink } from "lucide-react";
import { SubmissionStatus } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExtendedAssignment, ExtendedSubmission } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CommentInput } from "@/components/assignment/comment/comment-input";

interface SubmissionReviewProps {
  children: React.ReactNode;
  submission: ExtendedSubmission;
  assignment: ExtendedAssignment;
  session: Session;
}

export const SubmissionReview: React.FC<SubmissionReviewProps> = ({
  children,
  submission,
  assignment,
  session,
}) => {
  const [review, setReview] = useState(submission.submissionStatus!);

  const reviewOptions = [
    {
      value: SubmissionStatus.PENDING,
      label: "Comment",
      description: "Submit general feedback without explicit approval.",
    },
    {
      value: SubmissionStatus.APPROVED,
      label: "Approve",
      description: "Submit feedback and approve the submission.",
    },
    {
      value: SubmissionStatus.CHANGES_REQUESTED,
      label: "Request Changes",
      description: "Submit feedback and request changes from the student.",
    },
  ];

  const getReviewComment = () => {
    if (review === "CHANGES_REQUESTED")
      return "Please make the requested changes and resubmit your work.";

    if (review === "APPROVED") return "Your work has been approved. Great job!";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submission Review</DialogTitle>
          <DialogDescription>
            Review the submission of {submission.member.user.name} and provide
            feedback
          </DialogDescription>
        </DialogHeader>

        <div className="text-sm flex flex-wrap items-center gap-x-2">
          {submission.media.length === 0 ? (
            <p>No work attached</p>
          ) : (
            submission.media.map((media) => (
              <Link
                target="_blank"
                href={media.url}
                key={media.id}
                className="flex gap-x-2.5 hover:bg-neutral-100 transition items-center py-1 px-2 border rounded-md"
              >
                <span>{media.label}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </Link>
            ))
          )}
        </div>

        <RadioGroup
          defaultValue={review as string}
          onValueChange={(value) => setReview(value as SubmissionStatus)}
        >
          {reviewOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <RadioGroupItem
                value={option.value as string}
                id={option.value as string}
                className="h-3.5 w-3.5"
              />
              <div className="space-y-1">
                <Label htmlFor={option.value as string}>{option.label}</Label>
                <p className="text-muted-foreground text-xs">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>

        <div className="flex gap-x-2">
          <CommentInput
            assignment={assignment}
            session={session}
            reviewComment={getReviewComment()}
          />
          {/* <Button form="comment-creation-form" className="pt-2"> */}
          <Button
            onClick={() => toast.message("Coming soon..")}
            className="pt-2"
          >
            Submit review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
