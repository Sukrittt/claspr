import { toast } from "sonner";
import { useState } from "react";
import Markdown from "react-markdown";
import { ClassRoom } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpLeft, Check, Copy, Loader, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiPersonal, type AiPersonalType } from "@/config/ai";
import { ExtendedClassroomDetails } from "@/types";
import { PromptValidatorType } from "@/types/validator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { AiDialogVariants, ContainerVariants } from "@/lib/motion";
import { AiInputSkeleton } from "@/components/skeletons/ai-input-skeleton";
import { useConversation, useCreateConversation } from "@/hooks/conversation";

interface ClassAIDialogProps {
  classroom: ExtendedClassroomDetails | ClassRoom;
  moveToEditor?: (text: string) => void;
  personal?: AiPersonalType;
  temperature?: number;
  addInfo?: string;
}

const followUpInstructions = AiPersonal["FOLLOW_UP"];

export const AIDialog: React.FC<ClassAIDialogProps> = ({
  classroom,
  moveToEditor,
  personal,
  temperature,
  addInfo,
}) => {
  const [open, setOpen] = useState(false);

  const [input, setInput] = useState("");
  const [res, setRes] = useState("");
  const [prevInput, setPrevInput] = useState("");

  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState("");

  const { data: prevConversations, isLoading: isFetchingConversations } =
    useConversation(classroom.id, 30);

  const { mutate: createConversation } = useCreateConversation();

  const { mutate: handleSubmission, isLoading } = useMutation({
    mutationFn: async (userQuery: string) => {
      const prevConvo = prevConversations?.map((convo) => {
        return {
          prompt: convo.prompt,
          answer: convo.answer,
        };
      });

      const prompt = addInfo
        ? `This is the title given by the teacher for this assignment: ${addInfo}. Generate content based on this query: ${userQuery}`
        : userQuery;

      const payload: PromptValidatorType = {
        prompt: prompt + "\n\n" + followUpInstructions,
        classTitle: classroom.title,
        classDescription: classroom.description,
        prevConversations: prevConvo ?? [],
        personal: AiPersonal[personal ?? "TEACHER"],
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
          classroomId: classroom.id,
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

    navigator.clipboard.writeText(text);
    setCopied(true);

    toast.success("Copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMoveToEditor = (text: string) => {
    moveToEditor?.(text);
    toast.success("Moved to editor.");
    setOpen(false);
  };

  const getFilteredResponse = (text: string) => {
    const underscoreIndex = text.lastIndexOf("^^");
    const result =
      underscoreIndex !== -1 ? text.substring(0, underscoreIndex) : text;

    return result;
  };

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>
        <motion.div
          variants={AiDialogVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute bottom-8 right-10 group"
        >
          <CustomTooltip text="Ask AI">
            <div>
              <Button className="rounded-full p-2 h-12 w-12 shadow-lg">
                <Sparkles className="w-5 h-5 group-hover:rotate-90 transition duration-300" />
              </Button>
            </div>
          </CustomTooltip>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ask me anything</DialogTitle>
          <DialogDescription>
            Unlock personalized insights with AI&rsquo;s prompt memory
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
                <div className="hidden group-hover:flex gap-x-3 items-center absolute bottom-3 right-3">
                  <CustomTooltip text="Click to copy">
                    {copied ? (
                      <Check className="w-3 h-3 hover:text-gray-800 transition" />
                    ) : (
                      <Copy className="w-3 h-3 hover:text-gray-800 transition" />
                    )}
                  </CustomTooltip>
                  {moveToEditor && !isLoading && (
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
          {isFetchingConversations ? (
            <AiInputSkeleton />
          ) : (
            <div className="flex gap-x-2">
              <Input
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
                disabled={isLoading || isGenerating || input.length === 0}
                onClick={() => handleAskAI(input)}
              >
                {isLoading ? (
                  <div className="h-5 w-6 flex items-center justify-center">
                    <Loader className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  "Ask"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
