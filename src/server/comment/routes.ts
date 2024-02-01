import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

/**
 * To get comments associated with an announcement.
 *
 * @param {object} input - The input parameters for getting comments of an announcement.
 * @param {boolean} input.annnouncementId - The id of the announcement.
 * @returns {Promise<Object[]>} - A list of comments object.
 */
export const getComments = privateProcedure
  .input(
    z.object({
      announcementId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { announcementId } = input;

    const comments = await db.comment.findMany({
      where: {
        announcementId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  });

/**
 * To create a comment to an announcement.
 *
 * @param {object} input - The input parameters for creating announcement.
 * @param {string} input.message - The message for the comment.
 * @param {string} input.announcementId - The id of the announcement.
 */
export const createComment = privateProcedure
  .input(
    z.object({
      message: z.string().min(3).max(80),
      announcementId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { announcementId, message } = input;

    const existingAnnouncement = await db.announcement.findFirst({
      where: { id: announcementId },
    });

    if (!existingAnnouncement) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "We couldn't find the announcement you are trying to commennt on.",
      });
    }

    const promises = [
      db.classRoom.findFirst({
        where: {
          id: existingAnnouncement.classRoomId,
          teacherId: ctx.userId,
        },
        select: {
          id: true,
        },
      }),
      db.membership.findFirst({
        where: {
          classRoomId: existingAnnouncement.classRoomId,
          userId: ctx.userId,
        },
        select: { id: true },
      }),
    ];

    const [teacher, member] = await Promise.all(promises);

    const isPartOfClass = !!member || !!teacher;

    if (!isPartOfClass) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not allowed to comment on this announcement.",
      });
    }

    await db.comment.create({
      data: {
        message,
        announcementId,
        userId: ctx.userId,
      },
    });
  });

/**
 * To edit a comment of an announcement.
 *
 * @param {object} input - The input parameters for editing a comment.
 * @param {string} input.message - The message of the comment.
 * @param {string} input.commentId - The id of the comment to edit.
 */
export const editComment = privateProcedure
  .input(
    z.object({
      message: z.string().min(3).max(80),
      commentId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { commentId, message } = input;

    const existingComment = await db.comment.findFirst({
      where: { id: commentId, userId: ctx.userId },
      select: { id: true, userId: true },
    });

    if (!existingComment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the comment you are trying to edit.",
      });
    }

    if (existingComment.userId !== ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not allowed to edit someone else's comment.",
      });
    }

    await db.comment.update({
      where: { id: commentId },
      data: {
        message,
        isEdited: true,
      },
    });
  });

/**
 * To remove a comment from an announcement.
 *
 * @param {object} input - The input parameters for removing a comment.
 * @param {string} input.commentId - The id of the comment to remove.
 */
export const removeComment = privateProcedure
  .input(
    z.object({
      commentId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { commentId } = input;

    const existingComment = await db.comment.findFirst({
      where: { id: commentId, userId: ctx.userId },
      select: { id: true, userId: true },
    });

    if (!existingComment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the comment you are trying to edit.",
      });
    }

    if (existingComment.userId !== ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not allowed to edit someone else's comment.",
      });
    }

    await db.comment.delete({
      where: { id: commentId, userId: ctx.userId },
    });
  });
