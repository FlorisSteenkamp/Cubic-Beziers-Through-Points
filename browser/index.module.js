/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "j": () => (/* reexport */ cubicBeziersThroughPoints)
});

;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-sign.js
/**
 * Returns the sign of the given expansion.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * From Shewchuk: "A nonoverlapping expansion is desirable because it is easy to
 * determine its sign (take the sign of the largest component) ... "
 *
 * @param e A floating point expansion with zeroes eliminated.
 */
function e_sign_eSign(e) {
    return e[e.length - 1];
}

//# sourceMappingURL=e-sign.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-representation/double-to-octets.js
// Modified from https://github.com/bartaz/ieee754-visualization/
// under the MIT license
// Copyright 2013 Bartek Szopka (original author)
/**
 * Returns the ieee-574 8 bytes composing the given double, starting from the
 * sign bit and ending in the lsb of the significand.
 * e.g. 123.456 -> [64, 94, 221, 47, 26, 159, 190, 119]
 */
function doubleToOctets(number) {
    var buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, number, false);
    return Array.from(new Uint8Array(buffer));
}

//# sourceMappingURL=double-to-octets.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-representation/double-to-binary-string.js
// Modified from https://github.com/bartaz/ieee754-visualization/
// under the MIT license
// Copyright 2013 Bartek Szopka (original author)

function doubleToBinaryString(number) {
    return octetsToBinaryString(doubleToOctets(number));
}
/**
 * @param octets The 8 bytes composing a double (msb first)
 */
function octetsToBinaryString(octets) {
    return octets
        .map(int8ToBinaryString)
        .join('');
}
/**
 * intToBinaryString(8) -> "00001000"
 */
function int8ToBinaryString(i) {
    let iStr = i.toString(2);
    for (; iStr.length < 8; iStr = "0" + iStr)
        ;
    return iStr;
}

//# sourceMappingURL=double-to-binary-string.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-representation/parse-double.js
// Modified from https://github.com/bartaz/ieee754-visualization/
// under the MIT license
// Copyright 2013 Bartek Szopka (original author)


/**
 * Returns the relevant parts of the given IEEE-754 double. The returned
 * exponent has been normalized (i.e. 1023 ha been subtracted) and the
 * significand has the hidden bit added if appropriate.
 * See https://github.com/bartaz/ieee754-visualization
 */
function parseDouble(x) {
    let parts = doubleToOctets(x);
    let p0 = parts[0];
    let p1 = parts[1];
    let sign = p0 >> 7;
    let exponent_ = ((p0 & 127) << 4) + ((p1 & 0b11110000) >> 4);
    //---- Check for negative / positive zero / denormalized numbers.
    let hiddenMsb = exponent_ === 0 ? 0 : 16;
    // Note: exponent === 0 => 0 or denormalized number (a.k.a. subnormal number).
    let exponent = exponent_ === 0
        ? exponent_ - 1022 // Subnormals use a biased exponent of 1 (not 0!)
        : exponent_ - 1023;
    //---- Break up the significand into bytes
    let significand = parts.slice(1);
    significand[0] = (p1 & 15) + hiddenMsb;
    return {
        sign,
        exponent,
        significand
    };
}
/**
 * Returns the relevant parts of the given IEEE-754 double.
 * See https://github.com/bartaz/ieee754-visualization.
 * This is a slower version of parseDouble that gives binary string
 * representations of the components.
 */
function parseDoubleDetailed(x) {
    let str = doubleToBinaryString(x);
    // sign{1} exponent{11} fraction{52} === 64 bits (+1 hidden!)
    let [, sign, exponent, significand] = str.match(/^(.)(.{11})(.{52})$/);
    let exponent_ = parseInt(exponent, 2);
    let hidden = exponent_ === 0 ? "0" : "1";
    return {
        full: sign + exponent + hidden + significand,
        sign,
        exponent,
        hidden,
        significand
    };
}

//# sourceMappingURL=parse-double.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-representation/significand.js

/**
 * Return the significand of the given double with the hidden bit added (in case
 * a is not subnormal or 0, etc.)
 * @param a A double
 */
function significand(a) {
    return parseDouble(a).significand;
}

//# sourceMappingURL=significand.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-representation/get-max-set-bit.js

/**
 * Returns the lowest set bit of the given value in [1, (2**31)-1],
 * i.e. from 1 up to 2147483647 else if no bit is set (input === 0) returns
 * NaN, otherwise if the number is out of range returns a non-finite
 * number.
 * See https://stackoverflow.com/a/35190288/2010061
 */
function getLowestSetBit_(a) {
    return Math.log2(a & -a);
}
/**
 * Returns the lowest set bit of the given number's significand (where the lsb
 * is bit 0 and the msb is bit 52). If no bit is set (input === 0 or +-inf or
 * NaN) returns NaN.
 * See https://stackoverflow.com/a/35190288/2010061
 */
function getLowestSetBit(a) {
    if (a === 0 || !Number.isFinite(a)) {
        // There is no lowest set bit
        return NaN;
    }
    // Note: the significand includes the hidden bit!
    let s = significand(a);
    let len = s.length;
    for (let i = len - 1; i >= 0; i--) {
        if (s[i] === 0) {
            continue;
        }
        let l = getLowestSetBit_(s[i]);
        if (Number.isFinite(l)) {
            return (8 * (len - i - 1)) + l;
        }
    }
    return NaN;
}
/**
 * Returns the highest set bit of the given value in [1, 255], i.e. from 1 up
 * to 255. If the input number === 0 returns NaN.
 * See https://stackoverflow.com/a/35190288/2010061
 */
function getHighestSetBit_(a) {
    return a >= 128 ? 7
        : a >= 64 ? 6
            : a >= 32 ? 5
                : a >= 16 ? 4
                    : a >= 8 ? 3
                        : a >= 4 ? 2
                            : a >= 2 ? 1
                                : a >= 1 ? 0
                                    : NaN;
}
/**
 * Returns the highest set bit of the given double. If no bit is set (input
 * === 0 or +/-inf or NaN) returns NaN.
 * See https://stackoverflow.com/a/35190288/2010061
 */
function getHighestSetBit(a) {
    if (a === 0 || !Number.isFinite(a)) {
        // There is no lowest set bit
        return NaN;
    }
    // At this point there must be a highest set bit (always === 52 if the 
    // number is not a subnormal.
    let s = significand(a);
    let len = s.length;
    for (let i = 0; i < len; i++) {
        let l = getHighestSetBit_(s[i]);
        if (Number.isFinite(l)) {
            return (8 * (len - i - 1)) + l;
        }
    }
    return NaN;
}

//# sourceMappingURL=get-max-set-bit.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-representation/exponent.js

/**
 * Returns the normalized exponent of the given number.
 * @param a A double
 */
function exponent(a) {
    return parseDouble(a).exponent;
}

//# sourceMappingURL=exponent.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-representation/msb-exponent.js


/**
 * Returns the true exponent of the msb that is set of the given number or
 * NaN if a === 0 or +-inf or NaN.
 * @param a An array of numbers to check
 */
function msbExponent(a) {
    if (a === 0 || !Number.isFinite(a)) {
        return NaN;
    }
    let e = exponent(a);
    // Will return e for all but subnormal numbers
    return getHighestSetBit(a) - 52 + e;
}

//# sourceMappingURL=msb-exponent.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-compress.js
/**
 * Returns the result of compressing the given floating point expansion.
 *
 * * primarily for internal library use
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * Theorem 23 (Shewchuck): Let e = sum_(i=1)^m(e_i) be a nonoverlapping
 * expansion of m p-bit components, where m >= 3. Suppose that the components of
 * e are sorted in order of increasing magnitude, except that any of the e_i may
 * be zero. Then the following algorithm will produce a nonoverlapping expansion
 * (nonadjacent if round-to even tiebreaking is used) such that
 * h = sum_(i=1)^n(h_i) = e, where the components h_i are in order of increasing
 * magnitude. If h != 0, none of the h_i will be zero. Furthermore, the largest
 * component h_n approximates h with an error smaller than ulp(h_n).
 */
function e_compress_eCompress(e) {
    //return e;
    const e_ = e.slice();
    const m = e_.length;
    if (m === 1) {
        return e_;
    }
    let Q = e_[m - 1];
    let bottom = m;
    for (let i = m - 2; i >= 0; --i) {
        const a = Q;
        const b = e_[i];
        Q = a + b;
        const bv = Q - a;
        const q = b - bv;
        if (q) {
            e_[--bottom] = Q;
            Q = q;
        }
    }
    let top = 0;
    for (let i = bottom; i < m; ++i) {
        const a = e_[i];
        const b = Q;
        Q = a + b;
        const bv = Q - a;
        const q = b - bv;
        if (q) {
            e_[top++] = q;
        }
    }
    e_[top++] = Q;
    e_.length = top;
    return e_;
}

//# sourceMappingURL=e-compress.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/basic/reduce-significand.js
/**
 * Truncates a floating point value's significand and returns the result.
 * Similar to split, but with the ability to specify the number of bits to keep.
 *
 * Theorem 17 (Veltkamp-Dekker): Let a be a p-bit floating-point number, where
 * p >= 3. Choose a splitting point s such that p/2 <= s <= p-1. Then the
 * following algorithm will produce a (p-s)-bit value a_hi and a
 * nonoverlapping (s-1)-bit value a_lo such that abs(a_hi) >= abs(a_lo) and
 * a = a_hi + a_lo.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param a a double
 * @param bits the number of significand bits to leave intact
 */
function reduceSignificand(a, bits) {
    const s = 53 - bits;
    const f = 2 ** s + 1;
    const c = f * a;
    const r = c - (c - a);
    return r;
}

//# sourceMappingURL=reduce-significand.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-to-bitlength.js




// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const sign = e_sign_eSign;
const compress = e_compress_eCompress;
/**
 * Returns a floating point expansion accurate to the given number of bits.
 * Extraneous bits are discarded.
 * @param a a floating point expansion
 * @param l the number of accurate bits to keep
 */
// TODO - make faster
function eToBitlength(a, l) {
    a = compress(a);
    if (sign(a) === 0) {
        return [0];
    }
    let maxMsb = msbExponent(a[a.length - 1]);
    let msb = maxMsb;
    let i = a.length - 1; // start at most significant byte
    while (i > 0) {
        let msb_ = msbExponent(a[i - 1]);
        if (maxMsb - msb_ > l) {
            break;
        }
        msb = msb_;
        i--;
    }
    let keepBits = Math.min(l - (maxMsb - msb), 53);
    let b = a[i];
    b = reduceSignificand(b, keepBits);
    let result = a.slice(i);
    result[0] = b;
    return result;
}

//# sourceMappingURL=e-to-bitlength.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-estimate.js
/**
 * Returns the result of the given floating point expansion rounded to a double
 * floating point number.
 *
 * The result is within 1 ulps of the actual value, e.g. imagine the worst case
 * situation where we add (in 4dot4) 1111.1000 + 0.000011111111... The result
 * will be 1111.1000 whereas as the correct result should be 1111.1001 and we
 * thus lost 1 ulp of accuracy. It does not matter that the expansion contain
 * several floats since none is overlapping.
 *
 * See Shewchuk https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 *
 * @param e a floating point expansion
 */
function e_estimate_eEstimate(e) {
    let Q = e[0];
    for (let i = 1; i < e.length; i++) {
        Q += e[i];
    }
    return Q;
}

//# sourceMappingURL=e-estimate.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/fast-expansion-sum.js

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const fast_expansion_sum_compress = (/* unused pure expression or super */ null && (eCompress));
/**
 * Returns the result of adding two expansions.
 *
 * Theorem 13: Let e = sum_(i=1)^m(e_i) and f = sum_(i=1)^n(f_i) be strongly
 * nonoverlapping expansions of m and n p-bit components, respectively, where
 * p >= 4. Suppose that the components of both e and f are sorted in order of
 * increasing magnitude, except that any of the e_i or f_i may be zero. On a
 * machine whose arithmetic uses the round-to-even rule, the following algorithm
 * will produce a strongly nonoverlapping expansion h such that
 * sum_(i=1)^(m+n)(e_i + f_i) = e + f, where the components of h are also in
 * order of increasing magnitude, except that any of the h_i may be zero.
 *
 * See https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 */
function fastExpansionSum(e, f) {
    //const g = merge(e,f);
    // inlined (above line)
    const lenE = e.length;
    const lenF = f.length;
    let i = 0;
    let j = 0;
    const g = [];
    while (i < lenE && j < lenF) {
        if (e[i] === 0) {
            i++;
            continue;
        }
        if (f[j] === 0) {
            j++;
            continue;
        }
        if (Math.abs(e[i]) <= Math.abs(f[j])) {
            g.push(e[i]);
            i++;
        }
        else {
            g.push(f[j]);
            j++;
        }
    }
    while (i < lenE) {
        g.push(e[i]);
        i++;
    }
    while (j < lenF) {
        g.push(f[j]);
        j++;
    }
    if (g.length === 0) {
        return [0];
    }
    // end inlined
    const len = g.length;
    if (len === 1) {
        return g;
    }
    //const h: number[] = new Array(len);
    const h = [];
    //const q: number;
    //[h[0], q] = fastTwoSum(g[1], g[0]);
    // inlined (above line)
    const a = g[1];
    const b = g[0];
    let q = a + b;
    //h[0] = b - (q - a);
    const hh = b - (q - a);
    if (hh !== 0) {
        h.push(hh);
    }
    ;
    //let j = 0;
    j = 0;
    for (let i = 2; i < len; i++) {
        //[h[i-1], q] = twoSum(q, g[i]);
        // inlined (above line)
        const b = g[i];
        const R = q + b;
        const _ = R - q;
        //h[i-1] = (q - (R - _)) + (b - _);
        const hh = (q - (R - _)) + (b - _);
        if (hh !== 0) {
            h.push(hh);
        }
        q = R;
    }
    //h[len-1] = q;
    //h.push(q);
    if (q !== 0 || h.length === 0) {
        h.push(q);
    }
    //return compress(h);
    return h;
}
/**
 * Returns the result of merging an expansion e and f into a single expansion,
 * in order of nondecreasing magnitude (possibly with interspersed zeros).
 * (This function is zero-eliminating)
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param e a floating point expansion
 * @param f another floating point expansion
 */
function merge(e, f) {
    const lenE = e.length;
    const lenF = f.length;
    let i = 0;
    let j = 0;
    const merged = [];
    while (i < lenE && j < lenF) {
        if (e[i] === 0) {
            i++;
            continue;
        }
        if (f[j] === 0) {
            j++;
            continue;
        }
        if (Math.abs(e[i]) <= Math.abs(f[j])) {
            merged.push(e[i]);
            i++;
        }
        else {
            merged.push(f[j]);
            j++;
        }
    }
    while (i < lenE) {
        merged.push(e[i]);
        i++;
    }
    while (j < lenF) {
        merged.push(f[j]);
        j++;
    }
    if (merged.length === 0) {
        return [0];
    }
    return merged;
}

//# sourceMappingURL=fast-expansion-sum.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/scale-expansion.js




const f = 134217729; // 2**27 + 1;
// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const tp = (/* unused pure expression or super */ null && (twoProduct));
const ts = (/* unused pure expression or super */ null && (twoSum));
const fts = (/* unused pure expression or super */ null && (fastTwoSum));
const scale_expansion_compress = (/* unused pure expression or super */ null && (eCompress));
/**
 * Returns the result of multiplying an expansion by a double.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * Theorem 19 (Shwechuk): Let e = sum_(i=1)^m(e_i) be a nonoverlapping expansion
 * of m p-bit components, and const b be a p-bit value where p >= 4. Suppose that
 * the components of e are sorted in order of increasing magnitude, except that
 * any of the e_i may be zero. Then the following algorithm will produce a
 * nonoverlapping expansion h such that h = sum_(i=1)^(2m)(h_i) = be, where the
 * components of h are also in order of increasing magnitude, except that any of
 * the h_i may be zero. Furthermore, if e is nonadjacent and round-to-even
 * tiebreaking is used, then h is non-adjacent.
 *
 * @param e a double floating point expansion
 * @param b a double
 */
function scaleExpansion(e, b) {
    const m = e.length;
    //const h: number[] = new Array(2*m);
    let q_;
    //[h[0], q] = tp(e[0], b);
    // inlined (above line)
    const a = e[0];
    let q = a * b;
    const c = f * a;
    const ah = c - (c - a);
    const al = a - ah;
    const d = f * b;
    const bh = d - (d - b);
    const bl = b - bh;
    const h = [];
    //h[0] = (al*bl) - ((q - (ah*bh)) - (al*bh) - (ah*bl));
    const hh = (al * bl) - ((q - (ah * bh)) - (al * bh) - (ah * bl));
    if (hh !== 0) {
        h.push(hh);
    }
    ;
    for (let i = 1; i < m; i++) {
        //const [t, T] = tp(e[i], b);
        // inlined (above line)
        const a = e[i];
        const T = a * b;
        const c = f * a;
        const ah = c - (c - a);
        const al = a - ah;
        const d = f * b;
        const bh = d - (d - b);
        const bl = b - bh;
        const t = (al * bl) - ((T - (ah * bh)) - (al * bh) - (ah * bl));
        //[h[2*i-1], q_] = ts(q, t);
        // inlined (above line)
        const x = q + t;
        const bv = x - q;
        //h[2*i-1] = (q - (x - bv)) + (t - bv);
        //h.push((q - (x - bv)) + (t - bv));
        const hh = (q - (x - bv)) + (t - bv);
        if (hh !== 0) {
            h.push(hh);
        }
        q_ = x;
        //[h[2*i], q] = fts(T, q_);
        // inlined (above line)
        const xx = T + q_;
        //h[2*i] = q_ - (xx - T);
        //h.push(q_ - (xx - T));
        const hhh = q_ - (xx - T);
        if (hhh !== 0) {
            h.push(hhh);
        }
        q = xx;
    }
    //h[2*m - 1] = q;
    //h.push(q);
    if (q !== 0 || h.length === 0) {
        h.push(q);
    }
    //return eCompress(h);
    return h;
}
/**
 * Returns the result of multiplying an expansion by a double.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * Theorem 19 (Shwechuk): Let e = sum_(i=1)^m(e_i) be a nonoverlapping expansion
 * of m p-bit components, and const b be a p-bit value where p >= 4. Suppose that
 * the components of e are sorted in order of increasing magnitude, except that
 * any of the e_i may be zero. Then the following algorithm will produce a
 * nonoverlapping expansion h such that h = sum_(i=1)^(2m)(h_i) = be, where the
 * components of h are also in order of increasing magnitude, except that any of
 * the h_i may be zero. Furthermore, if e is nonadjacent and round-to-even
 * tiebreaking is used, then h is non-adjacent.
 *
 * @param e a double floating point expansion
 * @param b a double
 */
function scaleExpansion2(b, e) {
    const m = e.length;
    //const h: number[] = new Array(2*m);
    let q_;
    //[h[0], q] = tp(e[0], b);
    // inlined (above line)
    const a = e[0];
    let q = a * b;
    const c = f * a;
    const ah = c - (c - a);
    const al = a - ah;
    const d = f * b;
    const bh = d - (d - b);
    const bl = b - bh;
    const h = [];
    //h[0] = (al*bl) - ((q - (ah*bh)) - (al*bh) - (ah*bl));
    const hh = (al * bl) - ((q - (ah * bh)) - (al * bh) - (ah * bl));
    if (hh !== 0) {
        h.push(hh);
    }
    ;
    for (let i = 1; i < m; i++) {
        //const [t, T] = tp(e[i], b);
        // inlined (above line)
        const a = e[i];
        const T = a * b;
        const c = f * a;
        const ah = c - (c - a);
        const al = a - ah;
        const d = f * b;
        const bh = d - (d - b);
        const bl = b - bh;
        const t = (al * bl) - ((T - (ah * bh)) - (al * bh) - (ah * bl));
        //[h[2*i-1], q_] = ts(q, t);
        // inlined (above line)
        const x = q + t;
        const bv = x - q;
        //h[2*i-1] = (q - (x - bv)) + (t - bv);
        //h.push((q - (x - bv)) + (t - bv));
        const hh = (q - (x - bv)) + (t - bv);
        if (hh !== 0) {
            h.push(hh);
        }
        q_ = x;
        //[h[2*i], q] = fts(T, q_);
        // inlined (above line)
        const xx = T + q_;
        //h[2*i] = q_ - (xx - T);
        //h.push(q_ - (xx - T));
        const hhh = q_ - (xx - T);
        if (hhh !== 0) {
            h.push(hhh);
        }
        q = xx;
    }
    //h[2*m - 1] = q;
    //h.push(q);
    if (q !== 0 || h.length === 0) {
        h.push(q);
    }
    //return eCompress(h);
    return h;
}

//# sourceMappingURL=scale-expansion.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/expansion-product.js



// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const multByDouble = scaleExpansion;
const add = fastExpansionSum;
const expansion_product_compress = (/* unused pure expression or super */ null && (eCompress));
/**
 * Returns the product of two double floating point expansions.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * As per Shewchuk in the above paper: "To find the product of two expansions
 * e and f, use SCALE-EXPANSION (with zero elimination) to form the expansions
 * ef_1, ef_2, ..., then sum these using a distillation tree."
 *
 * A distillation tree used with fastExpansionSum will give O(k*log k) vs O(k^2)
 * operations.
 *
 * Implemented naively and not as described by Shewchuk (i.e. the algorithm
 * takes O(k^2) operations).
 * @param e a double floating point expansion
 * @param f another double floating point expansion
 */
function expansion_product_expansionProduct(e, f) {
    let sum = [0];
    for (let i = 0; i < e.length; i++) {
        sum = add(sum, multByDouble(f, e[i]));
    }
    //return compress(sum);
    return sum;
}

//# sourceMappingURL=expansion-product.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-negative-of.js
/**
 * Returns the negative of the given floating point expansion.
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param e a floating point expansion
 */
function eNegativeOf(e) {
    const m = e.length;
    const h = new Array(m);
    for (let i = 0; i < m; i++) {
        h[i] = -e[i];
    }
    return h;
}

//# sourceMappingURL=e-negative-of.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-diff.js


// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const negativeOf = eNegativeOf;
const e_diff_add = fastExpansionSum;
/**
 * Returns the difference between two floating point expansions, i.e. e - f.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param e a floating point expansion
 * @param f another floating point expansion
 */
function e_diff_eDiff(e, f) {
    const g = negativeOf(f);
    return e_diff_add(e, g);
}

//# sourceMappingURL=e-diff.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-representation/bit-length.js




/**
 * Returns the bit-length of the significand of the given number in such a way
 * that trailing zeros are not counted.
 * @param a A double precision floating point number
 */
function bitLength(a) {
    if (a === 0) {
        return 0;
    }
    return getHighestSetBit(a) - getLowestSetBit(a) + 1;
}
/**
 * Returns the bit-length of the significand of the given floating point
 * expansion in such a way that trailing zeros are not counted.
 * * precondition: subnormals not currently supported
 * @param a A double precision floating point expansion
 */
function expBitLength(a) {
    let a_ = e_compress_eCompress(a);
    if (e_sign_eSign(a_) === 0) {
        return 0;
    }
    let msbyte = a_[a_.length - 1];
    let lsbyte = a_[0];
    return exponent(msbyte) - exponent(lsbyte) + (53 - getLowestSetBit(lsbyte));
}

//# sourceMappingURL=bit-length.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-div.js





// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const mult = expansion_product_expansionProduct;
const toBitlength = eToBitlength;
const e_div_bitLength = expBitLength;
const diff = e_diff_eDiff;
const estimate = e_estimate_eEstimate;
/**
 * Returns the result of a/b using Goldschmidt division.
 *
 * The result will only be exact if b|a, i.e. if b divides a exactly, else the
 * result will be rounded to the longest bitlength between a and b.
 *
 * @param a the numerator
 * @param b the denominator
 *
 * @param expansionLength the bitlength/53 of the final result, e.g. 1 means
 * standard double precision, 2 means double-double, etc up to a max of about 20 at
 * which point underflow cease precision improvement. If the division is known
 * to be exact beforehand (such as in the pseudo remainder sequence algorithm)
 * then set expansionLength === 0 and an exact division will be done.
 */
// TODO - test this function properly or replace with a better one
function eDiv(N, D, expansionLength) {
    let D_ = D;
    let N_ = N;
    let exact = false;
    let resultBitlengthUpperBound = 0;
    if (!expansionLength) {
        let bitlengthN = e_div_bitLength(N_);
        let bitlengthD = e_div_bitLength(D_);
        // resultBitlengthUpperBound is only valid if the division is known
        // to be exact
        resultBitlengthUpperBound = bitlengthN - bitlengthD + 1;
        expansionLength = (resultBitlengthUpperBound / 53) + 1;
        exact = true;
    }
    let F = [1 / estimate(D_)]; // Initial guess - out by 1/2 upls
    let i = 1;
    while (true) {
        N_ = mult(N_, F);
        // The precision bitlength doubles on each iteration
        if (i > expansionLength) {
            // we now have roughly double the needed precision - we actually 
            // only require about the precision and then round properly - this
            // could be implemented in the future.
            if (exact) {
                // We must throw away bits known to be zero. 
                // Any bits > expansionLength * 53 must be thrown away as they
                // are wrong - all other bits are exact.
                N_ = toBitlength(N_, resultBitlengthUpperBound);
                // TODO - below is just for testing - remove later
                //if (compare(mult(D, N_), N) !== 0) {
                //    console.log(mult(D, N_))
                //    throw new Error(`division in-exact - probably due to underflow, N: ${N}, D: ${D}, Result: ${N_}, product: ${mult(D, N_)}`); 
                //} 
                return N_;
            }
            // Returning only significant bits helps with sign determination later on.
            return N_.slice(N_.length - expansionLength, N_.length);
        }
        D_ = mult(D_, F);
        F = diff([2], D_);
        i *= 2;
    }
}

//# sourceMappingURL=e-div.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/grow-expansion.js

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const grow_expansion_compress = (/* unused pure expression or super */ null && (eCompress));
/**
 * Returns the result of adding a double to an expansion.
 *
 * Let e be a nonoverlapping expansion of m p-bit components, and let b be a
 * p-bit value where p >= 3. Suppose that the components e_1, ..., e_m are
 * sorted in order of *increasing* magnitude, except that any of the ei may be
 * zero.
 * Then the following algorithm will produce a nonoverlapping expansion such
 * that h = sum_i(h_i) = e + b, where the components h_1, ..., h_(m+1) are also
 * in order of increasing magnitude, except that any of the h_i may be zero.
 * Furthermore, if e is nonadjacent and round-to-even tiebreaking is used, then
 * h is nonadjacent.
 * See https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 * @param e A floating point expansion
 * @param b Another floating point expansion
 */
function growExpansion(e, b) {
    const m = e.length;
    let q = b;
    //const h: number[] = new Array(m+1);
    const h = [];
    //let j = 0;
    for (let i = 0; i < m; i++) {
        // Note the use of twoSum and not fastTwoSum.
        //[h[i], q] = ts(q, e[i]);
        const ee = e[i];
        const x = q + ee;
        const bv = x - q;
        let hh = (q - (x - bv)) + (ee - bv);
        if (hh !== 0) {
            h.push(hh);
        }
        q = x;
    }
    //h[j] = q;
    if (q !== 0 || h.length === 0) {
        h.push(q);
    }
    //return compress(h);
    return h;
}

//# sourceMappingURL=grow-expansion.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/basic/two-sum.js
/**
 * Returns the exact result of adding two doubles.
 *
 * * the resulting array is the reverse of the standard twoSum in the literature.
 *
 * Theorem 7 (Knuth): Let a and b be p-bit floating-point numbers. Then the
 * following algorithm will produce a nonoverlapping expansion x + y such that
 * a + b = x + y, where x is an approximation to a + b and y is the roundoff
 * error in the calculation of x.
 *
 * See https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 */
function two_sum_twoSum(a, b) {
    const x = a + b;
    const bv = x - a;
    return [(a - (x - bv)) + (b - bv), x];
}
// inlined
//const R = a + b; const _ = R - a; const r = (a - (R - _)) + (b - _); return [r,R]

//# sourceMappingURL=two-sum.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-sum.js



// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const e_sum_ts = two_sum_twoSum;
const addDouble = growExpansion;
const e_sum_add = fastExpansionSum;
/**
 * Returns the result of summing an array of floating point expansions.
 *
 * * The result is exact in the form of a non-overlapping floating point
 * expansion.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param terms An array of numbers to be summed; A term is represented by a
 * floating point expansion.
 */
// The terms parameter were chosen to always be expansions in order to keep the 
// function monomorhic, but whether it's really worth it I am not sure.
function eSum(terms) {
    let total = [0];
    for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        // add
        if (term.length === 1) {
            if (total.length === 1) {
                total = e_sum_ts(total[0], term[0]);
            }
            else {
                total = addDouble(total, term[0]);
            }
        }
        else {
            if (total.length === 1) {
                total = addDouble(term, total[0]);
            }
            else {
                total = e_sum_add(total, term);
            }
        }
    }
    return total;
}

//# sourceMappingURL=e-sum.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-long-divide.js







// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const e_long_divide_eNegativeOf = eNegativeOf;
const e_long_divide_fastExpansionSum = fastExpansionSum;
const e_long_divide_eCompress = e_compress_eCompress;
const e_long_divide_growExpansion = growExpansion;
const e_long_divide_eSum = eSum;
const e_long_divide_scaleExpansion = scaleExpansion;
const e_long_divide_eDiff = e_diff_eDiff;
const e_long_divide_sign = Math.sign;
function eLongDivide(N, D) {
    N = e_long_divide_eCompress(N);
    D = e_long_divide_eCompress(D);
    // get the most significant double
    // out by at most 1 ulp, exact if d < MAX_SAFE_INT
    let d = D[D.length - 1];
    // trivial cases
    if (D.length === 1) {
        if (d === 0) {
            throw new Error('division by zero');
        }
        if (d === 1) {
            return { div: N, rem: [0] };
        }
        if (d === -1) {
            return { div: e_long_divide_eNegativeOf(N), rem: [0] };
        }
    }
    const signN = e_long_divide_sign(N[N.length - 1]);
    if (signN === 0) {
        return { div: [0], rem: [0] };
    }
    let signD = e_long_divide_sign(d);
    let divs = [];
    let oldLen = 0;
    while (true) {
        let rems = [];
        // loop from big `n[i]` to small `n[i]`
        for (let i = N.length - 1; i >= 0; i--) {
            const n = N[i];
            // `n % d` is the exact rem (for rem < MAX_SAFE_INTEGER) but is preliminary 
            // as it is subject to round-off for rem > MAX_SAFE_INTEGER; thus out by at 
            // most 1/2 ulp
            // Due to roundoff (and the fact we'e using `d` and not `D`!), `_div` does 
            // not necessarily represent the exact quotient.
            let div = Math.round((n - (n % d)) / d);
            // get the remainder by calculating `rem = n - d*div`
            rems.push(e_long_divide_scaleExpansion(D, div)); // exact
            if (div === 0) {
                break;
            }
            divs.push(div);
        }
        N = e_long_divide_eCompress(e_long_divide_eDiff(N, e_long_divide_eSum(rems)));
        if (oldLen === divs.length) {
            break;
        }
        oldLen = divs.length;
    }
    let rem = N;
    let div = [0];
    for (let i = 0; i < divs.length; i++) {
        div = e_long_divide_growExpansion(div, divs[i]);
    }
    div = e_long_divide_eCompress(div);
    //----------------------
    // fix signs (possibly)
    //----------------------
    //const signDiv = sign(div[div.length-1]);
    const signRem = e_long_divide_sign(rem[rem.length - 1]);
    //const signND = signN * signD;
    // We must have:
    // sign(div) === sign(n) * sign(d)
    // sign(rem) === sign(n)
    // At this point: `signN !== 0` and `signD !== 0`
    if (signRem !== 0 && signRem !== signN) {
        if (signN > 0) {
            if (signD > 0) {
                // div = div - 1  (div is positive)
                // rem = rem + D
                div = e_long_divide_growExpansion(div, -1);
                rem = e_long_divide_fastExpansionSum(rem, D);
            }
            else {
                // div = div + 1  (div is positive)
                // rem = rem - D
                div = e_long_divide_growExpansion(div, +1);
                rem = e_long_divide_fastExpansionSum(rem, e_long_divide_eNegativeOf(D));
            }
        }
        else if (signN < 0) {
            if (signD > 0) {
                // div = div + 1 (div is negative)
                // rem = rem - D
                div = e_long_divide_growExpansion(div, +1);
                rem = e_long_divide_fastExpansionSum(rem, e_long_divide_eNegativeOf(D));
            }
            else {
                // div = div - 1  (div is positive)
                // rem = rem + D
                div = e_long_divide_growExpansion(div, -1);
                rem = e_long_divide_fastExpansionSum(rem, D);
            }
        }
    }
    return { div, rem };
}

//# sourceMappingURL=e-long-divide.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-int-div.js

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const e_int_div_eLongDivide = eLongDivide;
/**
 * Returns the result of the integer division a/b.
 *
 * * **precondition:** a and b must be integers, b !== 0
 */
function eIntDiv(a, b) {
    return e_int_div_eLongDivide(a, b).div;
}

//# sourceMappingURL=e-int-div.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-rem.js

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const e_rem_eLongDivide = eLongDivide;
/**
 * Returns a % b
 *
 * * **precondition:** a and b must be integers, b !== 0
 */
function eRem(a, b) {
    return e_rem_eLongDivide(a, b).rem;
}

//# sourceMappingURL=e-rem.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-compare.js


/**
 * Returns 0 if a === b, a +tive value if a > b or a negative value if a < b.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * "The easiest way to compare two expansions is to subtract one from the other,
 * and test the sign of the result. An expansion’s sign can be easily tested
 * because of the nonoverlapping property; simply check the sign of the
 * expansion's most significant nonzero component..."
 *
 * @param a a floating point expansion
 * @param b another floating point expansion
 */
function e_compare_eCompare(a, b) {
    return e_sign_eSign(e_diff_eDiff(a, b));
}

//# sourceMappingURL=e-compare.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-abs.js


// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const e_abs_sign = (/* unused pure expression or super */ null && (eSign));
const e_abs_negativeOf = eNegativeOf;
/**
 * Returns the absolute value of the given floating point expansion.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param e a floating point expansion
 */
function e_abs_eAbs(e) {
    if (e[e.length - 1] < 0) {
        return e_abs_negativeOf(e);
    }
    return e;
}

//# sourceMappingURL=e-abs.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/basic/fast-two-diff.js
/**
 * Returns the difference and exact error of subtracting two floating point
 * numbers.
 * Uses an EFT (error-free transformation), i.e. a-b === x+y exactly.
 * The returned result is a non-overlapping expansion (smallest value first!).
 *
 * Precondition: abs(a) >= abs(b) - A fast test that can be used is
 * (a > b) === (a > -b)
 *
 * See https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 */
function fastTwoDiff(a, b) {
    const x = a - b;
    const y = (a - x) - b;
    return [y, x];
}

//# sourceMappingURL=fast-two-diff.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/basic/fast-two-sum.js
/**
 * Returns the sum and exact error of adding two floating point numbers.
 * Uses an EFT (error-free transformation), i.e. a+b === x+y exactly.
 * The returned sum is a non-overlapping expansion (smallest value first!).
 *
 * Precondition: abs(a) >= abs(b) - A fast test that can be used is
 * (a > b) === (a > -b)
 *
 * See https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 */
function fast_two_sum_fastTwoSum(a, b) {
    const x = a + b;
    return [b - (x - a), x];
}
// inlined
//const R = a + b; const r = b - (R - a); return [r, R];

//# sourceMappingURL=fast-two-sum.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-mult-by-2.js
/**
 * Returns the result of multiplying a floating point expansion by 2.
 * * **error free**
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param e a floating point expansion
 */
function eMultBy2(e) {
    const e_ = [];
    for (let i = 0; i < e.length; i++) {
        e_.push(2 * e[i]);
    }
    return e_;
}

//# sourceMappingURL=e-mult-by-2.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-mult-by-neg-2.js
/**
 * Multiply a floating point expansion by -2.
 * * **error free**
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param e a floating point expansion
 */
function eMultByNeg2(e) {
    const e_ = [];
    for (let i = 0; i < e.length; i++) {
        e_.push(-2 * e[i]);
    }
    return e_;
}

//# sourceMappingURL=e-mult-by-neg-2.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-div-by-2.js
/**
 * Returns the result of dividing a floating point expansion by 2.
 * * **error free**
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param e a floating point expansion
 */
function eDivBy2(e) {
    const e_ = [];
    for (let i = 0; i < e.length; i++) {
        e_.push(0.5 * e[i]);
    }
    return e_;
}

//# sourceMappingURL=e-div-by-2.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/basic/split.js
/**
 * === Math.ceil(p/2) where p is the # of significand bits in a double === 53.
 */
const split_f = 134217729; // 2**27 + 1;
/**
 * Returns the result of splitting a double into 2 26-bit doubles.
 *
 * Theorem 17 (Veltkamp-Dekker): Let a be a p-bit floating-point number, where
 * p >= 3. Choose a splitting point s such that p/2 <= s <= p-1. Then the
 * following algorithm will produce a (p-s)-bit value a_hi and a
 * nonoverlapping (s-1)-bit value a_lo such that abs(a_hi) >= abs(a_lo) and
 * a = a_hi + a_lo.
 *
 * see e.g. [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 * @param a A double floating point number
 */
function split(a) {
    const c = split_f * a;
    const a_h = c - (c - a);
    const a_l = a - a_h;
    return [a_h, a_l];
}
// inlined - input a, output a_h, a_l
// const c = f * a; const a_h = c - (c - a); const a_l = a - a_h; return [a_h, a_l];

//# sourceMappingURL=split.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/basic/two-diff.js
/**
 * Returns the exact result of subtracting b from a (as a floating point
 * expansion).
 * @param a
 * @param b
 */
function two_diff_twoDiff(a, b) {
    const x = a - b;
    const bvirt = a - x;
    const y = (a - (x + bvirt)) + (bvirt - b);
    return [y, x];
}

//# sourceMappingURL=two-diff.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/basic/two-product.js
const two_product_f = 134217729; // 2**27 + 1;
/**
 * Returns the exact result of multiplying two doubles.
 *
 * * the resulting array is the reverse of the standard twoSum in the literature.
 *
 * Theorem 18 (Shewchuk): Let a and b be p-bit floating-point numbers, where
 * p >= 6. Then the following algorithm will produce a nonoverlapping expansion
 * x + y such that ab = x + y, where x is an approximation to ab and y
 * represents the roundoff error in the calculation of x. Furthermore, if
 * round-to-even tiebreaking is used, x and y are non-adjacent.
 *
 * See https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 * @param a A double
 * @param b Another double
 */
function two_product_twoProduct(a, b) {
    const x = a * b;
    //const [ah, al] = split(a);
    const c = two_product_f * a;
    const ah = c - (c - a);
    const al = a - ah;
    //const [bh, bl] = split(b);
    const d = two_product_f * b;
    const bh = d - (d - b);
    const bl = b - bh;
    const y = (al * bl) - ((x - (ah * bh)) - (al * bh) - (ah * bl));
    //const err1 = x - (ah * bh);
    //const err2 = err1 - (al * bh);
    //const err3 = err2 - (ah * bl);
    //const y = (al * bl) - err3;
    return [y, x];
}

//# sourceMappingURL=two-product.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-representation/is-bit-aligned.js


/**
 * Returns true if the given number is bit-aligned in the sense that its a
 * multiple of a given power of 2, say e, and such that the number, say a,
 * conforms to: a/2^e < 2^(l-e), where l is the max allowed bit length.
 * This essentially means the numbers act somewhat like fixed-point numbers
 * which can drastically speed up some geometric algorithms and also reduce
 * their complexity.
 *
 * Visually:
 * These numbers (a,b and c) are bit aligned with e === 3 and max
 * bitlength === 6:
 *    a -> 00|101100|000
 *    b -> 00|000100|000
 *    c -> 00|110111|000
 * These are not
 *    a -> 01|101100|000
 *    b -> 00|000100|000
 * These are not
 *    a -> 00|101100|000
 *    b -> 00|000100|100
 * These are not
 *    a -> 00|101100|100
 *    b -> 00|000100|100
 * @param as An array of numbers to check
 * @param maxBitLength The max allowed bitlength
 * @param gridSpacingExponent The grid spacing === 1^gridSpacingExponent
 */
function isBitAligned(a, maxBitLength, gridSpacingExponent) {
    if (a === 0) {
        return true;
    }
    let e = exponent(a);
    let maxSetBit = getHighestSetBit(a) - 52 + e;
    let minSetBit = getLowestSetBit(a) - 52 + e;
    let minBitBigEnough = minSetBit >= gridSpacingExponent;
    let maxBitSmallEnough = maxSetBit <= maxBitLength - 1 + gridSpacingExponent;
    return minBitBigEnough && maxBitSmallEnough;
}

//# sourceMappingURL=is-bit-aligned.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-representation/lsb-exponent.js


/**
 * Returns the true exponent of the lsb that is set of the given number or
 * NaN if a === 0 or +-inf or NaN.
 * @param a An array of numbers to check
 */
function lsbExponent(a) {
    if (a === 0 || !Number.isFinite(a)) {
        return NaN;
    }
    let e = exponent(a);
    return getLowestSetBit(a) - 52 + e;
}

//# sourceMappingURL=lsb-exponent.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-calculate.js







// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const e_calculate_mult = expansion_product_expansionProduct;
const e_calculate_tp = two_product_twoProduct;
const e_calculate_multByDouble = scaleExpansion;
const e_calculate_ts = two_sum_twoSum;
const e_calculate_addDouble = growExpansion;
const e_calculate_add = fastExpansionSum;
const e_calculate_compress = (/* unused pure expression or super */ null && (eCompress));
/**
 * Return the result of summing an array of terms, each term being an array of
 * floating point expansions to be multiplied together.
 *
 * * The result is exact in the form of a non-overlapping floating point
 * expansion.
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param terms An array of terms to be summed; A term consists of an
 * array of floating point expansions to be multiplied together.
 */
// The terms parameter were chosen to always be expansions in order to keep the 
// function monomorhic, but whether it's really worth it I am not sure.
function eCalculate(terms) {
    let total = [0];
    for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        let product = term[0];
        for (let j = 1; j < term.length; j++) {
            const multiplicant = term[j];
            if (multiplicant.length == 1) {
                if (product.length === 1) {
                    product = e_calculate_tp(product[0], multiplicant[0]);
                }
                else {
                    product = e_calculate_multByDouble(product, multiplicant[0]);
                }
            }
            else if (product.length === 1) {
                product = e_calculate_multByDouble(multiplicant, product[0]);
            }
            else {
                product = e_calculate_mult(multiplicant, product);
            }
        }
        // add
        if (product.length === 1) {
            if (total.length === 1) {
                total = e_calculate_ts(total[0], product[0]);
            }
            else {
                total = e_calculate_addDouble(total, product[0]);
            }
        }
        else {
            if (total.length === 1) {
                total = e_calculate_addDouble(product, total[0]);
            }
            else {
                total = e_calculate_add(total, product);
            }
        }
    }
    //return compress(total);
    return total;
}

//# sourceMappingURL=e-calculate.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-product.js




// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const e_product_mult = expansion_product_expansionProduct;
const e_product_tp = two_product_twoProduct;
const e_product_multByDouble = scaleExpansion;
const e_product_compress = e_compress_eCompress;
/**
 * Return the result of multiplying together an array of floating point
 * expansions.
 *
 * * The result is exact in the form of a non-overlapping floating point
 * expansion.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param terms an array of multiplicands
 */
function eProduct(term) {
    let product = term[0];
    for (let j = 1; j < term.length; j++) {
        const multiplicant = term[j];
        if (multiplicant.length == 1) {
            if (product.length === 1) {
                product = e_product_tp(product[0], multiplicant[0]);
            }
            else {
                product = e_product_multByDouble(product, multiplicant[0]);
            }
        }
        else if (product.length === 1) {
            product = e_product_multByDouble(multiplicant, product[0]);
        }
        else {
            product = e_product_mult(multiplicant, product);
        }
    }
    return e_product_compress(product);
    //return product;
}

//# sourceMappingURL=e-product.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-int-pow.js


// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const e_int_pow_mult = expansion_product_expansionProduct;
const prod = eProduct;
/**
 * Returns a**i, where i is a non-negative integer.
 * @param a a floating point expansion
 */
// TODO - this algorithm's speed can easily be improved significantly using 'repeated squaring'
function eIntPow(a, p) {
    // a^0 === 1
    if (p === 0) {
        return [1];
    }
    // a^1 === a
    if (p === 1) {
        return a;
    }
    if (p === 2) {
        return e_int_pow_mult(a, a);
    }
    const as = [];
    for (let i = 0; i < p; i++) {
        as.push(a);
    }
    return prod(as);
}

//# sourceMappingURL=e-int-pow.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-to-double-double.js

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const e_to_double_double_compress = e_compress_eCompress;
/**
 * Returns the result of converting a floating point expansion to a
 * double-double precision floating point number.
 */
function eToDd(e) {
    e = e_to_double_double_compress(e);
    const len = e.length;
    if (len === 2) {
        return e; // already a double-double
    }
    else if (len === 1) {
        return [0, e[0]]; // double-doubles have a fixed length of 2
    }
    return [e[len - 2], e[len - 1]]; // return only most significant parts
}

//# sourceMappingURL=e-to-double-double.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/geometric-primitives/orient2d.js






let ccwerrboundA = 3.330669073875472e-16;
let ccwerrboundB = 2.220446049250315e-16;
let ccwerrboundC = 1.109335647967049e-31;
let resulterrbound = 3.330669073875471e-16;
/**
 * * Ported from [Shewchuk](http://docs.ros.org/kinetic/api/asr_approx_mvbb/html/Predicates_8cpp_source.html)
 * * see also https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 *
 * * Adaptive exact 2d orientation test.
 *
 * * Robust.
 *
 * Return a positive value if the points pa, pb, and pc occur in
 * counterclockwise order; a negative value if they occur in clockwise order;
 * and zero if they are collinear.  The result is also a rough approximation of
 * twice the signed area of the triangle defined by the three points.
 *
 * The result returned is the determinant of a matrix. This determinant is
 * computed adaptively, in the sense that exact arithmetic is used only to the
 * degree it is needed to ensure that the returned value has the correct sign.
 * Hence, orient2d() is usually quite fast, but will run more slowly when the
 * input points are collinear or nearly so.
 */
