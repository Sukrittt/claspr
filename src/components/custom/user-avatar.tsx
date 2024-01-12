import { User } from "next-auth";
import { UserType } from "@prisma/client";
import { User as UserIcon } from "lucide-react";
import { AvatarProps } from "@radix-ui/react-avatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps extends AvatarProps {
  user: User;
  userRole: UserType | null;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  userRole,
  ...props
}) => {
  const imageByRole = {
    [UserType.STUDENT]: "/student.png",
    [UserType.TEACHER]: "/teacher.png",
    DEFAULT: "/user.png",
  };

  return (
    <Avatar {...props}>
      <AvatarImage
        src={user.image ?? imageByRole[userRole ?? "DEFAULT"]}
        alt={user?.name ?? "user avatar"}
        className="cursor-pointer"
      />
      <AvatarFallback className="cursor-pointer">
        <span className="sr-only">{user?.name}</span>
        <UserIcon className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
};
