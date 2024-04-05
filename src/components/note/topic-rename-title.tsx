import { useEffect, useState } from "react";

import { useRenameTopic } from "@/hooks/note";
import { getShortenedText } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface TopicRenameTitleProps {
  topicId: string;
  topicTitle: string;
  disabled: boolean;
}

export const TopicRenameTitle: React.FC<TopicRenameTitleProps> = ({
  topicId,
  topicTitle,
  disabled = false,
}) => {
  const [title, setTitle] = useState(topicTitle);
  const debouncedTitle = useDebounce(title, 500);

  const { mutate: renameTitle } = useRenameTopic();

  useEffect(() => {
    if (title === topicTitle || disabled) return;

    const formattedTitle =
      debouncedTitle.length === 0 ? "Untitled Topic" : debouncedTitle.trim();
    ("");

    renameTitle({ name: formattedTitle, topicId });
  }, [debouncedTitle]);

  return disabled ? (
    <p>{getShortenedText(title, 25)}</p>
  ) : (
    <input
      tabIndex={-1}
      placeholder="Untitled Note"
      className="bg-transparent focus:outline-none w-full resize-none"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
};
