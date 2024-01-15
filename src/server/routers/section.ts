import { createTRPCRouter } from "@/server/trpc";
import {
  createSection,
  getSectionsForCreatedClassrooms,
  getSectionsForJoinedClassrooms,
  moveSection,
  removeSection,
} from "@/server/section/routes";

export const sectionRouter = createTRPCRouter({
  createSection,
  getSectionsForCreatedClassrooms,
  getSectionsForJoinedClassrooms,
  moveSection,
  removeSection,
});
