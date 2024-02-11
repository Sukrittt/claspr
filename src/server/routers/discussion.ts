import { createTRPCRouter } from "@/server/trpc";

import {
  startDiscussion,
  getDiscussions,
  getDiscussionDetails,
  addReply,
  addReaction,
  editDiscussion,
  removeDiscussion,
  editReply,
  removeReply,
  getIsAnswered,
  toggleAnswerSelection,
} from "@/server/discussion/routes";

export const discussionRouter = createTRPCRouter({
  startDiscussion,
  getDiscussions,
  getDiscussionDetails,
  addReply,
  addReaction,
  editDiscussion,
  removeDiscussion,
  editReply,
  removeReply,
  getIsAnswered,
  toggleAnswerSelection,
});
