import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { FEEDBACK_STATUS } from "@prisma/client";

/**
 * To facilitate improved context for future conversations, initiate a new dialogue between the user and the AI.
 *
 * @param {object} input - The input parameters for creating a new conversation.
 * @param {string} input.prompt - The prompt given by the user.
 * @param {string} input.answer - The answer to the above prompt.
 * @param {string} input.classroomId - An optional id of the clasroom.
 * @param {string} input.noteId - An optional id of the note.
 */
export const createConversation = privateProcedure
  .input(
    z.object({
      prompt: z.string(),
      answer: z.string(),
      classroomId: z.string().optional(),
      noteId: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { prompt, classroomId, answer, noteId } = input;

    await db.conversation.create({
      data: {
        prompt,
        answer,
        classRoomId: classroomId,
        noteId,
        userId: ctx.userId,
      },
    });
  });

/**
 * To get a list of all the previous conversations the user had with the AI in a particular classroom or in a note.
 *
 * @param {object} input - The input parameters for getting previous conversations.
 * @param {string} input.classroomId - An optional id of the classroom.
 * @param {string} input.note - An optional id of the note.
 * @returns {Promise<Object[]>} - A list of conversation objects from the database.
 */
export const getPreviousConversations = privateProcedure
  .input(
    z.object({
      classroomId: z.string().optional(),
      noteId: z.string().optional(),
      limit: z.optional(z.number()),
    })
  )
  .query(async ({ ctx, input }) => {
    const { classroomId, noteId, limit } = input;

    const conversations = await db.conversation.findMany({
      where: {
        userId: ctx.userId,
        classRoomId: classroomId,
        noteId,
      },
      select: {
        id: true,
        prompt: true,
        answer: true,
        feedback: true,
        createdAt: true,
        classRoomId: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit ?? undefined,
    });

    return conversations;
  });

/**
 * To clear the conversation between the user and the AI in a particular classroom.
 *
 * @param {object} input - The input parameters for clearing conversation with AI.
 * @param {string} input.classroomId - The id of the classroomId.
 */
export const clearConversation = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { classroomId } = input;

    const existingConversation = await db.conversation.findFirst({
      where: { classRoomId: classroomId, userId: ctx.userId },
      select: { classRoomId: true },
    });

    if (!existingConversation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find any conversation in this classroom.",
      });
    }

    await db.conversation.deleteMany({
      where: {
        userId: ctx.userId,
        classRoomId: existingConversation.classRoomId,
      },
    });
  });

/**
 * To remove a conversation between the user and the AI in a particular classroom.
 *
 * @param {object} input - The input parameters for removing a conversation with AI.
 * @param {string} input.conversationId - The id of the conversation to remove.
 * @param {string} input.classroomId - The id of the classroom to remove the conversation from.
 */
export const removeConversation = privateProcedure
  .input(
    z.object({
      conversationId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { conversationId } = input;

    const existingConversation = await db.conversation.findFirst({
      where: { id: conversationId, userId: ctx.userId },
    });

    if (!existingConversation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the conversation you're looking for.",
      });
    }

    await db.conversation.delete({
      where: {
        id: conversationId,
        userId: ctx.userId,
        classRoomId: existingConversation.classRoomId,
      },
    });
  });

const FeedbackEnum = z.nativeEnum(FEEDBACK_STATUS);

/**
 * For giving a feedback to the AI for a particular conversation.
 *
 * @param {object} input - The input parameters for giving feedback to the AI.
 * @param {string} input.conversationId - The id of the conversation to remove.
 * @param {enum} input.feedback - The feedback given by the user.
 */
export const giveFeedback = privateProcedure
  .input(
    z.object({
      conversationId: z.string(),
      feedback: FeedbackEnum,
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { conversationId, feedback } = input;

    const existingConversation = await db.conversation.findFirst({
      where: { id: conversationId, userId: ctx.userId },
    });

    if (!existingConversation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the conversation you're looking for.",
      });
    }

    const removeVote = existingConversation.feedback === feedback;

    await db.conversation.update({
      where: {
        id: conversationId,
        userId: ctx.userId,
        classRoomId: existingConversation.classRoomId,
      },
      data: {
        feedback: removeVote ? null : feedback,
      },
    });
  });
