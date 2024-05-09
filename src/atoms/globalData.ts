import { atomWithStorage } from "jotai/utils";
import type { GlobalData } from "~/types";

const globalDataAtom = atomWithStorage<GlobalData>("globalData", []);

export { globalDataAtom };
