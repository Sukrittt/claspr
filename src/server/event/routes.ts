import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { addDays, startOfDay } from "date-fns";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

/**
 *  Fetching events for next 7 days.
 *
 * @param {object} input - The input parameters for getting class events.
 * @param {string} input.classroomId - An optional id of the classroom.
 * @param {string} input.date - An optional date to fetch events for.
 * @returns {Promise<Object[]>} - A list of event objects from the database.
 */
export const getEvents = privateProcedure
  .input(
    z.object({
      date: z.date().optional(),
      classroomId: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { classroomId, date } = input;

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
    let eventDateWhereClause = {};

    if (date) {
      eventDateWhereClause = {
        gte: startOfDay(date),
        lt: addDays(date, 1),
      };
    } else {
      eventDateWhereClause = {
        gte: startOfDay(currentDate),
        lt: sevenDaysLater,
      };
    }

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
        select: { id: true, classRoomId: true },
      });

      const classroomIds = existingMemberships.map(
        (membership) => membership.classRoomId
      );
      const membershipIds = existingMemberships.map(
        (membership) => membership.id
      );

      assignmentWhereClause = {
        classRoomId: {
          in: classroomIds,
        },
        submissions: {
          every: {
            memberId: {
              notIn: membershipIds,
            },
          },
        },
      };
    }

    const eventPicks = {
      id: true,
      title: true,
      eventDate: true,
      description: true,
      createdAt: true,

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
    };

    const promises = [
      db.event.findMany({
        where: {
          assignment: assignmentWhereClause,
          eventDate: eventDateWhereClause,
        },
        select: eventPicks,
        orderBy: {
          eventDate: "asc",
        },
      }),
      db.event.findMany({
        where: {
          assignmentId: null,
          userId: ctx.userId,
          eventDate: eventDateWhereClause,
        },
        select: eventPicks,
        orderBy: {
          eventDate: "asc",
        },
      }),
    ];

    const [classEvents, userEvents] = await Promise.all(promises);

    let events = [...classEvents];

    if (!classroomId) {
      events = [...events, ...userEvents];
    }

    const sortedEvents = events.sort(
      (a, b) => a.eventDate.getTime() - b.eventDate.getTime()
    );

    return sortedEvents;
  });

/**
 * To create a new event.
 *
 * @param {object} input - The input parameters for creating a new event.
 * @param {string} input.title - The title of the event.
 * @param {string} input.eventDate - The date of the event.
 */
export const createEvent = privateProcedure
  .input(
    z.object({
      title: z.string().min(3).max(100),
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

/**
 * To edit event details.
 *
 * @param {object} input - The input parameters for editing an existing event.
 * @param {string} input.eventId - The id of the event to update.
 * @param {string} input.title - An optional title of the event.
 * @param {string} input.description - An optional description of the event.
 * @param {string} input.eventDate - An optional date of the event.
 */
export const editEvent = privateProcedure
  .input(
    z.object({
      eventId: z.string(),
      title: z.string().max(100).optional(),
      description: z.any().optional(),
      eventDate: z.date().optional(),
      initialDate: z.date().optional(), // For optimistic updates (USED FOR CLIENT ONLY)
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { eventId, title, description, eventDate } = input;

    const existingEvent = await db.event.findFirst({
      where: {
        id: eventId,
        userId: ctx.userId,
      },
      select: { id: true, title: true, description: true, eventDate: true },
    });

    if (!existingEvent) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized to edit this event.",
      });
    }

    await db.event.update({
      where: {
        id: eventId,
        userId: ctx.userId,
      },
      data: {
        title: title ?? existingEvent.title,
        description: description ?? existingEvent.description,
        eventDate: eventDate ?? existingEvent.eventDate,
      },
    });
  });

/**
 * To remove an event.
 *
 * @param {object} input - The input parameters for removing an existing event.
 * @param {string} input.eventId - The id of the event to update.
 */
export const removeEvent = privateProcedure
  .input(
    z.object({
      eventId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const existingEvent = await db.event.findFirst({
      where: {
        id: input.eventId,
        userId: ctx.userId,
      },
      select: { id: true },
    });

    if (!existingEvent) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized to edit this event.",
      });
    }

    await db.event.delete({
      where: {
        id: input.eventId,
        userId: ctx.userId,
      },
    });
  });
