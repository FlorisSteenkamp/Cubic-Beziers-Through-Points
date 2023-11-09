/**
 * Returns the solution vector of solving the given tridiagonal matrix.
 *
 * @param a Array representing subdiagonal
 * @param b Array representing diagonal
 * @param c Array representing superdiagonal
 * @param d Array representing `d` in `Ax = d`.
 */
declare function solveCirculantTridiagonal(a: number[], b: number[], c: number[], d: number[]): number[] | undefined;
export { solveCirculantTridiagonal };
