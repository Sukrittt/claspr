import { ClassRoom, Conversation, Membership, User } from "@prisma/client";

export type ExtendedClassroom = ClassRoom & {
  teacher: MinifiedUser;
  students: Membership[];
};

export type MinifiedClassroom = Pick<ClassRoom, "id" | "title" | "sectionId">;

export type ExtendedMembership = Pick<
  Membership,
  "id" | "renamedClassroom" | "sectionId"
> & {
  classRoom: MinifiedClassroom;
};

export type ExtendedClassroomDetails = ClassRoom & {
  teacher: MinifiedUser;
  students: ExtendedMembershipDetails[];
};

export type ExtendedMembershipDetails = Membership & {
  user: MinifiedUser;
};

export type MinifiedUser = Pick<User, "id" | "name" | "image" | "email">;

export type MinifiedConversation = Omit<Conversation, "updatedAt" | "userId">;
