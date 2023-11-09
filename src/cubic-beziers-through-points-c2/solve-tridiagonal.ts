
// https://en.wikipedia.org/wiki/Tridiagonal_matrix_algorithm
function solveTriDiagMatrix(A: number[][], b: number[]) {
    const n = A.length;

    for (let i=1; i<n; i++) {
        const w = A[i][0] / A[i-1][1];
        A[i][1] = A[i][1] - w*A[i-1][2];
        b[i] = b[i] - w*b[i-1];
    }

    const x: number[] = [];
    x[n-1] = b[n-1]/A[n-1][1];

    for (let i=n-2; i>=0; i--) {
        x[i] = (b[i] - A[i][2]*x[i+1])/A[i][1];
    }

    return Array.from(x);
}


export { solveTriDiagMatrix }
