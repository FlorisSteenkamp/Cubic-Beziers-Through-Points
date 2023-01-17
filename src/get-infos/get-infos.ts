import type { Info } from "./info";
import { reverse, rotate, translate } from "flo-vector2d";
import { cubicFromAnglesAndSpeeds } from "flo-bezier3";
import { INITIAL_SPAN_FRAC_FOR_MINI_ALPHAS, Ω } from "../consts.js";
import { initialS0, initialS1 } from "../consts.js";
import { getStencilAngle } from "../get-stencil-angle.js";

const { min, max, PI: 𝜋, atan2, sin, cos } = Math;


/**
 * Returns additional information for each curve.
 * 
 * @param hull 
 */
function getInfos(
        hull: number[][]): Info[] {

    const len = hull.length;

    const infos: Info[] = [];
    for (let i=0; i<len; i++) {
        infos.push({} as Info);
    }


    for (let i=0; i<len; i++) {
        const _i = (i - 1 + len)%len;
        const i_ = (i + 1)%len;
        
        const _info = infos[_i];
        const info = infos[i];
        const info_ = infos[i_];
        info._info = _info;
        info.info_ = info_;

        const _p = hull[_i];
        const p = hull[i];
        const p_ = hull[i_];

        const ϕ = getStencilAngle(_p,p,p_);
        info.ϕ = ϕ;

        const range = [max(-Ω, ϕ - Ω), min(+Ω, ϕ + Ω)] as [number,number];

        info.range = range;

        // move ps to origin
        const po = translate(reverse(p))(p_);

        const [x,y] = [po[0], po[1]];
        const rot = atan2(y,x);

        const pof = rotate(sin(-rot),cos(-rot))(po);
        const L = pof[0];

        info.L = L;
        info.rot = rot;
        info.p = p;
    }

    for (let i=0; i<len; i++) {
        const info = infos[i];

        const { ϕ, info_, p, L, rot } = info;
        const ϕ_ = info_.ϕ;

        const α = ϕ/2;
        const $ps = { α, β: -ϕ_/2, p, L, rot, s0: initialS0, s1: initialS1 };
        
        const _ps = cubicFromAnglesAndSpeeds($ps);
        info.ps = [p,_ps[1],_ps[2],info_.p];
        info.$ps = $ps;

        info.l = α - 𝜋*INITIAL_SPAN_FRAC_FOR_MINI_ALPHAS;
        info.m = α;
        info.r = α + 𝜋*INITIAL_SPAN_FRAC_FOR_MINI_ALPHAS;
    }


    return infos;
}


export { getInfos }
