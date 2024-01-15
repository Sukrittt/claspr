import {
  ClassRoom,
  Membership,
  Section, User
} from "@prisma/client";


export type ExtendedClassroom = ClassRoom & {
  teacher: User;
  students: Membership[];
};

export type ExtendedSectionWithClassrooms = Section & {
  classrooms: ExtendedClassroom[];
};

export type ExtendedMembership = Membership & {
  classRoom: ExtendedClassroom;
};

export type ExtendedSectionWithMemberships = Section & {
  memberships: ExtendedMembership[];
};
