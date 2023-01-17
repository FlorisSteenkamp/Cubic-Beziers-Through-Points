const { PI: 𝜋 } = Math;
//========================================================================
// const Ω = 𝜋/2;  // suggested value by the research paper but it causes ugly-ish 'heads'
// [A CONSTRUCTIVE FRAMEWORK FOR MINIMAL ENERGY PLANAR CURVES by Michael J. Johnson & Hakim S. Johnson](https://www.sciencedirect.com/science/article/abs/pii/S0096300315015490)
const Ω = 𝜋;
//========================================================================
const INITIAL_SPAN_FRAC_FOR_MINI_ALPHAS = 0.0625 * (2 ** 0);
const [initialS0, initialS1] = [1, 1];
const miniAlphaLoops = 4;
export { INITIAL_SPAN_FRAC_FOR_MINI_ALPHAS, Ω, initialS0, initialS1, miniAlphaLoops };
//# sourceMappingURL=consts.js.map