import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

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

    let classCode = generateRandomCode(6);

    let existingClass = await db.classRoom.findUnique({
      where: { classCode },
    });

    while (existingClass) {
      classCode = generateRandomCode(6);

      existingClass = await db.classRoom.findUnique({
        where: { classCode },
      });
    }

    await db.classRoom.create({
      data: {
        title,
        classCode,
        teacherId: ctx.userId,
        coverImage,
      },
    });
  });

function generateRandomCode(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}
