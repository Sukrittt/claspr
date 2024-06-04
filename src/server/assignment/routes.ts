import { z } from "zod";
import { format } from "date-fns";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { NovuEvent, novu } from "@/lib/novu";
import { privateProcedure } from "@/server/trpc";
import { EVENT_DATE_FORMAT } from "@/config/utils";

/**
 * To create an assignment in a classroom.
 *
 * @param {object} input - The input parameters for creating assignment.
 * @param {string} input.title - The title for the assignment.
 * @param {date} input.dueDate - Due date for the submission.
 * @param {string} input.classroomId - The id of the classroom where the assignment is to be created.
 * @param {any} input.content - The assignment description in a Json format.
 * @param {boolean} input.lateSubmission - If late submission is allowed or not.
 */
export const createAssignment = privateProcedure
  .input(
    z.object({
      title: z.string().min(3).max(80),
      classRoomId: z.string(),
      content: z.any(),
      dueDate: z.date().min(new Date()),
      lateSubmission: z.boolean().optional().default(false),
    }),
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
      select: {
        id: true,
        title: true,
        teacherId: true,
        teacher: { select: { email: true, name: true } },
      },
    });

    if (!existingClassroom) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "This classroom no longer exists. Please create a new classroom.",
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

    if (existingClassroom.teacherId !== ctx.userId) {
      await novu.trigger(NovuEvent.SCRIBE, {
        to: {
          subscriberId: existingClassroom.teacherId,
          email: existingClassroom.teacher.email ?? "",
          firstName: existingClassroom.teacher.name ?? "",
        },
        payload: {
          message: `${ctx.username} posted a new assignment in ${existingClassroom.title}.`,
          url: `/c/${existingClassroom.id}/a/${createdAssignment.id}`,
        },
      });
    }

    const classMembers = await db.membership.findMany({
      where: {
        classRoomId,
      },
      select: {
        userId: true,
        user: { select: { email: true, name: true } },
      },
    });

    const promises = classMembers.map(async (member) => {
      if (member.userId !== ctx.userId) {
        return novu.trigger(NovuEvent.SCRIBE, {
          to: {
            subscriberId: member.userId,
            email: member.user.email ?? "",
            firstName: member.user.name ?? "",
          },
          payload: {
            message: `${ctx.username} posted a new assignment in ${existingClassroom.title}.`,
            url: `/c/${classRoomId}/a/${createdAssignment.id}`,
          },
        });
      }
    });

    await Promise.all(promises);

    await db.event.create({
      data: {
        title,
        assignmentId: createdAssignment.id,
        userId: ctx.userId,
        eventDate: dueDate,
        rawEventDate: format(dueDate, EVENT_DATE_FORMAT),
      },
    });
  });

/**
 * To update assignment details.
 *
 * @param {object} input - The input parameters for updating assignment details.
 * @param {any} input.content - The assignment description in a Json format.
 *  * @param {string} input.title - The title for the assignment.
 * @param {date} input.dueDate - Due date for the submission.
 * @param {string} input.assignmentId - The id of the assignment.
 * @param {string} input.classroomId - For checking if the user is a teacher of the classroom.
 * @param {boolean} input.lateSubmission - If late submission is allowed or not.
 */
export const editAssignmentDetails = privateProcedure
  .input(
    z.object({
      assignmentId: z.string(),
      classroomId: z.string(),
      content: z.any().optional(),
      title: z.string().max(80).optional(),
      dueDate: z.date().optional(),
      lateSubmission: z.boolean().optional().default(false).optional(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const {
      content,
      assignmentId,
      classroomId,
      dueDate,
      lateSubmission,
      title,
    } = input;

    const isTeacher = await isTeacherAuthed(classroomId, ctx.userId);

    if (!isTeacher) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to create an assignment.",
      });
    }

    const existingAssignment = await db.assignment.findFirst({
      where: { id: assignmentId },
      select: {
        id: true,
        title: true,
        dueDate: true,
        description: true,
        lateSubmission: true,
        events: { select: { id: true } },
      },
    });

    if (!existingAssignment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "This assignment no longer exists. Please create a new assignment.",
      });
    }

    const eventId = existingAssignment.events[0].id;

    const promises = [
      db.event.update({
        where: {
          id: eventId,
          assignmentId,
          userId: ctx.userId,
        },
        data: {
          title: title ?? existingAssignment.title,
          eventDate: dueDate,
        },
      }),
      db.assignment.update({
        where: {
          id: assignmentId,
          classRoomId: classroomId,
        },
        data: {
          title: title ?? existingAssignment.title,
          dueDate: dueDate ?? existingAssignment.dueDate,
          lateSubmission: lateSubmission ?? existingAssignment.lateSubmission,
          description: content ?? existingAssignment.description,
        },
      }),
    ];

    await Promise.all(promises);
  });

