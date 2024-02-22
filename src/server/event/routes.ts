import { z } from "zod";
import { addDays } from "date-fns";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

/**
 *  Fetching events for next 7 days.
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

    if (classroomId) {
      const existingClassroom = await db.classRoom.findFirst({
        where: {
          id: classroomId,
        },
      });

      if (!existingClassroom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This classroom no longer exists. Check with your teacher.",
        });
      }
    }

    const currentDate = new Date();
    const sevenDaysLater = addDays(currentDate, 7);

    let assignmentWhereClause = {};

    if (classroomId) {
      const existingMembership = await db.membership.findFirst({
        where: {
          classRoomId: classroomId,
          userId: ctx.userId,
          isTeacher: false,
        },
        select: { id: true },
      });

      if (!existingMembership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You need to be a member of this classroom to view your upcoming events.",
        });
      }

      assignmentWhereClause = {
        classRoomId: classroomId,
        submissions: {
          every: {
            memberId: {
              not: existingMembership?.id,
            },
          },
        },
      };
    } else {
      const existingMemberships = await db.membership.findMany({
        where: {
          userId: ctx.userId,
          isTeacher: false,
        },
        select: { id: true },
      });

      assignmentWhereClause = {
        submissions: {
          every: {
            memberId: {
              notIn: existingMemberships.map((membership) => membership.id),
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
      select: {
        id: true,
        title: true,
        eventDate: true,
        description: true,

        assignment: {
          select: {
            id: true,
            title: true,
            classRoomId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        eventDate: "desc",
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
