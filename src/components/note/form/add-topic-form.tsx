import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, Pen, Plus, Trash } from "lucide-react";

import { cn } from "@/lib/utils";
import { FormattedNote } from "@/types/note";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAttachTopic, useRemoveTopics } from "@/hooks/note";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { TopicRenameTitle } from "@/components/note/topic-rename-title";
import { ContainerHeightVariants, ContainerVariants } from "@/lib/motion";

interface AddTopicFormProps {
  note: FormattedNote;
  classroomId?: string;
}

type SelectionType = {
  topicId: string;
  topic: string;
};

export const AddTopicForm: React.FC<AddTopicFormProps> = ({
  note,
  classroomId,
}) => {
  const [topicName, setTopicName] = useState("");

  const [selectedTopics, setSelectedTopics] = useState<SelectionType[]>([]);

  const [isEditing, setIsEditing] = useState(false);

  const { mutate: attachTopic, isLoading } = useAttachTopic({
    classroomId,
    handleCleanups: () => setTopicName(""),
    folderId: note.folderId,
  });

  const { mutate: removeTopics } = useRemoveTopics(
    note.folderId,
    () => setIsEditing(false),
    classroomId
  );

  //SERVER UPDATE
  const handleAttachTopic = useCallback(
    (topicName: string) => {
      if (note.topics.length === 0) {
        toast.error("Please add at least one topic");
        return;
      }

      attachTopic({
        noteId: note.id,
        name: topicName,
      });
    },
    [attachTopic, note.id, note.topics]
  );

  const addTopic = useCallback(() => {
    const trimmedTopic = topicName.trim();

    if (trimmedTopic === "") {
      toast.error("Please enter a valid topic name");
      return;
    }

    const existingDbTopic = note.topics.find(
      (topic) => topic.name.toLowerCase() === trimmedTopic.toLowerCase()
    );

    if (existingDbTopic) {
      toast.error("This topic is already added");
      return;
    }

    // SERVER
    handleAttachTopic(topicName);
  }, [topicName, note.topics, handleAttachTopic]);

  // Remove topics
  const handleRemoveTopics = useCallback(() => {
    // SERVER UPDATE
    if (selectedTopics.length > 0) {
      const topicIds = selectedTopics.map((t) => t.topicId);

      removeTopics({
        noteId: note.id,
        topicIds,
      });
    }

    setSelectedTopics([]);
  }, [selectedTopics, note.id, removeTopics]);

  // Add selected topics
  const handleAddSelectedTopic = useCallback(
    (topic: string, topicId: string) => {
      if (!isEditing) return;

      const existingSelection = selectedTopics.find((t) => t.topic === topic);

      if (existingSelection) {
        setSelectedTopics((prev) => prev.filter((t) => t.topic !== topic));
        return;
      }

      const selectionObj: SelectionType = {
        topicId,
        topic,
      };

      setSelectedTopics((prev) => [...prev, selectionObj]);
    },
    [isEditing, selectedTopics]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        e.preventDefault();

        if (!isEditing || selectedTopics.length === 0) return;

        handleRemoveTopics();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRemoveTopics, isEditing, selectedTopics]);

  return (
    <div className="space-y-4 relative">
      <AnimatePresence mode="wait">
        {note.topics.length > 0 && (
          <motion.div
            variants={ContainerHeightVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="grid grid-cols-3 items-center gap-2"
          >
            {/* SERVER TOPICS */}
            {note.topics.map((topic) => (
              <motion.div
                variants={ContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                key={topic.id}
                onClick={() => handleAddSelectedTopic(topic.name, topic.id)}
                className={cn(
                  "px-5 py-1 text-[13px] rounded-md border transition",
                  {
                    "cursor-pointer": isEditing,
                    "hover:bg-neutral-100 dark:hover:bg-neutral-800":
                      isEditing &&
                      !selectedTopics.some(
                        (selection) => selection.topic === topic.name
                      ),
                    "border-sky-500 dark:border-sky-600 bg-sky-200 dark:bg-sky-600/30 hover:bg-sky-200/80 dark:hover:bg-sky-600/50":
                      selectedTopics.some(
                        (selection) => selection.topic === topic.name
                      ),
                  }
                )}
              >
                <TopicRenameTitle
                  topicId={topic.id}
                  topicTitle={topic.name}
                  disabled={isEditing}
                />
                {/* {topic.name} */}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {note.topics.length > 0 && (
        <div
          className="absolute -top-[53px] border p-1.5 rounded-md right-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          <CustomTooltip
            text={`${
              isEditing
                ? selectedTopics.length === 0
                  ? "Save"
                  : "Remove"
                : "Edit"
            }`}
          >
            {!isEditing ? (
              <Pen className="h-3 w-3 text-neutral-800 dark:text-foreground" />
            ) : selectedTopics.length === 0 ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <Trash
                className="h-3 w-3 text-success"
                onClick={handleRemoveTopics}
              />
            )}
          </CustomTooltip>
        </div>
      )}

      <div className="flex items-center gap-x-2">
        <Input
          className="h-8"
          placeholder="E.g: Diophantine Equations"
          autoFocus
          disabled={isLoading}
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTopic();
            }
          }}
        />
        <Button className="h-8" onClick={addTopic} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* <Button className="my-1 w-full" onClick={closeModal}>
        Save
        <span className="sr-only">Save</span>
      </Button> */}
    </div>
  );
};
