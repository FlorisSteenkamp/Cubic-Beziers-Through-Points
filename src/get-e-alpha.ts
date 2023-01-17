import { getBendingEnergy } from "flo-bezier3";
import { cubicFromAnglesAndSpeeds } from 'flo-bezier3';
import { Info } from "./get-infos/info.js";


/**
 * Returns the bending energy of the given curve (within info) with the `α`
 * angle replaced with the given one.
 */
function getEα(
        info: Info) {

    return (α: number) => {
        const [_ps, ps_] = getPssByα(α,info);

        const e_ = getBendingEnergy(ps_);
        const _e = getBendingEnergy(_ps);

        return e_ + _e;
    }
}


/**
 * Returns the points of the given curve (within info) with the `α`
 * angle replaced with the given one.
 */
function getPssByα(
        α: number,
        info: Info) {

    const { ϕ } = info;
    const _info = info._info;
    const _$ps = _info.$ps;
    const $ps = info.$ps;

    const β = α - ϕ;
        
    const _ps = cubicFromAnglesAndSpeeds({ ..._$ps, β, s0: 1, s1: 1 });
    const ps = cubicFromAnglesAndSpeeds({ ...$ps, α, s0: 1, s1: 1 });

    {
        const _ops = _info.ps;
        const ops = info.ps;

        // preserve identities
        return [
            [_ops[0], _ps[1], _ps[2], _ops[3]],
            [ops[0], ps[1], ps[2], ops[3]],
        ];
    }
}


export { getEα, getPssByα }

