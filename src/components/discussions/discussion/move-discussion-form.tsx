import qs from "query-string";
import { Loader } from "lucide-react";
import { useCallback, useState } from "react";
import { DiscussionType } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEditDiscussion } from "@/hooks/discussion";
import { tabs } from "@/components/discussions/discussion-tabs";

interface MoveDiscussionFormProps {
  discussionId: string;
  discussionType: DiscussionType;
  classroomId: string;
  closeModal: () => void;
}

export const MoveDiscussionForm: React.FC<MoveDiscussionFormProps> = ({
  discussionId,
  discussionType,
  closeModal,
  classroomId,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const [selectedTab, setSelectedTab] =
    useState<DiscussionType>(discussionType);

  const handleQueryChange = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      tab: selectedTab,
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
  }, [params, selectedTab]);

  const cleanUps = () => {
    handleQueryChange();
    closeModal();
  };

  const { mutate: moveDiscussion, isLoading } = useEditDiscussion({
    discussionType,
    closeModal: cleanUps,
  });

  return (
    <div className="space-y-4">
      <Select
        disabled={isLoading}
        value={selectedTab}
        onValueChange={(val) => setSelectedTab(val as DiscussionType)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {tabs.map((tab) => (
            <SelectItem key={tab.value} value={tab.value}>
              {tab.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className="w-full"
        disabled={isLoading}
        onClick={() =>
          moveDiscussion({ discussionId, discussionType: selectedTab })
        }
      >
        {isLoading ? <Loader className="h-3 w-3 animate-spin" /> : "Save"}
      </Button>
    </div>
  );
};
