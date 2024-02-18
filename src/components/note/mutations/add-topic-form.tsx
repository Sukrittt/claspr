import { toast } from "sonner";
import { Check, Loader2, Pen, Plus, Trash } from "lucide-react";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { MinifiedNote } from "@/types";
import { MinifiedTopic } from "@/types/note";
import { Input } from "@/components/ui/input";
import { useAttachTopics, useRemoveTopics } from "@/hooks/note";
import { Button } from "@/components/ui/button";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { ContainerHeightVariants, ContainerVariants } from "@/lib/motion";

interface AddTopicFormProps {
  closeModal: () => void;
  note: MinifiedNote & {
    topics: MinifiedTopic[];
  };
}

type SelectionType = {
  topicId?: string;
  topic: string;
  type: "SERVER" | "CLIENT";
};

export const AddTopicForm: React.FC<AddTopicFormProps> = ({
  closeModal,
  note,
}) => {
  const [topicName, setTopicName] = useState("");

  const [enteredTopics, setEnteredTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<SelectionType[]>([]);

  const [isEditing, setIsEditing] = useState(false);

  const { mutate: attachTopics, isLoading } = useAttachTopics({
    closeModal,
  });

  const { mutate: removeTopics } = useRemoveTopics(note.folderId);

  const handleStateUpdates = useCallback(() => {
    setEnteredTopics((prev) => [...prev, topicName]);
    setTopicName("");
  }, [topicName, setEnteredTopics, setTopicName]);

  const addTopic = useCallback(() => {
    const trimmedTopic = topicName.trim();

    if (trimmedTopic === "") {
      toast.error("Please enter a valid topic name");
      return;
    }

    const existingDbTopic = note.topics.find(
      (topic) => topic.name.toLowerCase() === trimmedTopic.toLowerCase()
    );

    const existingEnteredTopic = enteredTopics.find(
      (t) => t.toLowerCase() === trimmedTopic.toLowerCase()
    );

    if (existingDbTopic || existingEnteredTopic) {
      toast.error("This topic is already added");
      return;
    }

    handleStateUpdates();
  }, [topicName, note.topics, enteredTopics, handleStateUpdates]);

  // Remove topics
  const handleRemoveTopics = useCallback(() => {
    const serverRemovalTopics = selectedTopics.filter(
      (selection) => selection.type === "SERVER"
    );

    const clientRemoveTopics = selectedTopics.filter(
      (selection) => selection.type === "CLIENT"
    );

    // CLIENT UPDATE
    if (clientRemoveTopics.length > 0) {
      const filteredTopics = enteredTopics.filter(
        (topic) => !clientRemoveTopics.some((t) => t.topic === topic)
      );

      setEnteredTopics(filteredTopics);
    }

    // SERVER UPDATE
    if (serverRemovalTopics.length > 0) {
      const topicIds = serverRemovalTopics.map((t) => t.topicId!);

      removeTopics({
        noteId: note.id,
        topicIds,
      });
    }

    setSelectedTopics([]);
  }, [enteredTopics, selectedTopics, note.id, removeTopics]);

  // Add selected topics
  const handleAddSelectedTopic = useCallback(
    (topic: string, type: "CLIENT" | "SERVER", topicId?: string) => {
      if (!isEditing) return;

      const existingSelection = selectedTopics.find((t) => t.topic === topic);

      if (existingSelection) {
        setSelectedTopics((prev) => prev.filter((t) => t.topic !== topic));
        return;
      }

      const selectionObj: SelectionType = {
        topicId,
        topic,
        type,
      };

      setSelectedTopics((prev) => [...prev, selectionObj]);
    },
    [isEditing, selectedTopics]
  );

  //DB UPDATE
  function handleAttachTopics() {
    if (enteredTopics.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }

    attachTopics({
      noteId: note.id,
      topics: enteredTopics,
    });
  }

  return (
    <div className="space-y-4 relative">
      <AnimatePresence mode="wait">
        {(note.topics.length > 0 || enteredTopics.length > 0) && (
          <motion.div
            variants={ContainerHeightVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center flex-wrap gap-2"
          >
            {/* SERVER TOPICS */}
            {note.topics.map((topic) => (
              <motion.div
                variants={ContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                key={topic.id}
                onClick={() =>
                  handleAddSelectedTopic(topic.name, "SERVER", topic.id)
                }
                className={cn(
                  "px-5 py-1 text-[13px] rounded-md border transition",
                  {
                    "cursor-pointer": isEditing,
                    "hover:bg-neutral-100":
                      isEditing &&
                      !selectedTopics.some(
                        (selection) => selection.topic === topic.name
                      ),
                    "border-sky-500 bg-sky-200 hover:bg-sky-200/80":
                      selectedTopics.some(
                        (selection) => selection.topic === topic.name
                      ),
                  }
                )}
              >
                {topic.name}
              </motion.div>
            ))}

            {/* CLIENT TOPICS */}
            {enteredTopics.map((topic, index) => (
              <motion.div
                variants={ContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                key={index}
                onClick={() => handleAddSelectedTopic(topic, "CLIENT")}
                className={cn(
                  "px-5 py-1 text-[13px] rounded-md border transition",
                  {
                    "cursor-pointer": isEditing,
                    "hover:bg-neutral-100":
                      isEditing &&
                      !selectedTopics.some(
                        (selection) => selection.topic === topic
                      ),
                    "border-sky-500 bg-sky-200 hover:bg-sky-200/80":
                      selectedTopics.some(
                        (selection) => selection.topic === topic
                      ),
                  }
                )}
              >
                {topic}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {(note.topics.length > 0 || enteredTopics.length > 0) && (
        <div
          className="absolute -top-[53px] border p-1.5 rounded-md right-2 hover:bg-neutral-100 transition cursor-pointer"
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
              <Pen className="h-3 w-3 text-neutral-800" />
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
          disabled={isLoading}
          placeholder="E.g: Diophantine Equations"
          autoFocus
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTopic();
            }
          }}
        />
        <Button className="h-8" onClick={addTopic} disabled={isLoading}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button
        className="my-1 w-full"
        disabled={isLoading}
        onClick={handleAttachTopics}
      >
        {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
        <span className="sr-only">Save</span>
      </Button>
    </div>
  );
};
