import {
  Assignment,
  ClassRoom,
  Comment,
  Discussion,
  Media,
  Membership,
  Reaction,
  Reply,
  Section,
  Submission,
  User,
} from "@prisma/client";

export type ExtendedClassroom = ClassRoom & {
  teacher: User;
  students: Membership[];
};

export type MinifiedClassroom = Pick<ClassRoom, "id" | "title" | "sectionId">;

export type ExtendedSectionWithClassrooms = Section & {
  classrooms: MinifiedClassroom[];
};

export type ExtendedMembership = Membership & {
  classRoom: MinifiedClassroom;
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

export type ExtendedAssignment = Assignment & {
  creator: User;
  classRoom: Pick<ClassRoom, "id" | "title" | "description">;
  submissions: (Submission & {
    member: Pick<Membership, "userId">;
  })[];
};

export type ExtendedComment = Comment & {
  sender: User;
  receiver: User | null;
};

export type ExtendedSubmission = Submission & {
  member: ExtendedMembershipDetails;
  media: Media[];
};

export type FilterType = "pending" | "evaluated" | "changes-requested";

export type ExtendedDiscussion = Discussion & {
  creator: User;
  _count: {
    replies: number;
  };
  replies: (Reply & {
    creator: User;
  })[];
};

export type ExtendedReaction = Reaction & {
  user: User;
};

export type ExtendedReply = Reply & {
  creator: User;
  reactions: ExtendedReaction[];
};

export type ExtendedDetailedReply = Reply & {
  creator: User;
  replies: ExtendedReply[];
  reactions: ExtendedReaction[];
};
