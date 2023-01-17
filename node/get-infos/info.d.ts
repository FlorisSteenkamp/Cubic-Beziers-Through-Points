import { AnglesAndSpeeds } from 'flo-bezier3';
/**
 * Additional information for each curve.
 *
 * * see for example [A CONSTRUCTIVE FRAMEWORK FOR MINIMAL ENERGY PLANAR CURVES by Michael J. Johnson & Hakim S. Johnson](https://www.sciencedirect.com/science/article/abs/pii/S0096300315015490)
 */
interface Info {
    /** stencil angle */
    ϕ: number;
    /** the allowed α range */
    range: [number, number];
    /** the previous info in the loop */
    _info: Info;
    /** the next info in the loop */
    info_: Info;
    /** the stencil point */
    p: number[];
    /** the bezier curve belonging to this info in Bernstein basis */
    ps: number[][];
    /** the bezier curve belonging to this info in Angle/Speed basis */
    $ps: AnglesAndSpeeds;
    L: number;
    rot: number;
    l: number;
    m: number;
    r: number;
}
export { Info };
