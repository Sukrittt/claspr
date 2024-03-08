import { toast } from "sonner";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpLeft, Check, Copy, Loader2, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExtendedNote } from "@/types";
import { FormattedNote } from "@/types/note";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, getFilteredResponse } from "@/lib/utils";
import { PromptValidatorType } from "@/types/validator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { AiDialogVariants, ContainerVariants } from "@/lib/motion";
import { AiPersonal, previousConversationTrainingText } from "@/config/ai";
import { useConversation, useCreateConversation } from "@/hooks/conversation";

/**
 - This component has repetitive code from ai-dialog.tsx. However, it is much more feasible to extract out the logic to generate content for note creation as it is a bit different from the other use cases.
 - The component is responsible for generating content for the note creation page using the AI.
 - This is different because ai-dialog.tsx is fully tailored to generate responses as per the classroom. However, note creation is not always a part of classroom.
 */

interface NoteAiProps {
  note: ExtendedNote | FormattedNote;
  moveToEditor: (text: string) => void;
  temperature?: number;
  customAiTrigger?: JSX.Element;
}

export const NoteAi: React.FC<NoteAiProps> = ({
  note,
  moveToEditor,
  temperature,
  customAiTrigger,
}) => {
  const [open, setOpen] = useState(false);

  const [input, setInput] = useState("");
  const [res, setRes] = useState("");
  const [prevInput, setPrevInput] = useState("");

  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState("");

  const { data: prevConversations, isLoading: isFetchingConversations } =
    useConversation(undefined, note.id, 30);

  const { mutate: createConversation } = useCreateConversation();

  const { mutate: handleSubmission, isLoading } = useMutation({
    mutationFn: async (userQuery: string) => {
      const prevConvo =
        prevConversations?.length === 0
          ? "I did not have any conversations with you yet. You can safely ignore this.\n"
          : prevConversations
              ?.map((c, index) => {
                return `\n${index + 1}. ${c.prompt}. \n Your answer: ${
                  c.answer
                } \n ${
                  c.feedback
                    ? ` I gave a ${c.feedback} to this conversation.`
                    : ""
                }`;
              })
              .join("\n\n");

      const formattedInput = `\nThis is the title given by the user for this note: ${note.title}.\n\nNow, you are supposed to generate content based on this prompt: ${userQuery}`;

      const customUserPrompt =
        previousConversationTrainingText +
        prevConvo +
        formattedInput +
        "\n\n" +
        AiPersonal["FOLLOW_UP"];

      const payload: PromptValidatorType = {
        prompt: customUserPrompt,
        personal: AiPersonal["NOTE_CREATOR_EXPERT"],
        temperature,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.body;
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later.");
    },
    onSuccess: async (stream) => {
      if (!stream || stream === null) {
        toast.error("Error generating the response", {
          position: "bottom-center",
        });
      } else {
        setInput("");
        setFollowUpQuestion("");
        setPrevInput(input);

        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let done = false;
        setIsGenerating(true);

        let accResponse = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);

          accResponse += chunkValue;
          setRes(accResponse);
        }

        // To extract the follow up question using the ^^ symbol
        const lastIndex = accResponse.lastIndexOf("^^");
        const nextQuestion =
          lastIndex === -1 ? "" : accResponse.substring(lastIndex + 2);

        setFollowUpQuestion(nextQuestion);

        // Create a conversation with the AI
        createConversation({
          noteId: note.id,
          prompt: input,
          answer: accResponse,
        });

        setIsGenerating(false);
      }
    },
  });

  const handleAskAI = (query: string) => {
    if (isGenerating) return;

    setRes("");
    setPrevInput("");

    if (query.length <= 3) {
      toast.error("Your prompt is too short. Please give more context.");
      return;
    }

    handleSubmission(query);
  };

  const handleCopyOutput = (text: string) => {
    if (!text) return;

    navigator.clipboard.writeText(getFilteredResponse(text));
    setCopied(true);

    toast.success("Copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMoveToEditor = (text: string) => {
    const filterdContent = getFilteredResponse(text);

    moveToEditor?.(filterdContent);
    toast.success("Moved to editor.");
    setOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>
        {customAiTrigger ? (
          customAiTrigger
        ) : (
          <motion.div
            variants={AiDialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute bottom-6 right-8 group"
          >
            <CustomTooltip text="Ask AI">
              <div>
                <Button className="rounded-full p-2 h-10 w-10 shadow-lg">
                  <Sparkles className="w-[18px] h-[18px] group-hover:rotate-90 transition duration-300" />
                </Button>
              </div>
            </CustomTooltip>
          </motion.div>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ask me anything</DialogTitle>
          <DialogDescription>
            I can help you generate content for your note. Just ask me anything.
          </DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait">
          <motion.div
            variants={ContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ScrollArea
              className={cn(
                "transition-[height] opacity-0 border border-border rounded-md relative",
                {
                  "h-[300px] p-5 opacity-100": res.length !== 0,
                  "h-0 cursor-default": res.length === 0,
                }
              )}
            >
              <div
                onClick={() => handleCopyOutput(res)}
                className="cursor-pointer group"
              >
                <h3 className="font-semibold text-[17px] tracking-tight pb-1.5">
                  {prevInput}
                </h3>
                <div className="opacity-0 group-hover:opacity-100 transition flex gap-x-3 items-center absolute bottom-3 right-3">
                  <CustomTooltip text="Click to copy">
                    {copied ? (
                      <Check className="w-3 h-3 hover:text-gray-800 transition" />
                    ) : (
                      <Copy className="w-3 h-3 hover:text-gray-800 transition" />
                    )}
                  </CustomTooltip>
                  {!isLoading && (
                    <CustomTooltip text="Move to editor">
                      <ArrowUpLeft
                        className="w-4 h-4 hover:text-gray-800 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveToEditor(res);
                        }}
                      />
                    </CustomTooltip>
                  )}
                </div>
                <Markdown className="text-[15px] text-gray-800">
                  {getFilteredResponse(res)}
                </Markdown>
              </div>
              <AnimatePresence mode="wait">
                {followUpQuestion && (
                  <motion.div
                    variants={ContainerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-1 mt-4"
                  >
                    <h5 className="font-semibold text-sm text-neutral-800 tracking-tight">
                      Next Up
                    </h5>
                    <p className="text-[15px] text-gray-800">
                      {followUpQuestion}{" "}
                      <span
                        onClick={() => {
                          setInput(followUpQuestion);
                          handleAskAI(followUpQuestion);
                        }}
                        className="font-medium text-muted-foreground text-sm hover:underline underline-offset-4 cursor-pointer"
                      >
                        Continue.
                      </span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
        <div
          className={cn({
            "-mt-4": res.length === 0,
          })}
        >
          <div className="flex gap-x-2">
            <Input
              className="focus-visible:ring-transparent h-8"
              placeholder="Type your prompt here."
              disabled={isLoading || isGenerating}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAskAI(input);
                }
              }}
            />
            <Button
              className="h-8"
              disabled={
                isLoading ||
                isFetchingConversations ||
                isGenerating ||
                input.length === 0
              }
              onClick={() => handleAskAI(input)}
            >
              {isLoading ? (
                <div className="h-5 w-6 flex items-center justify-center">
                  <Loader2 className="h-3 w-3 animate-spin" />
                </div>
              ) : (
                "Ask"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
