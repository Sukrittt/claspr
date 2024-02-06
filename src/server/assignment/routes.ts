import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

/**
 * To create an assignment in a classroom.
 *
 * @param {object} input - The input parameters for creating assignment.
 * @param {string} input.title - The title for the assignment.
 * @param {string} input.dueDate - Due date for the submission.
 * @param {string} input.classroomId - The id of the classroom where the assignment is to be created.
 * @param {string} input.content - The assignment description in a Json format.
 * @param {string} input.lateSubmission - If late submission is allowed or not.
 */
export const createAssignment = privateProcedure
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

    const isTeacher = await isTeacherAuthed(classRoomId, ctx.userId);

    if (!isTeacher) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to create an assignment.",
      });
    }

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

    const createdAssignment = await db.assignment.create({
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
        assignmentId: createdAssignment.id,
        userId: ctx.userId,
        eventDate: dueDate,
      },
    });
  });

/**
 * To get assignments of a classroom.
 *
 * @param {object} input - The input parameters for getting assignments of a classroom.
 * @param {boolean} input.classroomId - The id of the classroom.
 * @returns {Promise<Object[]>} - A list of assignment objects.
 */
export const getAssignments = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { classroomId } = input;

    const assignments = await db.assignment.findMany({
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

    return assignments;
  });

/**
 * To get assignment details.
 *
 * @param {object} input - The input parameters for getting assignment details.
 * @param {boolean} input.assignmentId - The id of the assignment to be fetched.
 * @param {boolean} input.classroomId - The id of the classroom where the assignment belongs.
 * @returns {Promise<Object[]>} - A list of assignment objects.
 */
export const getAssignment = privateProcedure
  .input(
    z.object({
      assignmentId: z.string(),
      classroomId: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const { assignmentId, classroomId } = input;

    const assignment = await db.assignment.findFirst({
      where: {
        id: assignmentId,
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

    return { assignment, isJoinedAsTeacher };
  });

/**
 * To submit review for an submission of an assignment.
 *
 * @param {object} input - The input parameters for submitting review.
 * @param {string} input.submissionId - The id of the submission to review.
 * @param {string} input.assignmentId - The id of the assignment where the submission belongs.
 */
export const submitReview = privateProcedure
  .input(
    z.object({
      submissionId: z.string(),
      assignmentId: z.string(),
      message: z.string().max(80),
      submissionStatus: z.enum(["PENDING", "APPROVED", "CHANGES_REQUESTED"]),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { submissionId, assignmentId, submissionStatus, message } = input;

    const existingSubmission = await db.submission.findFirst({
      where: {
        id: submissionId,
        assignmentId,
      },
      include: {
        assignment: true,
      },
    });

    if (!existingSubmission) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the submimssion you are trying to review.",
      });
    }

    const classRoomId = existingSubmission.assignment.classRoomId;

    const isTeacher = await isTeacherAuthed(classRoomId, ctx.userId);

    if (!isTeacher) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to review this submission.",
      });
    }

    const promises = [
      db.comment.create({
        data: {
          message,
          assignmentId,
          userId: ctx.userId,
        },
      }),
      db.submission.update({
        where: {
          id: submissionId,
          assignmentId,
        },
        data: {
          submissionStatus,
        },
      }),
    ];

    await Promise.all(promises);
  });

export const isTeacherAuthed = async (classRoomId: string, userId: string) => {
  const existingMember = await db.membership.findFirst({
    where: {
      userId,
      classRoomId,
    },
  });

  const existingClass = await db.classRoom.findFirst({
    where: {
      id: classRoomId,
      teacherId: userId,
    },
  });

  if (!existingClass && (!existingMember || !existingMember.isTeacher)) {
    return true;
  }

  return false;
};
