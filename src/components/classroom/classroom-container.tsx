import { Session } from "next-auth";
import {
  Bot,
  ClipboardList,
  LibraryBig,
  MessageSquare,
  UsersRound,
} from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { ClassMembers } from "./class-members";
import { ClassroomCard } from "./classroom-card";
import { ExtendedClassroomDetails } from "@/types";
import { ClassroomControls } from "./classroom-controls";
import { useQueryChange } from "@/hooks/use-query-change";
import { Assignments } from "@/components/assignment/assignments";
import { StudyMaterialLayout } from "@/components/study-materials";
import { UpcomingEvents } from "@/components/event/upcoming-events";
import { HelpfulUsers } from "@/components/discussions/helpful-users";
import { DiscussionTabs } from "@/components/discussions/discussion-tabs";
import { ClassDiscussions } from "@/components/discussions/class-discussions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationHistory } from "@/components/conversation/conversation-history";

interface ClassroomContainerProps {
  classroom: ExtendedClassroomDetails;
  session: Session;
}

type ClassroomOptions =
  | "assignments"
  | "study-materials"
  | "discussions"
  | "members"
  | "conversations";

export const ClassroomContainer: React.FC<ClassroomContainerProps> = ({
  classroom,
  session,
}) => {
  const params = useSearchParams();

  const activeTab = params.get("tab") as ClassroomOptions;
  const handleQueryChange = useQueryChange();

  const handleTabChange = (value: string) => {
    const typedValue = value as ClassroomOptions;

    const initialUrl = `/c/${classroom.id}`;

    handleQueryChange(initialUrl, {
      tab: typedValue,
      folder: null,
      note: null,
      active: null,
      discussion: null,
    });
  };

  useEffect(() => {
    if (activeTab) return;

    const initialUrl = `/c/${classroom.id}`;

    handleQueryChange(initialUrl, {
      tab: "assignments",
      folder: null,
      note: null,
      active: null,
      discussion: null,
    });
  }, [activeTab]);

  return (
    <Tabs
      defaultValue={activeTab ?? "assignments"}
      onValueChange={handleTabChange}
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
          {/* ASSIGNMENTS */}
          <TabsContent value="assignments" className="h-full">
            <Assignments classroomId={classroom.id} session={session} />
          </TabsContent>

          {/* STUDY MATERIALS */}
          <TabsContent className="h-full" value="study-materials">
            <StudyMaterialLayout classroomId={classroom.id} session={session} />
          </TabsContent>

          {/* DISCUSSIONS */}
          <TabsContent className="h-full" value="discussions">
            <div className="grid grid-cols-8 gap-4">
              <div className="col-span-2 flex flex-col gap-y-6">
                <DiscussionTabs classroomId={classroom.id} />
                <HelpfulUsers classroomId={classroom.id} />
              </div>
              <div className="col-span-6">
                <ClassDiscussions
                  classroomId={classroom.id}
                  session={session}
                />
              </div>
            </div>
          </TabsContent>

          {/* MEMBERS */}
          <TabsContent className="h-full" value="members">
            <ClassMembers
              members={classroom.students}
              creator={classroom.teacher}
              sessionId={session.user.id}
            />
          </TabsContent>

          {/* CONVERSATIONS */}
          <TabsContent className="h-full" value="conversations">
            <ConversationHistory classroomId={classroom.id} />
          </TabsContent>
        </div>

        <div className="col-span-2 flex flex-col gap-2 h-full pt-4">
          {/* CLASSROOM DETAILS */}
          <ClassroomCard classroom={classroom} sessionId={session.user.id} />
          <div className="flex-1">
            {/* UPCOMING EVENTS */}
            <UpcomingEvents classroomId={classroom.id} />
          </div>
        </div>
      </div>
    </Tabs>
  );
};
