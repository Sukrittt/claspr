import { useAtom } from "jotai";
import { useEffect } from "react";

import { Editor } from "@/components/editor/Editor";
import { useUpdateNoteContent } from "@/hooks/note";
import { contentAtom, isSubmittingAtom } from "@/atoms";

interface MaterialContentProps {
  content: any;
  noteId: string;
}

export const MaterialContent: React.FC<MaterialContentProps> = ({
  content,
  noteId,
}) => {
  const [editorContent] = useAtom(contentAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const { mutate: updateContent } = useUpdateNoteContent();

  const handleUpdateContent = () => {
    updateContent({
      noteId,
      content: editorContent,
    });

    setIsSubmitting(undefined);
  };

  useEffect(() => {
    if (isSubmitting !== undefined && !isSubmitting) {
      handleUpdateContent();
    }
  }, [isSubmitting]);

  return <Editor content={content} getDebouncedContent />;
};
