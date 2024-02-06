import Link from "next/link";
import { useState } from "react";
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
import { TeacherReviewInput } from "./teacher-review-input";
import { ExtendedAssignment, ExtendedSubmission } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SubmissionReviewProps {
  children: React.ReactNode;
  submission: ExtendedSubmission;
  assignment: ExtendedAssignment;
}

export const SubmissionReview: React.FC<SubmissionReviewProps> = ({
  children,
  submission,
  assignment,
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
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
          className="py-2"
        >
          {reviewOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <RadioGroupItem
                value={option.value as string}
                id={option.value as string}
                className="h-3.5 w-3.5"
              />
              <div className="space-y-1">
                <Label
                  className="cursor-pointer"
                  htmlFor={option.value as string}
                >
                  {option.label}
                </Label>
                <p className="text-muted-foreground text-xs">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>

        <TeacherReviewInput
          assignment={assignment}
          selectedReview={review}
          submissionId={submission.id}
          closeModal={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
