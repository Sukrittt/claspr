import { Comment, Discussion, Reaction, Reply, User } from "@prisma/client";

import { MinifiedUser } from ".";

export type ExtendedComment = Comment & {
  sender: User;
  receiver: User | null;
};

type MinifiedDiscussion = Pick<
  Discussion,
  | "id"
  | "title"
  | "content"
  | "discussionType"
  | "classroomId"
  | "createdAt"
  | "creatorId"
  | "isEdited"
>;

export type ExtendedDiscussion = MinifiedDiscussion & {
  creator: MinifiedUser;
  _count: {
    replies: number;
  };
  replies: (MinifiedReply & {
    creator: MinifiedUser;
  })[];
};

type MinifiedReply = Pick<
  Reply,
  | "id"
  | "text"
  | "discussionId"
  | "creatorId"
  | "createdAt"
  | "selected"
  | "isEdited"
>;

type MinifiedReaction = Pick<Reaction, "id" | "reaction">;

export type ExtendedReaction = MinifiedReaction & {
  user: MinifiedUser;
};

export type ExtendedReply = MinifiedReply & {
  creator: MinifiedUser;
  reactions: ExtendedReaction[];
};

export type ExtendedDetailedReply = MinifiedReply & {
  creator: MinifiedUser;
  replies: ExtendedReply[];
  reactions: ExtendedReaction[];
};
