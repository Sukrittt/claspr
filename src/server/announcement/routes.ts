import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

/**
 * To create an announncement in a classroom.
 *
 * @param {object} input - The input parameters for creating announcement.
 * @param {string} input.title - The title for the announcement.
 * @param {string} input.classroomId - The id of the classroom where the announcement is to be created.
 * @param {string} input.hasSubmission - Annoucement has a submission or not.
 * @param {string} input.dueDate - Due date for the submission.
 * @param {string} input.lateSubmission - If late submission is allowed or not.
 */
export const createAnnouncement = privateProcedure
  .input(
    z.object({
      title: z.string().min(3).max(80),
      classRoomId: z.string(),
      hasSubmission: z.boolean().optional().default(false),
      dueDate: z.date().optional(),
      lateSubmission: z.boolean().optional().default(false),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { classRoomId, hasSubmission, lateSubmission, title, dueDate } =
      input;

    const existingClassroom = await db.classRoom.findFirst({
      where: { id: classRoomId, teacherId: ctx.userId },
    });

    if (!existingClassroom) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "The classroom no longer exists. Please create a new classroom.",
      });
    }

    await db.announcement.create({
      data: {
        title,
        classRoomId,
        dueDate,
        hasSubmission,
        lateSubmission,
        creatorId: ctx.userId,
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
        submissions: true,
      },
    });

    return announcements;
  });

/**
 * To get announcement details.
 *
 * @param {object} input - The input parameters for getting annoucement details.
 * @param {boolean} input.announcementId - The id of the announcement to be fetched.
 * @returns {Promise<Object[]>} - A list of announcement objects.
 */
export const getAnnouncementById = privateProcedure
  .input(
    z.object({
      announcementId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { announcementId } = input;

    const announcement = await db.announcement.findFirst({
      where: {
        id: announcementId,
      },
      include: {
        creator: true,
        submissions: true,
      },
    });

    return announcement;
  });
