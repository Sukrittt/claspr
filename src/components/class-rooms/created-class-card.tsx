import Link from "next/link";
import { MoreVertical } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExtendedClassRoomsCreated } from "@/types";
import { getShortenedText, timeAgo } from "@/lib/utils";
import { UserAvatar } from "@/components/custom/user-avatar";

interface ClassCardProps {
  classRoom: ExtendedClassRoomsCreated;
}

export const CreatedClassGridView: React.FC<ClassCardProps> = ({
  classRoom,
}) => {
  return (
    <Link href={`/class/${classRoom.id}`}>
      <Card className="rounded-xl hover:bg-slate-100 transition">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{getShortenedText(classRoom.title, 25)}</CardTitle>
            <MoreVertical className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground text-sm">
            <div className="flex gap-x-2 items-center">
              <span>Created by</span>
              <div className="flex items-center gap-x-1">
                <UserAvatar user={classRoom.teacher} className="h-5 w-5" />
                <span>{classRoom.teacher.name}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        {/* <CardContent>Show upcoming events</CardContent> */}
        <CardFooter className="flex justify-end text-xs font-medium text-muted-foreground">
          <p>Updated {timeAgo(classRoom.updatedAt)}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export const CreatedClassListView: React.FC<ClassCardProps> = ({
  classRoom,
}) => {
  return (
    <Link href={`/class/${classRoom.id}`}>
      <Card className="hover:bg-slate-100 transition">
        <CardContent className="p-3 grid grid-cols-5 gap-x-2 items-center">
          <h3 className="col-span-3 tracking-tight">{classRoom.title}</h3>
          <div className="flex items-center gap-x-1">
            <UserAvatar user={classRoom.teacher} className="h-6 w-6" />
            <span className="tracking-tight">{classRoom.teacher.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">{timeAgo(classRoom.updatedAt)}</p>
            <div className="pr-2">
              <MoreVertical className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
