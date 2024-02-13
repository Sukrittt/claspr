import { z } from "zod";
import { customAlphabet } from "nanoid";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { isTeacherAuthed } from "../assignment/routes";

const CODE_LENGTH = 6;
const CODE_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * To create a class initiated by a teacher.
 *
 * @param {object} input - The input parameters for creating class.
 * @param {string} input.title - The title for the classroom.
 * @param {string} input.sectionId - The id of the section under which the classroom will fall under.
 */
export const createClass = privateProcedure
  .input(
    z.object({
      title: z.string().min(1).max(80),
      sectionId: z.string(),
      protectedDomain: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { title, sectionId, protectedDomain } = input;

    const existingTeacher = await db.user.findUnique({
      where: { id: ctx.userId },
    });

    if (!existingTeacher || existingTeacher.role !== "TEACHER") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You need to be a teacher to create a class.",
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
        sectionId,
        protectedDomain,
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
      title: z.string().min(1).max(80),
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
        message: "You are not authorized to edit this class.",
      });
    }

    await db.classRoom.update({
      where: { id: classroomId },
      data: { title },
    });
  });

/**
 * To give a nickname to a class by a member.
 *
 * @param {object} input - The input parameters for renaming a class.
 * @param {string} input.title - The updated title for the classroom.
 * @param {string} input.classroomId - The id of the classroom to update.
 */
export const setNickName = privateProcedure
  .input(
    z.object({
      title: z.string().min(1).max(80),
      membershipId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { membershipId, title } = input;

    const existingMembership = await db.membership.findFirst({
      where: { id: membershipId, userId: ctx.userId },
    });

    if (!existingMembership) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the classroom you are trying to edit.",
      });
    }

    await db.membership.update({
      where: { id: membershipId, userId: ctx.userId },
      data: {
        renamedClassroom: title,
      },
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
      where: { id: classroomId, teacherId: ctx.userId },
    });

    if (!existingClass) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the class you are trying to remove.",
      });
    }

    await db.classRoom.delete({
      where: { id: classroomId, teacherId: ctx.userId },
    });
  });

/**
 * To leave a class.
 *
 * @param {object} input - The input parameters for leaving a class.
 * @param {string} input.membershipId - The id of the membership to remove.
 */
export const leaveClass = privateProcedure
  .input(
    z.object({
      membershipId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { membershipId } = input;

    const existingMembership = await db.membership.findFirst({
      where: { id: membershipId, userId: ctx.userId },
    });

    if (!existingMembership) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "You are not a member of this classroom.",
      });
    }

    await db.membership.delete({
      where: { id: membershipId, userId: ctx.userId },
    });
  });

/**
 * To update the view count of the user's classroom/membership.
 *
 * @param {object} input - The input parameters for updating the view count of a classroom/membership.
 * @param {string} input.classroomId - The id of classroomId to update.
 */
