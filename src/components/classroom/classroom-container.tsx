import { Session } from "next-auth";
import {
  Bot,
  ClipboardList,
  LibraryBig,
  MessageSquare,
  UsersRound,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import { ClassMembers } from "./class-members";
import { ClassroomCard } from "./classroom-card";
import { UpcomingEvents } from "./upcoming-events";
import { ExtendedClassroomDetails } from "@/types";
import { ClassroomControls } from "./classroom-controls";
import { Assignments } from "@/components/assignment/assignments";
import { DiscussionTabs } from "@/components/discussions/discusion-tabs";
import { ClassDiscussions } from "@/components/discussions/class-discussions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationHistory } from "@/components/conversation/conversation-history";

interface ClassroomContainerProps {
  classroom: ExtendedClassroomDetails;
  session: Session;
}

export const ClassroomContainer: React.FC<ClassroomContainerProps> = ({
  classroom,
  session,
}) => {
  const params = useSearchParams();

  return (
    <Tabs
      defaultValue={params.get("tab") ? "discussions" : "assignments"}
      className="h-full"
    >
      <div className="flex items-center justify-between">
        <TabsList className="mb-2">
          <TabsTrigger className="ml-0" value="assignments">
            <div className="flex items-center gap-x-2">
              <ClipboardList className="w-4 h-4" />
              <span>Assignments</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="study-materials">
            <div className="flex items-center gap-x-2">
              <LibraryBig className="w-4 h-4" />
              <span>Study materials</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="discussions">
            <div className="flex items-center gap-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Discussions</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="members">
            <div className="flex items-center gap-x-2">
              <UsersRound className="w-4 h-4" />
              <span>Members</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="conversations">
            <div className="flex items-center gap-x-2">
              <Bot className="w-4 h-4" />
              <span>AI Chat</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <ClassroomControls classroom={classroom} sessionId={session.user.id} />
      </div>
      <div className="grid grid-cols-7 gap-4 h-[95%] pt-4">
        <div className="col-span-5">
          <TabsContent value="assignments" className="h-full">
            <Assignments classroomId={classroom.id} session={session} />
          </TabsContent>
          <TabsContent className="h-full" value="study-materials">
            Study Materials
          </TabsContent>
          <TabsContent className="h-full" value="discussions">
            <div className="grid grid-cols-8 gap-4">
              <div className="col-span-2">
                <DiscussionTabs classroomId={classroom.id} />
              </div>
              <div className="col-span-6">
                <ClassDiscussions classroom={classroom} session={session} />
              </div>
            </div>
          </TabsContent>
          <TabsContent className="h-full" value="members">
            <ClassMembers
              members={classroom.students}
              creator={classroom.teacher}
              sessionId={session.user.id}
            />
          </TabsContent>
          <TabsContent className="h-full" value="conversations">
            <ConversationHistory classroomId={classroom.id} />
          </TabsContent>
        </div>
        <div className="col-span-2 flex flex-col gap-2 h-full pt-4">
          <ClassroomCard classroom={classroom} sessionId={session.user.id} />
          <div className="flex-1">
            <UpcomingEvents classroom={classroom} />
          </div>
        </div>
      </div>
    </Tabs>
  );
};
