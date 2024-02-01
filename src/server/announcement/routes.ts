import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

/**
 * To create an announncement in a classroom.
 *
 * @param {object} input - The input parameters for creating announcement.
 * @param {string} input.title - The title for the announcement.
 * @param {string} input.dueDate - Due date for the submission.
 * @param {string} input.classroomId - The id of the classroom where the announcement is to be created.
 * @param {string} input.content - The announcement description in a Json format.
 * @param {string} input.lateSubmission - If late submission is allowed or not.
 */
export const createAnnouncement = privateProcedure
  .input(
    z.object({
      title: z.string().min(3).max(80),
      classRoomId: z.string(),
      content: z.any(),
      dueDate: z.date().min(new Date()),
      lateSubmission: z.boolean().optional().default(false),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { classRoomId, lateSubmission, title, dueDate, content } = input;

    const existingClassroom = await db.classRoom.findFirst({
      where: { id: classRoomId },
    });

    if (!existingClassroom) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "The classroom no longer exists. Please create a new classroom.",
      });
    }

    const createdAnnouncement = await db.announcement.create({
      data: {
        title,
        description: content,
        classRoomId,
        dueDate,
        lateSubmission,
        creatorId: ctx.userId,
      },
    });

    await db.event.create({
      data: {
        title,
        announcementId: createdAnnouncement.id,
        userId: ctx.userId,
        eventDate: dueDate,
      },
    });
  });

/**
 * To get announcements of a classroom.
 *
 * @param {object} input - The input parameters for getting annoucements of a classroom.
 * @param {boolean} input.classroomId - The id of the classroom.
 * @returns {Promise<Object[]>} - A list of announcement objects.
 */
export const getAnnouncements = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { classroomId } = input;

    const announcements = await db.announcement.findMany({
      where: {
        classRoomId: classroomId,
      },
      include: {
        creator: true,
        submissions: {
          include: {
            member: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return announcements;
  });

/**
 * To get announcement details.
 *
 * @param {object} input - The input parameters for getting annoucement details.
 * @param {boolean} input.announcementId - The id of the announcement to be fetched.
 * @param {boolean} input.classroomId - The id of the classroom where the announcement belongs.
 * @returns {Promise<Object[]>} - A list of announcement objects.
 */
export const getAnnouncementById = privateProcedure
  .input(
    z.object({
      announcementId: z.string(),
      classroomId: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const { announcementId, classroomId } = input;

    const announcement = await db.announcement.findFirst({
      where: {
        id: announcementId,
        classRoomId: classroomId,
      },
      include: {
        creator: true,
        submissions: {
          include: {
            member: true,
          },
        },
      },
    });

    const memberAsTeacher = await db.membership.findFirst({
      where: {
        classRoomId: classroomId,
        userId: ctx.userId,
        isTeacher: true,
      },
      select: { id: true },
    });

    const isJoinedAsTeacher = !!memberAsTeacher;

    return { announcement, isJoinedAsTeacher };
  });

/**
 * To get comments associated with an announcement.
 *
 * @param {object} input - The input parameters for getting comments of an announcement.
 * @param {boolean} input.annnouncementId - The id of the announcement.
 * @returns {Promise<Object[]>} - A list of comments object.
 */
export const getComments = privateProcedure
  .input(
    z.object({
      announcementId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { announcementId } = input;

    const comments = await db.comment.findMany({
      where: {
        announcementId,
      },
      include: {
        user: true,
      },
    });

    return comments;
  });

/**
 * To create a comment to an announcement.
 *
 * @param {object} input - The input parameters for creating announcement.
 * @param {string} input.message - The message for the comment.
 * @param {string} input.announcementId - The id of the announcement.
 */
export const createComment = privateProcedure
  .input(
    z.object({
      message: z.string().min(3).max(80),
      announcementId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { announcementId, message } = input;

    const existingAnnouncement = await db.announcement.findFirst({
      where: { id: announcementId },
    });

    if (!existingAnnouncement) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "We couldn't find the announcement you are trying to commennt on.",
      });
    }

    const promises = [
      db.classRoom.findFirst({
        where: {
          id: existingAnnouncement.classRoomId,
          teacherId: ctx.userId,
        },
        select: {
          id: true,
        },
      }),
      db.membership.findFirst({
        where: {
          classRoomId: existingAnnouncement.classRoomId,
          userId: ctx.userId,
        },
        select: { id: true },
      }),
    ];

    const [teacher, member] = await Promise.all(promises);

    const isPartOfClass = !!member || !!teacher;

    if (!isPartOfClass) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not allowed to comment on this announcement.",
      });
    }

    await db.comment.create({
      data: {
        message,
        announcementId,
        userId: ctx.userId,
      },
    });
  });
