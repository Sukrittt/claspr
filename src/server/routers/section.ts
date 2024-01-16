import { createTRPCRouter } from "@/server/trpc";
import {
  createSection,
  getSectionsForCreatedClassrooms,
  getSectionsForJoinedClassrooms,
  moveSection,
  updateSection,
  removeSection,
} from "@/server/section/routes";

export const sectionRouter = createTRPCRouter({
  createSection,
  getSectionsForCreatedClassrooms,
  getSectionsForJoinedClassrooms,
  moveSection,
  removeSection,
  updateSection,
});
