import { useEffect, useState } from "react";

import { useEditEvent } from "@/hooks/event";
import { useDebounce } from "@/hooks/use-debounce";
import ReactTextareaAutosize from "react-textarea-autosize";

interface RenameEventTitleProps {
  initialTitle: string;
  eventId: string;
  isEditable: boolean;
  date: Date;
}

export const RenameEventTitle: React.FC<RenameEventTitleProps> = ({
  eventId,
  initialTitle,
  isEditable,
  date,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const debouncedTitle = useDebounce(title, 500);

  const { mutate: renameEvent } = useEditEvent({ closeModal: undefined, date });

  useEffect(() => {
    if (title === initialTitle) return;

    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    if (title === initialTitle) return;

    const formattedTitle =
      debouncedTitle.length === 0
        ? "Untitled Discussion"
        : debouncedTitle.trim();

    renameEvent({ eventId, title: formattedTitle });
  }, [debouncedTitle]);

  return isEditable ? (
    <ReactTextareaAutosize
      placeholder="Untitled Event"
      className="bg-transparent focus:outline-none w-full resize-none"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  ) : (
    <span>{title}</span>
  );
};