function orient2d_orient2d(A, B, C) {
    let detleft = (A[0] - C[0]) * (B[1] - C[1]);
    let detright = (A[1] - C[1]) * (B[0] - C[0]);
    let det = detleft - detright;
    let detsum;
    if (detleft > 0) {
        if (detright <= 0) {
            // Anti-clockwise
            return det;
        }
        else {
            detsum = detleft + detright;
        }
    }
    else if (detleft < 0) {
        if (detright >= 0) {
            // Clockwise
            return det;
        }
        else {
            detsum = -detleft - detright;
        }
    }
    else {
        // Anti-clockwise, clockwise or straight
        return det;
    }
    if (Math.abs(det) >= ccwerrboundA * detsum) {
        // Anti-clockwise or clockwise
        return det;
    }
    return orient2dAdapt(A, B, C, detsum);
}
function orient2dAdapt(A, B, C, detsum) {
    let acx = A[0] - C[0];
    let bcx = B[0] - C[0];
    let acy = A[1] - C[1];
    let bcy = B[1] - C[1];
    let b = e_diff_eDiff(two_product_twoProduct(acx, bcy), two_product_twoProduct(acy, bcx));
    let det = e_estimate_eEstimate(b);
    if (Math.abs(det) >= ccwerrboundB * detsum) {
        // Anti-clockwise or clockwise
        return det;
    }
    let acxtail = two_diff_twoDiff(A[0], C[0])[0];
    let bcxtail = two_diff_twoDiff(B[0], C[0])[0];
    let acytail = two_diff_twoDiff(A[1], C[1])[0];
    let bcytail = two_diff_twoDiff(B[1], C[1])[0];
    if (acxtail === 0 && acytail === 0 &&
        bcxtail === 0 && bcytail === 0) {
        // Straight
        return det;
    }
    let errbound = ccwerrboundC * detsum + resulterrbound * Math.abs(det);
    det += (acx * bcytail + bcy * acxtail) - (acy * bcxtail + bcx * acytail);
    if (Math.abs(det) >= errbound) {
        return det;
    }
    let a = e_diff_eDiff(two_product_twoProduct(acxtail, bcy), two_product_twoProduct(acytail, bcx));
    let c = fastExpansionSum(b, a);
    let d = e_diff_eDiff(two_product_twoProduct(acx, bcytail), two_product_twoProduct(acy, bcxtail));
    let e = fastExpansionSum(c, d);
    let f = e_diff_eDiff(two_product_twoProduct(acxtail, bcytail), two_product_twoProduct(acytail, bcxtail));
    let D = fastExpansionSum(e, f);
    D = e_compress_eCompress(D);
    return D[D.length - 1];
}

//# sourceMappingURL=orient2d.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/is-overlapping.js


/**
 * Returns true if a and b overlaps, false otherwise.
 *
 * Two floating-point values x and y are nonoverlapping if the least significant
 * nonzero bit of x is more significant than the most significant nonzero bit of
 * y.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * Implemented for testing purposes.
 * @param a a double
 * @param b another double
 */
function isOverlapping(a, b) {
    return !isNonOverlapping(a, b);
}
/**
 * Returns true if a and b does not overlap, false otherwise.
 *
 * Two floating-point values x and y are nonoverlapping if the least significant
 * nonzero bit of x is more significant than the most significant nonzero bit of
 * y.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * Implemented for testing purposes.
 *
 * @param a A double
 * @param b Another double
 */
function isNonOverlapping(a, b) {
    if (a === 0 || b === 0) {
        return true;
    }
    if (Math.abs(b) > Math.abs(a)) {
        [a, b] = [b, a];
    }
    // At this point abs(a) > abs(b)
    let l = getLowestSetBit(a);
    let h = getHighestSetBit(b);
    let shift = exponent(a) - exponent(b);
    return (l + shift) > h;
}
/**
 * Returns true if all components of the given floating point expansion is
 * non-overlapping, false otherwise.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param e a double floating point expansion
 */
function isNonOverlappingAll(e) {
    for (let i = 1; i < e.length; i++) {
        if (isOverlapping(e[i - 1], e[i])) {
            return false;
        }
    }
    return true;
}

//# sourceMappingURL=is-overlapping.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/is-adjacent.js

/**
 * Returns true if x and y are adjacent, false otherwise.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 * for details
 *
 * @param x a double floating point number
 * @param y another double floating point number
 */
function isAdjacent(x, y) {
    return isOverlapping(x, y) ||
        isOverlapping(x, 2 * y) ||
        isOverlapping(2 * x, y);
}

//# sourceMappingURL=is-adjacent.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-is-integer.js

function eIsInteger(a) {
    a = e_compress_eCompress(a);
    for (let i = 0; i < a.length; i++) {
        if (a[i] % 1 !== 0) {
            return false;
        }
    }
    return true;
}

//# sourceMappingURL=e-is-integer.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/index.js














































// Aliases for some functions which names were not changed due to them being
// used extensively in the literature with a particular recognizable name
const eAdd = fastExpansionSum;
const eAddDouble = growExpansion;
const eMult = expansion_product_expansionProduct;
const eMultDouble1 = scaleExpansion;
const eMultDouble2 = scaleExpansion2;
const operators = {
    //---- basic ----//
    fastTwoDiff: fastTwoDiff,
    fastTwoSum: fast_two_sum_fastTwoSum,
    split: split,
    twoDiff: two_diff_twoDiff,
    twoProduct: two_product_twoProduct,
    twoSum: two_sum_twoSum,
    reduceSignificand: reduceSignificand,
    //---- double floating point expansions ----//
    fastExpansionSum: fastExpansionSum, eAdd,
    growExpansion: growExpansion, eAddDouble,
    expansionProduct: expansion_product_expansionProduct, eMult,
    scaleExpansion: scaleExpansion, eMultDouble1,
    scaleExpansion2: scaleExpansion2, eMultDouble2,
    eDiv: eDiv,
    eLongDivide: eLongDivide,
    eIntDiv: eIntDiv,
    eRem: eRem,
    eCompress: e_compress_eCompress,
    eEstimate: e_estimate_eEstimate,
    eDiff: e_diff_eDiff,
    eNegativeOf: eNegativeOf,
    eMultBy2: eMultBy2,
    eMultByNeg2: eMultByNeg2,
    eDivBy2: eDivBy2,
    eSign: e_sign_eSign,
    eCompare: e_compare_eCompare,
    eAbs: e_abs_eAbs,
    eToBitlength: eToBitlength,
    eIntPow: eIntPow,
    eCalculate: eCalculate,
    eSum: eSum,
    eProduct: eProduct,
    eToDd: eToDd,
    //---- double floating point representation ----//
    parseDouble: parseDouble,
    parseDoubleDetailed: parseDoubleDetailed,
    isBitAligned: isBitAligned,
    msbExponent: msbExponent,
    lsbExponent: lsbExponent,
    bitLength: bitLength,
    expBitLength: expBitLength,
    doubleToBinaryString: doubleToBinaryString,
    doubleToOctets: doubleToOctets,
    getHighestSetBit: getHighestSetBit,
    getLowestSetBit: getLowestSetBit,
    exponent: exponent,
    significand: significand,
    //---- geometric primitives
    orient2d: orient2d_orient2d,
    //---- others
    isAdjacent: isAdjacent,
    isNonOverlappingAll: isNonOverlappingAll,
    eIsInteger: eIsInteger
};


//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/flo-vector2d/node/lines-and-segments/seg-seg-intersection.js


const epr = (/* unused pure expression or super */ null && (expansionProduct));
const td = (/* unused pure expression or super */ null && (twoDiff));
/**
* Returns the point where two line segments intersect or undefined if they
* don't intersect or if they intersect at infinitely many points.
* * see Geometric primitves http://algs4.cs.princeton.edu/91primitives
* * **certified**
* @param ab The first line
* @param cd The second line
*/
function segSegIntersection(ab, cd) {
    let [a, b] = ab;
    let [c, d] = cd;
    let [a0, a1] = a;
    let [b0, b1] = b;
    let [c0, c1] = c;
    let [d0, d1] = d;
    //let denom  = (b[0] - a[0])*(d[1] - c[1]) - (b[1] - a[1])*(d[0] - c[0]);
    let denom = eDiff(epr(td(b0, a0), td(d1, c1)), epr(td(b1, a1), td(d0, c0)));
    //let rNumer = (a[1] - c[1])*(d[0] - c[0]) - (a[0] - c[0])*(d[1] - c[1]);
    let rNumer = eDiff(epr(td(a1, c1), td(d0, c0)), epr(td(a0, c0), td(d1, c1)));
    //let sNumer = (a[1] - c[1]) * (b[0] - a[0]) - (a[0] - c[0]) * (b[1] - a[1]); 
    let sNumer = eDiff(epr(td(a1, c1), td(b0, a0)), epr(td(a0, c0), td(b1, a1)));
    if (denom[denom.length - 1] === 0) {
        // parallel
        if (rNumer[rNumer.length - 1] === 0) {
            // collinear
            // TODO Check if x-projections and y-projections intersect
            // and return the line of intersection if they do.
            return undefined;
        }
        return undefined;
    }
    //let r = rNumer / denom;
    //let s = sNumer / denom;
    // if (0 <= r && r <= 1 && 0 <= s && s <= 1)
    if (eSign(rNumer) * eSign(denom) >= 0 && eCompare(eAbs(denom), eAbs(rNumer)) >= 0 &&
        eSign(sNumer) * eSign(denom) >= 0 && eCompare(eAbs(denom), eAbs(sNumer)) >= 0) {
        let r = eEstimate(rNumer) / eEstimate(denom);
        //return [a0 + r*(b0 - a0), a1 + r*(b1 - a1)];
        return [
            eEstimate(twoSum(eEstimate(epr(td(b0, a0), rNumer)) / eEstimate(denom), a0)),
            eEstimate(twoSum(eEstimate(epr(td(b1, a1), rNumer)) / eEstimate(denom), a1))
        ];
    }
    return undefined;
}

//# sourceMappingURL=seg-seg-intersection.js.map
;// CONCATENATED MODULE: ./node_modules/flo-vector2d/node/lines-and-segments/does-seg-seg-intersect.js

/**
 * Returns true if the two given 2d line segments intersect, false otherwise.
 * * **robust** uses exact adaptive floating point arithmetic.
 * @param a a line segment
 * @param b another line segment
 */
function doesSegSegIntersect(a, b) {
    if ((orient2d(a[0], a[1], b[0]) * orient2d(a[0], a[1], b[1])) > 0) {
        return false;
    }
    if ((orient2d(b[0], b[1], a[0]) * orient2d(b[0], b[1], a[1])) > 0) {
        return false;
    }
    return true;
}

//# sourceMappingURL=does-seg-seg-intersect.js.map
;// CONCATENATED MODULE: ./node_modules/flo-vector2d/node/affine-transformations/translate/translate.js
// From: https://en.wikipedia.org/wiki/Affine_transformation
// "If X is the point set of an affine space, then every affine transformation 
// on X can be represented as the composition of a linear transformation on X 
// and a translation of X"
function translate(a, b) {
    function f(b) {
        return [a[0] + b[0], a[1] + b[1]];
    }
    // Curry the function
    return b === undefined ? f : f(b);
}

//# sourceMappingURL=translate.js.map
;// CONCATENATED MODULE: ./node_modules/flo-vector2d/node/affine-transformations/linear/rotate.js
function rotate(sinθ, cosθ, p) {
    function rotateByθ(p) {
        return [
            p[0] * cosθ - p[1] * sinθ,
            p[0] * sinθ + p[1] * cosθ
        ];
    }
    // Curry the function
    return p === undefined ? rotateByθ : rotateByθ(p);
}

//# sourceMappingURL=rotate.js.map
;// CONCATENATED MODULE: ./node_modules/flo-vector2d/node/affine-transformations/linear/scale.js
/**
 * Returns a scaled version of the given 2-vector.
 * @param p a vector
 * @param c a scale factor
 */
function scale(p, c) {
    return [c * p[0], c * p[1]];
}

//# sourceMappingURL=scale.js.map
;// CONCATENATED MODULE: ./node_modules/flo-vector2d/node/affine-transformations/linear/reverse.js
/**
 * Returns the given 2-vector reversed (i.e. scaled by -1).
 * @param p a vector
 */
function reverse(p) {
    return [-p[0], -p[1]];
}

//# sourceMappingURL=reverse.js.map
;// CONCATENATED MODULE: ./node_modules/flo-vector2d/node/distance-and-length/len.js
/**
 * Returns the length of the given 2-vector.
 * @param p a 2d vector
 */
function len(p) {
    return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
}

//# sourceMappingURL=len.js.map
;// CONCATENATED MODULE: ./node_modules/flo-vector2d/node/index.js
//==================================
// 2d vector pure functions library
//==================================





























/**
 * Three 2d points are a counter-clockwise turn if ccw > 0, clockwise if
 * ccw < 0, and colinear if ccw === 0 because ccw is a determinant that gives
 * twice the signed area of the triangle formed by the points a, b and c.
 * * **certified**
 * @param A The first point
 * @param B The second point
 * @param C The third point
 */
const ccw = (/* unused pure expression or super */ null && (orient2d));
/**
 * Returns the second 2-vector minus the first.
 * @param p the first vector
 * @param q the second vector
  */
function fromTo(p, q) {
    return [q[0] - p[0], q[1] - p[1]];
}
/**
 * Performs linear interpolation between two 2d points and returns the
 * resulting point.
 * @param p the first point.
 * @param q the second point.
 * @param t the interpolation fraction (often in [0,1]).
 */
function interpolate(p, q, t) {
    return [
        p[0] + (q[0] - p[0]) * t,
        p[1] + (q[1] - p[1]) * t
    ];
}
/**
 * Returns the mean of two 2d points.
 * @param ps the two points
 */
function mean(ps) {
    let p = ps[0];
    let q = ps[1];
    return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
}
/**
* Returns true if two 2-vectors are identical (by value), false otherwise.
* @param a a 2d vector
* @param b another 2d vector
*/
function equal(a, b) {
    return (a[0] === b[0] && a[1] === b[1]);
}
/**
 * Returns the closest point to the array of 2d points or if the array is empty
 * returns undefined.
 * @param p
 * @param ps
 */
function getClosestTo(p, ps) {
    let closestPoint = undefined;
    let closestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < ps.length; i++) {
        let q = ps[i];
        let d = squaredDistanceBetween(p, q);
        if (d < closestDistance) {
            closestPoint = q;
            closestDistance = d;
        }
    }
    return closestPoint;
}
/**
 * Returns the closest point to the array of 2d points by providing a distance
 * function. If the given array is empty, returns undefined.
 * @param p
 * @param ps
 * @param f a function that takes the object and returns a point in order to
 * apply the Euclidian distance.
 */
function getObjClosestTo(p, ps, f) {
    let closestObj = undefined; // Closest Point
    let closestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < ps.length; i++) {
        let o = ps[i];
        let d = squaredDistanceBetween(p, f(o));
        if (d < closestDistance) {
            closestObj = o;
            closestDistance = d;
        }
    }
    return closestObj;
}

//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/angles-and-speeds/bezier-by-angles-and-speeds/cubic-to-angles-and-speeds.js

const { cos, sin, atan2 } = Math;
/**
 * For the given bernstein cubic bezier curve basis return the angles-and-speeds
 * basis coefficients, i.e.
 * * α   -> initial tangent angle in degrees
 * * β   -> terminal tangent angle in degrees
 * * s0  -> inital speed
 * * s1  -> terminal speed
 * * L   -> distance between initial and final point (cannot be 0)
 * * rot -> rotation of entire curve
 * * p   -> initial position offset
 *
 * @param ps an order 3 (cubic) bezier curve given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 */
function cubicToAnglesAndSpeeds(ps) {
    // [_x1,_y1],[_x2,_y2],[_x3,_y3]
    const p = ps[0];
    // move ps to origin
    ps = ps.map(translate(reverse(p)));
    const [x, y] = [ps[3][0], ps[3][1]];
    const rot = atan2(y, x);
    ps = ps.map(rotate(sin(-rot), cos(-rot)));
    const L = ps[3][0];
    ps = ps.map(p => scale(p, 1 / L));
    // TS -> tangent vector at `t === 0`
    const TS = ps[1];
    // TE -> tangent vector at `t === 1`
    const TE = [1 - ps[2][0], -ps[2][1]];
    // const h2 = sqrt(x1**2 + y1**2);
    const α = atan2(TS[1], TS[0]);
    const β = atan2(TE[1], TE[0]);
    const s0 = 3 * len(TS);
    const s1 = 3 * len(TE);
    return { α, β, s0, s1, L, rot, p };
}

//# sourceMappingURL=cubic-to-angles-and-speeds.js.map
;// CONCATENATED MODULE: ./node_modules/flo-gauss-quadrature/node/index.js
// TODO A future improvement can be to use the Gauss–Kronrod rules
// to estimate the error and thus choose a number of constants based
// on the error. Maybe not.
// TODO In future, the constants can be calculated and cached so we can
// choose any value for the order.
// TODO - to limit rounding error do pairwise addition of terms
// TODO order abscissas
// TODO - auto calc abscissas and weights (on first call to function only)
/**
 * Numerically integrates the given function using the Gaussian Quadrature
 * method.
 *
 * See https://en.wikipedia.org/wiki/Gaussian_quadrature
 * See http://pomax.github.io/bezierinfo/#arclength
 * @param f The univariate function to be integrated
 * @param interval The integration interval
 * @param order Can be 2, 4, 8, or 16. Higher values give more accurate results
 * but is slower - defaults to 16.
 */
function gaussQuadrature(f, interval, order = 16) {
    if (interval[0] === interval[1]) {
        return 0;
    }
    let { weights, abscissas } = GAUSS_CONSTANTS[order];
    let [a, b] = interval;
    let result = 0;
    let m1 = (b - a) / 2;
    let m2 = (b + a) / 2;
    for (let i = 0; i <= order - 1; i++) {
        result += weights[i] * f(m1 * abscissas[i] + m2);
    }
    return m1 * result;
}
// The Gaussian Legendre Quadrature method constants. 
const GAUSS_CONSTANTS = {
    2: {
        weights: [1, 1],
        abscissas: [-0.5773502691896257, 0.5773502691896257]
    },
    4: {
        weights: [
            0.6521451548625461, 0.6521451548625461,
            0.3478548451374538, 0.3478548451374538
        ],
        abscissas: [
            -0.3399810435848563, 0.3399810435848563,
            -0.8611363115940526, 0.8611363115940526
        ]
    },
    8: {
        weights: [
            0.3626837833783620, 0.3626837833783620,
            0.3137066458778873, 0.3137066458778873,
            0.2223810344533745, 0.2223810344533745,
            0.1012285362903763, 0.1012285362903763
        ],
        abscissas: [
            -0.1834346424956498, 0.1834346424956498,
            -0.5255324099163290, 0.5255324099163290,
            -0.7966664774136267, 0.7966664774136267,
            -0.9602898564975363, 0.9602898564975363
        ]
    },
    // Taken from http://keisan.casio.com/exec/system/1330940731
    16: {
        weights: [
            0.0271524594117540948518,
            0.062253523938647892863,
            0.0951585116824927848099,
            0.1246289712555338720525,
            0.1495959888165767320815,
            0.169156519395002538189,
            0.182603415044923588867,
            0.189450610455068496285,
            0.1894506104550684962854,
            0.182603415044923588867,
            0.1691565193950025381893,
            0.149595988816576732081,
            0.124628971255533872053,
            0.095158511682492784809,
            0.062253523938647892863,
            0.027152459411754094852
        ],
        abscissas: [
            -0.989400934991649932596,
            -0.944575023073232576078,
            -0.86563120238783174388,
            -0.7554044083550030338951,
            -0.6178762444026437484467,
            -0.4580167776572273863424,
            -0.28160355077925891323,
            -0.0950125098376374401853,
            0.0950125098376374401853,
            0.28160355077925891323,
            0.4580167776572273863424,
            0.617876244402643748447,
            0.755404408355003033895,
            0.8656312023878317438805,
            0.944575023073232576078,
            0.989400934991649932596
        ],
    },
    64: {
        weights: [
            0.048690957009139724,
            0.048690957009139724,
            0.04857546744150343,
            0.04857546744150343,
            0.048344762234802954,
            0.048344762234802954,
            0.04799938859645831,
            0.04799938859645831,
            0.04754016571483031,
            0.04754016571483031,
            0.04696818281621002,
            0.04696818281621002,
            0.046284796581314416,
            0.046284796581314416,
            0.04549162792741814,
            0.04549162792741814,
            0.044590558163756566,
            0.044590558163756566,
            0.04358372452932345,
            0.04358372452932345,
            0.04247351512365359,
            0.04247351512365359,
            0.04126256324262353,
            0.04126256324262353,
            0.03995374113272034,
            0.03995374113272034,
            0.038550153178615626,
            0.038550153178615626,
            0.03705512854024005,
            0.03705512854024005,
            0.035472213256882386,
            0.035472213256882386,
            0.033805161837141606,
            0.033805161837141606,
            0.03205792835485155,
            0.03205792835485155,
            0.030234657072402478,
            0.030234657072402478,
            0.028339672614259483,
            0.028339672614259483,
            0.02637746971505466,
            0.02637746971505466,
            0.024352702568710874,
            0.024352702568710874,
            0.022270173808383253,
            0.022270173808383253,
            0.02013482315353021,
            0.02013482315353021,
            0.017951715775697343,
            0.017951715775697343,
            0.015726030476024718,
            0.015726030476024718,
            0.013463047896718643,
            0.013463047896718643,
            0.011168139460131128,
            0.011168139460131128,
            0.008846759826363947,
            0.008846759826363947,
            0.006504457968978363,
            0.006504457968978363,
            0.004147033260562468,
            0.004147033260562468,
            0.001783280721696433,
            0.001783280721696433
        ],
        abscissas: [
            -0.024350292663424433,
            0.024350292663424433,
            -0.07299312178779904,
            0.07299312178779904,
            -0.12146281929612056,
            0.12146281929612056,
            -0.16964442042399283,
            0.16964442042399283,
            -0.21742364374000708,
            0.21742364374000708,
            -0.2646871622087674,
            0.2646871622087674,
            -0.31132287199021097,
            0.31132287199021097,
            -0.3572201583376681,
            0.3572201583376681,
            -0.4022701579639916,
            0.4022701579639916,
            -0.4463660172534641,
            0.4463660172534641,
            -0.48940314570705296,
            0.48940314570705296,
            -0.5312794640198946,
            0.5312794640198946,
            -0.571895646202634,
            0.571895646202634,
            -0.6111553551723933,
            0.6111553551723933,
            -0.6489654712546573,
            0.6489654712546573,
            -0.6852363130542333,
            0.6852363130542333,
            -0.7198818501716109,
            0.7198818501716109,
            -0.7528199072605319,
            0.7528199072605319,
            -0.7839723589433414,
            0.7839723589433414,
            -0.8132653151227975,
            0.8132653151227975,
            -0.8406292962525803,
            0.8406292962525803,
            -0.8659993981540928,
            0.8659993981540928,
            -0.8893154459951141,
            0.8893154459951141,
            -0.9105221370785028,
            0.9105221370785028,
            -0.9295691721319396,
            0.9295691721319396,
            -0.9464113748584028,
            0.9464113748584028,
            -0.9610087996520538,
            0.9610087996520538,
            -0.973326827789911,
            0.973326827789911,
            -0.983336253884626,
            0.983336253884626,
            -0.9910133714767443,
            0.9910133714767443,
            -0.9963401167719553,
            0.9963401167719553,
            -0.9993050417357722,
            0.9993050417357722
        ]
    }
};

//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/binary/dd-diff-dd.js
/**
 * Returns the result of subtracting the second given double-double-precision
 * floating point number from the first.
 *
 * * relative error bound: 3u^2 + 13u^3, i.e. fl(a-b) = (a-b)(1+ϵ),
 * where ϵ <= 3u^2 + 13u^3, u = 0.5 * Number.EPSILON
 * * the error bound is not sharp - the worst case that could be found by the
 * authors were 2.25u^2
 *
 * ALGORITHM 6 of https://hal.archives-ouvertes.fr/hal-01351529v3/document
 * @param x a double-double precision floating point number
 * @param y another double-double precision floating point number
 */
