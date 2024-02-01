import {
  Announcement,
  ClassRoom,
  Comment,
  Membership,
  Section,
  Submission,
  User,
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

export type ExtendedClassroomDetails = ClassRoom & {
  teacher: User;
  students: ExtendedMembershipDetails[];
};

export type ExtendedMembershipDetails = Membership & {
  user: User;
};

export type ExtendedAnnouncement = Announcement & {
  creator: User;
  submissions: (Submission & {
    member: Membership;
  })[];
};

export type ExtendedComment = Comment & {
  user: User;
};
