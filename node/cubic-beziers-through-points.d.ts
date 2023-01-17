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
declare function cubicBeziersThroughPoints(points: number[][]): number[][][];
export { cubicBeziersThroughPoints };
