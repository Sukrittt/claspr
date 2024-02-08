import { createTRPCRouter } from "@/server/trpc";

import { startDiscussion, getDiscussions } from "@/server/discussion/routes";

export const discussionRouter = createTRPCRouter({
  startDiscussion,
  getDiscussions,
});
