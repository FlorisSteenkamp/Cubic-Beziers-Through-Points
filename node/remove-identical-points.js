import { DualSetFs } from "./utils/dual-set.js";
function removeIdenticalPoints(ps) {
    const set = new Map();
    for (const p of ps) {
        DualSetFs.add(set, p[0], p[1]);
    }
    const ps_ = [];
    for (const p of ps) {
        if (DualSetFs.has(set, p[0], p[1])) {
            ps_.push(p);
            DualSetFs.remove(set, p[0], p[1]);
        }
    }
    return ps_;
}
export { removeIdenticalPoints };
//# sourceMappingURL=remove-identical-points.js.map