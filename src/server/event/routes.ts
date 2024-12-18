import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { add, addDays, format, startOfDay } from "date-fns";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { setDateWithSameTime } from "@/lib/utils";
import { EVENT_DATE_FORMAT } from "@/config/utils";
import { getIsPartOfClassAuth } from "@/server/class/routes";

/**
 *  Fetching events for next 7 days.
 *
 * @param {object} input - The input parameters for getting class events.
 * @param {string} input.date - An optional date to fetch events for.
 * @param {string} input.classroomId - An optional id of the classroom.
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

    const indianTimeZone = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    const currentDate = startOfDay(new Date(indianTimeZone));
    const sevenDaysLater = startOfDay(addDays(currentDate, 7));

    let assignmentWhereClause = {};
    let eventDateWhereClause = {};
    let rawEventDateWhereClause = {};

    if (date) {
      const formattedDate = format(addDays(date, 1), EVENT_DATE_FORMAT);

      rawEventDateWhereClause = formattedDate;
    } else {
      eventDateWhereClause = {
        gte: startOfDay(currentDate),
        lt: sevenDaysLater,
      };
    }

    if (classroomId) {
      const isTeacher = await getIsPartOfClassAuth(
        classroomId,
        ctx.userId,
        true
      );

      if (!isTeacher) {
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
        // When a teacher inside a classroom
        assignmentWhereClause = {
          classRoomId: classroomId,
        };
      }
    } else {
      const existingUser = await db.user.findFirst({
        where: { id: ctx.userId },
        select: { role: true },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "We couldn't find your account. Please sign in.",
        });
      }

      if (existingUser.role === "STUDENT") {
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
      } else if (existingUser.role === "TEACHER") {
        const promises = [
          db.classRoom.findMany({
            where: {
              teacherId: ctx.userId,
            },
            select: { id: true },
          }),
          db.membership.findMany({
            where: {
              userId: ctx.userId,
              isTeacher: true,
            },
            select: { classRoomId: true },
          }),
        ];

        const [existingClassrooms, existingMemberships] = await Promise.all(
          promises
        );

        const typedExistingMemberships = existingMemberships as {
          classRoomId: string;
        }[];
        const typedExistingClassrooms = existingClassrooms as { id: string }[];

        const classroomIds = typedExistingMemberships.map(
          (membership) => membership.classRoomId
        );

        const teacherClassroomIds = typedExistingClassrooms.map(
          (classroom) => classroom.id
        );

        assignmentWhereClause = {
          classRoomId: {
            in: [...classroomIds, ...teacherClassroomIds],
          },
        };
      }
    }

    const eventPicks = {
      id: true,
      title: true,
      eventDate: true,
      rawEventDate: true,
      description: true,
      createdAt: true,
      userId: true,

      assignment: {
        select: {
          id: true,
          title: true,
          description: true,
          classRoomId: true,
        },
      },
    };

    const promises = [
      db.event.findMany({
        where: {
          assignment: assignmentWhereClause,
          eventDate: eventDateWhereClause,
          rawEventDate: rawEventDateWhereClause,
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
          rawEventDate: rawEventDateWhereClause,
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
      title: z.string().min(3).max(200),
      eventDate: z.date(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const rawEventDate = formatRawEvent(input.eventDate);

    await db.event.create({
      data: {
        ...input,
        rawEventDate,
        userId: ctx.userId,
      },
    });
  });

function formatRawEvent(rawInputEventDate: Date) {
  const inputEventDate = add(rawInputEventDate, { hours: 5, minutes: 30 });

  return format(inputEventDate, EVENT_DATE_FORMAT);
}

/**
 * To edit event details.
 *
 * @param {object} input - The input parameters for editing an existing event.
 * @param {string} input.eventId - The id of the event to update.
 * @param {string} input.title - An optional title of the event.
 * @param {string} input.description - An optional description of the event.
 * @param {string} input.eventDate - An optional date of the event.
 * @param {boolean} input.isMoving - An optional boolean value to determine if it's a dnd edit.
 */
export const editEvent = privateProcedure
  .input(
    z.object({
      eventId: z.string(),
      title: z.string().max(500).optional(),
      description: z.any().optional(),
      eventDate: z.date().optional(),
      isMoving: z.boolean().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { eventId, title, description, eventDate, isMoving } = input;

    const existingEvent = await db.event.findFirst({
      where: {
        id: eventId,
        userId: ctx.userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        eventDate: true,
        rawEventDate: true,
      },
    });

    if (!existingEvent) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized to edit this event.",
      });
    }

    const updatedEventDate = eventDate
      ? isMoving
        ? setDateWithSameTime(eventDate, existingEvent.eventDate)
        : eventDate
      : existingEvent.eventDate;

    const updatedRawEventDate = eventDate
      ? formatRawEvent(eventDate)
      : existingEvent.rawEventDate;

    await db.event.update({
      where: {
        id: eventId,
        userId: ctx.userId,
      },
      data: {
        title: title ?? existingEvent.title,
        description: description ?? existingEvent.description,
        eventDate: updatedEventDate,
        rawEventDate: updatedRawEventDate,
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
