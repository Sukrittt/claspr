import { toast } from "sonner";
import { useState } from "react";
import { Session } from "next-auth";
import { Smile } from "lucide-react";
import { ReactionType } from "@prisma/client";

import { ExtendedReaction } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { listOfReactions } from "@/config/utils";
import { useAddReaction } from "@/hooks/discussion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface ReactionListsProps {
  discussionId?: string;
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
    (reaction) => reaction.userId === session.user.id
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

    //a workaround to take the previous state value because when reaction is removed, I am not getting which reaction was removed.
    handleAddReaction(
      validValue ? (val as ReactionType) : selectedReactionValue
    );

    setSelectedReactionValue(validValue ? (val as ReactionType) : undefined);
  };

  return (
    <div className="flex items-center gap-x-2">
      <Popover open={open} onOpenChange={(val) => setOpen(val)}>
        <PopoverTrigger asChild>
          <div className="border p-1 w-fit rounded-full cursor-pointer">
            <Smile className="h-4 w-4 text-neutral-800" />
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
                className="h-8"
                key={reaction.value}
                value={reaction.value}
              >
                {reaction.emoji}
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
            reaction.userId === session.user.id
        );

        return (
          <div
            key={reactionType}
            onClick={() => handleReactionChange(reactionType)}
            className={cn(
              "border rounded-lg px-2 py-0.5 text-xs flex items-center gap-x-2 cursor-pointer hover:bg-neutral-200/70 transition",
              {
                "bg-sky-100 border-sky-500": userReacted,
                "opacity-50 cursor-default": disabled,
              }
            )}
          >
            <span>{emoji}</span>
            <span>{emojiCount}</span>
          </div>
        );
      })}
    </div>
  );
};