import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

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

    const existingMembership = await getMembershipDetails(
      ctx.userId,
      input.classroomId
    );

    await db.conversation.create({
      data: {
        prompt,
        answer,
        classRoomId: classroomId,
        memberId: existingMembership.id,
      },
    });
  });

/**
 * To get a list of all the previous conversations the user had with the AI in a particular classroom.
 *
 * @param {object} input - The input parameters for getting previous conversations.
 * @param {string} input.classroomId - The id of the classroom.
 * @returns {Promise<Object[]>} - A list of classRoom objects from the database.
 */
export const getPreviousConversations = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
      limit: z.optional(z.number()),
    })
  )
  .query(async ({ ctx, input }) => {
    const existingMembership = await getMembershipDetails(
      ctx.userId,
      input.classroomId
    );

    const conversations = await db.conversation.findMany({
      where: {
        memberId: existingMembership.id,
        classRoomId: input.classroomId,
      },
      orderBy: { createdAt: "desc" },
      take: input.limit ?? undefined,
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
    const existingMembership = await getMembershipDetails(
      ctx.userId,
      input.classroomId
    );

    const existingConversation = await db.conversation.findFirst({
      where: { classRoomId: classroomId, memberId: existingMembership.id },
    });

    if (!existingConversation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find any conversation in this classroom.",
      });
    }

    await db.conversation.deleteMany({
      where: {
        memberId: existingMembership.id,
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
      classroomId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { conversationId } = input;
    const existingMembership = await getMembershipDetails(
      ctx.userId,
      input.classroomId
    );

    const existingConversation = await db.conversation.findFirst({
      where: { id: conversationId, memberId: existingMembership.id },
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
        memberId: existingMembership.id,
        classRoomId: existingConversation.classRoomId,
      },
    });
  });

const getMembershipDetails = async (userId: string, classroomId: string) => {
  const existingMembership = await db.membership.findFirst({
    where: { userId, classRoomId: classroomId },
    select: { id: true },
  });

  if (!existingMembership) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "You are not a member of this classroom.",
    });
  }

  return existingMembership;
};
