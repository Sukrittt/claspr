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
 * @param {string} input.coverImage - An optional cover image for the classroom.
 */
export const createClass = privateProcedure
  .input(
    z.object({
      title: z.string(),
      coverImage: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { title, coverImage } = input;

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
      },
    });

    return classRoom;
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
 * @param {string} input.isTeacher - An optional parameter to fetch classes joined by a teacher.
 * @returns {Promise<Object[]>} - A list of classRoom objects from the database.
 */
export const getClassesJoined = privateProcedure
  .input(
    z.object({
      isTeacher: z.boolean().optional().default(false),
    })
  )
  .query(async ({ ctx, input }) => {
    const memberships = await db.member.findMany({
      where: { userId: ctx.userId, isTeacher: input.isTeacher },
      include: {
        classRoom: true,
      },
    });

    return memberships;
  });

/**
 * To join a class created by a teacher.
 *
 * @param {object} input - The input parameters joining a class.
 * @param {string} input.classCode - The class code for the classroom.
 */
export const joinClass = privateProcedure
  .input(
    z.object({
      classCode: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { classCode } = input;

    const existingMember = await db.member.findFirst({
      where: {
        userId: ctx.userId,
      },
    });

    if (existingMember) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are already a member of this class",
      });
    }

    const classRoom = await db.classRoom.findUnique({
      where: {
        classCode,
      },
    });

    if (!classRoom) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The classroom you are trying to join does not exist",
      });
    }

    if (classRoom.teacherId === ctx.userId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You cannot join a class that you created",
      });
    }

    await db.member.create({
      data: {
        classRoomId: classRoom.id,
        userId: ctx.userId,
      },
    });
  });
