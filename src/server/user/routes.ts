import { z } from "zod";
import bcrypt from "bcrypt";
import { UserType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure, publicProcedure } from "@/server/trpc";
import { NovuEvent, novu } from "@/lib/novu";
import { pricingStrategy } from "@/config/ai";

const RoleEnum = z.nativeEnum(UserType);

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
    }),
  )
  .mutation(async ({ input }) => {
    const { email, name, password } = input;

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
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
    }),
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
 * To update user details and onboard the user.
 *
 * @param {object} input - The input parameters for updating the user details.
 * @param {enum} input.role - The role of the user - STUDENT OR TEACHER.
 * @param {string} input.university - The university of the user.
 */
export const onBoardUser = privateProcedure
  .input(
    z.object({
      role: RoleEnum,
      university: z.string().min(3, {
        message: "University name should be atleast 3 characters long.",
      }),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { role, university } = input;

    const existingUser = await db.user.findUnique({
      where: { id: ctx.userId },
    });

    if (!existingUser) {
      return new TRPCError({
        code: "BAD_REQUEST",
        message: "We couldn't find your account.",
      });
    }

    const defaultSection = await db.section.findFirst({
      where: {
        creatorId: ctx.userId,
        isDefault: true,
      },
    });

    if (!defaultSection) {
      if (role === "STUDENT") {
        await db.section.create({
          data: {
            creatorId: ctx.userId,
            name: "Getting Started",
            isDefault: true,
            sectionType: "MEMBERSHIP",
            order: 1, // This section will be the first section
          },
        });
      } else {
        const promises = [
          db.section.create({
            data: {
              creatorId: ctx.userId,
              name: "Getting Started",
              isDefault: true,
              sectionType: "MEMBERSHIP",
              order: 1, // This section will be the first section
            },
          }),
          db.section.create({
            data: {
              creatorId: ctx.userId,
              name: "Getting Started",
              isDefault: true,
              sectionType: "CREATION",
              order: 1, // This section will be the first section
            },
          }),
        ];

        await Promise.all(promises);
      }
    }

    await db.user.update({
      data: {
        role,
        university,
        credits: pricingStrategy[role].freeCredits,
      },
      where: {
        id: ctx.userId,
      },
    });

    await novu.trigger(NovuEvent.Claspr, {
      to: {
        subscriberId: ctx.userId,
        email: ctx.email ?? "",
        firstName: ctx.username ?? "",
      },
      payload: {
        message: `Welcome to Scribe! You have successfully onboarded as a ${role}.`,
      },
    });

    const createdFolder = await db.folder.create({
      data: {
        name: "New Folder",
        userId: ctx.userId,
        order: 1,
      },
      select: { id: true },
    });

    await db.note.create({
      data: {
        title: "Untitled Note",
        noteType: "PERSONAL",
        folderId: createdFolder.id,
        creatorId: ctx.userId,
      },
    });
  });

/**
 * Delete user's from the database.
 *
 * @param {object} input - The input parameters for deleting the account of a user.
 * @param {string} input.userId - The id of the user.
 */
export const deleteAccount = publicProcedure
  .input(
    z.object({
      userId: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const { userId } = input;

    const existingUser = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: { id: true },
    });

    if (!existingUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "We couldn't find your account. Please try again later.",
      });
    }

    await db.user.delete({
      where: {
        id: userId,
      },
    });
  });
