import { useAtom } from "jotai";
import { useEffect } from "react";
import { startOfDay } from "date-fns";

import { ExtendedEvent } from "@/types";
import { useEditEvent } from "@/hooks/event";
import { Editor } from "@/components/editor/Editor";
import { contentAtom, isSubmittingAtom } from "@/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditorOutput } from "@/components/editor/EditorOutput";

interface EventEditorProps {
  event: ExtendedEvent;
}

export const EventEditor: React.FC<EventEditorProps> = ({ event }) => {
  const [content] = useAtom(contentAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const { mutate: updateContent } = useEditEvent({
    closeModal: undefined,
    date: startOfDay(event.eventDate),
  });

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
      {!event.assignment?.description ? (
        <Editor
          disableAI
          content={event.description}
          placeholder="What is this event about?"
          getDebouncedContent
          isNotePage
        />
      ) : (
        <EditorOutput content={event.assignment.description} />
      )}
    </ScrollArea>
  );
};
