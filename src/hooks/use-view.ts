import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type ViewType = {
  section: "created" | "joined";
  view: "grid" | "list";
};

const createdViewAtom = atomWithStorage<ViewType>("createdView", {
  section: "created",
  view: "grid",
});

const joinedViewAtom = atomWithStorage<ViewType>("joinedView", {
  section: "joined",
  view: "grid",
});

export function useCreatedView() {
  return useAtom(createdViewAtom);
}

export function useJoinedView() {
  return useAtom(joinedViewAtom);
}
