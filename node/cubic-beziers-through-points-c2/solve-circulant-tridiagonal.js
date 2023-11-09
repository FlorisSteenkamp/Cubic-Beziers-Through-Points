/**
 * Returns the solution vector of solving the given tridiagonal matrix.
 *
 * @param a Array representing subdiagonal
 * @param b Array representing diagonal
 * @param c Array representing superdiagonal
 * @param d Array representing `d` in `Ax = d`.
 */
function solveCirculantTridiagonal(a, b, c, d) {
    const b_ = b.slice();
    const x = d.slice();
    const n = a.length;
    const n1 = n - 1;
    const n2 = n - 2;
    const n3 = n - 3;
    const w = [];
    // Set one of two nonzero components of the work vector
    w[0] = -a[0];
    // Eliminate two systems in parallel:
    for (let i = 1; i < n1; i++) {
        if (b_[i - 1] === 0) {
            return undefined;
        }
        const fac = a[i] / b_[i - 1];
        b_[i] -= fac * c[i - 1];
        x[i] -= fac * x[i - 1];
        // Would be -=, except we know it's already zero:
        w[i] = -fac * w[i - 1];
    }
    // Add the second term in the last component of the work vector:
    w[n2] -= c[n2];
    // Back-substitute:
    if (b_[n2] === 0) {
        return undefined;
    }
    x[n2] /= b_[n2];
    w[n2] /= b_[n2];
    for (let i = n3; i >= 0; i--) {
        if (b_[i] === 0) {
            return undefined;
        }
        x[i] = (x[i] - c[i] * x[i + 1]) / b_[i];
        w[i] = (w[i] - c[i] * w[i + 1]) / b_[i];
    }
    // Compute the periodic term:
    x[n1] -= c[n1] * x[0] + a[n1] * x[n2];
    const fac = b_[n1] + c[n1] * w[0] + a[n1] * w[n2];
    if (fac === 0) {
        return undefined;
    }
    x[n1] /= fac;
    // combine the two components of the solution to get the final answer:
    for (let i = 0; i < n1; i++) {
        x[i] += w[i] * x[n1];
    }
    return x;
}
export { solveCirculantTridiagonal };
//# sourceMappingURL=solve-circulant-tridiagonal.js.map