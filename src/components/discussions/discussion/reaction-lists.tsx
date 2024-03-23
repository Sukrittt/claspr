import { toast } from "sonner";
import { Session } from "next-auth";
import { Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { ReactionType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

import { ExtendedReaction } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { listOfReactions } from "@/config/utils";
import { ContainerVariants } from "@/lib/motion";
import { useAddReaction } from "@/hooks/discussion";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ReactionListsProps {
  discussionId: string;
  replyId?: string;
  reactions: ExtendedReaction[];
  session: Session;
}

export const ReactionLists: React.FC<ReactionListsProps> = ({
  reactions,
  session,
  discussionId,
  replyId,
}) => {
  const [open, setOpen] = useState(false);

  const selectedReaction = reactions.find(
    (reaction) => reaction.user.id === session.user.id
  );

  const [selectedReactionValue, setSelectedReactionValue] = useState<
    ReactionType | undefined
  >(selectedReaction?.reaction);

  const { mutate: addReaction, isLoading } = useAddReaction({
    closePopover: () => setOpen(false),
  });

  const handleAddReaction = (reaction: ReactionType | undefined) => {
    if (!reaction || reaction.length === 0) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    addReaction({
      reactionType: reaction,
      discussionId,
      replyId,
    });
  };

  const handleReactionChange = (val: string) => {
    const validValue = val.length > 0;

    // A workaround to take the previous state value of reaction because when a reaction is removed, I am not getting the reaction which was removed.
    handleAddReaction(
      validValue ? (val as ReactionType) : selectedReactionValue
    );

    setSelectedReactionValue(validValue ? (val as ReactionType) : undefined);
  };

  useEffect(() => {
    setSelectedReactionValue(selectedReaction?.reaction);
  }, [selectedReaction?.reaction]);

  return (
    <div className="flex items-center gap-x-2">
      <Popover open={open} onOpenChange={(val) => setOpen(val)}>
        <PopoverTrigger asChild>
          <div className="border p-1 w-fit rounded-full cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-800/70 transition">
            <Smile className="h-4 w-4 text-neutral-800 dark:text-foreground" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-1">
          <ToggleGroup
            type="single"
            disabled={isLoading}
            value={selectedReactionValue}
            onValueChange={handleReactionChange}
          >
            {listOfReactions.map((reaction) => (
              <ToggleGroupItem
                className={cn("h-8", {
                  "dark:bg-neutral-800":
                    selectedReactionValue === reaction.value,
                })}
                key={reaction.value}
                value={reaction.value}
              >
                <CustomTooltip text={reaction.label}>
                  <span className="-ml-[5px]">{reaction.emoji}</span>
                </CustomTooltip>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </PopoverContent>
      </Popover>

      <ReactionsDisplay
        disabled={isLoading}
        reactions={reactions}
        session={session}
        handleReactionChange={handleReactionChange}
      />
    </div>
  );
};

interface ReactionsDisplayProps {
  reactions: ExtendedReaction[];
  session: Session;
  handleReactionChange: (val: string) => void;
  disabled: boolean;
}

const ReactionsDisplay: React.FC<ReactionsDisplayProps> = ({
  reactions,
  session,
  handleReactionChange,
  disabled,
}) => {
  const reactionCounts = reactions.reduce(
    (acc, reaction) => {
      acc[reaction.reaction] = (acc[reaction.reaction] || 0) + 1;
      return acc;
    },
    {
      THUMBS_UP: 0,
      THUMBS_DOWN: 0,
      SMILE: 0,
      PARTY_POPPER: 0,
      SAD: 0,
      HEART: 0,
      ROCKET: 0,
      EYES: 0,
    }
  );

  return (
    <AnimatePresence mode="wait">
      <div className="flex items-center gap-x-2">
        {Object.keys(reactionCounts).map((reactionType) => {
          const emoji = listOfReactions.find(
            (r) => r.value === reactionType
          )?.emoji;

          const emojiCount = reactionCounts[reactionType as ReactionType];

          if (emojiCount === 0) return null;

          const userReacted = reactions.some(
            (reaction) =>
              reaction.reaction === reactionType &&
              reaction.user.id === session.user.id
          );

          return (
            <motion.div
              variants={ContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              key={reactionType}
              onClick={() => handleReactionChange(reactionType)}
              className={cn(
                "border rounded-lg px-2 py-0.5 text-xs flex items-center gap-x-2 cursor-pointer hover:bg-neutral-200/70 hover:bg-neutral-800 hover:border-border transition",
                {
                  "bg-sky-100 dark:bg-sky-900/30 text-sky-500 dark:text-sky-600 border-sky-500 dark:border-sky-600 dark:hover:bg-sky-900/50":
                    userReacted,
                  "opacity-50 cursor-default": disabled,
                }
              )}
            >
              <span>{emoji}</span>
              <span>{emojiCount}</span>
            </motion.div>
          );
        })}
      </div>
    </AnimatePresence>
  );
};
