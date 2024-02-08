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
      discussionType: z.enum(["general", "announcements"]),
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
        message: "You are not a part of this class to start a discussion.",
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
      discussionType: z.enum(["general", "announcements"]),
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
        message: "You are not a part of this class to view discussions.",
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
          take: 3,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return discussions;
  });