export const updateViewCount = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { classroomId } = input;

    const existingClassroom = await db.classRoom.findFirst({
      where: { id: classroomId },
    });

    if (!existingClassroom) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Something went wrong. Please refresh your page.",
      });
    }

    if (existingClassroom.teacherId === ctx.userId) {
      await db.classRoom.update({
        where: {
          id: classroomId,
          teacherId: ctx.userId,
        },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
    } else {
      const existingMembership = await db.membership.findFirst({
        where: {
          classRoomId: classroomId,
          userId: ctx.userId,
        },
      });

      if (!existingMembership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Something went wrong. Please refresh your page.",
        });
      }

      await db.membership.update({
        where: {
          id: existingMembership.id,
          userId: ctx.userId,
        },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
    }
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
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
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
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
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
        message: "You are already a member of this class.",
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
        message: "We couldn't find your account.",
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
        message: "We couldn't find the class you are trying to join.",
      });
    }

    if (existingClassRoom.teacherId === ctx.userId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are not allowed to join a class that you have created.",
      });
    }

    const userDomain = getDomain(ctx.email ?? null);

    if (
      existingClassRoom.protectedDomain &&
      existingClassRoom.protectedDomain !== userDomain
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Only members with the domain ${existingClassRoom.protectedDomain} are allowed in this classroom.`,
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

const getDomain = (email: string | null) => {
  if (!email) return;

  const parts = email.split("@");
  return parts[parts.length - 1];
};

/**
 * To update the section a classroom belongs to.
 *
 * @param {object} input - The input parameters for moving classes to another section.
 * @param {string} input.sectionId - The id of the section where the container is dropped.
 * @param {string} input.containerType - The type of container to update.
 * @param {string} input.classContainerId - The id of the class/membership container to update.
 */
export const moveClass = privateProcedure
  .input(
    z.object({
      sectionId: z.string(),
      containerType: z.enum(["CREATION", "MEMBERSHIP"]),
      classContainerId: z.string(), //id of classroom or membership which is being drag and dropped
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (input.containerType === "CREATION") {
      await db.classRoom.update({
        where: {
          id: input.classContainerId,
          teacherId: ctx.userId,
        },
        data: {
          sectionId: input.sectionId,
        },
      });
    } else {
      await db.membership.update({
        where: {
          id: input.classContainerId,
          userId: ctx.userId,
        },
        data: {
          sectionId: input.sectionId,
        },
      });
    }
  });

/**
 * To get the classroom details.
 *
 * @param {object} input - The input parameters for getting classroom details.
 * @param {boolean} input.classroomId - The id of the classroom to fetch.
 * @returns {Promise<Object>} - The classroom object returned from the database.
 */
export const getClassroom = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { classroomId } = input;

    const classroom = await db.classRoom.findFirst({
      where: {
        id: classroomId,
      },
      include: {
        students: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return classroom;
  });

/**
 * To add a descripton to a class by a teacher.
 *
 * @param {object} input - The input parameters for creating class.
 * @param {string} input.description - The title for the classroom.
 * @param {string} input.classroomId - The id of the classroom.
 * @param {string} input.membershipId - The id of the member to allow joined teachers for updation.
 */
export const addDescription = privateProcedure
  .input(
    z.object({
      description: z.string().min(3).max(200),
      classroomId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { classroomId, description } = input;

    const isTeacher = await isTeacherAuthed(classroomId, ctx.userId);

    if (!isTeacher) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to edit this class.",
      });
    }

    await db.classRoom.update({
      where: { id: classroomId },
      data: { description },
    });
  });

/**
 * To get the description of the classroom.
 * Note: Keeping this function separate because facing issues with stale data fetched from server.
 *
 * @param {object} input - The input parameters for getting classroom description.
 * @param {string} input.classroomId - The id of the classroom.
 * @returns {Promise<string>} - The description of the classroom.
 */
export const getDescription = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { classroomId } = input;

    const existingClassroom = await db.classRoom.findFirst({
      where: { id: classroomId },
      select: { description: true },
    });

    if (!existingClassroom) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the classroom you are looking for.",
      });
    }

    return existingClassroom.description;
  });

/**
 * To check if the user is a part of the classroom.
 *
 * @param {object} input - The input parameters for creating class.
 * @param {string} input.classroomId - The id of the classroom.
 * @param {boolean} input.isTeacher - A boolean attribute to check if the user is a teacher or not.
 * @returns {Promise<boolean>} - A boolean value indicating if the user is a part of the classroom or not.
 *
 */
export const getIsPartOfClass = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
      isTeacher: z.boolean().optional(),
    })
  )
  .query(async ({ input, ctx }) => {
    const { classroomId, isTeacher } = input;

    const isPartOfClass = await getIsPartOfClassAuth(
      classroomId,
      ctx.userId,
      isTeacher
    );

    return isPartOfClass;
  });

export const getIsPartOfClassAuth = async (
  classroomId: string,
  userId: string,
  isTeacher?: boolean
) => {
  let whereClause = {};

  if (isTeacher) {
    whereClause = {
      classRoomId: classroomId,
      userId,
      isTeacher: true,
    };
  } else {
    whereClause = {
      classRoomId: classroomId,
      userId,
    };
  }

  const promises = [
    db.classRoom.findFirst({
      where: {
        id: classroomId,
        teacherId: userId,
      },
      select: {
        id: true,
      },
    }),
    db.membership.findFirst({
      where: whereClause,
      select: { id: true },
    }),
  ];

  const [teacher, member] = await Promise.all(promises);

  const isPartOfClass = !!member || !!teacher;

  return isPartOfClass;
};
