import { z } from "zod";
import { customAlphabet } from "nanoid";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

const CODE_LENGTH = 6;
const CODE_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * To create a class initiated by a teacher.
 *
 * @param {object} input - The input parameters for creating class.
 * @param {string} input.title - The title for the classroom.
 * @param {string} input.sectionId - The id of the section under which the classroom will fall under.
 * @param {string} input.coverImage - An optional cover image for the classroom.
 */
export const createClass = privateProcedure
  .input(
    z.object({
      title: z.string().min(3).max(80),
      sectionId: z.string(),
      coverImage: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { title, coverImage, sectionId } = input;

    const existingTeacher = await db.user.findUnique({
      where: { id: ctx.userId },
    });

    if (!existingTeacher || existingTeacher.role !== "TEACHER") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You need to be a teacher to create a class",
      });
    }

    const nanoid = customAlphabet(CODE_CHARACTERS, CODE_LENGTH);
    let classCode = nanoid();

    let existingClass = await db.classRoom.findUnique({
      where: { classCode },
    });

    while (existingClass) {
      classCode = nanoid();

      existingClass = await db.classRoom.findUnique({
        where: { classCode },
      });
    }

    const classRoom = await db.classRoom.create({
      data: {
        title,
        classCode,
        teacherId: ctx.userId,
        coverImage,
        sectionId,
      },
    });

    return classRoom;
  });

/**
 * To rename a class.
 *
 * @param {object} input - The input parameters for renaming a class.
 * @param {string} input.title - The updated title for the classroom.
 * @param {string} input.classroomId - The id of the classroom to update.
 */
export const renameClass = privateProcedure
  .input(
    z.object({
      title: z.string().min(3).max(80),
      classroomId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { classroomId, title } = input;

    const existingClass = await db.classRoom.findFirst({
      where: { id: classroomId },
    });

    if (!existingClass) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The class you are trying to rename doesn't exist.",
      });
    }

    if (existingClass.teacherId !== ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not allowed to edit this class",
      });
    }

    await db.classRoom.update({
      where: { id: classroomId },
      data: { title },
    });
  });

/**
 * To remove a class.
 *
 * @param {object} input - The input parameters for removing a class.
 * @param {string} input.classroomId - The id of the classroom to delete.
 */
export const removeClass = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { classroomId } = input;

    const existingClass = await db.classRoom.findFirst({
      where: { id: classroomId },
    });

    if (!existingClass) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The class you are trying to remove doesn't exist",
      });
    }

    if (existingClass.teacherId !== ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not allowed to edit this class",
      });
    }

    await db.classRoom.delete({
      where: { id: classroomId },
    });
  });

/**
 * To get a list of all classes created by the teacher.
 *
 * @returns {Promise<Object[]>} - A list of classRoom objects from the database.
 */
export const getClassesCreated = privateProcedure.query(async ({ ctx }) => {
  const classRooms = await db.classRoom.findMany({
    where: { teacherId: ctx.userId },
    include: {
      students: true,
      teacher: true,
    },
  });

  return classRooms;
});

/**
 * To get a list of all classes joined by the student/teacher.
 *
 * @param {object} input - The input parameters for getting classes joined by the user.
 * @param {boolean} input.isTeacher - An optional parameter to fetch classes joined by a teacher.
 * @returns {Promise<Object[]>} - A list of classRoom objects from the database.
 */
export const getClassesJoined = privateProcedure
  .input(
    z.object({
      isTeacher: z.boolean().optional().default(false),
    })
  )
  .query(async ({ ctx, input }) => {
    const memberships = await db.membership.findMany({
      where: { userId: ctx.userId, isTeacher: input.isTeacher },
      include: {
        classRoom: {
          include: {
            teacher: true,
            students: true,
          },
        },
      },
    });

    return memberships;
  });

/**
 * To join a class created by a teacher.
 *
 * @param {object} input - The input parameters joining a class.
 * @param {string} input.sectionId - The id of the section under which the classroom membership will fall under
 * @param {string} input.classCode - The class code for the classroom.
 */
export const joinClass = privateProcedure
  .input(
    z.object({
      classCode: z.string(),
      sectionId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { classCode, sectionId } = input;

    const existingMember = await db.membership.findFirst({
      where: {
        userId: ctx.userId,
        classRoom: {
          classCode,
        },
      },
    });

    if (existingMember) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are already a member of this class",
      });
    }

    const existingUser = await db.user.findUnique({
      where: {
        id: ctx.userId,
      },
    });

    if (!existingUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find your account",
      });
    }

    const isTeacher = existingUser.role === "TEACHER";

    const existingClassRoom = await db.classRoom.findUnique({
      where: {
        classCode,
      },
    });

    if (!existingClassRoom) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the class you are trying to join",
      });
    }

    if (existingClassRoom.teacherId === ctx.userId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are not allowed to join a class that you have created.",
      });
    }

    await db.membership.create({
      data: {
        classRoomId: existingClassRoom.id,
        userId: ctx.userId,
        isTeacher,
        sectionId,
      },
    });

    return existingClassRoom;
  });
