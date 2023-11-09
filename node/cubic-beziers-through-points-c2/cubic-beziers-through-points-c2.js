import { scale, translate } from 'flo-vector2d';
import { solveCirculantTridiagonal } from './solve-circulant-tridiagonal.js';
/**
 * Returns the unique algebraically C² smooth piecewise cubic bezier curve
 * that interpolates the given set of points.
 *
 * * modified from the medium article [Bézier Interpolation - Create smooth shapes using Bézier curves](https://medium.com/towards-data-science/b%C3%A9zier-interpolation-8033e9a262c2)
 * to account for closed loops
 *
 * * The array of returned curves are order 3 (cubic) bezier curves given as an
 * ordered array of its control point coordinates, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 */
function cubicBeziersThroughPoints_C2(ps) {
    const n = ps.length;
    // build coefficents matrix
    const a = [...Array(n)].map(x => 1);
    const b = [...Array(n)].map(x => 4);
    const c = [...Array(n)].map(x => 1);
    // build points vector
    const P = [];
    for (let i = 0; i < n; i++) {
        const i_ = i + 1 === n ? 0 : i + 1;
        P.push(scale(translate(scale(ps[i], 2), ps[i_]), 2));
    }
    // solve system, i.e. find `A` and `B`
    const X = solveCirculantTridiagonal(a, b, c, P.map(p => p[0]));
    const Y = solveCirculantTridiagonal(a, b, c, P.map(p => p[1]));
    // const A = [X,Y];
    const B = [];
    for (let i = 0; i < n; i++) {
        const i_ = i + 1 === n ? 0 : i + 1;
        B.push(translate(scale(ps[i_], 2), [-X[i_], -Y[i_]]));
    }
    const cubics = [];
    for (let i = 0; i < n; i++) {
        const i_ = i + 1 === n ? 0 : i + 1;
        cubics.push([ps[i], [X[i], Y[i]], B[i], ps[i_]]);
    }
    return cubics;
}
export { cubicBeziersThroughPoints_C2 };
//# sourceMappingURL=cubic-beziers-through-points-c2.js.map