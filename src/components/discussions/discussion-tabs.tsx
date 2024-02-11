import qs from "query-string";
import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Hash,
  Lightbulb,
  Megaphone,
  MessageCircleQuestion,
} from "lucide-react";
import { useAtom } from "jotai";

import { cn } from "@/lib/utils";
import { isChangingQueryAtom } from "@/atoms";

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
];

export const DiscussionTabs = ({ classroomId }: { classroomId: string }) => {
  const router = useRouter();
  const params = useSearchParams();

  const [, setIsChangingQuery] = useAtom(isChangingQueryAtom);

  const activeTab = params?.get("tab") ?? "announcements";

  useEffect(() => {
    setIsChangingQuery(false);
  }, [params]);

  const handleQueryChange = useCallback(
    (value: string) => {
      let currentQuery = {};

      if (params) {
        currentQuery = qs.parse(params.toString());
      }

      const updatedQuery: any = {
        ...currentQuery,
        tab: value,
        active: undefined,
      };

      const url = qs.stringifyUrl(
        {
          url: `/c/${classroomId}`,
          query: updatedQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [params]
  );

  return (
    <div className="space-y-4 text-neutral-800">
      <h3 className="tracking-tight font-medium text-[13px]">Categories</h3>
      <div className="flex flex-col gap-y-2">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={cn(
              "py-1 px-2.5 flex items-center gap-x-2 hover:bg-neutral-100 rounded-md text-[13px] cursor-pointer",
              {
                "bg-neutral-100 font-medium": activeTab === tab.value,
              }
            )}
            onClick={() => {
              setIsChangingQuery(true);
              handleQueryChange(tab.value);
            }}
          >
            <tab.icon className="h-3.5 w-3.5" />
            <p>{tab.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
