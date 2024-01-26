import { toast } from "sonner";
import { useState } from "react";
import Markdown from "react-markdown";
import { Check, Copy } from "lucide-react";
import { Conversation } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

import { ContainerVariants } from "@/lib/motion";
import { Separator } from "@/components/ui/separator";
import { useConversation } from "@/hooks/conversation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClearConversation } from "./clear-conversation";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ChatHistory = ({ classroomId }: { classroomId: string }) => {
  const { data: conversations, isLoading } = useConversation(classroomId);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="pt-6 space-y-4"
      >
        <div className="flex justify-between items-end pr-3">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              Previous Interactions with our AI
            </h3>
            <p className="text-muted-foreground">
              Your recent <span className="font-semibold">30</span>{" "}
              conversations are used for providing better context to our AI
            </p>
          </div>
          <ClearConversation
            classroomId={classroomId}
            disabled={conversations?.length === 0}
          />
        </div>
        <Separator />
        {(!conversations || conversations.length === 0) && !isLoading ? (
          <p className="text-muted-foreground text-sm">
            Your conversations with our AI for this classroom will appear here.
          </p>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="flex flex-col gap-y-4">
              {conversations?.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

const ConversationCard = ({ conversation }: { conversation: Conversation }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyOutput = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    toast.success("Copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-neutral-100 shadow-none border border-border relative group">
      <CardHeader className="bg-neutral-200 py-3">
        <CardTitle className="text-lg">{conversation.prompt}</CardTitle>
      </CardHeader>
      <CardContent
        className="py-3 text-gray-800 text-[15px] cursor-pointer"
        onClick={() => handleCopyOutput(conversation.answer)}
      >
        <Markdown>{conversation.answer}</Markdown>
      </CardContent>
      <div className="opacity-0 group-hover:opacity-100 transition absolute bottom-2.5 right-3">
        <CustomTooltip text="Click to copy">
          {copied ? (
            <Check className="w-3 h-3" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </CustomTooltip>
      </div>
    </Card>
  );
};
