import { z } from "zod";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

/**
 * To facilitate improved context for future conversations, initiate a new dialogue between the user and the AI.
 *
 * @param {object} input - The input parameters for creating a new conversation.
 * @param {string} input.prompt - The prompt given by the user.
 * @param {string} input.answer - The answer to the above prompt.
 * @param {string} input.classroomId - The id of the clasroom.
 */
export const createConversation = privateProcedure
  .input(
    z.object({
      prompt: z.string(),
      answer: z.string(),
      classroomId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { prompt, classroomId, answer } = input;

    await db.conversation.create({
      data: {
        prompt,
        answer,
        classRoomId: classroomId,
        userId: ctx.userId,
      },
    });
  });

/**
 * To get a list of all the previous conversations the user had with the AI in a particular classroom.
 *
 * @param {object} input - The input parameters for getting previous conversations.
 * @param {string} input.classroomId - The name of the section.
 * @returns {Promise<Object[]>} - A list of classRoom objects from the database.
 */
export const getPreviousConversations = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const conversations = await db.conversation.findMany({
      where: { userId: ctx.userId, classRoomId: input.classroomId },
      orderBy: { createdAt: "desc" },
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
 * To clear the conversation between the user and the AI in a particular classroom.
 *
 * @param {object} input - The input parameters for clearing conversation with AI.
 * @param {string} input.conversationId - The id of the conversation to remove.
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
