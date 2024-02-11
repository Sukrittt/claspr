import { useEffect, useState } from "react";
import { DiscussionType } from "@prisma/client";
import ReactTextareaAutosize from "react-textarea-autosize";

import { useDebounce } from "@/hooks/use-debounce";
import { useEditDiscussion } from "@/hooks/discussion";

interface RenameDiscussionTitleProps {
  initialTitle: string;
  discussionId: string;
  discussionType: DiscussionType;
  isEditable: boolean;
}

export const RenameDiscussionTitle: React.FC<RenameDiscussionTitleProps> = ({
  discussionId,
  discussionType,
  initialTitle,
  isEditable,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const debouncedTitle = useDebounce(title, 500);

  const { mutate: renameTitle } = useEditDiscussion({
    discussionType,
    setTitle,
  });

  useEffect(() => {
    if (!isEditable || title === initialTitle) return;

    const formattedTitle =
      debouncedTitle.length === 0
        ? "Untitled Discussion"
        : debouncedTitle.trim();

    renameTitle({ discussionId, title: formattedTitle });
  }, [debouncedTitle, isEditable]);

  return isEditable ? (
    <ReactTextareaAutosize
      placeholder="Untitled Discussion"
      className="tracking-tight text-2xl bg-transparent focus:outline-none w-full resize-none"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  ) : (
    <h5 className="tracking-tight text-2xl">{title}</h5>
  );
};
