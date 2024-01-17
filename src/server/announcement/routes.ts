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
      where: { id: classRoomId },
    });

    if (!existingClassroom) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The classroom does not exist. Please create a new classroom.",
      });
    }

    await db.announcement.create({
      data: {
        title,
        classRoomId,
        dueDate,
        hasSubmission,
        lateSubmission,
      },
    });
  });
