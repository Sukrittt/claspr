import { toast } from "sonner";
import { DiscussionType } from "@prisma/client";

import { trpc } from "@/trpc/client";
import { ExtendedDiscussion } from "@/types";

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

export const useGetIsAnswered = ({
  discussionId,
}: {
  discussionId: string;
}) => {
  return trpc.discussion.getIsAnswered.useQuery({
    discussionId,
  });
};

export const useStartDiscussion = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const utils = trpc.useUtils();

  return trpc.discussion.startDiscussion.useMutation({
    onSuccess: (discussion) => {
      utils.discussion.getDiscussions.setData(
        {
          classroomId: discussion.classroomId,
          discussionType: discussion.discussionType,
        },
        (prev) => {
          if (!prev) return;

          const formattedDiscussion: ExtendedDiscussion = {
            ...discussion,
            replies: [],
            _count: {
              replies: 0,
            },
          };

          return [formattedDiscussion, ...prev];
        }
      );

      toast.success("Your discussion has been started successfully.");
      closeModal();
    },
  });
};

interface GetDetailedtDiscussionProps {
  discussionId: string;
  discussionType: DiscussionType;
}

export const useGetDiscussionDetails = ({
  discussionId,
  discussionType,
}: GetDetailedtDiscussionProps) => {
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

export const useEditDiscussion = ({
  discussionType,
  setTitle,
  closeModal,
}: {
  discussionType: DiscussionType;
  setTitle?: React.Dispatch<React.SetStateAction<string>>;
  closeModal?: () => void;
}) => {
  const utils = trpc.useUtils();

  return trpc.discussion.editDiscussion.useMutation({
    onMutate: async ({ discussionId }) => {
      await utils.discussion.getDiscussionDetails.cancel({
        discussionId,
        discussionType,
      });

      const prevDiscussionDetails =
        utils.discussion.getDiscussionDetails.getData({
          discussionId,
          discussionType,
        });

      return { prevDiscussionDetails };
    },
    onError: (error, _, ctx) => {
      setTitle?.(ctx?.prevDiscussionDetails?.title ?? "Untitled Discussion");

      toast.error(error.message);
    },
    onSettled: () => {
      utils.discussion.getDiscussionDetails.invalidate();
    },
    onSuccess: () => {
      closeModal?.();
    },
  });
};

interface RemoveDiscussionProps {
  classroomId: string;
  discussionType: DiscussionType;
  closeModal: () => void;
}

export const useRemoveDiscussion = ({
  closeModal,
  classroomId,
  discussionType,
}: RemoveDiscussionProps) => {
  const utils = trpc.useUtils();

  return trpc.discussion.removeDiscussion.useMutation({
    onMutate: async ({ discussionId }) => {
      await utils.discussion.getDiscussions.cancel({
        classroomId,
        discussionType,
      });

      const prevDiscussions = utils.discussion.getDiscussions.getData();

      utils.discussion.getDiscussions.setData(
        { classroomId, discussionType },
        (prev) => prev?.filter((discussion) => discussion.id !== discussionId)
      );

      return { prevDiscussions };
    },
    onError: (error, data, ctx) => {
      toast.error(error.message);

      utils.discussion.getDiscussions.setData(
        { classroomId, discussionType },
        ctx?.prevDiscussions
      );
    },
    onSettled: () => {
      utils.discussion.getDiscussions.invalidate({
        classroomId,
        discussionType,
      });
    },
    onSuccess: () => {
      closeModal();
    },
  });
};

export const useGetHelpfulUsers = (classroomId: string) => {
  return trpc.discussion.getHelpfulUsers.useQuery({ classroomId });
};