function ddDiffDd(x, y) {
    const xl = x[0];
    const xh = x[1];
    const yl = y[0];
    const yh = y[1];
    //const [sl,sh] = twoSum(xh,yh);
    const sh = xh - yh;
    const _1 = sh - xh;
    const sl = (xh - (sh - _1)) + (-yh - _1);
    //const [tl,th] = twoSum(xl,yl);
    const th = xl - yl;
    const _2 = th - xl;
    const tl = (xl - (th - _2)) + (-yl - _2);
    const c = sl + th;
    //const [vl,vh] = fastTwoSum(sh,c)
    const vh = sh + c;
    const vl = c - (vh - sh);
    const w = tl + vl;
    //const [zl,zh] = fastTwoSum(vh,w)
    const zh = vh + w;
    const zl = w - (zh - vh);
    return [zl, zh];
}

//# sourceMappingURL=dd-diff-dd.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/binary/dd-min.js

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
/** @internal */
const dd_min_diff = ddDiffDd;
/**
 * Returns the minimum of a and b.
 * @param a a double-double precision floating point number
 * @param b another double-double precision floating point number
 */
function ddMin(a, b) {
    const res = dd_min_diff(a, b)[1];
    return res > 0 ? b : a;
}

//# sourceMappingURL=dd-min.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/binary/dd-max.js

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
/** @internal */
const dd_max_diff = ddDiffDd;
/**
 * Returns the maximum of a and b.
 * @param a a double-double precision floating point number
 * @param b another double-double precision floating point number
 */
function ddMax(a, b) {
    const res = dd_max_diff(a, b)[1];
    return res > 0 ? a : b;
}

//# sourceMappingURL=dd-max.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/unary/dd-sqrt.js
/** @internal */
const dd_sqrt_f = 134217729; // 2**27 + 1;
// Taken from https://github.com/munrocket/double.js/blob/master/src/double.ts
// Unfortunately no error bound given
/**
 * Returns the square root of a double-double as a double-double.
 * * no error bound is returned
 *
 * @param x a double-double precision floating point number
 */
// TODO - calculate an error bound and add to function description
function ddSqrt(x) {
    const xl = x[0];
    const xh = x[1];
    if (xh === 0) {
        return [0, 0];
    }
    const s = Math.sqrt(xh);
    //const [tl,th] = twoSquare(s);
    const th = s * s;
    const c = dd_sqrt_f * s;
    const ah = c - (c - s);
    const al = s - ah;
    const tl = (al * al) - ((th - (ah * ah)) - 2 * (ah * al));
    const e = (xh - th - tl + xl) * 0.5 / s;
    return [e - ((s + e) - s), s + e];
}

//# sourceMappingURL=dd-sqrt.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-mixed-double-double/double-sqrt.js
/** @internal */
const double_sqrt_f = 134217729; // 2**27 + 1;
// Taken from https://github.com/munrocket/double.js/blob/master/src/double.ts
// Unfortunately no error bound given
/**
 * Returns the square root of a double as a double-double.
 * * no error bound is returned
 */
// TODO - calculate an error bound and add to function description
function doubleSqrt(x) {
    if (x === 0) {
        return [0, 0];
    }
    const s = Math.sqrt(x);
    //const [tl,th] = twoSquare(s);
    const th = s * s;
    const c = double_sqrt_f * s;
    const ah = c - (c - s);
    const al = s - ah;
    const tl = (al * al) - ((th - (ah * ah)) - 2 * (ah * al));
    const e = (x - th - tl) * 0.5 / s;
    x = s + e;
    const xl = e - (x - s);
    return [xl, x];
}

//# sourceMappingURL=double-sqrt.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-with-err/sqrt-with-err.js
/** @internal */
const eps = Number.EPSILON;
/**
 * Returns the result of the square root of a double floating point number
 * together with an absolute error bound where x_ is an absolute error
 * bound on the input value.
 * * see also "A Reduced Product of Absolute and Relative Error Bounds for Floating-point Analysis"
 * by Maxime Jacquemin, Sylvie Putot, and Franck Vedrine
 * @param x numerator
 * @param x_ absolute value error bound in numerator
 */
function sqrtWithErr(x, x_) {
    // Note: it is assumed x + x_ >= 0, else the error in x_ was wrong in the
    // first place (since we can't have a negative input to the square root)
    // estimate the result of the square root
    if (x - x_ <= 0) {
        const est = x > 0 ? Math.sqrt(x) : 0;
        return {
            est,
            err: Math.max(Math.sqrt(x + x_) - est, est)
        };
    }
    const est = Math.sqrt(x);
    const minSqrt = Math.sqrt(x - x_);
    const maxSqrt = Math.sqrt(x + x_);
    const err = Math.max(Math.abs(minSqrt - est), Math.abs(maxSqrt - est));
    //err += eps*abs(est + err);
    //err = eps*abs(est + err);
    // approx relative input error
    //const rel = x_/abs(x);
    // propogated error bound
    //const err = est*(Math.sqrt(1 + rel) - 1) + u*abs(est);
    return { est, err };
}

//# sourceMappingURL=sqrt-with-err.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/unary/dd-abs.js
/**
 * Returns the absolute value of the given double-double precision floating
 * point number.
 * @param f a double-double precision floating point number
 */
function ddAbs(f) {
    const Q = f[1];
    return (Q < 0) ? [-f[0], -Q] : f;
}

//# sourceMappingURL=dd-abs.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-mixed-double-double/dd-add-double.js
/**
 * Returns the result of adding a double to a double-double precision floating
 * point number.
 *
 * * relative error bound: 2u^2, i.e. fl(a+b) = (a+b)(1+ϵ),
 * where ϵ <= 2u^2, u = 0.5 * Number.EPSILON
 * * the error bound is sharp
 *
 * ALGORITHM 4 of https://hal.archives-ouvertes.fr/hal-01351529v3/document
 * @param x a double-double precision floating point number
 * @param y a double precision floating point number
 */
function ddAddDouble(x, y) {
    const xl = x[0];
    const xh = x[1];
    //const [sl,sh] = twoSum(xh, y);
    const sh = xh + y;
    const c = sh - xh;
    const sl = (xh - (sh - c)) + (y - c);
    const v = xl + sl;
    //const [zl,zh] = fastTwoSum(sh,v);
    const zh = sh + v;
    const zl = v - (zh - sh);
    return [zl, zh];
}

//# sourceMappingURL=dd-add-double.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/binary/dd-add-dd.js
/**
 * Returns the result of adding two double-double-precision floating point
 * numbers.
 *
 * * relative error bound: 3u^2 + 13u^3, i.e. fl(a+b) = (a+b)(1+ϵ),
 * where ϵ <= 3u^2 + 13u^3, u = 0.5 * Number.EPSILON
 * * the error bound is not sharp - the worst case that could be found by the
 * authors were 2.25u^2
 *
 * ALGORITHM 6 of https://hal.archives-ouvertes.fr/hal-01351529v3/document
 * @param x a double-double precision floating point number
 * @param y another double-double precision floating point number
 */
function ddAddDd(x, y) {
    const xl = x[0];
    const xh = x[1];
    const yl = y[0];
    const yh = y[1];
    //const [sl,sh] = twoSum(xh,yh);
    const sh = xh + yh;
    const _1 = sh - xh;
    const sl = (xh - (sh - _1)) + (yh - _1);
    //const [tl,th] = twoSum(xl,yl);
    const th = xl + yl;
    const _2 = th - xl;
    const tl = (xl - (th - _2)) + (yl - _2);
    const c = sl + th;
    //const [vl,vh] = fastTwoSum(sh,c)
    const vh = sh + c;
    const vl = c - (vh - sh);
    const w = tl + vl;
    //const [zl,zh] = fastTwoSum(vh,w)
    const zh = vh + w;
    const zl = w - (zh - vh);
    return [zl, zh];
}

//# sourceMappingURL=dd-add-dd.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/binary/dd-mult-dd.js
/** @internal */
const dd_mult_dd_f = 2 ** 27 + 1;
/**
 * Returns the product of two double-double-precision floating point numbers.
 *
 * * relative error bound: 7u^2, i.e. fl(a+b) = (a+b)(1+ϵ),
 * where ϵ <= 7u^2, u = 0.5 * Number.EPSILON
 * the error bound is not sharp - the worst case that could be found by the
 * authors were 5u^2
 *
 * * ALGORITHM 10 of https://hal.archives-ouvertes.fr/hal-01351529v3/document
 * @param x a double-double precision floating point number
 * @param y another double-double precision floating point number
 */
function ddMultDd(x, y) {
    //const xl = x[0];
    const xh = x[1];
    //const yl = y[0];
    const yh = y[1];
    //const [cl1,ch] = twoProduct(xh,yh);
    const ch = xh * yh;
    const c = dd_mult_dd_f * xh;
    const ah = c - (c - xh);
    const al = xh - ah;
    const d = dd_mult_dd_f * yh;
    const bh = d - (d - yh);
    const bl = yh - bh;
    const cl1 = (al * bl) - ((ch - (ah * bh)) - (al * bh) - (ah * bl));
    //return fastTwoSum(ch,cl1 + (xh*yl + xl*yh));
    const b = cl1 + (xh * y[0] + x[0] * yh);
    const xx = ch + b;
    return [b - (xx - ch), xx];
}

//# sourceMappingURL=dd-mult-dd.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/multi/dd-product.js

/**
 * Returns the result of multiplying together an array of double-double-precision
 * floating point numbers naively (i.e. not using pairwise addition to reduce
 * error a bit).
 *
 * * an error bound is given by: (n-1)(1+ϵ),
 * where ϵ <= 7u^2, u = 0.5 * Number.EPSILON
 */
function ddProduct(qs) {
    let q = qs[0];
    for (let i = 1; i < qs.length; i++) {
        q = ddMultDd(q, qs[i]);
    }
    return q;
}

//# sourceMappingURL=dd-product.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/multi/dd-sum.js

/**
 * Returns the result of summing an array of double-double-precision floating
 * point numbers naively (i.e. not using pairwise addition to reduce error a bit).
 *
 * * an error bound is given by: (n-1)(1+ϵ),
 * where ϵ <= 3u^2 + 13u^3, u = 0.5 * Number.EPSILON
 */
function ddSum(qs) {
    let q = qs[0];
    for (let i = 1; i < qs.length; i++) {
        q = ddAddDd(q, qs[i]);
    }
    return q;
}

//# sourceMappingURL=dd-sum.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/binary/dd-compare.js
/**
 * Returns 0 if a === b, a +tive value if a > b or a negative value if a < b.
 *
 * @param x a double-double precision floating point number
 * @param y another double-double precision floating point number
 */
function ddCompare(x, y) {
    //return ddDiffDd(x,y)[1];
    const xl = x[0];
    const xh = x[1];
    const yl = y[0];
    const yh = y[1];
    //const [sl,sh] = twoSum(xh,yh);
    const sh = xh - yh;
    const _1 = sh - xh;
    const sl = (xh - (sh - _1)) + (-yh - _1);
    //const [tl,th] = twoSum(xl,yl);
    const th = xl - yl;
    const _2 = th - xl;
    const tl = (xl - (th - _2)) + (-yl - _2);
    const c = sl + th;
    //const [vl,vh] = fastTwoSum(sh,c)
    const vh = sh + c;
    const vl = c - (vh - sh);
    const w = tl + vl;
    //const [zl,zh] = fastTwoSum(vh,w)
    const zh = vh + w;
    return zh;
}

//# sourceMappingURL=dd-compare.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-mixed-double-double/dd-mult-double.js
/** @internal */
const dd_mult_double_f = 134217729; // 2**27 + 1;
/**
 * Returns the product of a double-double-precision floating point number and a
 * double.
 *
 * * slower than ALGORITHM 8 (one call to fastTwoSum more) but about 2x more
 * accurate
 * * relative error bound: 1.5u^2 + 4u^3, i.e. fl(a+b) = (a+b)(1+ϵ),
 * where ϵ <= 1.5u^2 + 4u^3, u = 0.5 * Number.EPSILON
 * * the bound is very sharp
 * * probably prefer `ddMultDouble2` due to extra speed
 *
 * * ALGORITHM 7 of https://hal.archives-ouvertes.fr/hal-01351529v3/document
 * @param y a double
 * @param x a double-double precision floating point number
 */
function ddMultDouble1(y, x) {
    const xl = x[0];
    const xh = x[1];
    //const [cl1,ch] = twoProduct(xh,y);
    const ch = xh * y;
    const c = dd_mult_double_f * xh;
    const ah = c - (c - xh);
    const al = xh - ah;
    const d = dd_mult_double_f * y;
    const bh = d - (d - y);
    const bl = y - bh;
    const cl1 = (al * bl) - ((ch - (ah * bh)) - (al * bh) - (ah * bl));
    const cl2 = xl * y;
    //const [tl1,th] = fastTwoSum(ch,cl2);
    const th = ch + cl2;
    const tl1 = cl2 - (th - ch);
    const tl2 = tl1 + cl1;
    //const [zl,zh] = fastTwoSum(th,tl2);
    const zh = th + tl2;
    const zl = tl2 - (zh - th);
    return [zl, zh];
}
/**
 * Returns the product of a double-double-precision floating point number and a double.
 *
 * * faster than ALGORITHM 7 (one call to fastTwoSum less) but about 2x less
 * accurate
 * * relative error bound: 3u^2, i.e. fl(a*b) = (a*b)(1+ϵ),
 * where ϵ <= 3u^2, u = 0.5 * Number.EPSILON
 * * the bound is sharp
 * * probably prefer this algorithm due to extra speed
 *
 * * ALGORITHM 8 of https://hal.archives-ouvertes.fr/hal-01351529v3/document
 * @param y a double
 * @param x a double-double precision floating point number
 */
function ddMultDouble2(y, x) {
    const xl = x[0];
    const xh = x[1];
    //const [cl1,ch] = twoProduct(xh,y);
    const ch = xh * y;
    const c = dd_mult_double_f * xh;
    const ah = c - (c - xh);
    const al = xh - ah;
    const d = dd_mult_double_f * y;
    const bh = d - (d - y);
    const bl = y - bh;
    const cl1 = (al * bl) - ((ch - (ah * bh)) - (al * bh) - (ah * bl));
    const cl2 = xl * y;
    const cl3 = cl1 + cl2;
    //return fastTwoSum(ch,cl3);
    const xx = ch + cl3;
    return [cl3 - (xx - ch), xx];
}

//# sourceMappingURL=dd-mult-double.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/unary/dd-mult-by-2.js
/**
 * Returns the result of multiplying the given double-double by 2.
 * * The result is exact
 * @param f a double-double precision floating point number
 */
function ddMultBy2(f) {
    return [2 * f[0], 2 * f[1]];
}

//# sourceMappingURL=dd-mult-by-2.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/unary/dd-mult-by-4.js
/**
 * Returns the result of multiplying the given double-double by 4.
 * * The result is exact
 * @param f a double-double precision floating point number
 */
function ddMultBy4(f) {
    return [4 * f[0], 4 * f[1]];
}

//# sourceMappingURL=dd-mult-by-4.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/unary/dd-div-by-2.js
/**
 * Returns the result of dividing the given double-double by 2.
 * @param f a double-double precision floating point number
 */
function ddDivBy2(f) {
    return [f[0] / 2, f[1] / 2];
}

//# sourceMappingURL=dd-div-by-2.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/unary/dd-mult-by-neg-2.js
/**
 * Returns the result of multiplying the given double-double by -2.
 * * The result is exact
 * @param f a double-double precision floating point number
 */
function ddMultByNeg2(f) {
    return [-2 * f[0], -2 * f[1]];
}

//# sourceMappingURL=dd-mult-by-neg-2.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/unary/dd-mult-by-neg-4.js
/**
 * Returns the result of multiplying the given double-double by -4.
 * * The result is exact
 * @param f a double-double precision floating point number
 */
function ddMultByNeg4(f) {
    return [-4 * f[0], -4 * f[1]];
}

//# sourceMappingURL=dd-mult-by-neg-4.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-mixed-double-double/dd-div-double.js
/** @internal */
const dd_div_double_f = 134217729; // 2**27 + 1;
/**
 * Returns the result of dividing a double-double-precision floating point
 * number by a double.
 *
 * * relative error bound: 3u^2, i.e. fl(a/b) = (a/b)(1+ϵ), where ϵ <= 3u^2,
 * u = 0.5 * Number.EPSILON
 * * the bound is very sharp
 *
 * * ALGORITHM 15 of https://hal.archives-ouvertes.fr/hal-01351529v3/document
 * @param x a double-double precision floating point number
 * @param y the double-precision divisor
 */
function ddDivDouble(x, y) {
    const xl = x[0];
    const xh = x[1];
    const th = xh / y;
    //const [πl,πh] = twoProduct(th,y);
    const πh = th * y;
    const c = dd_div_double_f * th;
    const ah = c - (c - th);
    const al = th - ah;
    const d = dd_div_double_f * y;
    const bh = d - (d - y);
    const bl = y - bh;
    const πl = (al * bl) - ((πh - (ah * bh)) - (al * bh) - (ah * bl));
    const δh = xh - πh; // exact operation
    const δt = δh - πl; // exact operation
    const δ = δt + xl;
    const tl = δ / y;
    //return fastTwoSum(th,tl);
    const rl = th + tl;
    return [tl - (rl - th), rl];
}

//# sourceMappingURL=dd-div-double.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/binary/dd-div-dd.js
/** @internal */
const dd_div_dd_f = 134217729; // 2**27 + 1;
/**
 * Returns the result of dividing two double-double-precision floating point
 * numbers, i.e. returns x/y.
 *
 * * relative error bound: 15u^2 + 56u^3, i.e. fl(a/b) = (a/b)(1+ϵ),
 * where ϵ <= 15u^2 + 56u^3, u = 0.5 * Number.EPSILON
 * * the largest error found was 8.465u^2
 *
 * * ALGORITHM 17 of https://hal.archives-ouvertes.fr/hal-01351529v3/document
 * @param x a double-double precision floating point number
 * @param y another double-double precision floating point number
 */
function ddDivDd(x, y) {
    const xl = x[0];
    const xh = x[1];
    const yl = y[0];
    const yh = y[1];
    const th = xh / yh;
    // approximation to th*(yh + yl) using Algorithm 7
    //const [rl,rh] = ddMultDouble1(th,[yl,yh]);  
    const ch = yh * th;
    const c = dd_div_dd_f * yh;
    const ah = c - (c - yh);
    const al = yh - ah;
    const d = dd_div_dd_f * th;
    const bh = d - (d - th);
    const bl = th - bh;
    const cl1 = (al * bl) - ((ch - (ah * bh)) - (al * bh) - (ah * bl));
    const cl2 = yl * th;
    const th_ = ch + cl2;
    const tl1 = cl2 - (th_ - ch);
    const tl2 = tl1 + cl1;
    const rh = th_ + tl2;
    const rl = tl2 - (rh - th_);
    const πh = xh - rh; // exact operation
    const δl = xl - rl;
    const δ = πh + δl;
    const tl = δ / yh;
    //return fastTwoSum(th,tl);
    const xx = th + tl;
    return [tl - (xx - th), xx];
}

//# sourceMappingURL=dd-div-dd.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/unary/dd-negative-of.js
/**
 * Returns the negative of the given double-double precision floating point
 * number.
 * * the result is exact
 * @param f a double-double precision floating point number
 */
function ddNegativeOf(f) {
    return [-f[0], -f[1]];
}

//# sourceMappingURL=dd-negative-of.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double/unary/dd-sign.js
/**
 * Returns the sign of the given double-double-precision floating point number.
 * * a positive or negative double or zero is returned - not necessarily +1, 0
 * or -1
 * * prefer inlining this - it is really only here for reference
 */
function ddSign(f) {
    return f[1];
}

//# sourceMappingURL=dd-sign.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/basic/fast-two-diff.js
/**
 * Returns the difference and exact error of subtracting two floating point
 * numbers.
 * Uses an EFT (error-free transformation), i.e. `a-b === x+y` exactly.
 * The returned result is a non-overlapping expansion (smallest value first!).
 *
 * * **precondition:** `abs(a) >= abs(b)` - A fast test that can be used is
 * `(a > b) === (a > -b)`
 *
 * See https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 */
function fast_two_diff_fastTwoDiff(a, b) {
    const x = a - b;
    const y = (a - x) - b;
    return [y, x];
}

//# sourceMappingURL=fast-two-diff.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/basic/fast-two-sum.js
/**
 * Returns the sum and exact error of adding two floating point numbers.
 * Uses an EFT (error-free transformation), i.e. a+b === x+y exactly.
 * The returned sum is a non-overlapping expansion (smallest value first!).
 *
 * Precondition: abs(a) >= abs(b) - A fast test that can be used is
 * (a > b) === (a > -b)
 *
 * See https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 */
function basic_fast_two_sum_fastTwoSum(a, b) {
    const x = a + b;
    return [b - (x - a), x];
}
// inlined
//const R = a + b; const r = b - (R - a); return [r, R];

//# sourceMappingURL=fast-two-sum.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/basic/split.js
/**
 * === 2^Math.ceil(p/2) + 1 where p is the # of significand bits in a double === 53.
 * @internal
 */
const basic_split_f = 134217729; // 2**27 + 1;
/**
 * Returns the result of splitting a double into 2 26-bit doubles.
 *
 * Theorem 17 (Veltkamp-Dekker): Let a be a p-bit floating-point number, where
 * p >= 3. Choose a splitting point s such that p/2 <= s <= p-1. Then the
 * following algorithm will produce a (p-s)-bit value a_hi and a
 * nonoverlapping (s-1)-bit value a_lo such that abs(a_hi) >= abs(a_lo) and
 * a = a_hi + a_lo.
 *
 * see e.g. [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 * @param a A double floating point number
 */
function split_split(a) {
    const c = basic_split_f * a;
    const a_h = c - (c - a);
    const a_l = a - a_h;
    return [a_h, a_l];
}
// inlined - input a, output a_h, a_l
// const c = f * a; const a_h = c - (c - a); const a_l = a - a_h; return [a_h, a_l];

//# sourceMappingURL=split.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/basic/two-diff.js
/**
 * Returns the exact result of subtracting b from a.
 *
 * @param a minuend - a double-double precision floating point number
 * @param b subtrahend - a double-double precision floating point number
 */
function basic_two_diff_twoDiff(a, b) {
    const x = a - b;
    const bvirt = a - x;
    const y = (a - (x + bvirt)) + (bvirt - b);
    return [y, x];
}

//# sourceMappingURL=two-diff.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/basic/two-product.js
/** @internal */
const basic_two_product_f = 134217729; // 2**27 + 1;
/**
 * Returns the exact result of multiplying two doubles.
 *
 * * the resulting array is the reverse of the standard twoSum in the literature.
 *
 * Theorem 18 (Shewchuk): Let a and b be p-bit floating-point numbers, where
 * p >= 6. Then the following algorithm will produce a nonoverlapping expansion
 * x + y such that ab = x + y, where x is an approximation to ab and y
 * represents the roundoff error in the calculation of x. Furthermore, if
 * round-to-even tiebreaking is used, x and y are non-adjacent.
 *
 * See https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 * @param a A double
 * @param b Another double
 */
function basic_two_product_twoProduct(a, b) {
    const x = a * b;
    //const [ah, al] = split(a);
    const c = basic_two_product_f * a;
    const ah = c - (c - a);
    const al = a - ah;
    //const [bh, bl] = split(b);
    const d = basic_two_product_f * b;
    const bh = d - (d - b);
    const bl = b - bh;
    const y = (al * bl) - ((x - (ah * bh)) - (al * bh) - (ah * bl));
    //const err1 = x - (ah * bh);
    //const err2 = err1 - (al * bh);
    //const err3 = err2 - (ah * bl);
    //const y = (al * bl) - err3;
    return [y, x];
}

