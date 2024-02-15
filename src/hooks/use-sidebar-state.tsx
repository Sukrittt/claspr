import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Config = {
  isOpen: boolean;
};

const configAtom = atomWithStorage<Config>("config", {
  isOpen: true,
});

export function useSidebarState() {
  return useAtom(configAtom);
}
