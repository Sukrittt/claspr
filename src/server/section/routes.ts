import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { SectionType } from "@prisma/client";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

const SectionTypeEnum = z.nativeEnum(SectionType);

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
      name: z.string().min(1).max(80),
      sectionType: SectionTypeEnum,
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userSections = await db.section.findMany({
      where: {
        creatorId: ctx.userId,
        sectionType: input.sectionType,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
      take: 1,
    });

    const nextOrder = userSections.length === 0 ? 1 : userSections[0].order + 1;

    const section = await db.section.create({
      data: {
        name: input.name,
        creatorId: ctx.userId,
        sectionType: input.sectionType,
        order: nextOrder,
      },
      include: {
        classrooms: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              },
            },
            students: true,
          },
        },
      },
    });

    if (input.sectionType === "MEMBERSHIP") {
      const membershipSection = await db.section.findFirst({
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
                  teacher: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                      email: true,
                    },
                  },
                  students: true,
                },
              },
            },
          },
        },
      });

      return membershipSection;
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
 * @param {boolean} input.isDefault - Whether to mark the section as default.
 * @param {boolean} input.sectionType - To find the type of section it should be updated.
 */
export const updateSection = privateProcedure
  .input(
    z.object({
      sectionId: z.string(),
      name: z.string().min(1).max(80).optional(),
      emojiUrl: z.string().optional(),
      isDefault: z.boolean().optional(),
      sectionType: z.enum(["CREATION", "MEMBERSHIP"]).optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { sectionId, name, emojiUrl, isDefault, sectionType } = input;

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
    // if (existingSection.isDefault && !emojiUrl) {
    //   throw new TRPCError({
    //     code: "BAD_REQUEST",
    //     message: "You cannot rename your default section.",
    //   });
    // }

    //mark the existing default section as false
    if (isDefault && sectionType) {
      const userDefaultSection = await db.section.findFirst({
        where: { creatorId: ctx.userId, isDefault: true, sectionType },
        select: { id: true },
      });

      if (!userDefaultSection) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "We couldn't find your current default section.",
        });
      }

      await db.section.update({
        where: {
          id: userDefaultSection.id,
          creatorId: ctx.userId,
        },
        data: {
          isDefault: false,
        },
      });
    }

    await db.section.update({
      where: { id: sectionId },
      data: {
        name,
        emojiUrl,
        isDefault,
      },
    });
  });

/**
 * To remove a section created by the user.
 *
 * @param {object} input - The input parameters for removing a section.
 * @param {string} input.sectionId - The id of the section to remove.
 */
export const removeSection = privateProcedure
  .input(
    z.object({
      sectionId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { sectionId } = input;

    const existingSection = await db.section.findFirst({
      where: {
        id: sectionId,
        creatorId: ctx.userId,
      },
      select: {
        id: true,
        order: true,
        isDefault: true,
        sectionType: true,

        classrooms: {
          select: {
            id: true,
          },
        },
        memberships: {
          select: {
            id: true,
          },
        },
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

    if (
      existingSection.classrooms.length > 0 ||
      existingSection.memberships.length > 0
    ) {
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
            teacherId: ctx.userId,
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
            userId: ctx.userId,
          },
          data: {
            sectionId: existingDefaultSection.id,
          },
        });
      }
    }

    const deletedSectionOrder = existingSection.order;

    const promises = [
      db.section.delete({
        where: {
          id: sectionId,
          creatorId: ctx.userId,
        },
      }),
      db.section.updateMany({
        where: {
          order: { gt: deletedSectionOrder },
          creatorId: ctx.userId,
        },
        data: {
          order: { decrement: 1 },
        },
      }),
    ];

    await Promise.all(promises);
  });

/**
 * To reorder a section created by the user.
 *
 * @param {object} input - The input parameters for reordering a section.
 * @param {string} input.activeSectionId - The id of the section which is being dragged.
 * @param {string} input.overSectionId - The id of the section where it was dropped.
 * @param {enum} input.shiftDirection - The direction in which the shifting should happen.
 */
export const moveSection = privateProcedure
  .input(
    z.object({
      activeSectionId: z.string(),
      overSectionId: z.string(),
      shiftSections: z.array(
        z.object({
          sectionId: z.string(),
          order: z.number(),
        })
      ),
      shiftDirection: z.enum(["UP", "DOWN"]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { activeSectionId, shiftSections, shiftDirection, overSectionId } =
      input;

    const activeOrderSection = await db.section.findFirst({
      where: {
        id: activeSectionId,
        creatorId: ctx.userId,
      },
      select: { id: true },
    });

    if (!activeOrderSection) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Section you are trying to move was not found.",
      });
    }

    const existingOverSection = await db.section.findFirst({
      where: {
        id: overSectionId,
        creatorId: ctx.userId,
      },
      select: { id: true, order: true },
    });

    if (!existingOverSection) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Section you are trying to move was not found.",
      });
    }

    // NOTE: I'm not using Promise.all because of the order of execution

    //update the order of the active section
    await db.section.update({
      where: {
        id: activeSectionId,
        creatorId: ctx.userId,
      },
      data: {
        order: existingOverSection.order,
      },
    });

    if (shiftSections.length > 0) {
      //shifting the order of the sections in between
      const shiftUpdatePromise = shiftSections.map(
        async ({ sectionId, order }) => {
          return db.section.update({
            where: {
              id: sectionId,
              creatorId: ctx.userId,
            },
            data: {
              order: shiftDirection === "UP" ? order + 1 : order - 1,
            },
          });
        }
      );

      await Promise.all(shiftUpdatePromise);
    }
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
      select: {
        id: true,
        name: true,
        order: true,
        emojiUrl: true,
        isDefault: true,
        sectionType: true,

        classrooms: {
          select: {
            id: true,
            title: true,
            sectionId: true,
          },
          orderBy: {
            viewCount: "desc",
          },
        },
      },
      orderBy: {
        order: "desc",
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
      select: {
        id: true,
        name: true,
        order: true,
        emojiUrl: true,
        isDefault: true,
        sectionType: true,

        memberships: {
          select: {
            id: true,
            renamedClassroom: true,
            sectionId: true,

            classRoom: {
              select: {
                id: true,
                title: true,
                sectionId: true,
              },
            },
          },
          orderBy: {
            viewCount: "desc",
          },
        },
      },
      orderBy: {
        order: "desc",
      },
    });

    return sectionsForJoinedClassrooms;
  }
);
