import { createTRPCRouter } from "@/server/trpc";
import {
  createConversation,
  getPreviousConversations,
} from "@/server/conversation/routes";

export const conversationRouter = createTRPCRouter({
  createConversation,
  getPreviousConversations,
});
