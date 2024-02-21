import { Folder } from "@prisma/client";

import { FormattedNote } from "./note";

export type MinifiedFolder = Pick<
  Folder,
  "id" | "name" | "createdAt" | "order"
>;

export type ExtendedFolder = MinifiedFolder & {
  notes: FormattedNote[];
};
