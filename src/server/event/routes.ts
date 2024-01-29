import { z } from "zod";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

/**
 * To get a list of all the events of a particular classroom.
 *
 * @param {object} input - The input parameters for getting class events.
 * @param {string} input.classroomId - The id of the classroom.
 * @returns {Promise<Object[]>} - A list of event objects from the database.
 */
export const getClassEvents = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    // TODO
  });

/**
 * To get a list of all the previous conversations the user had with the AI in a particular classroom.
 *
 * @param {object} input - The input parameters for getting previous conversations.
 * @param {string} input.classroomId - The id of the classroom.
 * @returns {Promise<Object[]>} - A list of classRoom objects from the database.
 */
export const getUserEvents = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
      limit: z.optional(z.number()),
    })
  )
  .query(async ({ ctx, input }) => {
    // TODO
  });

/**
 * To facilitate improved context for future conversations, initiate a new dialogue between the user and the AI.
 *
 * @param {object} input - The input parameters for creating a new conversation.
 * @param {string} input.prompt - The prompt given by the user.
 * @param {string} input.answer - The answer to the above prompt.
 * @param {string} input.classroomId - The id of the clasroom.
 */
export const createEvent = privateProcedure
  .input(
    z.object({
      prompt: z.string(),
      answer: z.string(),
      classroomId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { prompt, classroomId, answer } = input;
  });
