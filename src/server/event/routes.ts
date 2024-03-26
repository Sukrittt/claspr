import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { addDays, endOfDay, format, startOfDay } from "date-fns";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { getIsPartOfClassAuth } from "@/server/class/routes";
import { setDateWithSameTime } from "@/lib/utils";

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

    if (date) {
      // const indianTimeZone = new Date(date).toLocaleString("en-US", {
      //   timeZone: "Asia/Kolkata",
      // });

      // const indianDate = new Date(indianTimeZone);

      // const timezoneOffset = date.getTimezoneOffset();

      // // If the timezone offset is zero, the date is in UTC
      // if (timezoneOffset === 0) {
      //   console.log("The provided date is in UTC.");
      // } else {
      //   console.log("The provided date is not in UTC.");
      // }

      const currDate = new Date();
      console.log("CURRENT DATE", format(currDate, "MMMM do, h:mm a"));
      console.log("PROVIDED DATE", format(date, "MMMM do, h:mm a"));

      eventDateWhereClause = {
        gte: startOfDay(date),
        lte: endOfDay(date),
      };
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

    console.log("eventDateWhereClause", eventDateWhereClause);

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
      title: z.string().min(3).max(200),
      eventDate: z.date(),
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
      select: { id: true, title: true, description: true, eventDate: true },
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

    await db.event.update({
      where: {
        id: eventId,
        userId: ctx.userId,
      },
      data: {
        title: title ?? existingEvent.title,
        description: description ?? existingEvent.description,
        eventDate: updatedEventDate,
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