//# sourceMappingURL=two-product.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-mixed-double-double/double-div-double.js
/** @internal */
const double_div_double_f = 134217729; // 2**27 + 1;
/**
 * Returns the result of dividing a double-precision floating point
 * number by a double with the result given as a double-double.
 * This is a slight modification of ddDivDd.
 *
 * * **!! NOT an error-free transformation !!**
 * * relative error bound: 3u^2, i.e. fl(a/b) = (a/b)(1+ϵ), where ϵ <= 3u^2,
 * u = 0.5 * Number.EPSILON
 *
 * * ALGORITHM 15 of https://hal.archives-ouvertes.fr/hal-01351529v3/document
 * (slightly modified)
 * @param x dividend
 * @param y divisor
 */
function doubleDivDouble(x, y) {
    const th = x / y;
    //const [πl,πh] = twoProduct(th,y);
    const πh = th * y;
    const c = double_div_double_f * th;
    const ah = c - (c - th);
    const al = th - ah;
    const d = double_div_double_f * y;
    const bh = d - (d - y);
    const bl = y - bh;
    const πl = (al * bl) - ((πh - (ah * bh)) - (al * bh) - (ah * bl));
    const δh = x - πh; // exact operation
    const δt = δh - πl; // exact operation
    const tl = δt / y;
    //return fastTwoSum(th,tl);
    const xx = th + tl;
    return [tl - (xx - th), xx];
}

//# sourceMappingURL=double-div-double.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/basic/two-sum.js
/**
 * Returns the exact result of adding two doubles.
 *
 * * the resulting array is the reverse of the standard twoSum in the literature.
 *
 * Theorem 7 (Knuth): Let a and b be p-bit floating-point numbers. Then the
 * following algorithm will produce a nonoverlapping expansion x + y such that
 * a + b = x + y, where x is an approximation to a + b and y is the roundoff
 * error in the calculation of x.
 *
 * See https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 */
function basic_two_sum_twoSum(a, b) {
    const x = a + b;
    const bv = x - a;
    return [(a - (x - bv)) + (b - bv), x];
}
// inlined
//const R = a + b; const _ = R - a; const r = (a - (R - _)) + (b - _); return [r,R]

//# sourceMappingURL=two-sum.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/basic/reduce-significand.js
/**
 * Truncates a floating point value's significand and returns the result.
 * Similar to split, but with the ability to specify the number of bits to keep.
 *
 * **Theorem 17 (Veltkamp-Dekker)**: Let a be a p-bit floating-point number, where
 * p >= 3. Choose a splitting point s such that p/2 <= s <= p-1. Then the
 * following algorithm will produce a (p-s)-bit value a_hi and a
 * nonoverlapping (s-1)-bit value a_lo such that abs(a_hi) >= abs(a_lo) and
 * a = a_hi + a_lo.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param a a double
 * @param bits the number of significand bits to leave intact
 */
function reduce_significand_reduceSignificand(a, bits) {
    const s = 53 - bits;
    const f = 2 ** s + 1;
    const c = f * a;
    const r = c - (c - a);
    return r;
}

//# sourceMappingURL=reduce-significand.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-representation/double-to-octets.js
// Modified from https://github.com/bartaz/ieee754-visualization/
// under the MIT license
// Copyright 2013 Bartek Szopka (original author)
/**
 * Returns the ieee-574 8 bytes composing the given double, starting from the
 * sign bit and ending in the lsb of the significand.
 * e.g. 123.456 -> [64, 94, 221, 47, 26, 159, 190, 119]
 * @internal
 */
function double_to_octets_doubleToOctets(number) {
    var buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, number, false);
    return Array.from(new Uint8Array(buffer));
}

//# sourceMappingURL=double-to-octets.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-representation/double-to-binary-string.js
// Modified from https://github.com/bartaz/ieee754-visualization/
// under the MIT license
// Copyright 2013 Bartek Szopka (original author)

/** @internal */
function double_to_binary_string_doubleToBinaryString(number) {
    return double_to_binary_string_octetsToBinaryString(double_to_octets_doubleToOctets(number));
}
/**
 * @param octets The 8 bytes composing a double (msb first)
 * @internal
 */
function double_to_binary_string_octetsToBinaryString(octets) {
    return octets
        .map(double_to_binary_string_int8ToBinaryString)
        .join('');
}
/**
 * intToBinaryString(8) -> "00001000"
 * @internal
 */
function double_to_binary_string_int8ToBinaryString(i) {
    let iStr = i.toString(2);
    for (; iStr.length < 8; iStr = "0" + iStr)
        ;
    return iStr;
}

//# sourceMappingURL=double-to-binary-string.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-representation/parse-double.js
// Modified from https://github.com/bartaz/ieee754-visualization/
// under the MIT license
// Copyright 2013 Bartek Szopka (original author)


/**
 * Returns the relevant parts of the given IEEE-754 double. The returned
 * exponent has been normalized (i.e. 1023 ha been subtracted) and the
 * significand has the hidden bit added if appropriate.
 * See https://github.com/bartaz/ieee754-visualization
 */
function parse_double_parseDouble(x) {
    let parts = double_to_octets_doubleToOctets(x);
    let p0 = parts[0];
    let p1 = parts[1];
    let sign = p0 >> 7;
    let exponent_ = ((p0 & 127) << 4) + ((p1 & 0b11110000) >> 4);
    //---- Check for negative / positive zero / denormalized numbers.
    let hiddenMsb = exponent_ === 0 ? 0 : 16;
    // Note: exponent === 0 => 0 or denormalized number (a.k.a. subnormal number).
    let exponent = exponent_ === 0
        ? exponent_ - 1022 // Subnormals use a biased exponent of 1 (not 0!)
        : exponent_ - 1023;
    //---- Break up the significand into bytes
    let significand = parts.slice(1);
    significand[0] = (p1 & 15) + hiddenMsb;
    return {
        sign,
        exponent,
        significand
    };
}
/**
 * Returns the relevant parts of the given IEEE-754 double.
 * See https://github.com/bartaz/ieee754-visualization.
 * This is a slower version of parseDouble that gives binary string
 * representations of the components.
 */
function parse_double_parseDoubleDetailed(x) {
    let str = double_to_binary_string_doubleToBinaryString(x);
    // sign{1} exponent{11} fraction{52} === 64 bits (+1 hidden!)
    let [, sign, exponent, significand] = str.match(/^(.)(.{11})(.{52})$/);
    let exponent_ = parseInt(exponent, 2);
    let hidden = exponent_ === 0 ? "0" : "1";
    return {
        full: sign + exponent + hidden + significand,
        sign,
        exponent,
        hidden,
        significand
    };
}

//# sourceMappingURL=parse-double.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-representation/significand.js

/**
 * Return the significand of the given double with the hidden bit added (in case
 * a is not subnormal or 0, etc.)
 *
 * @param a A double
 */
function significand_significand(a) {
    return parse_double_parseDouble(a).significand;
}

//# sourceMappingURL=significand.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-representation/get-max-set-bit.js

/**
 * Returns the lowest set bit of the given value in [1, (2**31)-1],
 * i.e. from 1 up to 2147483647 else if no bit is set (input === 0) returns
 * NaN, otherwise if the number is out of range returns a non-finite
 * number.
 * See https://stackoverflow.com/a/35190288/2010061
 * @internal
 */
function get_max_set_bit_getLowestSetBit_(a) {
    return Math.log2(a & -a);
}
/**
 * Returns the lowest set bit of the given number's significand (where the lsb
 * is bit 0 and the msb is bit 52). If no bit is set (input === 0 or +-inf or
 * NaN) returns NaN.
 * See https://stackoverflow.com/a/35190288/2010061
 */
function get_max_set_bit_getLowestSetBit(a) {
    if (a === 0 || !Number.isFinite(a)) {
        // There is no lowest set bit
        return NaN;
    }
    // Note: the significand includes the hidden bit!
    let s = significand_significand(a);
    let len = s.length;
    for (let i = len - 1; i >= 0; i--) {
        if (s[i] === 0) {
            continue;
        }
        let l = get_max_set_bit_getLowestSetBit_(s[i]);
        if (Number.isFinite(l)) {
            return (8 * (len - i - 1)) + l;
        }
    }
    return NaN;
}
/**
 * Returns the highest set bit of the given value in [1, 255], i.e. from 1 up
 * to 255. If the input number === 0 returns NaN.
 * See https://stackoverflow.com/a/35190288/2010061
 * @internal
 */
function get_max_set_bit_getHighestSetBit_(a) {
    return a >= 128 ? 7
        : a >= 64 ? 6
            : a >= 32 ? 5
                : a >= 16 ? 4
                    : a >= 8 ? 3
                        : a >= 4 ? 2
                            : a >= 2 ? 1
                                : a >= 1 ? 0
                                    : NaN;
}
/**
 * Returns the highest set bit of the given double. If no bit is set (input
 * === 0 or +/-inf or NaN) returns NaN.
 * See https://stackoverflow.com/a/35190288/2010061
 */
function get_max_set_bit_getHighestSetBit(a) {
    if (a === 0 || !Number.isFinite(a)) {
        // There is no lowest set bit
        return NaN;
    }
    // At this point there must be a highest set bit (always === 52 if the 
    // number is not a subnormal.
    let s = significand_significand(a);
    let len = s.length;
    for (let i = 0; i < len; i++) {
        let l = get_max_set_bit_getHighestSetBit_(s[i]);
        if (Number.isFinite(l)) {
            return (8 * (len - i - 1)) + l;
        }
    }
    return NaN;
}

//# sourceMappingURL=get-max-set-bit.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-representation/exponent.js

/**
 * Returns the normalized exponent of the given number.
 * @param a A double
 */
function exponent_exponent(a) {
    return parse_double_parseDouble(a).exponent;
}

//# sourceMappingURL=exponent.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-representation/is-bit-aligned.js


/**
 * Returns true if the given number is bit-aligned in the sense that its a
 * multiple of a given power of 2, say e, and such that the number, say a,
 * conforms to: a/2^e < 2^(l-e), where l is the max allowed bit length.
 * This essentially means the numbers act somewhat like fixed-point numbers
 * which can drastically speed up some geometric algorithms and also reduce
 * their complexity.
 *
 * Visually:
 * These numbers (a,b and c) are grid aligned with e === 3 and max
 * bitlength === 6:
 *   a -> 00|101100|000
 *   b -> 00|000100|000
 *   c -> 00|110111|000
 * These are not
 *   a -> 01|101100|000
 *   b -> 00|000100|000
 * These are not
 *   a -> 00|101100|000
 *   b -> 00|000100|100
 * These are not
 *   a -> 00|101100|100
 *   b -> 00|000100|100
 * @param as An array of numbers to check
 * @param maxBitLength The max allowed bitlength
 * @param gridSpacingExponent The grid spacing === 1^gridSpacingExponent
 */
function is_bit_aligned_isBitAligned(a, maxBitLength, gridSpacingExponent) {
    if (a === 0) {
        return true;
    }
    let e = exponent_exponent(a);
    let maxSetBit = get_max_set_bit_getHighestSetBit(a) - 52 + e;
    let minSetBit = get_max_set_bit_getLowestSetBit(a) - 52 + e;
    let minBitBigEnough = minSetBit >= gridSpacingExponent;
    let maxBitSmallEnough = maxSetBit <= maxBitLength - 1 + gridSpacingExponent;
    return minBitBigEnough && maxBitSmallEnough;
}

//# sourceMappingURL=is-bit-aligned.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-representation/msb-exponent.js


/**
 * Returns the true exponent of the msb that is set of the given number or
 * NaN if a === 0 or +-inf or NaN.
 * @param a An array of numbers to check
 */
function msb_exponent_msbExponent(a) {
    if (a === 0 || !Number.isFinite(a)) {
        return NaN;
    }
    let e = exponent_exponent(a);
    // Will return e for all but subnormal numbers
    return get_max_set_bit_getHighestSetBit(a) - 52 + e;
}

//# sourceMappingURL=msb-exponent.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-representation/lsb-exponent.js


/**
 * Returns the true exponent of the lsb that is set of the given number or
 * NaN if a === 0 or +-inf or NaN.
 * @param a An array of numbers to check
 */
function lsb_exponent_lsbExponent(a) {
    if (a === 0 || !Number.isFinite(a)) {
        return NaN;
    }
    let e = exponent_exponent(a);
    return get_max_set_bit_getLowestSetBit(a) - 52 + e;
}

//# sourceMappingURL=lsb-exponent.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-representation/bit-length.js

/**
 * Returns the bit-length of the significand of the given number in such a way
 * that trailing zeros are not counted.
 * @param a a double precision floating point number
 */
function bit_length_bitLength(a) {
    if (a === 0) {
        return 0;
    }
    return get_max_set_bit_getHighestSetBit(a) - get_max_set_bit_getLowestSetBit(a) + 1;
}

//# sourceMappingURL=bit-length.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-double-with-error/dd-div-dd-with-error.js

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
/** @internal */
const div = ddDivDd;
/** @internal */
const dd_div_dd_with_error_eps = Number.EPSILON;
/** @internal */
const u = dd_div_dd_with_error_eps / 2;
/** @internal */
const uu = u * u;
/**
 * Returns the result of dividing two double-double-precision floating point
 * numbers together with an absolute error bound where nE and dE are absolute
 * error bounds on the *input* values.
 *
 * @param numer numerator - a double-double-precision float
 * @param denom denominator - a double-double-precision float
 * @param nE absolute value error bound in numerator
 * @param dE absolute value error bound in denominator
 */
function ddDivDdWithError(numer, denom, nE, dE) {
    const n = numer[0];
    const N = numer[1];
    const d = denom[0];
    const D = denom[1];
    // estimate the result of the division
    const est = div(numer, denom);
    const _n = Math.abs(n + N); // absolute value of estimate of n accurate to within 1/2 ulp
    const _d = Math.abs(d + D); // absolute value of estimate of d accurate to within 1/2 ulp
    const δd = u * _d; // the max error in the rounding to _d
    // if the error in the denominator is too high the error can be 
    // arbitrarily high
    const minD = _d - δd - dE;
    // maxErr is only valid if minD > 0
    if (minD <= 0) {
        // the error can be arbitrarily high; est is mostly irrelevant
        return { est, err: Number.POSITIVE_INFINITY };
    }
    const err = ((_d * nE + _n * dE) / minD ** 2) + 9 * uu * Math.abs(_n / _d);
    return { est, err };
}

//# sourceMappingURL=dd-div-dd-with-error.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/double-with-err/div-with-err.js
/** @internal */
const div_with_err_u = Number.EPSILON / 2;
/**
 * Returns the result of dividing two double floating point numbers
 * together with an absolute error bound where nE and dE are absolute error
 * bounds on the input values.
 * @param n numerator
 * @param d denominator
 * @param nE absolute value error bound in numerator
 * @param dE absolute value error bound in denominator
 */
function divWithErr(n, d, nE, dE) {
    // estimate the result of the division
    const est = n / d;
    const _n = Math.abs(n);
    const _d = Math.abs(d);
    // if the error in the denominator is too high the error can be 
    // arbitrarily high
    const minD = _d - dE;
    // maxErr is only valid if minD > 0
    if (minD <= 0) {
        // the error can be arbitrarily high; est is mostly irrelevant
        return { est, err: Number.POSITIVE_INFINITY };
    }
    const err = ((_d * nE + _n * dE) / minD ** 2) + div_with_err_u * Math.abs(_n / _d);
    return { est, err };
}

//# sourceMappingURL=div-with-err.js.map
;// CONCATENATED MODULE: ./node_modules/double-double/node/index.js











































const node_ddMultDouble2 = ddMultDouble2;
const node_parseDoubleDetailed = parse_double_parseDoubleDetailed;
const node_getLowestSetBit = get_max_set_bit_getLowestSetBit;
const node_ddMin = ddMin;
const node_ddMax = ddMax;
const node_ddSqrt = ddSqrt;
const node_doubleSqrt = doubleSqrt;
const node_sqrtWithErr = sqrtWithErr;
const node_ddAbs = ddAbs;
const node_ddAddDouble = ddAddDouble;
const node_ddAddDd = ddAddDd;
const node_ddProduct = ddProduct;
const node_ddSum = ddSum;
const node_ddCompare = ddCompare;
const node_ddDiffDd = ddDiffDd;
const node_ddMultDouble1 = ddMultDouble1;
const node_ddMultBy2 = ddMultBy2;
const node_ddMultBy4 = ddMultBy4;
const node_ddDivBy2 = ddDivBy2;
const node_ddMultByNeg2 = ddMultByNeg2;
const node_ddMultByNeg4 = ddMultByNeg4;
const node_ddMultDd = ddMultDd;
const node_ddDivDouble = ddDivDouble;
const node_ddDivDd = ddDivDd;
const node_ddNegativeOf = ddNegativeOf;
const node_ddSign = ddSign;
const node_fastTwoDiff = fast_two_diff_fastTwoDiff;
const node_fastTwoSum = basic_fast_two_sum_fastTwoSum;
const node_split = split_split;
const node_twoDiff = basic_two_diff_twoDiff;
const node_twoProduct = basic_two_product_twoProduct;
const node_doubleDivDouble = doubleDivDouble;
const node_twoSum = basic_two_sum_twoSum;
const node_reduceSignificand = reduce_significand_reduceSignificand;
const node_parseDouble = parse_double_parseDouble;
const node_isBitAligned = is_bit_aligned_isBitAligned;
const node_msbExponent = msb_exponent_msbExponent;
const node_lsbExponent = lsb_exponent_lsbExponent;
const node_bitLength = bit_length_bitLength;
const node_exponent = exponent_exponent;
const node_significand = significand_significand;
const node_doubleToBinaryString = double_to_binary_string_doubleToBinaryString;
const node_doubleToOctets = double_to_octets_doubleToOctets;
const node_getHighestSetBit = get_max_set_bit_getHighestSetBit;
const node_ddDivDdWithError = ddDivDdWithError;
const node_divWithErr = divWithErr;
const node_operators = {
    //---- basic ----//
    fastTwoDiff: node_fastTwoDiff,
    fastTwoSum: node_fastTwoSum,
    split: node_split,
    twoDiff: node_twoDiff,
    twoProduct: node_twoProduct,
    doubleDivDouble: node_doubleDivDouble,
    twoSum: node_twoSum,
    reduceSignificand: node_reduceSignificand,
    //---- double-double precision ----//
    doubleSqrt: node_doubleSqrt,
    ddSqrt: node_ddSqrt,
    ddAbs: node_ddAbs,
    ddAddDouble: node_ddAddDouble,
    ddAddDd: node_ddAddDd,
    ddProduct: node_ddProduct,
    ddSum: node_ddSum,
    ddCompare: node_ddCompare,
    ddDiffDd: node_ddDiffDd,
    ddMultDouble1: node_ddMultDouble1,
    ddMultDouble2: node_ddMultDouble2,
    ddMultDd: node_ddMultDd,
    ddDivDouble: node_ddDivDouble,
    ddDivDd: node_ddDivDd,
    ddNegativeOf: node_ddNegativeOf,
    ddSign: node_ddSign,
    ddMultBy2: node_ddMultBy2,
    ddMultBy4: node_ddMultBy4,
    ddDivBy2: node_ddDivBy2,
    ddMultByNeg2: node_ddMultByNeg2,
    ddMultByNeg4: node_ddMultByNeg4,
    ddMin: node_ddMin,
    ddMax: node_ddMax,
    //---- double-double precision error propagation - with error bound on input parameters
    ddDivDdWithError: node_ddDivDdWithError,
    //---- double precision error propagation - with error bound on input parameters
    divWithErr: node_divWithErr,
    sqrtWithErr: node_sqrtWithErr,
    //---- double floating point representation ----//
    parseDouble: node_parseDouble,
    parseDoubleDetailed: node_parseDoubleDetailed,
    isBitAligned: node_isBitAligned,
    msbExponent: node_msbExponent,
    lsbExponent: node_lsbExponent,
    bitLength: node_bitLength,
    doubleToBinaryString: node_doubleToBinaryString,
    doubleToOctets: node_doubleToOctets,
    getHighestSetBit: node_getHighestSetBit,
    getLowestSetBit: node_getLowestSetBit,
    exponent: node_exponent,
    significand: node_significand
};


//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/error-analysis/error-analysis.js
const error_analysis_u = Number.EPSILON / 2;
const error_analysis_uu = error_analysis_u * error_analysis_u;
/** @internal */
function γ(n) {
    const nu = n * error_analysis_u;
    return nu / (1 - nu);
}
/** @internal */
function γγ(n) {
    const nuu = n * error_analysis_uu;
    return nuu / (1 - nuu);
}

γ(1); //=> 1.1102230246251568e-16
γγ(3); //=> 3.697785493223493e-32
//# sourceMappingURL=error-analysis.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/global-properties/classification/is-really-point.js
/**
 * Returns `true` if the given bezier curve has all control points coincident,
 * `false` otherwise.
 *
 * @param ps an order 0,1,2 or 3 bezier curve given as an array of its control
 * points, e.g. `[[0,0],[1,1],[2,1],[2,0]]`
 *
 * @doc
 */
function isReallyPoint(ps) {
    const x = ps[0][0];
    const y = ps[0][1];
    for (let i = 1; i < ps.length; i++) {
        if (x !== ps[i][0] || y !== ps[i][1]) {
            return false;
        }
    }
    return true;
}

//# sourceMappingURL=is-really-point.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/global-properties/classification/is-quad-really-line.js

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const ediff = e_diff_eDiff;
const esign = e_sign_eSign;
const is_quad_really_line_ts = two_sum_twoSum;
const { abs } = Math;
/**
 * Returns `true` if the given quadratic bezier curve is really a linear curve
 * (or a point), i.e. if all control points collinear *and* it can be converted
 * to an order 1 bezier curve (a line) such that the
 * same `(x,y)` point is returned for the same `t` value, `false` otherwise.
 *
 * * the required condition is met if: `x0 + x2 = 2*x1` and `y0 + y2 = 2*y1`
 * * **exact**: not susceptible to floating point round-off
 *
 * @param ps a quadratic bezier curve given as an array of its control
 * points, e.g. `[[1,2],[5,6],[7,8]]`
 *
 * @doc mdx
 */
function isQuadReallyLine(ps) {
    const [[x0, y0], [x1, y1], [x2, y2]] = ps;
    //if (x0 + x2 === 2*x1) && (y0 + y2 === 2*y1)
    // Calculate an approximation of the above with error bounds and use it as
    // a fast filter.
    const q = x0 + x2;
    const _q_ = abs(q); // the absolute error bound in q (after multipliciation by `u`)
    const w = q - 2 * x1;
    const w_ = _q_ + abs(w); // the absolute error bound in w
    // if w cannot possibly be zero, i.e. if the error is smaller than the value
    if (abs(w) - w_ > 0) {
        // fast filter passed
        return false;
    }
    const r = y0 + y2;
    const _r_ = abs(r); // the absolute error bound in r (after multipliciation by `u`)
    const z = r - 2 * y1;
    const z_ = _r_ + abs(z); // the absolute error bound in w
    // if the error is smaller than the value
    if (abs(z) - z_ > 0) {
        // fast filter passed
        return false;
    }
    // unable to filter - go slow and exact
    return (esign(ediff(is_quad_really_line_ts(x0, x2), [2 * x1])) === 0 &&
        esign(ediff(is_quad_really_line_ts(y0, y2), [2 * y1])) === 0);
}

//# sourceMappingURL=is-quad-really-line.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/global-properties/classification/is-cubic-really-quad.js

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const is_cubic_really_quad_tp = two_product_twoProduct;
const fes = fastExpansionSum;
const is_cubic_really_quad_esign = e_sign_eSign;
const is_cubic_really_quad_ediff = e_diff_eDiff;
const is_cubic_really_quad_u = Number.EPSILON / 2;
const is_cubic_really_quad_abs = Math.abs;
/**
 * Returns `true` if the given cubic bezier curve is really a quadratic (or
 * lower order) curve in disguise, i.e. it can be represent by a quadratic
 * bezier curve, `false` otherwise.
 *
 * * **exact**: not susceptible to floating point round-off
 *
 * @param ps an order 0,1,2 or 3 bezier curve given as an array of its control
 * points, e.g. `[[1,2],[3,4],[5,6],[7,8]]`
 *
 * @doc mdx
 */
