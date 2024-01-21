import { toast } from "sonner";
import { useState } from "react";
import Markdown from "react-markdown";
import { Loader, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExtendedClassroom } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface ClassAIDialogProps {
  classroom: ExtendedClassroom;
}

type Payload = {
  prompt: string;
};

export const ClassAIDialog: React.FC<ClassAIDialogProps> = ({ classroom }) => {
  const markdown = "";
  const [input, setInput] = useState("");
  const [res, setRes] = useState("");

  const { mutate: handleSubmission, isLoading } = useMutation({
    mutationFn: async (userQuery: string) => {
      const payload: Payload = {
        prompt: userQuery,
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
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let done = false;

        let accResponse = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);

          accResponse += chunkValue;
          setRes(accResponse);
        }
      }
    },
  });

  const handleAskAI = (query: string) => {
    toast.message("This feature is work in progress. Please try again later.");
    // setRes("");

    // if (query.length <= 3) {
    //   toast.error("Your prompt is too short. Please give more context.");
    // }

    // handleSubmission(query);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ask me anything</DialogTitle>
          <DialogDescription>
            Unlock personalized insights with AI&rsquo;s prompt memory.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-x-2">
          <Input
            placeholder="Type your prompt here."
            disabled={isLoading}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAskAI(input);
              }
            }}
          />
          <Button
            disabled={isLoading || input.length === 0}
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
        {res && (
          <ScrollArea className="h-[300px]">
            <div className="p-5 border border-border rounded-md">
              <Markdown>{res}</Markdown>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
