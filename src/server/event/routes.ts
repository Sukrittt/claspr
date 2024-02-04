import { z } from "zod";
import { addDays } from "date-fns";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

/**
 *  Fetching events for next 7 days whose submission is not done by the user in a classroom.
 *
 * @param {object} input - The input parameters for getting class events.
 * @param {string} input.classroomId - An optional id of the classroom.
 * @returns {Promise<Object[]>} - A list of event objects from the database.
 */
export const getEvents = privateProcedure
  .input(
    z.object({
      classroomId: z.string().optional(), //If present then fetch events for that classroom only
    })
  )
  .query(async ({ ctx, input }) => {
    const { classroomId } = input;

    const existingClassroom = await db.classRoom.findFirst({
      where: {
        id: classroomId,
      },
    });

    if (!existingClassroom) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The classroom no longer exists. Check with your teacher.",
      });
    }

    const existingMembership = await db.membership.findFirst({
      where: {
        classRoomId: classroomId,
        userId: ctx.userId,
      },
    });

    if (!existingMembership) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "You are not a member of this classroom. Please join the classroom to view your upcoming events.",
      });
    }

    const currentDate = new Date();
    const sevenDaysLater = addDays(currentDate, 7);

    let assignmentWhereClause = {};

    if (classroomId) {
      assignmentWhereClause = {
        classRoomId: classroomId,
        submissions: {
          every: {
            memberId: {
              not: existingMembership.id,
            },
          },
        },
      };
    } else {
      assignmentWhereClause = {
        submissions: {
          every: {
            memberId: {
              not: existingMembership.id,
            },
          },
        },
      };
    }

    const classEvents = await db.event.findMany({
      where: {
        assignment: assignmentWhereClause,
        eventDate: {
          gte: currentDate,
          lt: sevenDaysLater,
        },
      },
      include: {
        assignment: true,
        user: true,
      },
    });

    return classEvents;
  });

/**
 * To create a new event.
 *
 * @param {object} input - The input parameters for creating a new event.
 * @param {string} input.title - The title of the event.
 * @param {string} input.description - The description of the event.
 * @param {string} input.eventDate - The date of the event.
 */
export const createEvent = privateProcedure
  .input(
    z.object({
      title: z.string().min(3).max(100),
      description: z.string().max(500).optional(),
      eventDate: z.date().min(new Date()),
    })
  )
  .mutation(async ({ ctx, input }) => {
    await db.event.create({
      data: {
        ...input,
        userId: ctx.userId,
      },
    });
  });