function isCubicReallyQuad(ps) {
    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    // The line below is unrolled (uses a toHybridQuadratic condition (points same?))
    //if ((x3 + 3*x1) - (x0 + 3*x2) === 0 && 
    //    (y3 + 3*y1) - (y0 + 3*y2) === 0) {
    // Calculate an approximation of the above with error bounds and use it as
    // a fast filter.
    const u1 = 3 * x1;
    const u1_ = is_cubic_really_quad_abs(3 * x1); // the absolute error in u1
    const u2 = x3 + u1;
    const u2_ = u1_ + is_cubic_really_quad_abs(u2); // the absolute error in u2
    const v1 = 3 * x2;
    const v1_ = is_cubic_really_quad_abs(3 * x2); // the absolute error in v1
    const v2 = x0 + v1;
    const v2_ = v1_ + is_cubic_really_quad_abs(v2); // the absolute error in v2
    const w = u2 - v2;
    const w_ = u2_ + v2_ + is_cubic_really_quad_abs(w); // the absolute error in w
    // if w cannot possibly be zero, i.e. if the error is smaller than the value
    if (is_cubic_really_quad_abs(w) - is_cubic_really_quad_u * w_ > 0) {
        // fast filter 1 passed
        return false;
    }
    const q1 = 3 * y1;
    const q1_ = is_cubic_really_quad_abs(3 * y1); // the absolute error in q1
    const q2 = y3 + q1;
    const q2_ = q1_ + is_cubic_really_quad_abs(q2); // the absolute error in q2
    const r1 = 3 * y2;
    const r1_ = is_cubic_really_quad_abs(3 * y2); // the absolute error in r1
    const r2 = y0 + r1;
    const r2_ = r1_ + is_cubic_really_quad_abs(r2); // the absolute error in r2
    const s = q2 - r2;
    const s_ = q2_ + r2_ + is_cubic_really_quad_abs(s); // the absolute error in s
    if (is_cubic_really_quad_abs(s) - is_cubic_really_quad_u * s_ > 0) {
        // fast filter 2 passed
        return false;
    }
    // unable to filter - go slow and exact
    return (is_cubic_really_quad_esign(is_cubic_really_quad_ediff(fes([x3], is_cubic_really_quad_tp(3, x1)), fes([x0], is_cubic_really_quad_tp(3, x2)))) === 0 &&
        is_cubic_really_quad_esign(is_cubic_really_quad_ediff(fes([y3], is_cubic_really_quad_tp(3, y1)), fes([y0], is_cubic_really_quad_tp(3, y2)))) === 0);
}

//# sourceMappingURL=is-cubic-really-quad.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/global-properties/classification/is-collinear.js

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const { orient2d: is_collinear_orient2d } = operators;
/**
 * Returns `true` if the given bezier curve has all control points collinear,
 * `false` otherwise.
 *
 * * if you need to know whether a given bezier curve can be converted to an
 * order 1 bezier curve (a line) such that the same `(x,y)` point is returned
 * for the same `t` value then use e.g. [[isQuadReallyLine]] instead.
 *
 * * **exact** not susceptible to floating point round-off
 *
 * @param ps an order 0,1,2 or 3 bezier curve given as an array of its control
 * points, e.g. `[[1,2],[3,4],[5,6],[7,8]]`
 *
 * @doc mdx
 */
function isCollinear(ps) {
    if (ps.length === 4) {
        // Cubic bezier
        return (is_collinear_orient2d(ps[0], ps[1], ps[2]) === 0 &&
            is_collinear_orient2d(ps[1], ps[2], ps[3]) === 0 &&
            // The below check is necessary for if ps[1] === ps[2]
            is_collinear_orient2d(ps[0], ps[2], ps[3]) === 0);
    }
    if (ps.length === 3) {
        // Quadratic bezier
        return is_collinear_orient2d(ps[0], ps[1], ps[2]) === 0;
    }
    if (ps.length <= 2) {
        // Line (or point)
        return true;
    }
    throw new Error('The given bezier curve must be of order <= 3.');
}
/**
 * Returns `true` if the given bezier curve has all control points the
 * same `y` value (possibly self-overlapping), `false` otherwise.
 *
 * @param ps An order 0, 1, 2 or 3 bezier curve.
 *
 * @doc
 */
function isHorizontal(ps) {
    const y = ps[0][1];
    for (let i = 1; i < ps.length; i++) {
        if (ps[i][1] !== y) {
            return false;
        }
    }
    return true;
}
/**
 * Returns `true` if the given bezier curve has all control points the
 * same `x` value (possibly self-overlapping), `false` otherwise.
 *
 * @param ps An order 0, 1, 2 or 3 bezier curve.
 *
 * @doc
 */
function isVertical(ps) {
    const x = ps[0][0];
    for (let i = 1; i < ps.length; i++) {
        if (ps[i][0] !== x) {
            return false;
        }
    }
    return true;
}

//# sourceMappingURL=is-collinear.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/global-properties/classification/is-cubic-really-line.js


// We *have* to do the below to improve performance with bundlers❗ The assignee is a getter❗ The assigned is a pure function❗
const sce = scaleExpansion;
const is_cubic_really_line_ediff = e_diff_eDiff;
const is_cubic_really_line_ts = two_sum_twoSum;
const is_cubic_really_line_esign = e_sign_eSign;
/**
 * Returns `true` if the given bezier curve has all control points collinear
 * *and* it can be converted to an order 1 bezier curve (a line) such that the
 * same `(x,y)` point is returned for the same `t` value, `false` otherwise.
 *
 * * **exact**: not susceptible to floating point round-off
 *
 * @param ps a cubic bezier curve given as an array of its control
 * points, e.g. `[[1,2],[3,4],[5,6],[7,8]]`
 *
 * @doc mdx
 */
function isCubicReallyLine(ps) {
    // note: if cubic is really a quad then
    // x3 + 3*(x1 - x2) === x0 && 
    // y3 + 3*(y1 - y2) === y0
    if (!isCollinear(ps)) {
        return false;
    }
    const [p0, p1, p2, p3] = ps;
    const [x0, y0] = p0;
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const [x3, y3] = p3;
    // convert middle two control points to single quad point
    // [
    //   (3*(x1 + x2) - (x0 + x3)) / 4, 
    //   (3*(y1 + y2) - (y0 + y3)) / 4
    // ]
    const qx1 = is_cubic_really_line_ediff(sce(is_cubic_really_line_ts(x1 / 4, x2 / 4), 3), is_cubic_really_line_ts(x0 / 4, x3 / 4));
    const qy1 = is_cubic_really_line_ediff(sce(is_cubic_really_line_ts(y1 / 4, y2 / 4), 3), is_cubic_really_line_ts(y0 / 4, y3 / 4));
    // is quad really line:
    //   if (x0 + x2 === 2*x1) && (y0 + y2 === 2*y1) OR
    //   if ((x0 + x2)/2 === x1) && ((y0 + y2)/2 === y1)
    return (is_cubic_really_line_esign(is_cubic_really_line_ediff(is_cubic_really_line_ts(x0 / 2, x3 / 2), qx1)) === 0 &&
        is_cubic_really_line_esign(is_cubic_really_line_ediff(is_cubic_really_line_ts(y0 / 2, y3 / 2), qy1)) === 0);
}

//# sourceMappingURL=is-cubic-really-line.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/to-power-basis/to-power-basis/double/to-power-basis-with-running-error.js
const to_power_basis_with_running_error_abs = Math.abs;
/**
 * Returns the power basis representation of a bezier curve of order cubic or
 * less including a coefficient-wise absolute error bound.
 *
 * * intermediate calculations are done in double precision
 * * the error bound need to be multiplied by `γ(1) === u/(1-u)`
 * where `u = Number.EPSILON/2` before use
 * * returns the resulting power basis x and y coordinate polynomials from
 * highest power to lowest, e.g. if `x(t) = at^2 + bt + c`
 * and `y(t) = dt^2 + et + f` then  the result is returned
 * as `[[a,b,c],[d,e,f]]`
 *
 * @param ps an order 0,1,2 or 3 bezier curve given by an ordered array of its
 * control points, e.g. `[[0,0],[1,1],[2,1],[2,0]]`
 *
 * @doc
 */
function toPowerBasisWithRunningError(ps) {
    if (ps.length === 4) {
        return toPowerBasis3WithRunningError(ps);
    }
    if (ps.length === 3) {
        return toPowerBasis2WithRunningError(ps);
    }
    if (ps.length === 2) {
        return toPowerBasis1WithRunningError(ps);
    }
    if (ps.length === 1) {
        return toPowerBasis0WithRunningError(ps);
    }
    throw new Error('The given bezier curve must be of order <= 3.');
}
/** @internal */
function toPowerBasis3WithRunningError(ps) {
    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    // ----------------------------
    // xx3 = (x3 - x0) + 3*(x1 - x2)
    // ----------------------------
    const xa = x3 - x0;
    const _xa_ = to_power_basis_with_running_error_abs(xa);
    const xb = x1 - x2;
    const _xb_ = to_power_basis_with_running_error_abs(xb);
    const xc = 3 * xb;
    const xc_ = 6 * _xb_; // === 3*_xb_ + 3*abs(xc)
    const xx3 = xa + xc;
    const xx3_ = _xa_ + xc_ + to_power_basis_with_running_error_abs(xx3);
    // ----------------------------
    // xx2 = 3*((x2 + x0) - 2*x1)
    // ----------------------------
    const xd = x2 + x0;
    const _xd_ = to_power_basis_with_running_error_abs(xd);
    const xe = xd - 2 * x1;
    const _xe_ = _xd_ + to_power_basis_with_running_error_abs(xe);
    const xx2 = 3 * xe;
    const xx2_ = 6 * _xe_; // 3*_xe_ + abs(xx2)
    // ----------------------------
    // xx1 = 3*(x1 - x0)
    // ----------------------------
    const xg = x1 - x0;
    const _xg_ = to_power_basis_with_running_error_abs(xg);
    const xx1 = 3 * xg;
    const xx1_ = 6 * _xg_; // 3*_xg_ + abs(3*xg)
    // ------------------------------
    // yy3 = (y3 - y0) + 3*(y1 - y2)
    // ------------------------------
    const ya = y3 - y0;
    const _ya_ = to_power_basis_with_running_error_abs(ya);
    const yb = y1 - y2;
    const _yb_ = to_power_basis_with_running_error_abs(yb);
    const yc = 3 * yb;
    const yc_ = 6 * _yb_; // === 3*_yb_ + 3*abs(yc)
    const yy3 = ya + yc;
    const yy3_ = _ya_ + yc_ + to_power_basis_with_running_error_abs(yy3);
    // ----------------------------
    // yy2 = 3*((y2 + y0) - 2*y1)
    // ----------------------------
    const yd = y2 + y0;
    const _yd_ = to_power_basis_with_running_error_abs(yd);
    const ye = yd - 2 * y1;
    const _ye_ = _yd_ + to_power_basis_with_running_error_abs(ye);
    const yy2 = 3 * ye;
    const yy2_ = 6 * _ye_; // 3*_ye_ + abs(yy2)
    // ----------------------------
    // yy1 = 3*(y1 - y0)
    // ----------------------------
    const yg = y1 - y0;
    const _yg_ = to_power_basis_with_running_error_abs(yg);
    const yy1 = 3 * yg;
    const yy1_ = 6 * _yg_; // 3*_yg_ + abs(3*yg)
    return {
        coeffs: [[xx3, xx2, xx1, x0], [yy3, yy2, yy1, y0]],
        errorBound: [[xx3_, xx2_, xx1_, 0], [yy3_, yy2_, yy1_, 0]]
    };
}
/** @internal */
function toPowerBasis2WithRunningError(ps) {
    const [[x0, y0], [x1, y1], [x2, y2]] = ps;
    // ---------------------
    // xx2 = (x2 + x0) - 2*x1
    // ---------------------
    const xa = x2 + x0;
    const _xa_ = to_power_basis_with_running_error_abs(xa);
    const xx2 = xa - 2 * x1;
    const xx2_ = _xa_ + to_power_basis_with_running_error_abs(xx2);
    // ---------------------
    // xx1 = 2*(x1 - x0)
    // ---------------------
    const xx1 = 2 * (x1 - x0);
    const xx1_ = to_power_basis_with_running_error_abs(xx1);
    // ---------------------
    // yy2 = (y2 + y0) - 2*y1
    // ---------------------
    const ya = y2 + y0;
    const _ya_ = to_power_basis_with_running_error_abs(ya);
    const yy2 = ya - 2 * y1;
    const yy2_ = _ya_ + to_power_basis_with_running_error_abs(yy2);
    // ---------------------
    // yy1 = 2*(y1 - y0)
    // ---------------------
    const yy1 = 2 * (y1 - y0);
    const yy1_ = to_power_basis_with_running_error_abs(yy1);
    return {
        coeffs: [[xx2, xx1, x0], [yy2, yy1, y0]],
        errorBound: [[xx2_, xx1_, 0], [yy2_, yy1_, 0]]
    };
}
/** @internal */
function toPowerBasis1WithRunningError(ps) {
    const [[x0, y0], [x1, y1]] = ps;
    const xx1 = x1 - x0;
    const xx1_ = to_power_basis_with_running_error_abs(xx1);
    const yy1 = y1 - y0;
    const yy1_ = to_power_basis_with_running_error_abs(yy1);
    return {
        coeffs: [[xx1, x0], [yy1, y0]],
        errorBound: [[xx1_, 0], [yy1_, 0]]
    };
}
/** @internal */
function toPowerBasis0WithRunningError(ps) {
    const [[x0, y0]] = ps;
    return {
        coeffs: [[x0], [y0]],
        errorBound: [[0], [0]]
    };
}

//# sourceMappingURL=to-power-basis-with-running-error.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/intersection/self-intersection/get-coefficients/double/get-coeffs-bez3-with-running-error.js


const get_coeffs_bez3_with_running_error_abs = Math.abs;
const γ1 = γ(1);
/**
 * Returns a polynomial in 1 variable (including coefficientwise error bound)
 * whose roots are the parameter values of the self-intersection points of the
 * given cubic bezier curve.
 *
 * The returned polynomial coefficients are given densely as an array of double
 * precision floating point numbers from highest to lowest power,
 * e.g. `[5,-3,0]` represents the polynomial `5x^2 - 3x`.
 *
 * * intermediate calculations are done in double precision and this is
 * reflected in the error bound
 * * the error bound returned need **not** be scaled before use
 * * adapted from [Indrek Mandre](http://www.mare.ee/indrek/misc/2d.pdf)
 *
 * @param ps a cubic bezier curve.
 *
 * @internal
 */
function getCoeffsBez3WithRunningError(ps) {
    const { coeffs: [[a3, a2, a1], [b3, b2, b1]], errorBound: [[a3_, a2_], [b3_, b2_]] } = toPowerBasis3WithRunningError(ps);
    const _a3 = get_coeffs_bez3_with_running_error_abs(a3);
    const _a2 = get_coeffs_bez3_with_running_error_abs(a2);
    const _a1 = get_coeffs_bez3_with_running_error_abs(a1);
    const _b3 = get_coeffs_bez3_with_running_error_abs(b3);
    const _b2 = get_coeffs_bez3_with_running_error_abs(b2);
    const _b1 = get_coeffs_bez3_with_running_error_abs(b1);
    const a2b3 = a2 * b3;
    const a3b2 = a3 * b2;
    const a3b1 = a3 * b1;
    const a1b3 = a1 * b3;
    const a2b1 = a2 * b1;
    const a1b2 = a1 * b2;
    // Note: a variable prepended with and underscore is an absolute value,
    // postpended with an underscore denotes an absolute error (before 
    // multiplication by the round-off unit `u`) - both underscores present 
    // means it is both an absolute value and a round-off error.
    const _a2b3 = get_coeffs_bez3_with_running_error_abs(a2b3);
    const _a3b2 = get_coeffs_bez3_with_running_error_abs(a3b2);
    const _a3b1 = get_coeffs_bez3_with_running_error_abs(a3b1);
    const _a1b3 = get_coeffs_bez3_with_running_error_abs(a1b3);
    const _a2b1 = get_coeffs_bez3_with_running_error_abs(a2b1);
    const _a1b2 = get_coeffs_bez3_with_running_error_abs(a1b2);
    const a2b3_ = a2_ * _b3 + _a2 * b3_ + _a2b3;
    const a3b2_ = a3_ * _b2 + _a3 * b2_ + _a3b2;
    const a3b1_ = a3_ * _b1 + _a3b1;
    const a1b3_ = _a1 * b3_ + _a1b3;
    const a2b1_ = a2_ * _b1 + _a2b1;
    const a1b2_ = _a1 * b2_ + _a1b2;
    const f4 = a2b3 - a3b2;
    const _f4 = get_coeffs_bez3_with_running_error_abs(f4);
    const f4_ = a2b3_ + a3b2_ + _f4;
    const f5 = a1b3 - a3b1;
    const _f5 = get_coeffs_bez3_with_running_error_abs(f5);
    const f5_ = a1b3_ + a3b1_ + _f5;
    const f6 = a2b1 - a1b2;
    const _f6 = get_coeffs_bez3_with_running_error_abs(f6);
    const f6_ = a2b1_ + a1b2_ + _f6;
    //const u2 = -2*a2*a3*b2*b3 + a2*a2*b3*b3 + a3*a3*b2*b2
    //const u2 = a2b3*(-2*a3b2 + a2b3) + a3b2*a3b2
    //const u2 = (a2b3 - a3b2)*(a2b3 - a3b2)
    const u2 = f4 * f4;
    const u2_ = 2 * f4_ * _f4 + get_coeffs_bez3_with_running_error_abs(u2);
    //const u1 = -a1*a3*b2*b3 - a2*a3*b1*b3 + a1*a2*b3*b3 + b1*b2*a3*a3
    //const u1 = a1*b3*-a3*b2 + a1*b3*a2*b3 + a3*b1*-a2*b3 + a3*b1*a3*b2
    //const u1 = a1b3*(a2b3 - a3b2) - a3b1*(a2b3 - a3b2)
    //const u1 = a1b3*f4 - a3b1*f4 = f4*(a1b3 - a3b1);
    const u1 = f4 * f5;
    const u1_ = f4_ * _f5 + _f4 * f5_ + get_coeffs_bez3_with_running_error_abs(u1);
    //const u0 = -a1*a2*b2*b3 - a2*a3*b1*b2 - 2*a1*a3*b1*b3 + a1*a1*b3*b3 + a3*a3*b1*b1 + a1*a3*b2*b2 + b1*b3*a2*a2
    //const u0 = 
    //       a2b3*(a2b1 - a1b2) - a3b2*(a2b1 - a1b2) +
    //       a1b3*(-2*a3b1 + a1b3) + a3b1*a3b1;
    //const u0 = 
    //       f6*f4 + 
    //       (a1b3 - a3b1)*(a1b3 - a3b1);
    //const u0 = f6*f4 + f5*f5;
    const g7 = f6 * f4;
    const g7_ = f6_ * _f4 + _f6 * f4_ + get_coeffs_bez3_with_running_error_abs(g7);
    const g9 = f5 * f5;
    const g9_ = 2 * _f5 * f5_ + get_coeffs_bez3_with_running_error_abs(g9);
    const u0 = g7 + g9;
    const u0_ = g7_ + g9_ + get_coeffs_bez3_with_running_error_abs(u0);
    // Solve: u2*t**2 + u1*t + u0 = 0
    return {
        coeffs: [u2, u1, u0],
        errBound: [u2_, u1_, u0_].map(c => γ1 * c)
    };
}

//# sourceMappingURL=get-coeffs-bez3-with-running-error.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/to-power-basis/to-power-basis/exact/to-power-basis-exact.js

// We *have* to do the below to improve performance with bundlers❗ The assignee is a getter❗ The assigned is a pure function❗
const to_power_basis_exact_td = two_diff_twoDiff;
const to_power_basis_exact_ts = two_sum_twoSum;
const to_power_basis_exact_sce = scaleExpansion2;
const ge = growExpansion;
const to_power_basis_exact_eAdd = eAdd;
/**
 * Returns the *exact* power basis representation of a bezier curve of order
 * cubic or less.
 *
 * * returns the resulting power basis x and y coordinate polynomials from
 * highest power to lowest, e.g. if `x(t) = at^2 + bt + c`
 * and `y(t) = dt^2 + et + f` then  the result is returned
 * as `[[a,b,c],[d,e,f]]`, where the `a,b,c,...` are [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf) floating point
 * expansions
 *
 * @param ps an order 0,1,2 or 3 bezier curve given by an ordered array of its
 * control points, e.g. `[[0,0],[1,1],[2,1],[2,0]]`
 *
 * @doc
 */
function toPowerBasisExact(ps) {
    if (ps.length === 4) {
        return toPowerBasis3Exact(ps);
    }
    if (ps.length === 3) {
        return toPowerBasis2Exact(ps);
    }
    if (ps.length === 2) {
        return toPowerBasis1Exact(ps);
    }
    if (ps.length === 1) {
        return toPowerBasis0Exact(ps);
    }
    throw new Error('The given bezier curve must be of order <= cubic.');
}
/** @internal */
function toPowerBasis3Exact(ps) {
    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    return [[
            // (x3 - x0) + 3*(x1 - x2)
            to_power_basis_exact_eAdd(to_power_basis_exact_td(x3, x0), to_power_basis_exact_sce(3, to_power_basis_exact_td(x1, x2))),
            // OR
            // (x3 - x0) - (2*x2 + x2) + (2*x1 + x1)
            //eAdd(eAdd(td(x3,x0), ts(-2*x2, -x2)), ts(2*x1, x1))
            // 3*((x2 + x0) - 2*x1)
            to_power_basis_exact_sce(3, ge(to_power_basis_exact_ts(x2, x0), -2 * x1)),
            // 3*(x1 - x0)
            to_power_basis_exact_sce(3, to_power_basis_exact_td(x1, x0)),
            // x0
            [x0]
        ], [
            //ge(ge(sce(3, td(y1, y2)), y3), -y0),
            to_power_basis_exact_eAdd(to_power_basis_exact_td(y3, y0), to_power_basis_exact_sce(3, to_power_basis_exact_td(y1, y2))),
            //sce(3, ge(td(y2, 2*y1), y0)),
            to_power_basis_exact_sce(3, ge(to_power_basis_exact_ts(y2, y0), -2 * y1)),
            to_power_basis_exact_sce(3, to_power_basis_exact_td(y1, y0)),
            [y0]
        ]];
}
/** @internal */
function toPowerBasis2Exact(ps) {
    const [[x0, y0], [x1, y1], [x2, y2]] = ps;
    return [[
            // x2 - 2*x1 + x0
            ge(to_power_basis_exact_ts(x2, x0), -2 * x1),
            // 2*(x1 - x0)
            to_power_basis_exact_td(2 * x1, 2 * x0),
            //x0
            [x0]
        ], [
            ge(to_power_basis_exact_ts(y2, y0), -2 * y1),
            to_power_basis_exact_td(2 * y1, 2 * y0),
            [y0]
        ]];
}
/** @internal */
function toPowerBasis1Exact(ps) {
    const [[x0, y0], [x1, y1]] = ps;
    return [[
            //x1 - x0,
            to_power_basis_exact_td(x1, x0),
            //x0
            [x0]
        ], [
            to_power_basis_exact_td(y1, y0),
            [y0]
        ]];
}
/** @internal */
function toPowerBasis0Exact(ps) {
    const [[x0, y0]] = ps;
    return [[[x0]], [[y0]]];
}

