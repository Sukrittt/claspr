import { toast } from "sonner";
import { Discussion, DiscussionType } from "@prisma/client";

import { trpc } from "@/trpc/client";

interface GetDiscussionProps {
  classroomId: string;
  discussionType: DiscussionType;
}

export const useGetDiscussions = ({
  classroomId,
  discussionType,
}: GetDiscussionProps) => {
  return trpc.discussion.getDiscussions.useQuery({
    classroomId,
    discussionType,
  });
};

export const useStartDiscussion = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const utils = trpc.useUtils();

  return trpc.discussion.startDiscussion.useMutation({
    onSuccess: () => {
      utils.discussion.getDiscussions.invalidate();
      toast.success("Your discussion has been started successfully.");
      closeModal();
    },
  });
};

interface GeDetailedtDiscussionProps {
  discussionId: string;
  discussionType: DiscussionType;
}

export const useGetDiscussionDetails = ({
  discussionId,
  discussionType,
}: GeDetailedtDiscussionProps) => {
  return trpc.discussion.getDiscussionDetails.useQuery({
    discussionId,
    discussionType,
  });
};

export const useAddReaction = ({
  closePopover,
}: {
  closePopover: () => void;
}) => {
  const utils = trpc.useUtils();

  return trpc.discussion.addReaction.useMutation({
    onSuccess: () => {
      closePopover();
      utils.discussion.getDiscussionDetails.invalidate();
    },
  });
};
