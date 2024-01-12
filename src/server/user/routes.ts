import { z } from "zod";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure, publicProcedure } from "@/server/trpc";

/**
 * Creates a new user in the database.
 *
 * @param {object} input - The input parameters for registration of a new user.
 * @param {string} input.name - The name of the user.
 * @param {string} input.email - The email of the user.
 * @param {string} input.password - The password of the user.
 */
export const registerUser = publicProcedure
  .input(
    z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
    })
  )
  .mutation(async ({ input }) => {
    const { email, name, password } = input;

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You have already created an account with this email.",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        password: encryptedPassword,
      },
    });
  });

/**
 * To get existing user from the database.
 *
 * @param {object} input - The input parameters for registration of a new user.
 * @param {string} input.email - The email of the user.
 */
export const getUserRoleByEmail = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .mutation(async ({ input }) => {
    const { email } = input;

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return new TRPCError({
        code: "BAD_REQUEST",
        message: "Your account does not exist.",
      });
    }

    return existingUser.role;
  });

/**
 * To update the user role and university and onboard the user.
 *
 * @param {object} input - The input parameters for updating the user details.
 * @param {string} input.role - The role of the user.
 * @param {string} input.university - The university of the user.
 */
export const onBoardUser = privateProcedure
  .input(
    z.object({
      role: z.enum(["STUDENT", "TEACHER"]),
      university: z.string().min(3, {
        message: "University name should be atleast 3 characters long",
      }),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { role, university } = input;

    await db.user.update({
      data: {
        role,
        university,
      },
      where: {
        id: ctx.userId,
      },
    });
  });
