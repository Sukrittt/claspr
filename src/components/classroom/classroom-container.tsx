import { Session } from "next-auth";
import {
  Bot,
  ClipboardList,
  LibraryBig,
  MessageSquare,
  Settings,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UserType } from "@prisma/client";
import { notFound, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { ClassMembers } from "./class-members";
import { ClassroomCard } from "./classroom-card";
import { ExtendedClassroomDetails } from "@/types";
import { ClassroomSettings } from "./classroom-settings";
import { ClassroomControls } from "./classroom-controls";
import { useQueryChange } from "@/hooks/use-query-change";
import { ClassOptionsDropdown } from "./class-options-dropdown";
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
  userRole: UserType;
}

export type ClassroomOptions =
  | "assignments"
  | "study-materials"
  | "discussions"
  | "members"
  | "conversations"
  | "settings";

export type OptionType = {
  label: string;
  value: ClassroomOptions;
  icon: JSX.Element;
};

export const ClassroomContainer: React.FC<ClassroomContainerProps> = ({
  classroom,
  session,
  userRole,
}) => {
  const params = useSearchParams();

  const activeTab = params.get("tab") as ClassroomOptions;
  const handleQueryChange = useQueryChange();
  const [tabValue, setTabValue] = useState<ClassroomOptions>(
    activeTab ?? "assignments"
  );

  const handleTabChange = (value: string) => {
    const typedValue = value as ClassroomOptions;
    setTabValue(typedValue);

    if (typedValue === "settings" && classroom.teacherId !== session.user.id) {
      return;
    }

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

  const tabOptions: OptionType[] = [
    {
      label: "Assignments",
      value: "assignments",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      label: "Study Materials",
      value: "study-materials",
      icon: <LibraryBig className="h-4 w-4" />,
    },
    {
      label: "Discussions",
      value: "discussions",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      label: "Members",
      value: "members",
      icon: <UsersRound className="h-4 w-4" />,
    },
    {
      label: "AI Chat",
      value: "conversations",
      icon: <Bot className="h-4 w-4" />,
    },
  ];

  function isValidTab(status: string) {
    if (!status) return true;

    if (status === "settings" && classroom.teacherId !== session.user.id)
      return false;

    const tabs = [
      "assignments",
      "study-materials",
      "discussions",
      "members",
      "conversations",
      "settings",
    ];

    return tabs.some((s) => s === status);
  }

  if (!isValidTab(activeTab)) notFound();

  return (
    <Tabs value={tabValue} onValueChange={handleTabChange} className="h-full">
      <div className="flex items-center justify-between">
        {/* FOR SMALLER SCREENS */}
        <ClassOptionsDropdown
          tabOptions={tabOptions}
          tabValue={tabValue}
          setTabValue={setTabValue}
          isTeacher={classroom.teacherId === session.user.id}
        />

        <TabsList className="mb-2 hidden xl:block">
          {tabOptions.map((option) => (
            <TabsTrigger
              key={option.value}
              className={cn("ml-0", {
                "text-foreground": tabValue === option.value,
              })}
              value={option.value}
            >
              <div className="flex items-center gap-x-2">
                {option.icon}
                <span>{option.label}</span>
              </div>
            </TabsTrigger>
          ))}

          {classroom.teacherId === session.user.id && (
            <TabsTrigger
              value="settings"
              onClick={() => setTabValue("settings")}
            >
              <div className="flex items-center gap-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
            </TabsTrigger>
          )}
        </TabsList>

        <ClassroomControls classroom={classroom} sessionId={session.user.id} />
      </div>
      <div className="grid grid-cols-7 gap-4 h-[95%] pt-4">
        <div className="col-span-7 lg:col-span-5">
          {/* ASSIGNMENTS */}
          <TabsContent value="assignments" className="h-full">
            <Assignments classroomId={classroom.id} session={session} />
          </TabsContent>

          {/* STUDY MATERIALS */}
          <TabsContent className="h-full" value="study-materials">
            <StudyMaterialLayout
              classroomId={classroom.id}
              session={session}
              userRole={userRole}
            />
          </TabsContent>

          {/* DISCUSSIONS */}
          <TabsContent className="h-full" value="discussions">
            <div className="grid grid-cols-8 gap-4">
              <div className="col-span-8 lg:col-span-2 flex flex-col gap-y-6">
                <DiscussionTabs classroomId={classroom.id} />
                <div className="hidden lg:block ">
                  <HelpfulUsers classroomId={classroom.id} />
                </div>
              </div>
              <div className="col-span-8 lg:col-span-6">
                <ClassDiscussions
                  classroomId={classroom.id}
                  session={session}
                />
                <div className="lg:hidden">
                  <HelpfulUsers classroomId={classroom.id} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* MEMBERS */}
          <TabsContent className="h-full" value="members">
            <ClassMembers
              protectedDomain={classroom.protectedDomain}
              members={classroom.students}
              creator={classroom.teacher}
              sessionId={session.user.id}
            />
          </TabsContent>

          {/* CONVERSATIONS */}
          <TabsContent className="h-full" value="conversations">
            <ConversationHistory classroomId={classroom.id} />
          </TabsContent>

          {/* SETTINGS */}
          {classroom.teacherId === session.user.id && (
            <TabsContent className="h-full" value="settings">
              <ClassroomSettings classroom={classroom} />
            </TabsContent>
          )}
        </div>

        <div className="col-span-7 lg:col-span-2 flex flex-col gap-2 h-full pt-4 pb-4 lg:pb-0">
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
