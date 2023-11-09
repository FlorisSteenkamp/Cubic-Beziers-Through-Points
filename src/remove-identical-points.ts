import { DualSet, DualSetFs } from "./utils/dual-set.js";


function removeIdenticalPoints(ps: number[][]) {
    const set: DualSet<number,number> = new Map();
    for (const p of ps) {
        DualSetFs.add(set, p[0], p[1]);
    }
    const ps_: number[][] = [];
    for (const p of ps) {
        if (DualSetFs.has(set, p[0],p[1])) {
            ps_.push(p);
            DualSetFs.remove(set, p[0] ,p[1]);
        }
    }

    return ps_;
}


export { removeIdenticalPoints }
