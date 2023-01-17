import { Info } from "./get-infos/info.js";
/**
 * Returns the bending energy of the given curve (within info) with the `α`
 * angle replaced with the given one.
 */
declare function getEα(info: Info): (α: number) => number;
/**
 * Returns the points of the given curve (within info) with the `α`
 * angle replaced with the given one.
 */
declare function getPssByα(α: number, info: Info): number[][][];
export { getEα, getPssByα };
