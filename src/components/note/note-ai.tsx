import { toast } from "sonner";
import { useAtom } from "jotai";
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
import {
  useConversation,
  useCreateConversation,
  useUpdateCredits,
} from "@/hooks/conversation";
import { ExtendedNote } from "@/types";
import { FormattedNote } from "@/types/note";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, getFilteredResponse } from "@/lib/utils";
import { creditModalAtom, creditsAtom } from "@/atoms";
import { PromptValidatorType } from "@/types/validator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { AiDialogVariants, ContainerVariants } from "@/lib/motion";
import { AiPersonal, previousConversationTrainingText } from "@/config/ai";

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

  const [credits] = useAtom(creditsAtom);
  const [, setCreditModal] = useAtom(creditModalAtom);

  const [input, setInput] = useState("");
  const [res, setRes] = useState("");
  const [prevInput, setPrevInput] = useState("");

  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState("");

  const { data: prevConversations, isLoading: isFetchingConversations } =
    useConversation(undefined, note.id, 30);

  const { mutate: createConversation } = useCreateConversation();
  const { mutate: updateCredits } = useUpdateCredits();

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

        // Update the credits
        updateCredits({ credits: 1, updateType: "SUBTRACT" });

        setIsGenerating(false);
      }
    },
  });

  const handleAskAI = (query: string) => {
    if (isGenerating) return;

    if (credits === 0) {
      toast.error(
        "You don't have enough credits to use this feature. Please purchase more credits.",
      );

      setOpen(false);
      setCreditModal(true);

      return;
    }

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
      if (e.key === "a" && (e.metaKey || e.altKey)) {
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
            className="group absolute bottom-6 right-8"
          >
            <CustomTooltip text="Ask AI">
              <div>
                <Button className="h-10 w-10 rounded-full p-2 shadow-lg">
                  <Sparkles className="h-[18px] w-[18px] transition duration-300 group-hover:rotate-90" />
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
                "relative rounded-md border border-border opacity-0 transition-[height]",
                {
                  "h-[300px] p-5 opacity-100": res.length !== 0,
                  "h-0 cursor-default": res.length === 0,
                },
              )}
            >
              <div
                onClick={() => handleCopyOutput(res)}
                className="group cursor-pointer"
              >
                <h3 className="pb-1.5 text-[17px] font-semibold tracking-tight">
                  {prevInput}
                </h3>
                <div className="absolute bottom-3 right-3 flex items-center gap-x-3 opacity-100 transition group-hover:opacity-100 lg:opacity-0">
                  <CustomTooltip text="Click to copy">
                    {copied ? (
                      <Check className="h-3 w-3 transition hover:text-gray-800 dark:hover:text-foreground" />
                    ) : (
                      <Copy className="h-3 w-3 transition hover:text-gray-800 dark:hover:text-foreground" />
                    )}
                  </CustomTooltip>
                  {!isLoading && (
                    <CustomTooltip text="Move to editor">
                      <ArrowUpLeft
                        className="h-4 w-4 transition hover:text-gray-800 dark:hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveToEditor(res);
                        }}
                      />
                    </CustomTooltip>
                  )}
                </div>
                <Markdown className="text-[15px] text-gray-800 dark:text-neutral-400">
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
                    className="mt-4 space-y-1"
                  >
                    <h5 className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-foreground">
                      Next Up
                    </h5>
                    <p className="text-[15px] text-gray-800 dark:text-neutral-400">
                      {followUpQuestion}{" "}
                      <span
                        onClick={() => {
                          setInput(followUpQuestion);
                          handleAskAI(followUpQuestion);
                        }}
                        className="cursor-pointer text-sm font-medium text-muted-foreground underline-offset-4 hover:underline dark:text-neutral-300"
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
              className="h-8 focus-visible:ring-transparent"
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
                <div className="flex h-5 w-6 items-center justify-center">
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
