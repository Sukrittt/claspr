"use client";
import { useSearchParams } from "next/navigation";
import {
  Hash,
  Lightbulb,
  Megaphone,
  MessageCircleQuestion,
} from "lucide-react";
import { useAtom } from "jotai";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { useQueryChange } from "@/hooks/use-query-change";
import { activeDiscussionIdAtom, activeDiscussionTabAtom } from "@/atoms";

export const tabs = [
  {
    label: "Announcements",
    value: "announcements",
    icon: Megaphone,
  },
  {
    label: "Questionnaires",
    value: "questionnaires",
    icon: MessageCircleQuestion,
  },
  {
    label: "General",
    value: "general",
    icon: Hash,
  },
  {
    label: "Ideas",
    value: "ideas",
    icon: Lightbulb,
  },
] as const;

export type DiscussionTab = (typeof tabs)[number]["value"];

export const DiscussionTabs = ({ classroomId }: { classroomId: string }) => {
  const params = useSearchParams();

  const paramDiscussionTab = params.get("active") as DiscussionTab;
  const paramDiscussionId = params.get("discussion");

  const [activeTab, setActiveTab] = useAtom(activeDiscussionTabAtom);
  const [, setActiveDiscussionId] = useAtom(activeDiscussionIdAtom);

  const handleQueryChange = useQueryChange();

  useEffect(() => {
    if (paramDiscussionTab) {
      setActiveTab(paramDiscussionTab);
    }

    if (paramDiscussionId) {
      setActiveDiscussionId(paramDiscussionId);
    }
  }, [params]);

  useEffect(() => {
    if (paramDiscussionTab) return;

    const initialUrl = `/c/${classroomId}`;

    handleQueryChange(initialUrl, {
      active: "announcements",
      tab: "discussions",
    });

    setActiveTab("announcements");
  }, [activeTab]);

  return (
    <div className="space-y-4 text-neutral-800">
      <h3 className="tracking-tight font-medium text-[13px]">Categories</h3>
      <div className="flex flex-col gap-y-2">
        {tabs.map((tab, index) => (
          <div
            onClick={() => {
              setActiveTab(tab.value);
              setActiveDiscussionId(null);

              const initialUrl = `/c/${classroomId}`;

              handleQueryChange(initialUrl, {
                active: tab.value,
                folder: null,
                note: null,
                discussion: null,
              });
            }}
            key={index}
            className={cn(
              "py-1 px-2.5 flex items-center gap-x-2 hover:bg-neutral-100 rounded-md text-[13px] cursor-pointer",
              {
                "bg-neutral-100 font-medium": activeTab === tab.value,
              }
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            <p>{tab.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
