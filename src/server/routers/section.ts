import { createTRPCRouter } from "@/server/trpc";
import {
  createSection,
  getSectionsForCreatedClassrooms,
  getSectionsForJoinedClassrooms,
  updateSection,
  removeSection,
} from "@/server/section/routes";

export const sectionRouter = createTRPCRouter({
  createSection,
  getSectionsForCreatedClassrooms,
  getSectionsForJoinedClassrooms,
  removeSection,
  updateSection,
});