/**
 * To get assignments of a classroom.
 *
 * @param {object} input - The input parameters for getting assignments of a classroom.
 * @param {string} input.classroomId - The id of the classroom.
 * @returns {Promise<Object[]>} - A list of assignment objects.
 */
export const getAssignments = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
    }),
  )
  .query(async ({ input }) => {
    const { classroomId } = input;

    const assignments = await db.assignment.findMany({
      where: {
        classRoomId: classroomId,
      },
      select: {
        id: true,
        classRoomId: true,
        dueDate: true,
        title: true,
        createdAt: true,
        updatedAt: true,

        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        classRoom: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        submissions: {
          include: {
            member: {
              select: {
                userId: true,
              },
            },
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
 * @param {string} input.assignmentId - The id of the assignment to be fetched.
 * @param {string} input.classroomId - The id of the classroom where the assignment belongs.
 * @returns {Promise<Object[]>} - A list of assignment objects.
 */
export const getAssignment = privateProcedure
  .input(
    z.object({
      assignmentId: z.string(),
      classroomId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { assignmentId, classroomId } = input;

    const assignment = await db.assignment.findFirst({
      where: {
        id: assignmentId,
        classRoomId: classroomId,
      },
      select: {
        id: true,
        classRoomId: true,
        dueDate: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        lateSubmission: true,
        description: true,

        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        classRoom: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        submissions: {
          include: {
            member: {
              select: {
                userId: true,
              },
            },
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
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { submissionId, assignmentId, submissionStatus, message } = input;

    const existingSubmission = await db.submission.findFirst({
      where: {
        id: submissionId,
        assignmentId,
      },
      select: {
        assignment: {
          select: {
            classRoomId: true,
          },
        },
        member: {
          select: {
            userId: true,
            user: { select: { name: true, email: true } },
          },
        },
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
          senderId: ctx.userId,
          receiverId: existingSubmission.member.userId,
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

    await novu.trigger(NovuEvent.SCRIBE, {
      to: {
        subscriberId: existingSubmission.member.userId,
        email: existingSubmission.member.user.email ?? "",
        firstName: existingSubmission.member.user.name ?? "",
      },
      payload: {
        message: `${ctx.username} has reviwed your work and marked it as ${submissionStatus}.`,
        url: `/c/${existingSubmission.assignment.classRoomId}/a/${assignmentId}`,
      },
    });
  });

/**
 * To get all the students who have not yet submitted their work.
 *
 * @param {object} input - The input parameters for getting not submitted students.
 * @param {string} input.assignmentId - The id of the assignment.
 * @returns {Promise<Object[]>} - A list of member objects.
 */
export const getNotSubmittedStudents = privateProcedure
  .input(
    z.object({
      assignmentId: z.string(),
    }),
  )
  .query(async ({ input }) => {
    const { assignmentId } = input;

    const existingAssignment = await db.assignment.findFirst({
      where: { id: assignmentId },
      select: { classRoomId: true },
    });

    if (!existingAssignment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find this assignment. Please try again later.",
      });
    }

    const notSubmittedMembers = await db.membership.findMany({
      where: {
        classRoomId: existingAssignment.classRoomId,
        isTeacher: false,
        submissions: {
          none: {
            assignmentId,
          },
        },
      },
      include: {
        user: true,
      },
    });

    return notSubmittedMembers;
  });

/**
 * To delete an assignment.
 *
 * @param {object} input - The input parameters for deleting an assignment.
 * @param {string} input.assignmentId - The id of the assignment.
 */
export const deleteAssignment = privateProcedure
  .input(
    z.object({
      assignmentId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { assignmentId } = input;

    const existingAssignment = await db.assignment.findFirst({
      where: { id: assignmentId },
      select: { classRoomId: true },
    });

    if (!existingAssignment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "This assignment no longer exists.",
      });
    }

    const isTeacher = await isTeacherAuthed(
      existingAssignment.classRoomId,
      ctx.userId,
    );

    if (!isTeacher) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to delete this assignment.",
      });
    }

    await db.assignment.delete({
      where: {
        id: assignmentId,
      },
    });
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
    return false;
  }

  return true;
};
