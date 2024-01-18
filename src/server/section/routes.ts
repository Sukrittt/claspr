import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

/**
 * To create a new section for the user to store their classrooms.
 *
 * @param {object} input - The input parameters for getting classes joined by the user.
 * @param {string} input.name - The name of the section.
 * @param {string} input.sectionType - The type of section to be created.
 */
export const createSection = privateProcedure
  .input(
    z.object({
      name: z.string().min(3).max(80),
      sectionType: z.enum(["CREATION", "MEMBERSHIP"]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const section = await db.section.create({
      data: {
        name: input.name,
        creatorId: ctx.userId,
        sectionType: input.sectionType,
      },
      include: {
        classrooms: {
          include: {
            teacher: true,
            students: true,
          },
        },
      },
    });

    if (input.sectionType === "MEMBERSHIP") {
      const sections = await db.section.findFirst({
        where: {
          id: section.id,
          creatorId: ctx.userId,
          sectionType: "MEMBERSHIP",
        },
        include: {
          memberships: {
            include: {
              classRoom: {
                include: {
                  teacher: true,
                  students: true,
                },
              },
            },
          },
        },
      });

      return sections;
    }

    return section;
  });

/**
 * To update a section by it's id.
 *
 * @param {object} input - The input parameters for update a section.
 * @param {string} input.sectionId - The id of the section to update.
 * @param {string} input.name - The updated name of the section.
 * @param {string} input.emojiUrl - The updated emojiUrl of the section.
 */
export const updateSection = privateProcedure
  .input(
    z.object({
      sectionId: z.string(),
      name: z.string().min(3).max(80).optional(),
      emojiUrl: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { sectionId, name, emojiUrl } = input;

    const existingSection = await db.section.findFirst({
      where: {
        id: sectionId,
      },
    });

    if (!existingSection) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The section you are trying to edit doesn't exist.",
      });
    }

    if (existingSection.creatorId !== ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not allowed to edit this section.",
      });
    }

    //cannot edit name of default section
    if (existingSection.isDefault && !emojiUrl) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You cannot rename your default section.",
      });
    }

    await db.section.update({
      where: { id: sectionId },
      data: {
        name,
        emojiUrl,
      },
    });
  });

/**
 * To remove a section created by the user.
 *
 * @param {object} input - The input parameters for remoing a section.
 * @param {string} input.sectionId - The id of the section to remove.
 */
export const removeSection = privateProcedure
  .input(
    z.object({
      sectionId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const existingSection = await db.section.findFirst({
      where: {
        id: input.sectionId,
        creatorId: ctx.userId,
      },
      include: {
        classrooms: true,
        memberships: true,
      },
    });

    if (!existingSection) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Section you are trying to remove was not found.",
      });
    }

    if (existingSection.isDefault) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You cannot delete your default section.",
      });
    }

    let movedClassrooms = false;

    if (
      existingSection.classrooms.length > 0 ||
      existingSection.memberships.length > 0
    ) {
      movedClassrooms = true;

      const existingDefaultSection = await db.section.findFirst({
        where: {
          creatorId: ctx.userId,
          sectionType: existingSection.sectionType,
          isDefault: true,
        },
      });

      if (!existingDefaultSection) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Cannot move your classrooms to default section. Please try again later.",
        });
      }

      //if there are created classrooms inside this section
      if (existingSection.classrooms.length > 0) {
        await db.classRoom.updateMany({
          where: {
            id: {
              in: existingSection.classrooms.map((classroom) => classroom.id),
            },
          },
          data: {
            sectionId: existingDefaultSection.id,
          },
        });
      }
      //if there are joined classrooms inside this section
      else if (existingSection.memberships.length > 0) {
        await db.membership.updateMany({
          where: {
            id: {
              in: existingSection.memberships.map(
                (membership) => membership.id
              ),
            },
          },
          data: {
            sectionId: existingDefaultSection.id,
          },
        });
      }
    }

    await db.section.delete({
      where: {
        id: input.sectionId,
        creatorId: ctx.userId,
      },
    });

    return movedClassrooms;
  });

/**
 * To get a list of all sections created under the creation classrooms.
 *
 * @returns {Promise<Object[]>} - A list of section objects from the database.
 */
export const getSectionsForCreatedClassrooms = privateProcedure.query(
  async ({ ctx }) => {
    const sectionsForCreatedClassrooms = await db.section.findMany({
      where: {
        creatorId: ctx.userId,
        sectionType: "CREATION",
      },
      include: {
        classrooms: {
          include: {
            teacher: true,
            students: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return sectionsForCreatedClassrooms;
  }
);

/**
 * To get a list of all sections created under the joined classrooms.
 *
 * @returns {Promise<Object[]>} - A list of section objects from the database.
 */
export const getSectionsForJoinedClassrooms = privateProcedure.query(
  async ({ ctx }) => {
    const sectionsForJoinedClassrooms = await db.section.findMany({
      where: {
        creatorId: ctx.userId,
        sectionType: "MEMBERSHIP",
      },
      include: {
        memberships: {
          include: {
            classRoom: {
              include: {
                teacher: true,
                students: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return sectionsForJoinedClassrooms;
  }
);
