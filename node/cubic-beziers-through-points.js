import { cubicToAnglesAndSpeeds } from "flo-bezier3";
import { getEα, getPssByα } from './get-e-alpha.js';
import { miniAlphaLoops } from './consts.js';
import { getInfos } from './get-infos/get-infos.js';
import { removeIdenticalPoints } from './remove-identical-points.js';
/**
 * Returns an array of cubic bezier curves forming a loop going through all
 * the given ordered points such that the binding energy of the loop is near
 * a local minimum.
 *
 * Such loops are 'fair' meaning they look 'pretty' somehow.
 *
 * * curve terminal speeds are not optimized (even though it would not be too
 * hard to do so); only angles are optimized but the resulting curves are quite
 * close to each other. In any case, the research paper this library is based
 * on suggest speeds to be fixed at the theoretical value of 1 and this is how
 * it is implemented.
 *
 * * see [A CONSTRUCTIVE FRAMEWORK FOR MINIMAL ENERGY PLANAR CURVES by Michael J. Johnson & Hakim S. Johnson](https://www.sciencedirect.com/science/article/abs/pii/S0096300315015490)
 *
 * * The array of returned curves are order 3 (cubic) bezier curves given as an
 * ordered array of its control point coordinates, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 *
 * @param points an ordered array of planar points
 */
function cubicBeziersThroughPoints(points) {
    const infos = getInfos(removeIdenticalPoints(points));
    const len = infos.length;
    for (let j = 0; j < miniAlphaLoops; j++) {
        for (let i = 0; i < len; i++) {
            const info = infos[i];
            const _info = info._info;
            const getE_ = getEα(info);
            let halfSpan;
            let { l, m, r } = info;
            let L = getE_(l);
            let M = getE_(m);
            let R = getE_(r);
            // 1d pattern search
            while (true) {
                ({ l, m, r } = info);
                halfSpan = (r - l) / 2;
                if ((L >= M && M <= R)) {
                    info.l = m - halfSpan / 2;
                    info.r = m + halfSpan / 2;
                    break;
                }
                else if ((L <= M && M <= R)) {
                    info.l = l - halfSpan;
                    info.m = l;
                    info.r = m;
                    R = M;
                    M = L;
                    L = getE_(info.l);
                }
                else if ((L >= M && M >= R)) {
                    info.l = m;
                    info.m = r;
                    info.r = r + halfSpan;
                    L = M;
                    M = R;
                    R = getE_(info.r);
                }
                else if ((L <= M && M >= R)) {
                    info.l = l - halfSpan;
                    info.m = l;
                    info.r = m;
                    R = M;
                    M = L;
                    L = getE_(info.l);
                }
            }
            const α = info.m;
            const [_ps, ps_] = getPssByα(α, info);
            info.ps = ps_;
            info.$ps = cubicToAnglesAndSpeeds(ps_);
            _info.ps = _ps;
            _info.$ps = cubicToAnglesAndSpeeds(_ps);
        }
    }
    const cubics = infos.map(info => info.ps);
    return cubics;
}
export { cubicBeziersThroughPoints };
//# sourceMappingURL=cubic-beziers-through-points.js.map