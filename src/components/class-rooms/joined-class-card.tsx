import { ExtendedClassRoomsJoined } from "@/types";

interface ClassCardProps {
  membership: ExtendedClassRoomsJoined;
}

export const JoinedClassGridView: React.FC<ClassCardProps> = ({
  membership,
}) => {
  return <div>{membership.classRoom.title}</div>;
};

export const JoinedClassListView: React.FC<ClassCardProps> = ({
  membership,
}) => {
  return <div>{membership.classRoom.title}</div>;
};
