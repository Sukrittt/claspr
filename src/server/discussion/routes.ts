import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { getIsPartOfClassAuth } from "@/server/class/routes";

/**
 * Startes a discussion for a class.
 *
 * @param {object} input - The input parameters for starting a discussion.
 * @param {string} input.classroomId - The id of the classroom.
 * @param {string} input.title - The title of the discussion.
 * @param {any} input.content - The content of the discussion.
 * @param {enum} input.discussionType - The type of discussion.
 */
export const startDiscussion = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
      title: z.string().min(3).max(100),
      content: z.any(),
      discussionType: z.enum(["general", "announcements", "questionnaires"]),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { classroomId, discussionType, title, content } = input;

    const existingClassroom = await db.classRoom.findFirst({
      where: {
        id: classroomId,
      },
    });

    if (!existingClassroom) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the classroom you are looking for.",
      });
    }

    const isPartOfClass = await getIsPartOfClassAuth(classroomId, ctx.userId);

    if (!isPartOfClass) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a part of this classroom to start a discussion.",
      });
    }

    await db.discussion.create({
      data: {
        title,
        content,
        discussionType,
        classroomId,
        creatorId: ctx.userId,
      },
    });
  });

/**
 * To get the discussions for a classroom.
 *
 * @param {object} input - The input parameters for getting classroom discussions.
 * @param {string} input.classroomId - The id of the classroom.
 * @param {enum} input.discussionType - The type of discussion to fetch.
 * @returns {Promise<Object[]>} - A list of discussion objects from the database.
 */
export const getDiscussions = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
      discussionType: z.enum(["general", "announcements", "questionnaires"]),
    })
  )
  .query(async ({ input, ctx }) => {
    const { classroomId, discussionType } = input;

    const existingClassroom = await db.classRoom.findFirst({
      where: { id: classroomId },
      select: { description: true },
    });

    if (!existingClassroom) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the classroom you are looking for.",
      });
    }

    const isPartOfClass = await getIsPartOfClassAuth(classroomId, ctx.userId);

    if (!isPartOfClass) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a part of this classroom to view discussions.",
      });
    }

    const discussions = await db.discussion.findMany({
      where: {
        classroomId,
        discussionType,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        creator: true,
        _count: {
          select: {
            replies: true,
          },
        },
        replies: {
          include: {
            creator: true,
          },
          distinct: ["creatorId"],
          take: 3,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return discussions;
  });

/**
 * To get the details of a discussion.
 *
 * @param {object} input - The input parameters for getting discussion details.
 * @param {string} input.discussionId - The id of the discussion.
 * @param {enum} input.discussionType - The type of discussion to fetch.
 * @returns {Promise<Object[]>} - A discussion object from the database.
 */
export const getDiscussionDetails = privateProcedure
  .input(
    z.object({
      discussionId: z.string(),
      discussionType: z.enum(["general", "announcements", "questionnaires"]),
    })
  )
  .query(async ({ input }) => {
    const { discussionId, discussionType } = input;

    const discussion = await db.discussion.findFirst({
      where: { id: discussionId, discussionType },
      include: {
        creator: true,
        replies: {
          where: {
            replyId: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            creator: true,
            replies: {
              include: {
                creator: true,
                reactions: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            reactions: {
              include: {
                user: true,
              },
            },
          },
        },
        reactions: {
          include: {
            user: true,
          },
          where: {
            replyId: null,
          },
        },
      },
    });

    if (!discussion) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the classroom you are looking for.",
      });
    }

    return discussion;
  });

/**
 * To add a reply to discussion or reply.
 *
 * @param {object} input - The input parameters for adding a reply.
 * @param {string} input.discussionId - The id of the discussion.
 * @param {string} input.text - The text of the reply.
 * @param {string} input.replyId - An optional id of the reply to reply to.
 */
export const addReply = privateProcedure
  .input(
    z.object({
      discussionId: z.string(),
      text: z.string().min(1).max(100),
      replyId: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { discussionId, text, replyId } = input;

    const existingDiscussion = await db.discussion.findFirst({
      where: {
        id: discussionId,
      },
    });

    if (!existingDiscussion) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the discussion you are looking for.",
      });
    }

    const isPartOfClass = await getIsPartOfClassAuth(
      existingDiscussion.classroomId,
      ctx.userId
    );

    if (!isPartOfClass) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "You are not a part of this classroom to reply to this discussion.",
      });
    }

    await db.reply.create({
      data: {
        text,
        discussionId,
        replyId,
        creatorId: ctx.userId,
      },
    });
  });

/**
 * To add a reaction for a discussion or reply.
 *
 * @param {object} input - The input parameters for adding a reaction.
 * @param {string} input.discussionId - An optional id of discussion.
 * @param {string} input.replyId - An optional replyId when reaction attaached to a reply.
 * @param {enum} input.reactionType - An optional type of reaction to add to the discussion or reply.
 */
export const addReaction = privateProcedure
  .input(
    z.object({
      discussionId: z.string().optional(),
      replyId: z.string().optional(),
      reactionType: z.enum([
        "THUMBS_UP",
        "THUMBS_DOWN",
        "SMILE",
        "PARTY_POPPER",
        "SAD",
        "HEART",
        "ROCKET",
        "EYES",
      ]),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { discussionId, reactionType, replyId } = input;

    const existingDiscussion = await db.discussion.findFirst({
      where: { id: discussionId },
      select: { id: true, classroomId: true },
    });

    if (!existingDiscussion) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The discussion you are looking for does not exist.",
      });
    }

    const isPartOfClass = await getIsPartOfClassAuth(
      existingDiscussion.classroomId,
      ctx.userId
    );

    if (!isPartOfClass) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a part of this classroom to start a discussion.",
      });
    }

    const existingReaction = await db.reaction.findFirst({
      where: {
        discussionId,
        userId: ctx.userId,
        replyId,
      },
      select: { id: true, reaction: true },
    });

    if (existingReaction) {
      if (existingReaction.reaction === reactionType) {
        await db.reaction.delete({
          where: {
            id: existingReaction.id,
            discussionId,
            userId: ctx.userId,
            replyId,
          },
        });
      } else {
        await db.reaction.update({
          data: {
            reaction: reactionType,
          },
          where: {
            id: existingReaction.id,
            discussionId,
            userId: ctx.userId,
            replyId,
          },
        });
      }
    } else {
      await db.reaction.create({
        data: {
          discussionId,
          replyId,
          reaction: reactionType,
          userId: ctx.userId,
        },
      });
    }
  });

/**
 * To rename the title of a discussion.
 *
 * @param {object} input - The input parameters for adding a reaction.
 * @param {string} input.discussionId - The id of discussion.
 * @param {string} input.title - The updated title of the description.
 */
export const renameTitle = privateProcedure
  .input(
    z.object({
      discussionId: z.string(),
      title: z.string().min(3).max(100),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { discussionId, title } = input;

    const existingDiscussion = await db.discussion.findFirst({
      where: {
        id: discussionId,
        creatorId: ctx.userId,
      },
      select: { id: true, creatorId: true },
    });

    if (!existingDiscussion) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The discussion you are looking for does not exist.",
      });
    }

    await db.discussion.update({
      data: {
        title,
      },
      where: {
        id: discussionId,
        creatorId: ctx.userId,
      },
    });
  });
