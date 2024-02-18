import { Folder } from "@prisma/client";

import { MinifiedNote } from ".";
import { MinifiedTopic } from "./note";

export type MinifiedFolder = Pick<
  Folder,
  "id" | "name" | "createdAt" | "order"
>;

export type ExtendedFolder = MinifiedFolder & {
  notes: (MinifiedNote & {
    topics: MinifiedTopic[];
  })[];
};
