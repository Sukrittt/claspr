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
        ? `This is the title given by the teacher for this assignment: ${addInfo}. Generate prompt based on this query: ${userQuery}`
        : userQuery;

      const payload: PromptValidatorType = {
        prompt,
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
              <Button className="rounded-full p-2 h-12 w-12">
                <Sparkles className="w-5 h-5 group-hover:rotate-90 transition duration-300" />
              </Button>
            </div>
          </CustomTooltip>
        </motion.div>
      </DialogTrigger>
      <DialogContent
        className={cn("max-w-2xl", {
          "pb-2": res.length === 0,
        })}
      >
        <DialogHeader>
          <DialogTitle>Ask me anything</DialogTitle>
          <DialogDescription>
            Unlock personalized insights with AI&rsquo;s prompt memory.
          </DialogDescription>
        </DialogHeader>
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
        <AnimatePresence mode="wait">
          <motion.div
            variants={ContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ScrollArea
              onClick={() => handleCopyOutput(res)}
              className={cn(
                "transition-[height] opacity-0 border border-border rounded-md cursor-pointer",
                {
                  "h-[300px] p-5 opacity-100": res.length !== 0,
                  "h-0": res.length === 0,
                }
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[17px] tracking-tight pb-1.5">
                  {prevInput}
                </h3>
                <div className="flex gap-x-3 items-center">
                  <CustomTooltip text="Click to copy">
                    {copied ? (
                      <Check className="w-3.5 h-3.5 hover:text-gray-800 transition" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 hover:text-gray-800 transition" />
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
              </div>
              <Markdown className="text-[15px] text-gray-800">{res}</Markdown>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
