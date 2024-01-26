import { createTRPCRouter } from "@/server/trpc";
import {
  createConversation,
  getPreviousConversations,
  removeConversation,
  clearConversation,
} from "@/server/conversation/routes";

export const conversationRouter = createTRPCRouter({
  createConversation,
  getPreviousConversations,
  removeConversation,
  clearConversation,
});