//# sourceMappingURL=to-power-basis-exact.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/intersection/self-intersection/get-coefficients/exact/get-coeffs-bez3-exact.js


// We *have* to do the below to improve performance with bundlers❗ The assignee is a getter❗ The assigned is a pure function❗
const get_coeffs_bez3_exact_epr = expansion_product_expansionProduct;
const get_coeffs_bez3_exact_fes = fastExpansionSum;
const get_coeffs_bez3_exact_ediff = e_diff_eDiff;
/**
 * Returns an error-free polynomial in 1 variable whose roots are the parameter
 * values of the self-intersection points of the given cubic bezier curve.
 *
 * The returned polynomial coefficients are given densely as an array of
 * [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf) floating point expansions from highest to lowest power,
 * e.g. `[[5],[-3],[0]]` represents the polynomial `5x^2 - 3x`.
 *
 * * the returned polynomial coefficients are exact (i.e. error-free)
 * * adapted from [Indrek Mandre](http://www.mare.ee/indrek/misc/2d.pdf)
 *
 * @param ps a cubic bezier curve.
 *
 * @internal
 */
function getCoeffsBez3Exact(ps) {
    const [[a3, a2, a1], [b3, b2, b1]] = toPowerBasis3Exact(ps);
    const a2b3 = get_coeffs_bez3_exact_epr(a2, b3);
    const a3b2 = get_coeffs_bez3_exact_epr(a3, b2);
    const a3b1 = get_coeffs_bez3_exact_epr(a3, b1);
    const a1b3 = get_coeffs_bez3_exact_epr(a1, b3);
    const a2b1 = get_coeffs_bez3_exact_epr(a2, b1);
    const a1b2 = get_coeffs_bez3_exact_epr(a1, b2);
    const f4 = get_coeffs_bez3_exact_ediff(a2b3, a3b2);
    const f5 = get_coeffs_bez3_exact_ediff(a1b3, a3b1);
    const f6 = get_coeffs_bez3_exact_ediff(a2b1, a1b2);
    //const u2 = -2*a2*a3*b2*b3 + a2*a2*b3*b3 + a3*a3*b2*b2
    const u2 = get_coeffs_bez3_exact_epr(f4, f4);
    //const u1 = -a1*a3*b2*b3 - a2*a3*b1*b3 + a1*a2*b3*b3 + b1*b2*a3*a3
    const u1 = get_coeffs_bez3_exact_epr(f4, f5);
    //const u0 = -a1*a2*b2*b3 - a2*a3*b1*b2 - 2*a1*a3*b1*b3 + a1*a1*b3*b3 + a3*a3*b1*b1 + a1*a3*b2*b2 + b1*b3*a2*a2
    const g7 = get_coeffs_bez3_exact_epr(f4, f6);
    const g9 = get_coeffs_bez3_exact_epr(f5, f5);
    const u0 = get_coeffs_bez3_exact_fes(g7, g9);
    // Solve: u2*t**2 + u1*t + u0 = 0
    return [u2, u1, u0];
}

//# sourceMappingURL=get-coeffs-bez3-exact.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/global-properties/classification/classify.js











// We *have* to do the below to improve performance with bundlers❗ The assignee is a getter❗ The assigned is a pure function❗
const { eSign: classify_eSign, eCompare: classify_eCompare } = operators;
const edif = e_diff_eDiff;
const classify_epr = expansion_product_expansionProduct;
const classify_sce = scaleExpansion2;
const classify_td = node_twoDiff;
const classify_ts = node_twoSum;
const classify_fes = fastExpansionSum;
const classify_ge = growExpansion;
const classify_abs = Math.abs;
const classify_1 = γ(1);
// The classifications form an equivalence class, in other words *all* 
// possible planar polynomial bezier curves (of order <= 3) are represented and 
// all options are mutually exclusive.
const point = { order: 0, realOrder: 0, collinear: true, nodeType: 'n/a' };
const lineGeneral = { order: 1, realOrder: 1, collinear: true, nodeType: 'n/a' };
const lineDegenPoint = { order: 1, realOrder: 0, collinear: true, nodeType: 'n/a' };
const quadGeneral = { order: 2, realOrder: 2, collinear: false, nodeType: 'n/a' };
/** The curve is collinear but not a line (i.e. evaluating at `t` values won't correspond to same points) */
const quadDegenCollinear = { order: 2, realOrder: 2, collinear: true, nodeType: 'n/a' };
const quadDegenLine = { order: 2, realOrder: 1, collinear: true, nodeType: 'n/a' };
const quadDegenPoint = { order: 2, realOrder: 0, collinear: true, nodeType: 'n/a' };
const cubicGeneralCrunode = { order: 3, realOrder: 3, collinear: false, nodeType: 'crunode' };
const cubicGeneralAcnode = { order: 3, realOrder: 3, collinear: false, nodeType: 'acnode' };
const cubicGeneralCusp = { order: 3, realOrder: 3, collinear: false, nodeType: 'cusp' };
const cubicGeneralExplicit = { order: 3, realOrder: 3, collinear: false, nodeType: 'explicit' };
const cubicDegenCollinearCubic = { order: 3, realOrder: 3, collinear: true, nodeType: 'n/a' };
const cubicDegenQuad = { order: 3, realOrder: 2, collinear: false, nodeType: 'n/a' };
const cubicDegenCollinearQuad = { order: 3, realOrder: 2, collinear: true, nodeType: 'n/a' };
const cubicDegenLine = { order: 3, realOrder: 1, collinear: true, nodeType: 'n/a' };
const cubicDegenPoint = { order: 3, realOrder: 0, collinear: true, nodeType: 'n/a' };
/**
 * The classifications form an equivalence class, in other words *all*
 * possible planar polynomial bezier curves (of order <= 3) are represented and
 * all options are mutually exclusive.
 */
const classifications = {
    point,
    lineGeneral,
    lineDegenPoint,
    quadGeneral,
    quadDegenCollinear,
    quadDegenLine,
    quadDegenPoint,
    cubicGeneralCrunode,
    cubicGeneralAcnode,
    cubicGeneralCusp,
    cubicGeneralExplicit,
    cubicDegenCollinearCubic,
    cubicDegenQuad,
    cubicDegenCollinearQuad,
    cubicDegenLine,
    cubicDegenPoint
};
function isPoint(ps) {
    return classify(ps) === point;
}
function isLineGeneral(ps) {
    return classify(ps) === lineGeneral;
}
function isLineDegenPoint(ps) {
    return classify(ps) === lineDegenPoint;
}
function isQuadGeneral(ps) {
    return classify(ps) === quadGeneral;
}
function isQuadDegenCollinear(ps) {
    return classify(ps) === quadDegenCollinear;
}
function isQuadDegenLine(ps) {
    return classify(ps) === quadDegenLine;
}
function isQuadDegenPoint(ps) {
    return classify(ps) === quadDegenPoint;
}
function isCubicGeneralCrunode(ps) {
    return classify(ps) === cubicGeneralCrunode;
}
function isCubicGeneralAcnode(ps) {
    return classify(ps) === cubicGeneralAcnode;
}
function isCubicGeneralCusp(ps) {
    return classify(ps) === cubicGeneralCusp;
}
function isCubicGeneralExplicit(ps) {
    return classify(ps) === cubicGeneralExplicit;
}
function isCubicDegenCollinearCubic(ps) {
    return classify(ps) === cubicDegenCollinearCubic;
}
function isCubicDegenQuad(ps) {
    return classify(ps) === cubicDegenQuad;
}
function isCubicDegenCollinearQuad(ps) {
    return classify(ps) === cubicDegenCollinearQuad;
}
function isCubicDegenLine(ps) {
    return classify(ps) === cubicDegenLine;
}
function isCubicDegenPoint(ps) {
    return classify(ps) === cubicDegenPoint;
}
const classification = {
    isPoint,
    isLineGeneral,
    isLineDegenPoint,
    isQuadGeneral,
    isQuadDegenCollinear,
    isQuadDegenLine,
    isQuadDegenPoint,
    isCubicGeneralCrunode,
    isCubicGeneralAcnode,
    isCubicGeneralCusp,
    isCubicGeneralExplicit,
    isCubicDegenCollinearCubic,
    isCubicDegenQuad,
    isCubicDegenCollinearQuad,
    isCubicDegenLine,
    isCubicDegenPoint,
};
/**
 * Returns a classification of the given bezier curve.
 *
 * * **exact**: not susceptible to floating point round-off
 *
 * @param ps a bezier curve of order 0,1,2 or 3 given as an array of its
 * control points.
 *
 * @doc mdx
 */
function classify(ps) {
    if (ps.length === 4) {
        if (isCubicReallyQuad(ps)) {
            return isCubicReallyLine(ps)
                ? isReallyPoint(ps) ? cubicDegenPoint : cubicDegenLine
                : isCollinear(ps) ? cubicDegenCollinearQuad : cubicDegenQuad;
        }
        return isCollinear(ps)
            ? cubicDegenCollinearCubic
            : classifyGeneralCubic(ps);
    }
    if (ps.length === 3) {
        return isCollinear(ps)
            ? isQuadReallyLine(ps)
                ? isReallyPoint(ps) ? quadDegenPoint : quadDegenLine
                : quadDegenCollinear
            : quadGeneral;
    }
    if (ps.length === 2) {
        return isReallyPoint(ps) ? lineDegenPoint : lineGeneral;
    }
    if (ps.length === 1) {
        return point;
    }
    throw new Error('The given bezier curve must be of order <= 3');
}
/**
 * Return a complete classification of the given *general* cubic bezier curve as
 * either having an `acnode`, `crunode`, `cusp` or being an `explicit` curve.
 *
 * * **precondition**: the given bezier curve is a 'general' cubic, i.e. not all
 * points collinear and not degenerate to a quadratic curve, line or point.
 *
 * @param ps
 */
function classifyGeneralCubic(ps) {
    // First get fast naively calculated coefficients for self-intersection
    const { coeffs: [a, b, c], errBound: [a_, b_, c_] } = getCoeffsBez3WithRunningError(ps);
    // if error in `a` cannot discern it from zero
    if (classify_abs(a) <= a_) {
        // it is rare to get here 
        // check for sure if a === 0 exactly
        const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
        //const a3 = (x3 - x0) + 3*(x1 - x2);
        //const a2 = (x2 + x0) - 2*x1;
        //const b3 = (y3 - y0) + 3*(y1 - y2);
        //const b2 = (y2 + y0) - 2*y1;
        const a3 = classify_fes(classify_td(x3, x0), classify_sce(3, (classify_td(x1, x2))));
        const a2 = classify_ge(classify_ts(x2, x0), -2 * x1);
        const b3 = classify_fes(classify_td(y3, y0), classify_sce(3, (classify_td(y1, y2))));
        const b2 = classify_ge(classify_ts(y2, y0), -2 * y1);
        const a2b3 = classify_epr(a2, b3);
        const a3b2 = classify_epr(a3, b2);
        if (classify_eCompare(a2b3, a3b2) === 0) {
            // a === 0 => no roots possible! (also b === 0)
            return cubicGeneralExplicit;
        }
    }
    // `Discr` = discriminant = b^2 - 4ac
    // calculate `Discr` and its absolute error Discr_
    const bb = b * b;
    const bb_ = 2 * b_ * classify_abs(b) + classify_1 * bb; // the error in b**2
    const ac4 = 4 * a * c;
    const ac4_ = 4 * (a_ * classify_abs(c) + classify_abs(a) * c_) + classify_1 * classify_abs(ac4);
    const Discr = bb - ac4;
    const Discr_ = bb_ + ac4_ + classify_1 * classify_abs(Discr);
    // if the discriminant is smaller than negative the error bound then
    // certainly there are no roots, i.e. no cusp and no self-intersections
    if (Discr < -Discr_) {
        // discriminant is definitely negative
        return cubicGeneralAcnode;
    }
    // if the discriminant is definitely positive
    if (Discr > Discr_) {
        // calculate roots naively as a fast pre-filter
        return cubicGeneralCrunode;
    }
    // we need to check exactly - (a !== 0) at this point - tested for earlier
    let [A, B, C] = getCoeffsBez3Exact(ps);
    // exact - Discr = b^2 - 4ac
    const eDiscr = edif(classify_epr(B, B), classify_sce(4, classify_epr(A, C)));
    const sgnDiscr = classify_eSign(eDiscr);
    return sgnDiscr < 0
        ? cubicGeneralAcnode
        : sgnDiscr > 0
            ? cubicGeneralCrunode
            : cubicGeneralCusp;
}

//# sourceMappingURL=classify.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/simultaneous-properties/get-interface-rotation.js



const get_interface_rotation_tp = node_twoProduct;
const get_interface_rotation_ddAddDd = node_ddAddDd;
const get_interface_rotation_ddDiffDd = node_ddDiffDd;
const { atan2: get_interface_rotation_atan2 } = Math;
/**
 * Returns the rotation angle (-𝜋 <= θ <= 𝜋 *guaranteed*) from some vector to
 * another vector considering them to both start at the same point.
 *
 * If one of the vectors is the zero vector then `0` is returned.
 *
 * It can also be imagined that the 2nd vector starts where the 1st one ends.
 *
 * Intermediate calculations are done in double precision in a numerically
 * stable manner.
 *
 * @param a the first 2d vector given as `[x,y]` where `x` and `y` are the
 * coordinates, e.g. `[2,3]`
 * @param b the second 2d vector
 */
function getInterfaceRotation(a, b) {
    const v1 = a[0];
    const v2 = a[1];
    const w1 = b[0];
    const w2 = b[1];
    let A = get_interface_rotation_ddDiffDd(get_interface_rotation_tp(w2, v1), get_interface_rotation_tp(w1, v2))[1];
    let B = get_interface_rotation_ddAddDd(get_interface_rotation_tp(w1, v1), get_interface_rotation_tp(w2, v2))[1];
    return get_interface_rotation_atan2(A, B);
}

//# sourceMappingURL=get-interface-rotation.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/global-properties/curviness.js

const { abs: curviness_abs } = Math;
/**
 * Returns a 'curviness' measure of the given bezier curve. `0` is considered
 * the `flattest` (as is the case of e.g. a line).
 *
 * The returned flatness, say `f` is such that `0 <= f <= (order-1)*𝜋`, where
 * `order` is the order of the bezier curve (e.g. cubics are of order 3); thus,
 * for example, cubics can have a maximum value of `2𝜋` for curviness (the most
 * curvy) and a minimum value of `0` (the flattest)
 *
 * This function is useful as a heuristic to test the `flatness` of curves to
 * see if they should be subdivided (in which case they would become flatter)
 *
 * * curviness is calculated simply as the sum of the absolute rotation (in
 * radians) of consecutive vectors formed by the ordered control points of the
 * curve
 *
 * @param ps an order 0,1,2 or 3 bezier curve given as an array of its control
 * points, e.g. `[[1,2],[3,4],[5,6],[7,8]]`
 *
 * @doc mdx
 */
function curviness(ps) {
    // The below was the old heuristic which did not work well e.g. if an end 
    // control point was far away from the other 3
    //return controlPointLinesLength(ps) / distanceBetween(ps[0], ps[ps.length-1]);
    const vs = [];
    for (let i = 0; i < ps.length - 1; i++) {
        const v = [ps[i + 1][0] - ps[i][0], ps[i + 1][1] - ps[i][1]];
        if ((v[0] !== 0 || v[1]) !== 0) {
            vs.push(v);
        }
    }
    const len = vs.length;
    let total = 0;
    for (let i = 0; i < len - 1; i++) {
        total += curviness_abs(getInterfaceRotation(vs[i], vs[i + 1]));
    }
    return total;
}

//# sourceMappingURL=curviness.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/transformation/split/from-to/from-to-3.js
/**
 * Returns a bezier curve that starts and ends at the given t parameters.
 *
 * @param ps a cubic bezier curve given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 * @param tS the `t` parameter where the resultant bezier should start
 * @param tE the `t` parameter where the resultant bezier should end
 *
 * @internal
 */
function fromTo3(ps, tS, tE) {
    if (tS === 0) {
        if (tE === 1) {
            return ps;
        }
        return splitLeft3(ps, tE);
    }
    if (tE === 1) {
        return splitRight3(ps, tS);
    }
    return splitAtBoth3(ps, tS, tE);
}
/**
 * Returns a bezier curve that starts at the given t parameter and ends
 * at `t === 1`.
 *
 * @param ps a cubic bezier curve given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 * @param t the `t` parameter where the resultant bezier should start
 *
 * @internal
 */
function splitRight3(ps, t) {
    // --------------------------------------------------------
    // const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps; 
    const p0 = ps[0];
    const p1 = ps[1];
    const p2 = ps[2];
    const p3 = ps[3];
    const x00 = p0[0];
    const y00 = p0[1];
    const x10 = p1[0];
    const y10 = p1[1];
    const x20 = p2[0];
    const y20 = p2[1];
    const x30 = p3[0];
    const y30 = p3[1];
    // --------------------------------------------------------
    const x01 = x00 - t * (x00 - x10);
    const x11 = x10 - t * (x10 - x20);
    const x21 = x20 - t * (x20 - x30);
    const x02 = x01 - t * (x01 - x11);
    const x12 = x11 - t * (x11 - x21);
    const x03 = x02 - t * (x02 - x12);
    const y01 = y00 - t * (y00 - y10);
    const y11 = y10 - t * (y10 - y20);
    const y21 = y20 - t * (y20 - y30);
    const y02 = y01 - t * (y01 - y11);
    const y12 = y11 - t * (y11 - y21);
    const y03 = y02 - t * (y02 - y12);
    return [[x03, y03], [x12, y12], [x21, y21], [x30, y30]];
}
/**
 * Returns a bezier curve that starts at `t === 0` and ends at the given t
 * parameter.
 *
 * @param ps a cubic bezier curve given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 * @param t the `t` parameter where the resultant bezier should end
 *
 * @internal
 */
function splitLeft3(ps, t) {
    // --------------------------------------------------------
    // const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps; 
    const p0 = ps[0];
    const p1 = ps[1];
    const p2 = ps[2];
    const p3 = ps[3];
    const x00 = p0[0];
    const y00 = p0[1];
    const x10 = p1[0];
    const y10 = p1[1];
    const x20 = p2[0];
    const y20 = p2[1];
    const x30 = p3[0];
    const y30 = p3[1];
    // --------------------------------------------------------
    const x01 = x00 - t * (x00 - x10);
    const x11 = x10 - t * (x10 - x20);
    const x21 = x20 - t * (x20 - x30);
    const x02 = x01 - t * (x01 - x11);
    const x12 = x11 - t * (x11 - x21);
    const x03 = x02 - t * (x02 - x12);
    const y01 = y00 - t * (y00 - y10);
    const y11 = y10 - t * (y10 - y20);
    const y21 = y20 - t * (y20 - y30);
    const y02 = y01 - t * (y01 - y11);
    const y12 = y11 - t * (y11 - y21);
    const y03 = y02 - t * (y02 - y12);
    return [[x00, y00], [x01, y01], [x02, y02], [x03, y03]];
}
/**
 * Returns a bezier curve that starts and ends at the given `t` parameters.
 *
 * @param ps a cubic bezier curve given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 * @param tS the `t` parameter where the resultant bezier should start
 * @param tE the `t` parameter where the resultant bezier should end
 *
 * @internal
 */
function splitAtBoth3(ps, tS, tE) {
    // --------------------------------------------------------
    // const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps; 
    const p0 = ps[0];
    const p1 = ps[1];
    const p2 = ps[2];
    const p3 = ps[3];
    const x0 = p0[0];
    const y0 = p0[1];
    const x1 = p1[0];
    const y1 = p1[1];
    const x2 = p2[0];
    const y2 = p2[1];
    const x3 = p3[0];
    const y3 = p3[1];
    // --------------------------------------------------------
    const ttS = tS * tS;
    const tttS = tS * ttS;
    const ttE = tE * tE;
    const tttE = tE * ttE;
    const tStE = tS * tE;
    const xA = x0 - x1;
    const xB = x2 - x1;
    const xC = x3 - x0;
    const xD = xA + xB;
    const tSxA = tS * xA;
    const tExA = tE * xA;
    const xC3xB = xC - 3 * xB;
    const yA = y0 - y1;
    const yB = y2 - y1;
    const yC = y3 - y0;
    const yD = yA + yB;
    const tSyA = tS * yA;
    const tEyA = tE * yA;
    const yC3yB = yC - 3 * yB;
    const xx0 = tttS * xC3xB + (3 * tS * (tS * xD - xA) + x0);
    const xx1 = tStE * (tS * xC3xB + 2 * xD) + ((ttS * xD + x0) - (tExA + 2 * tSxA));
    const xx2 = tStE * (tE * xC3xB + 2 * xD) + ((ttE * xD + x0) - (2 * tExA + tSxA));
    const xx3 = tttE * xC3xB + (3 * tE * (tE * xD - xA) + x0);
    const yy0 = tttS * yC3yB + (3 * tS * (tS * yD - yA) + y0);
    const yy1 = tStE * (tS * yC3yB + 2 * yD) + ((ttS * yD + y0) - (tEyA + 2 * tSyA));
    const yy2 = tStE * (tE * yC3yB + 2 * yD) + ((ttE * yD + y0) - (2 * tEyA + tSyA));
    const yy3 = tttE * yC3yB + (3 * tE * (tE * yD - yA) + y0);
    return [[xx0, yy0], [xx1, yy1], [xx2, yy2], [xx3, yy3]];
}

//# sourceMappingURL=from-to-3.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/transformation/split/from-to/from-to-2.js
/**
 * Returns a bezier curve that starts and ends at the given `t` parameters.
 *
 * @param ps a quadratic bezier curve given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1], [2,1]]`
 * @param tS the `t` parameter where the resultant bezier should start
 * @param tE the `t` parameter where the resultant bezier should end
 *
 * @internal
 */
function fromTo2(ps, tS, tE) {
    if (tS === 0) {
        if (tE === 1) {
            return ps;
        }
        return splitLeft2(ps, tE);
    }
    if (tE === 1) {
        return splitRight2(ps, tS);
    }
    return splitAtBoth2(ps, tS, tE);
}
/**
 * Returns a bezier curve that starts at the given t parameter and ends
 * at `t === 1`.
 *
 * @param ps a quadratic bezier curve given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1], [2,1]]`
 * @param t the `t` parameter where the resultant bezier should start
 *
 * @internal
 */
function splitRight2(ps, t) {
    // --------------------------------------------------------
    // const [[x0, y0], [x1, y1], [x2, y2]] = ps; 
    const p0 = ps[0];
    const p1 = ps[1];
    const p2 = ps[2];
    const x0 = p0[0];
    const y0 = p0[1];
    const x1 = p1[0];
    const y1 = p1[1];
    const x2 = p2[0];
    const y2 = p2[1];
    // --------------------------------------------------------
    const tt = t * t;
    const xA = x0 - x1;
    const xB = x2 - x1;
    const yA = y0 - y1;
    const yB = y2 - y1;
    return [
        [tt * (xA + xB) - (2 * t * xA - x0),
            tt * (yA + yB) - (2 * t * yA - y0)],
        [t * xB + x1,
            t * yB + y1],
        [x2,
            y2] // yy2
    ];
}
/**
 * Returns a bezier curve that starts at `t === 0` and ends at the given `t`
 * parameter.
 *
 * @param ps a quadratic bezier curve given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1], [2,1]]`
 * @param t the `t` parameter where the resultant bezier should end
 *
 * @internal
 */
