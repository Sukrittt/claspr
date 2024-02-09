import { Session } from "next-auth";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AvatarUser = {
  session: Session;
  image: string | null;
  name: string | null;
};

type AvatarGroupProps = {
  data: AvatarUser[];
};

export const AvatarGroup = ({ data }: AvatarGroupProps) => {
  const AVATARS_TO_SHOW = 3;
  const REMAINING_AVATARS = data.length - AVATARS_TO_SHOW;

  return (
    <div className="avatar-group flex items-center">
      <TooltipProvider>
        {data
          .slice(0, AVATARS_TO_SHOW)
          .map(({ name, image, session }, index) => (
            <Tooltip key={index}>
              <TooltipTrigger
                className={cn(
                  { "-ml-4": index !== 0 },
                  "transition-all avatar"
                )}
                asChild
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={image as string} alt={name as string} />
                  <AvatarFallback>{name}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                {session.user.name === name ? "You" : (name as string)}
              </TooltipContent>
            </Tooltip>
          ))}
      </TooltipProvider>
      {REMAINING_AVATARS > 0 && (
        <div className="avatar -ml-4 rounded-full flex items-center justify-center font-semibold bg-slate-700 h-11 w-11 relative z-10">
          +{data.length - AVATARS_TO_SHOW}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
