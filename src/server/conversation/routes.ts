import { z } from "zod";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

/**
 * To facilitate improved context for future conversations, initiate a new dialogue between the user and the AI.
 *
 * @param {object} input - The input parameters for creating a new conversation.
 * @param {string} input.prompt - The prompt given by the user.
 * @param {string} input.answer - The type of section to be created.
 * @param {string} input.classroomId - The type of section to be created.
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
    });

    return conversations;
  });
