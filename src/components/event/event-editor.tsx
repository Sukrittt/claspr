import { useAtom } from "jotai";
import { useEffect } from "react";

import { ExtendedEvent } from "@/types";
import { useEditEvent } from "@/hooks/event";
import { Editor } from "@/components/editor/Editor";
import { contentAtom, isSubmittingAtom } from "@/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";

export const EventEditor = ({ event }: { event: ExtendedEvent }) => {
  const [content] = useAtom(contentAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const { mutate: updateContent } = useEditEvent({ closeModal: undefined });

  const handleUpdateContent = () => {
    updateContent({
      eventId: event.id,
      description: content,
    });
    setIsSubmitting(undefined);
  };

  useEffect(() => {
    if (isSubmitting !== undefined && !isSubmitting) {
      handleUpdateContent();
    }
  }, [isSubmitting]);

  return (
    <ScrollArea className="h-[50vh]">
      <Editor
        disableAI
        content={event.description}
        placeholder="What is this event about?"
        getDebouncedContent
      />
    </ScrollArea>
  );
};
