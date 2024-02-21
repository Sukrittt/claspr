import { useAtom } from "jotai";
import { useEffect } from "react";

import { FormattedNote } from "@/types/note";
import { Editor } from "@/components/editor/Editor";
import { useUpdateNoteContent } from "@/hooks/note";
import { contentAtom, isSubmittingAtom } from "@/atoms";

interface MaterialContentProps {
  note: FormattedNote;
}

export const MaterialContent: React.FC<MaterialContentProps> = ({ note }) => {
  const [editorContent] = useAtom(contentAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const { mutate: updateContent } = useUpdateNoteContent();

  const handleUpdateContent = () => {
    updateContent({
      noteId: note.id,
      content: editorContent,
    });

    setIsSubmitting(undefined);
  };

  useEffect(() => {
    if (isSubmitting !== undefined && !isSubmitting) {
      handleUpdateContent();
    }
  }, [isSubmitting]);

  const customAiTrigger = (
    <div className="absolute -top-14 right-0">
      <div className="py-[3px] px-3 border rounded-full text-[13px] text-neutral-200 bg-primary font-medium hover:bg-primary/90 transition tracking-tight cursor-pointer">
        <span>Generate</span>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <Editor
        content={note.content}
        note={note}
        getDebouncedContent
        isNotePage
        customAiTrigger={customAiTrigger}
      />
    </div>
  );
};
