import { Comment, Discussion, Reaction, Reply, User } from "@prisma/client";

export type ExtendedComment = Comment & {
  sender: User;
  receiver: User | null;
};

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
