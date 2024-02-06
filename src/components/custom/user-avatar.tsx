import { User } from "next-auth";
import { User as UserIcon } from "lucide-react";
import { AvatarProps } from "@radix-ui/react-avatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps extends AvatarProps {
  user: User;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      <AvatarImage src={user.image ?? ""} alt={user?.name ?? "user avatar"} />
      <AvatarFallback className="rounded-md">
        <span className="sr-only">{user?.name}</span>
        <UserIcon className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
};
