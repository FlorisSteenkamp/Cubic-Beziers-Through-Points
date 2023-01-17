import { getInterfaceRotation } from "flo-bezier3";
import { fromTo } from "flo-vector2d";


/**
 * Returns the stencil angle between curve interfaces.
 */
function getStencilAngle(
        p0: number[],
        p1: number[],
        p2: number[]) {

    return -getInterfaceRotation(fromTo(p0, p1), fromTo(p1, p2));
}


export { getStencilAngle }
