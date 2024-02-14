import { Folder } from "@prisma/client";

import { MinifiedNote } from ".";

export type MinifiedFolder = Pick<
  Folder,
  "id" | "name" | "createdAt" | "order"
>;

export type ExtendedFolder = MinifiedFolder & {
  notes: MinifiedNote[];
};
