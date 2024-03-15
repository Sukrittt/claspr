import { z } from "zod";
import { subDays } from "date-fns";
import { TRPCError } from "@trpc/server";
import { DiscussionType, ReactionType } from "@prisma/client";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { getIsPartOfClassAuth } from "@/server/class/routes";

const ReactionEnum = z.nativeEnum(ReactionType);
const DiscussionEnum = z.nativeEnum(DiscussionType);

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
      discussionType: DiscussionEnum,
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

    const discussion = await db.discussion.create({
      data: {
        title,
        content,
        discussionType,
        classroomId,
        creatorId: ctx.userId,
      },
      select: {
        id: true,
        title: true,
        discussionType: true,
        classroomId: true,
        createdAt: true,
        creatorId: true,
        isEdited: true,
        content: true,

        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return discussion;
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
      discussionType: DiscussionEnum,
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
      select: {
        id: true,
        title: true,
        discussionType: true,
        classroomId: true,
        createdAt: true,
        creatorId: true,
        isEdited: true,
        content: true,

        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
        replies: {
          select: {
            id: true,
            selected: true,
            text: true,
            createdAt: true,
            creatorId: true,
            isEdited: true,
            discussionId: true,

            creator: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
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
      discussionType: DiscussionEnum,
    })
  )
  .query(async ({ input }) => {
    const { discussionId, discussionType } = input;

    const discussion = await db.discussion.findFirst({
      where: { id: discussionId, discussionType },
      select: {
        id: true,
        title: true,
        discussionType: true,
        classroomId: true,
        createdAt: true,
        creatorId: true,
        isEdited: true,
        content: true,

        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        replies: {
          where: {
            replyId: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            selected: true,
            text: true,
            createdAt: true,
            creatorId: true,
            isEdited: true,
            discussionId: true,

            creator: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
            replies: {
              select: {
                id: true,
                selected: true,
                text: true,
                createdAt: true,
                creatorId: true,
                isEdited: true,
                discussionId: true,

                creator: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
                reactions: {
                  select: {
                    id: true,
                    reaction: true,

                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                      },
                    },
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
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
      text: z.string().min(1).max(200),
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

    const reply = await db.reply.create({
      data: {
        text,
        discussionId,
        replyId,
        creatorId: ctx.userId,
      },
    });

    return reply;
  });

/**
 * To add a reaction for a discussion or reply.
 *
 * @param {object} input - The input parameters for adding a reaction.
 * @param {string} input.discussionId - An optional id of discussion.
 * @param {string} input.replyId - An optional replyId when reaction attached to a reply.
 * @param {enum} input.reactionType - An optional type of reaction to add to the discussion or reply.
 */
export const addReaction = privateProcedure
  .input(
    z.object({
      discussionId: z.string().optional(),
      replyId: z.string().optional(),
      reactionType: ReactionEnum,
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { discussionId, reactionType, replyId } = input;


    const existingDiscussion = await db.discussion.findFirst({
      where: { id: discussionId },
      select: { id: true, classroomId: true, discussionType: true },
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
        message: "You are not a part of this classroom.",
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

    // If the user has already reacted to the discussion or reply.
    if (existingReaction) {
      // If the user has already reacted with the same reaction type.
      if (existingReaction.reaction === reactionType) {
        await db.reaction.delete({
          where: {
            id: existingReaction.id,
            discussionId,
            userId: ctx.userId,
            replyId,
          },
        });
      }
      // If the user has already reacted with a different reaction type.
      else {
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
    }
    // If the user has not reacted to the discussion or reply.
    else {
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
 * To edit a discussion.
 *
 * @param {object} input - The input parameters for editing a discussion.
 * @param {string} input.discussionId - The id of discussion.
 * @param {string} input.title - The updated title of the discussion.
 * @param {any} input.content - The updated content of the discussion.
 * @param {enum} input.discussionType - The updated discussionType of the discussion.
 */
export const editDiscussion = privateProcedure
  .input(
    z.object({
      discussionId: z.string(),
      title: z.string().max(100).optional(),
      discussionType: DiscussionEnum.optional(),
      content: z.any().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { discussionId, title, content, discussionType } = input;

    const existingDiscussion = await db.discussion.findFirst({
      where: {
        id: discussionId,
        creatorId: ctx.userId,
      },
    });

    if (!existingDiscussion) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The discussion you are looking for does not exist.",
      });
    }

    await db.discussion.update({
      data: {
        title: title ?? existingDiscussion.title,
        content: content ?? existingDiscussion.content,
        discussionType: discussionType ?? existingDiscussion.discussionType,
        isEdited: true,
      },
      where: {
        id: discussionId,
        creatorId: ctx.userId,
      },
    });
  });

/**
 * To remove a discussion.
 *
 * @param {object} input - The input parameters for removing a discussion.
 * @param {string} input.discussionId - The id of discussion.
 */
export const removeDiscussion = privateProcedure
  .input(
    z.object({
      discussionId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { discussionId } = input;

    const existingDiscussion = await db.discussion.findFirst({
      where: {
        id: discussionId,
        creatorId: ctx.userId,
      },
      select: { id: true },
    });

    if (!existingDiscussion) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The discussion you are looking for does not exist.",
      });
    }

    await db.discussion.delete({
      where: {
        id: discussionId,
        creatorId: ctx.userId,
      },
    });
  });

/**
 * To edit a reply.
 *
 * @param {object} input - The input parameters for editing a reply.
 * @param {string} input.replyId - The id of the reply.
 * @param {string} input.text - The updated text of the reply.
 */
export const editReply = privateProcedure
  .input(
    z.object({
      replyId: z.string(),
      text: z.string().min(1).max(100),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { text, replyId } = input;

    const existingReply = await db.reply.findFirst({
      where: {
        id: replyId,
        creatorId: ctx.userId,
      },
    });

    if (!existingReply) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The reply you are looking for does not exist.",
      });
    }

    await db.reply.update({
      data: {
        text,
        isEdited: true,
      },
      where: {
        id: replyId,
        creatorId: ctx.userId,
      },
    });
  });

/**
 * To remove a reply.
 *
 * @param {object} input - The input parameters for removing a reply.
 * @param {string} input.replyId - The id of the reply.
 */
export const removeReply = privateProcedure
  .input(
    z.object({
      replyId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { replyId } = input;

    const existingReply = await db.reply.findFirst({
      where: {
        id: replyId,
        creatorId: ctx.userId,
      },
    });

    if (!existingReply) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The reply you are looking for does not exist.",
      });
    }

    await db.reply.delete({
      where: {
        id: replyId,
        creatorId: ctx.userId,
      },
    });
  });

/**
 * To check if a questionnaire is answered or not.
 *
 * @param {object} input - The input parameters for checking if a questionnaire is answered or not.
 * @param {string} input.discussionId - The id of the discussion.
 * @return {Promise<boolean>} - A boolean value indicating if the questionnaire is answered or not.
 */
export const getIsAnswered = privateProcedure
  .input(
    z.object({
      discussionId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { discussionId } = input;

    const existingDiscussion = await db.discussion.findFirst({
      where: {
        id: discussionId,
      },
    });

    if (!existingDiscussion) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The discussion you are looking for does not exist.",
      });
    }

    const isAnswered = await db.discussion.findFirst({
      where: {
        id: discussionId,
        discussionType: "questionnaires",
        replies: {
          some: {
            OR: [
              { selected: true },
              {
                replies: {
                  some: { selected: true },
                },
              },
            ],
          },
        },
      },
    });

    return !!isAnswered;
  });

/**
 * To toggle the selection of a reply as an answer to a questionnaire.
 *
 * @param {object} input - The input parameters for removing a reply.
 * @param {string} input.replyId - The id of the reply.
 */
export const toggleAnswerSelection = privateProcedure
  .input(
    z.object({
      replyId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { replyId } = input;

    const existingReply = await db.reply.findFirst({
      where: {
        id: replyId,
      },
    });

    if (!existingReply) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The reply you are looking for does not exist.",
      });
    }

    const alreadyAnsweredReply = await db.reply.findFirst({
      where: {
        discussionId: existingReply.discussionId,
        selected: true,
        NOT: {
          id: replyId,
        },
      },
    });

    if (alreadyAnsweredReply) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You can't select multiple answers for a questionnaire.",
      });
    }

    await db.reply.update({
      where: {
        id: replyId,
      },
      data: {
        selected: {
          set: !existingReply.selected,
        },
      },
    });
  });

/**
 * To get the users who have been helpful in all kinds of discussion.
 *
 * @param {object} input - The input parameters for getting helpful users.
 * @param {string} input.classroomId - The id of the classroom.
 * @return {Promise<object>} - A list of users who have been helpful in all kinds of discussion.
 */
export const getHelpfulUsers = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { classroomId } = input;

    const existingClassroom = await db.classRoom.findFirst({
      where: {
        id: classroomId,
      },
    });

    if (!existingClassroom) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The classroom you are looking for does not exist.",
      });
    }

    const thirtyDaysAgo = subDays(new Date(), 30);

    const helpfulUsers = await db.user.findMany({
      where: {
        replies: {
          some: {
            discussion: {
              classroomId,
            },
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
        },
      },
      orderBy: {
        replies: {
          _count: "desc",
        },
      },
      include: {
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return helpfulUsers;
  });
