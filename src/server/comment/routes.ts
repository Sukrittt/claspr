import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { NovuEvent, novu } from "@/lib/novu";
import { privateProcedure } from "@/server/trpc";

/**
 * To get comments associated with an assignment.
 *
 * @param {object} input - The input parameters for getting comments of an assignment.
 * @param {string} input.annnouncementId - The id of the assignment.
 * @param {boolean} input.isTeacher - A boolean to check if the user is a teacher.
 * @param {string} input.receiverId - The id of the user on the receiving end.
 * @returns {Promise<Object[]>} - A list of comments object.
 */
export const getComments = privateProcedure
  .input(
    z.object({
      assignmentId: z.string(),
      isTeacher: z.boolean().optional().default(false),
      receiverId: z.string().optional(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { assignmentId, isTeacher, receiverId } = input;

    let whereClause = {};

    if (!isTeacher) {
      whereClause = {
        assignmentId,
        OR: [{ senderId: ctx.userId }, { receiverId: ctx.userId }],
      };
    } else {
      whereClause = {
        assignmentId,
        OR: [{ senderId: ctx.userId, receiverId }, { senderId: receiverId }],
      };
    }

    const comments = await db.comment.findMany({
      where: whereClause,
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  });

/**
 * To create a comment to an assignment.
 *
 * @param {object} input - The input parameters for creating assignment.
 * @param {string} input.message - The message for the comment.
 * @param {string} input.assignmentId - The id of the assignment.
 * @param {string} input.receiverId - The id of the user on the receiving end.
 */
export const createComment = privateProcedure
  .input(
    z.object({
      message: z.string().max(80),
      assignmentId: z.string(),
      receiverId: z.string().optional(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { assignmentId, message, receiverId } = input;

    const existingAssignment = await db.assignment.findFirst({
      where: { id: assignmentId },
      select: {
        classRoomId: true,
        classRoom: {
          select: {
            title: true,
            teacherId: true,
            teacher: { select: { email: true, name: true } },
          },
        },
      },
    });

    if (!existingAssignment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "We couldn't find the assignment you are trying to comment on.",
      });
    }

    const promises = [
      db.classRoom.findFirst({
        where: {
          id: existingAssignment.classRoomId,
          teacherId: ctx.userId,
        },
        select: {
          id: true,
        },
      }),
      db.membership.findFirst({
        where: {
          classRoomId: existingAssignment.classRoomId,
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
        message: "You are not allowed to comment on this assignment.",
      });
    }

    await db.comment.create({
      data: {
        message,
        assignmentId,
        senderId: ctx.userId,
        receiverId,
      },
    });

    if (!receiverId) {
      if (existingAssignment.classRoom.teacherId !== ctx.userId) {
        await novu.trigger(NovuEvent.SCRIBE, {
          to: {
            subscriberId: existingAssignment.classRoom.teacherId,
            email: existingAssignment.classRoom.teacher.email ?? "",
            firstName: existingAssignment.classRoom.teacher.name ?? "",
          },
          payload: {
            message: `${ctx.username} added a new comment to an assignment in ${existingAssignment.classRoom.title}`,
            url: `/c/${existingAssignment.classRoomId}/a/${assignmentId}`,
          },
        });
      }

      const classMembers = await db.membership.findMany({
        where: {
          classRoomId: existingAssignment.classRoomId,
        },
        select: {
          userId: true,
          user: { select: { email: true, name: true } },
        },
      });

      const promises = classMembers.map(async (member) => {
        if (member.userId !== ctx.userId) {
          return novu.trigger(NovuEvent.SCRIBE, {
            to: {
              subscriberId: member.userId,
              email: member.user.email ?? "",
              firstName: member.user.name ?? "",
            },
            payload: {
              message: `${ctx.username} added a new comment to an assignment in ${existingAssignment.classRoom.title}`,
              url: `/c/${existingAssignment.classRoomId}/a/${assignmentId}`,
            },
          });
        }
      });

      await Promise.all(promises);

      return;
    }

    const receiver = await db.user.findFirst({
      where: { id: receiverId },
      select: {
        name: true,
        email: true,
      },
    });

    if (!receiver) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the user you are trying to send a comment.",
      });
    }

    await novu.trigger(NovuEvent.SCRIBE, {
      to: {
        subscriberId: receiverId,
        email: receiver.email ?? "",
        firstName: receiver.name ?? "",
      },
      payload: {
        message: `${ctx.username} added a new comment to an assignment.`,
        url: `/c/${existingAssignment.classRoomId}/a/${assignmentId}`,
      },
    });
  });

/**
 * To edit a comment of an assignment.
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
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { commentId, message } = input;

    const existingComment = await db.comment.findFirst({
      where: { id: commentId, senderId: ctx.userId },
      select: { id: true, senderId: true },
    });

    if (!existingComment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the comment you are trying to edit.",
      });
    }

    if (existingComment.senderId !== ctx.userId) {
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
 * To remove a comment from an assignment.
 *
 * @param {object} input - The input parameters for removing a comment.
 * @param {string} input.commentId - The id of the comment to remove.
 */
export const removeComment = privateProcedure
  .input(
    z.object({
      commentId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { commentId } = input;

    const existingComment = await db.comment.findFirst({
      where: { id: commentId, senderId: ctx.userId },
      select: { id: true, senderId: true },
    });

    if (!existingComment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the comment you are trying to edit.",
      });
    }

    if (existingComment.senderId !== ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not allowed to edit someone else's comment.",
      });
    }

    await db.comment.delete({
      where: { id: commentId, senderId: ctx.userId },
    });
  });