function splitLeft2(ps, t) {
    // --------------------------------------------------------
    // const [[x0, y0], [x1, y1], [x2, y2]] = ps; 
    const p0 = ps[0];
    const p1 = ps[1];
    const p2 = ps[2];
    const x0 = p0[0];
    const y0 = p0[1];
    const x1 = p1[0];
    const y1 = p1[1];
    const x2 = p2[0];
    const y2 = p2[1];
    // --------------------------------------------------------
    const tt = t * t;
    const xA = x0 - x1;
    const yA = y0 - y1;
    return [
        [x0,
            y0],
        [-t * xA + x0,
            -t * yA + y0],
        [tt * (xA + (x2 - x1)) - (2 * t * xA - x0),
            tt * (yA + (y2 - y1)) - (2 * t * yA - y0)] // yy2 - split point y
    ];
}
/**
 * Returns a bezier curve that starts and ends at the given `t` parameters.
 *
 * @param ps a quadratic bezier curve given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1], [2,1]]`
 * @param tS the `t` parameter where the resultant bezier should start
 * @param tE the `t` parameter where the resultant bezier should end
 *
 * @internal
 */
function splitAtBoth2(ps, tS, tE) {
    // --------------------------------------------------------
    // const [[x0, y0], [x1, y1], [x2, y2]] = ps; 
    const p0 = ps[0];
    const p1 = ps[1];
    const p2 = ps[2];
    const x0 = p0[0];
    const y0 = p0[1];
    const x1 = p1[0];
    const y1 = p1[1];
    const x2 = p2[0];
    const y2 = p2[1];
    // --------------------------------------------------------
    const ttS = tS * tS;
    const ttE = tE * tE;
    const tStE = tS * tE;
    const xA = x0 - x1;
    const xB = x2 - x1;
    const xC = xA + xB;
    const yA = y0 - y1;
    const yB = y2 - y1;
    const yC = yA + yB;
    const xx0 = ttS * xC - (2 * tS * xA - x0);
    const xx1 = tStE * xC - (xA * (tE + tS) - x0);
    const xx2 = ttE * xC - (2 * tE * xA - x0);
    const yy0 = ttS * yC - (2 * tS * yA - y0);
    const yy1 = tStE * yC - (yA * (tE + tS) - y0);
    const yy2 = ttE * yC - (2 * tE * yA - y0);
    return [[xx0, yy0], [xx1, yy1], [xx2, yy2]];
}

//# sourceMappingURL=from-to-2.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/transformation/split/from-to/from-to-1.js
/**
 * Returns a bezier curve that starts and ends at the given `t` parameters.
 *
 * @param ps a lineer bezier curve (a line) given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1]]`
 * @param tS the `t` parameter where the resultant bezier should start
 * @param tE the `t` parameter where the resultant bezier should end
 *
 * @internal
 */
function fromTo1(ps, tS, tE) {
    if (tS === 0) {
        if (tE === 1) {
            return ps;
        }
        return splitLeft1(ps, tE);
    }
    if (tE === 1) {
        return splitRight1(ps, tS);
    }
    return splitAtBoth1(ps, tS, tE);
}
/**
 * Returns a bezier curve that starts at the given `t` parameter and ends
 * at `t === 1`.
 *
 * @param ps a lineer bezier curve (a line) given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1]]`
 * @param t the `t` parameter where the resultant bezier should start
 *
 * @internal
 */
function splitRight1(ps, t) {
    // --------------------------------------------------------
    // const [[x0, y0], [x1, y1]] = ps; 
    const p0 = ps[0];
    const p1 = ps[1];
    const x0 = p0[0];
    const y0 = p0[1];
    const x1 = p1[0];
    const y1 = p1[1];
    // --------------------------------------------------------
    return [
        [t * (x1 - x0) + x0,
            t * (y1 - y0) + y0],
        [x1,
            y1] // yy1
    ];
}
/**
 * Returns a bezier curve that starts at `t === 0` and ends at the given `t`
 * parameter.
 *
 * @param ps a lineer bezier curve (a line) given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1]]`
 * @param t the `t` parameter where the resultant bezier should end
 *
 * @internal
 */
function splitLeft1(ps, t) {
    // --------------------------------------------------------
    // const [[x0, y0], [x1, y1]] = ps; 
    const p0 = ps[0];
    const p1 = ps[1];
    const x0 = p0[0];
    const y0 = p0[1];
    const x1 = p1[0];
    const y1 = p1[1];
    // --------------------------------------------------------
    return [
        [x0,
            y0],
        [t * (x1 - x0) + x0,
            t * (y1 - y0) + y0] // yy1
    ];
}
/**
 * Returns a bezier curve that starts and ends at the given `t` parameters.
 *
 * @param ps a lineer bezier curve (a line) given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1]]`
 * @param tS the `t` parameter where the resultant bezier should start
 * @param tE the `t` parameter where the resultant bezier should end
 *
 * @internal
 */
function splitAtBoth1(ps, tS, tE) {
    // --------------------------------------------------------
    // const [[x0, y0], [x1, y1]] = ps; 
    const p0 = ps[0];
    const p1 = ps[1];
    const x0 = p0[0];
    const y0 = p0[1];
    const x1 = p1[0];
    const y1 = p1[1];
    // --------------------------------------------------------
    return [
        [tS * (x1 - x0) + x0,
            tS * (y1 - y0) + y0],
        [tE * (x1 - x0) + x0,
            tE * (y1 - y0) + y0] // yy1
    ];
}

//# sourceMappingURL=from-to-1.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/transformation/split/from-to.js



const from_to_fromTo3 = fromTo3;
const from_to_fromTo2 = fromTo2;
const from_to_fromTo1 = fromTo1;
/**
 * Returns a bezier curve that starts and ends at the given `t` parameters.
 *
 * @param ps an order 0,1,2 or 3 bezier curve given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 * @param tS the `t` parameter where the resultant bezier should start
 * @param tE the `t` parameter where the resultant bezier should end
 *
 * @doc mdx
 */
function from_to_fromTo(ps, tS, tE) {
    if (ps.length === 4) {
        return from_to_fromTo3(ps, tS, tE);
    }
    if (ps.length === 3) {
        return from_to_fromTo2(ps, tS, tE);
    }
    if (ps.length === 2) {
        return from_to_fromTo1(ps, tS, tE);
    }
    if (ps.length === 1) {
        return ps;
    }
    throw new Error('The given bezier curve must be of order <= 3.');
}

//# sourceMappingURL=from-to.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/transformation/split/split-by-curvature.js


/**
 * Split the order 0,1,2 or 3 bezier curve into pieces (given as an array of
 * parameter `t` values) such that each piece is flat within a given tolerance
 * given by the `curviness` function.
 *
 * @param ps an order 0,1,2 or 3 bezier curve given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 * @param maxCurviness optional; defaults to `0.4 radians`; maximum curviness
 * (must be > 0) as calculated using
 * the `curviness` function (which measures the total angle in radians formed
 * by the vectors formed by the ordered control points)
 * @param minTSpan optional; defaults to `2**-16`; the minimum `t` span that
 * can be returned for a bezier piece; necessary for cubics otherwise a curve
 * with a cusp would cause an infinite loop
 *
 * @doc mdx
 */
function splitByCurvature(ps, maxCurviness = 0.4, minTSpan = 2 ** -16) {
    let head = { r: [0, 1] };
    let n = head;
    while (n !== undefined) {
        const ts_ = n.r;
        const ps_ = from_to_fromTo(ps, ts_[0], ts_[1]);
        const curviness_ = curviness(ps_);
        if (curviness_ <= maxCurviness || ts_[1] - ts_[0] <= minTSpan) {
            n = n.next;
            continue;
        }
        const t = (ts_[0] + ts_[1]) / 2;
        const L = [ts_[0], t];
        const R = [t, ts_[1]];
        n.r = L;
        n.next = { r: R, next: n.next };
    }
    n = head;
    const ts = [];
    while (n !== undefined) {
        ts.push(n.r[0]);
        if (n.next === undefined) {
            ts.push(n.r[1]);
        }
        n = n.next;
    }
    return ts;
}

//# sourceMappingURL=split-by-curvature.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/global-properties/classification/is-self-overlapping.js

/**
 * Returns `true` if the given bezier has all control points collinear and
 * it is self-overlapping, i.e. if it intersects itself at an infinite number
 * of points.
 *
 * * a bezier curve can only intersect itself at an infinite number of
 * points if its locus is a 'self-overlapping line'.
 *
 * @param ps an order 0,1,2 or 3 bezier curve given as an array of its control
 * points, e.g. `[[1,2],[3,4],[5,6],[7,8]]`
 *
 * @doc mdx
 */
function isSelfOverlapping(ps) {
    if (!isCollinear(ps)) {
        return false;
    }
    // Check if control points are non-strict monotone
    const xs = ps.map(p => p[0]);
    const ys = ps.map(p => p[1]);
    return !(isMonotone(xs) && isMonotone(ys));
}
/**
 * Returns true if the given array of numbers are non-strict monotone increasing.
 * @param xs an array of numbers
 *
 * @internal
 */
function isMonotoneIncreasing(xs) {
    for (let i = 1; i < xs.length; i++) {
        if (xs[i - 1] > xs[i]) {
            return false;
        }
    }
    return true;
}
/**
 * Returns true if the given array of numbers are non-strict monotone decreasing.
 * @param xs an array of numbers
 *
 * @internal
 */
function isMonotoneDecreasing(xs) {
    for (let i = 1; i < xs.length; i++) {
        if (xs[i - 1] < xs[i]) {
            return false;
        }
    }
    return true;
}
/**
 * @param xs
 *
 * @internal
 */
function isMonotone(xs) {
    return isMonotoneIncreasing(xs) || isMonotoneDecreasing(xs);
}

//# sourceMappingURL=is-self-overlapping.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/global-properties/get-bending-energy.js





const { sqrt } = Math;
/**
 * Returns an accurate approximation of the bending energy of the given bezier
 * curve.
 *
 * @param maxCurviness defaults to 1.125
 * @param gaussOrder defaults to 4
 * @param ps a cubic bezier curve given by an ordered array of its
 * control points, e.g. `[[0,0],[1,1],[2,1],[2,0]]`
 *
 * @doc mdx
 */
function getBendingEnergy(ps, maxCurviness = 1.125, gaussOrder = 4) {
    // return getBendingEnergyByGauss(ps, maxCurviness, gaussOrder);
    const c = classify(ps);
    if (c.collinear) {
        if (isSelfOverlapping(ps)) {
            return Number.POSITIVE_INFINITY;
        }
        return 0;
    }
    if (c.realOrder === 3) {
        if (c.nodeType === 'cusp') {
            return Number.POSITIVE_INFINITY;
        }
        // it is a well behaved 'acnode', 'crunode' or 'explicit'
        return getBendingEnergyByGauss(κi3, ps, maxCurviness, gaussOrder);
    }
    if (c.realOrder === 2) {
        // it is a well behaved 'quadratic'
        return getBendingEnergyByGauss(κi2, ps, maxCurviness, gaussOrder);
    }
    return 0;
}
/**
 * Returns an estimate of the bending energy of the given bezier curve.
 *
 * @param ps
 * @param maxCurviness maximum curviness (must be > 0) as calculated using the
 * curviness function (which measures the total angle in radians formed by the
 * vectors formed by the ordered control points)
 * @param gaussOrder
 */
function getBendingEnergyByGauss(κi, ps, maxCurviness, gaussOrder) {
    const ts = splitByCurvature(ps, maxCurviness);
    let total = 0;
    for (let i = 0; i < ts.length - 1; i++) {
        const tS = ts[i];
        const tE = ts[i + 1];
        const ps_ = from_to_fromTo(ps, tS, tE);
        total += gaussQuadrature(κi(ps_), [0, 1], gaussOrder);
    }
    return total;
}
/**
 * * For insight: https://faculty.sites.iastate.edu/jia/files/inline-files/curvature.pdf
 * * cubic version
 *
 * @param ps
 */
function κi3(ps) {
    /*
    return (t: number): number => {
        const [dx, dy] = tangent(ps, t);
        const [ddx, ddy] = evaluate2ndDerivative(ps, t);

        const a = (dx*ddy - dy*ddx)**2;
        const b = sqrt((dx*dx + dy*dy)**5);

        return a/b;
    }
    */
    const p0 = ps[0];
    const p1 = ps[1];
    const p2 = ps[2];
    const p3 = ps[3];
    const x0 = p0[0];
    const y0 = p0[1];
    const x1 = p1[0];
    const y1 = p1[1];
    const x2 = p2[0];
    const y2 = p2[1];
    const x3 = p3[0];
    const y3 = p3[1];
    const A = ((x3 - x0) + 3 * (x1 - x2));
    const B = ((y3 - y0) + 3 * (y1 - y2));
    const C = ((x2 + x0) - 2 * x1);
    const D = ((y2 + y0) - 2 * y1);
    return (t) => {
        const tt = t * t;
        const dx_3 = tt * A + 2 * t * C + (x1 - x0);
        const dy_3 = tt * B + 2 * t * D + (y1 - y0);
        const ddx_6 = t * A + C;
        const ddy_6 = t * B + D;
        const a = dx_3 * ddy_6 - dy_3 * ddx_6;
        const c = dx_3 * dx_3 + dy_3 * dy_3;
        const b = c * c * sqrt(c);
        return (4 / 3) * a * a / b;
    };
}
/**
 * * For insight: https://faculty.sites.iastate.edu/jia/files/inline-files/curvature.pdf
 * * quadratic version
 *
 * @param ps
 */
function κi2(ps) {
    /*
    return (t: number): number => {
        const [dx, dy] = tangent(ps, t);
        const [ddx, ddy] = evaluate2ndDerivative(ps, t);

        const a = (dx*ddy - dy*ddx)**2;
        const b = sqrt((dx*dx + dy*dy)**5);

        return a/b;
    }
    */
    const p0 = ps[0];
    const p1 = ps[1];
    const p2 = ps[2];
    const x0 = p0[0];
    const y0 = p0[1];
    const x1 = p1[0];
    const y1 = p1[1];
    const x2 = p2[0];
    const y2 = p2[1];
    const A = x2 - 2 * x1 + x0;
    const B = y2 - 2 * y1 + y0;
    return (t) => {
        const dx = A * t + (x1 - x0);
        const dy = B * t + (y1 - y0);
        const ddx = A;
        const ddy = B;
        const a = dx * ddy - dy * ddx;
        const c = dx * dx + dy * dy;
        const b = c * c * sqrt(c);
        return 0.5 * a * a / b;
    };
}

//# sourceMappingURL=get-bending-energy.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/from-power-basis/from-power-basis.js
/**
 * Returns the Bernstein basis representation (i.e. control points) of a line,
 * quadratic or cubic bezier given its power bases.
 *
 * * **non-exact**: due to floating-point round-off (see implementation to
 * understand under what conditions the result would be exact)
 *
 * @param cs An order 1,2 or 3 parametric curve in power bases with the
 * x-coordinate coefficients given first (as an array representing the
 * polynomial from highest to lowest power coefficient), e.g. `[[1,2,3,4],
 * [5,6,7,8]]` represents a cubic parametric curve given by
 * `x(t) = t^3 + 2t^2 + 3t^3 + 4t^4, y(t) = 5t^3 + 6t^2 + 7t + 8`.
 *
 * @doc
 */
function fromPowerBasis(cs) {
    const len = cs[0].length;
    if (len === 4) {
        const [[a3, a2, a1, a0], [b3, b2, b1, b0]] = cs;
        return [
            [a0,
                b0],
            [a0 + a1 / 3,
                b0 + b1 / 3],
            [a0 + 2 * a1 / 3 + a2 / 3,
                b0 + 2 * b1 / 3 + b2 / 3],
            [a0 + a1 + a2 + a3,
                b0 + b1 + b2 + b3]
        ];
    }
    if (len === 3) {
        const [[a2, a1, a0], [b2, b1, b0]] = cs;
        return [
            [a0,
                b0],
            [a0 + a1 / 2,
                b0 + b1 / 2],
            [a0 + a1 + a2,
                b0 + b1 + b2]
        ];
    }
    if (len === 2) {
        const [[a1, a0], [b1, b0]] = cs;
        return [
            [a0,
                b0],
            [a0 + a1,
                b0 + b1]
        ];
    }
    if (len === 1) {
        const [[a0], [b0]] = cs;
        return [
            [a0,
                b0]
        ];
    }
    throw new Error('The given bezier curve must be of order <= 3.');
}

//# sourceMappingURL=from-power-basis.js.map
;// CONCATENATED MODULE: ./node_modules/flo-bezier3/node/angles-and-speeds/bezier-by-angles-and-speeds/cubic-from-angles-and-speeds.js


const { cos: cubic_from_angles_and_speeds_cos, sin: cubic_from_angles_and_speeds_sin } = Math;
/**
 * Returns a cubic bezier curve (given by its control points) with the given
 * angles-and-speeds parameters.
 *
 * @param α initial tangent angle in radians
 * @param β terminal tangent angle in radians
 * @param s0 inital speed
 * @param s1 terminal speed
 * @param L distance between initial and final point (cannot be 0)
 * @param rot rotation of entire curve
 * @param p initial position offset
 */
function cubicFromAnglesAndSpeeds(anglesAndSpeeds) {
    const { α, β, s0, s1, L, rot, p } = anglesAndSpeeds;
    const x3 = L * (-2 + s0 * cubic_from_angles_and_speeds_cos(α) + s1 * cubic_from_angles_and_speeds_cos(β));
    const x2 = L * (3 - 2 * s0 * cubic_from_angles_and_speeds_cos(α) - s1 * cubic_from_angles_and_speeds_cos(β));
    const x1 = L * (s0 * cubic_from_angles_and_speeds_cos(α));
    const x0 = L * (0);
    const y3 = L * (s0 * cubic_from_angles_and_speeds_sin(α) + s1 * cubic_from_angles_and_speeds_sin(β));
    const y2 = L * (-2 * s0 * cubic_from_angles_and_speeds_sin(α) - s1 * cubic_from_angles_and_speeds_sin(β));
    const y1 = L * (s0 * cubic_from_angles_and_speeds_sin(α));
    const y0 = L * (0);
    return fromPowerBasis([[x3, x2, x1, x0], [y3, y2, y1, y0]])
        .map(rotate(cubic_from_angles_and_speeds_sin(rot), cubic_from_angles_and_speeds_cos(rot)))
        .map(translate(p));
}

//# sourceMappingURL=cubic-from-angles-and-speeds.js.map
;// CONCATENATED MODULE: ./src/get-e-alpha.ts


/**
 * Returns the bending energy of the given curve (within info) with the `α`
 * angle replaced with the given one.
 */
function getEα(info) {
    return (α) => {
        const [_ps, ps_] = getPssByα(α, info);
        const e_ = getBendingEnergy(ps_);
        const _e = getBendingEnergy(_ps);
        return e_ + _e;
    };
}
/**
 * Returns the points of the given curve (within info) with the `α`
 * angle replaced with the given one.
 */
function getPssByα(α, info) {
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


;// CONCATENATED MODULE: ./src/consts.ts
const { PI: 𝜋 } = Math;
//========================================================================
// const Ω = 𝜋/2;  // suggested value by the research paper but it causes ugly-ish 'heads'
// [A CONSTRUCTIVE FRAMEWORK FOR MINIMAL ENERGY PLANAR CURVES by Michael J. Johnson & Hakim S. Johnson](https://www.sciencedirect.com/science/article/abs/pii/S0096300315015490)
const Ω = 𝜋;
//========================================================================
const INITIAL_SPAN_FRAC_FOR_MINI_ALPHAS = 0.0625 * (2 ** 0);
const [initialS0, initialS1] = [1, 1];
const miniAlphaLoops = 4;


;// CONCATENATED MODULE: ./src/get-stencil-angle.ts


/**
 * Returns the stencil angle between curve interfaces.
 */
function getStencilAngle(p0, p1, p2) {
    return -getInterfaceRotation(fromTo(p0, p1), fromTo(p1, p2));
}


;// CONCATENATED MODULE: ./src/get-infos/get-infos.ts





const { min, max, PI: get_infos_, atan2: get_infos_atan2, sin: get_infos_sin, cos: get_infos_cos } = Math;
/**
 * Returns additional information for each curve.
 *
 * @param hull
 */
function getInfos(hull) {
    const len = hull.length;
    const infos = [];
    for (let i = 0; i < len; i++) {
        infos.push({});
    }
    for (let i = 0; i < len; i++) {
        const _i = (i - 1 + len) % len;
        const i_ = (i + 1) % len;
        const _info = infos[_i];
        const info = infos[i];
        const info_ = infos[i_];
        info._info = _info;
        info.info_ = info_;
        const _p = hull[_i];
        const p = hull[i];
        const p_ = hull[i_];
        const ϕ = getStencilAngle(_p, p, p_);
        info.ϕ = ϕ;
        const range = [max(-Ω, ϕ - Ω), min(+Ω, ϕ + Ω)];
        info.range = range;
        // move ps to origin
        const po = translate(reverse(p))(p_);
        const [x, y] = [po[0], po[1]];
        const rot = get_infos_atan2(y, x);
        const pof = rotate(get_infos_sin(-rot), get_infos_cos(-rot))(po);
        const L = pof[0];
        info.L = L;
        info.rot = rot;
        info.p = p;
    }
    for (let i = 0; i < len; i++) {
        const info = infos[i];
        const { ϕ, info_, p, L, rot } = info;
        const ϕ_ = info_.ϕ;
        const α = ϕ / 2;
        const $ps = { α, β: -ϕ_ / 2, p, L, rot, s0: initialS0, s1: initialS1 };
        const _ps = cubicFromAnglesAndSpeeds($ps);
        info.ps = [p, _ps[1], _ps[2], info_.p];
        info.$ps = $ps;
        info.l = α - get_infos_ * INITIAL_SPAN_FRAC_FOR_MINI_ALPHAS;
        info.m = α;
        info.r = α + get_infos_ * INITIAL_SPAN_FRAC_FOR_MINI_ALPHAS;
    }
    return infos;
}


;// CONCATENATED MODULE: ./src/cubic-beziers-through-points.ts




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
function cubicBeziersThroughPoints(points) {
    const infos = getInfos(points);
    const len = infos.length;
    for (let j = 0; j < miniAlphaLoops; j++) {
        for (let i = 0; i < len; i++) {
            const info = infos[i];
            const _info = info._info;
            const getE_ = getEα(info);
            let halfSpan;
            let { l, m, r } = info;
            let L = getE_(l);
            let M = getE_(m);
            let R = getE_(r);
            // 1d pattern search
            while (true) {
                ({ l, m, r } = info);
                halfSpan = (r - l) / 2;
                if ((L >= M && M <= R)) {
                    info.l = m - halfSpan / 2;
                    info.r = m + halfSpan / 2;
                    break;
                }
                else if ((L <= M && M <= R)) {
                    info.l = l - halfSpan;
                    info.m = l;
                    info.r = m;
                    R = M;
                    M = L;
                    L = getE_(info.l);
                }
                else if ((L >= M && M >= R)) {
                    info.l = m;
                    info.m = r;
                    info.r = r + halfSpan;
                    L = M;
                    M = R;
                    R = getE_(info.r);
                }
                else if ((L <= M && M >= R)) {
                    info.l = l - halfSpan;
                    info.m = l;
                    info.r = m;
                    R = M;
                    M = L;
                    L = getE_(info.l);
                }
            }
            const α = info.m;
            const [_ps, ps_] = getPssByα(α, info);
            info.ps = ps_;
            info.$ps = cubicToAnglesAndSpeeds(ps_);
            _info.ps = _ps;
            _info.$ps = cubicToAnglesAndSpeeds(_ps);
        }
    }
    const cubics = infos.map(info => info.ps);
    return cubics;
}


;// CONCATENATED MODULE: ./src/index.ts



var __webpack_exports__cubicBeziersThroughPoints = __webpack_exports__.j;
export { __webpack_exports__cubicBeziersThroughPoints as cubicBeziersThroughPoints };
