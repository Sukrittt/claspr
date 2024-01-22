import { toast } from "sonner";
import { useState } from "react";
import Markdown from "react-markdown";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Loader, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ContainerVariants } from "@/lib/motion";
import { ExtendedClassroomDetails } from "@/types";
import { PromptValidatorType } from "@/types/validator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { AiInputSkeleton } from "@/components/skeletons/ai-input-skeleton";

interface ClassAIDialogProps {
  classroom: ExtendedClassroomDetails;
}

export const ClassAIDialog: React.FC<ClassAIDialogProps> = ({ classroom }) => {
  const [input, setInput] = useState("");
  const [res, setRes] = useState("");
  const [prevInput, setPrevInput] = useState("");

  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const utils = trpc.useUtils();

  const { data: prevConversations, isLoading: isFetchingConversations } =
    trpc.conversation.getPreviousConversations.useQuery({
      classroomId: classroom.id,
    });

  const { mutate: createConversation } =
    trpc.conversation.createConversation.useMutation({
      onSuccess: () => {
        utils.conversation.getPreviousConversations.invalidate();
      },
    });

  const { mutate: handleSubmission, isLoading } = useMutation({
    mutationFn: async (userQuery: string) => {
      const prevConvo = prevConversations?.map((convo) => {
        return {
          prompt: convo.prompt,
          answer: convo.answer,
        };
      });

      const payload: PromptValidatorType = {
        prompt: userQuery,
        classDescription: classroom.description,
        prevConversations: prevConvo ?? [],
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute bottom-8 right-10 group">
          <CustomTooltip text="Ask AI">
            <div>
              <Button className="rounded-full p-2 h-12 w-12">
                <Sparkles className="w-5 h-5 group-hover:rotate-90 transition duration-300" />
              </Button>
            </div>
          </CustomTooltip>
        </div>
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
              className={cn(
                "transition-[height] opacity-0 border border-border rounded-md",
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
                <CustomTooltip text="Click to copy">
                  <span
                    className="cursor-pointer"
                    onClick={() => handleCopyOutput(res)}
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 cursor-pointer" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 cursor-pointer" />
                    )}
                  </span>
                </CustomTooltip>
              </div>
              <Markdown className="text-[15px] text-gray-800">{res}</Markdown>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
