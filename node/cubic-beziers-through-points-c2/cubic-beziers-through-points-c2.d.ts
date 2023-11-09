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
declare function cubicBeziersThroughPoints_C2(ps: number[][]): number[][][];
export { cubicBeziersThroughPoints_C2 };
