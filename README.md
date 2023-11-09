Bug reports, pull requests and ⭐⭐⭐⭐⭐s are welcome and appreciated!

## Overview

This is a simple library exporting a single function, `cubicBeziersThroughPoints`,
to fit fair (bending energy minimizing) cubic bezier curves through a set of
given ordered points in the plane.

Note that it is assumed the first and last points are connected (implicitly) so
that it forms a loop. This is not a technical requirement though and the code
can easily be modified to accomodate open endpoints as well.

![The pink curves between yellow points are the calculated cubic bezier curves](https://github.com/FlorisSteenkamp/Cubic-Beziers-Through-Points/blob/master/cubic-beziers-through-points.png)


## Features
* **fast** (~8ms to fit 100 points)
* **based on solid research**; see [A CONSTRUCTIVE FRAMEWORK FOR MINIMAL ENERGY PLANAR CURVES by Michael J. Johnson & Hakim S. Johnson](https://www.sciencedirect.com/science/article/abs/pii/S0096300315015490)
* resulting curves look natural and does not contain bezier curves with loops

## Why?
I read [this](https://medium.com/towards-data-science/b%C3%A9zier-interpolation-8033e9a262c2) article on Medium
and implemented it for closed loops (as suggested in the comments by [solving a Tridiagonal Matrix](https://en.wikipedia.org/wiki/Tridiagonal_matrix_algorithm#Method)).

The result was a very smooth curve and is actually **the** unique algebraically C² smooth piecewise cubic bezier curve
that interpolates the given set of points and is certainly useful in many applications. However, the problem was
that it often resulted in curves with loops (but I believe only if the points are not too well-behaved, i.e. when certain angle
conditions are not met; please see the research paper quoted above for further details).

This library solves the above 'bezier-curves-with-loops' problem by minimizing the bending energy of the
bezier curves under the constraint that the 'terminal speeds' equal exactly 1.

This library now also exports the function `cubicBeziersThroughPoints_C2`.

## Installation
```cli
npm install cubic-beziers-through-points
```

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
It can be used in `Node.js` or in a browser.

## Usage

### Node.js
```js
import { cubicBeziersThroughPoints } from 'cubic-beziers-through-points';

// define some points (there must be at least 3!)
const points = [[6.4, 4.8], [15, 5], [1, 4], [10, 4]];
const cubics = cubicBeziersThroughPoints(points);
console.log(cubics);  //=> [[[6, 4],[8.982969047258369, 4.461526569343107]...]]]
// ...
```

### Browsers - directly, without a bundler, using the pre-bundled minified .js file

Please note that no tree shaking will take place in this case.

```html
<!doctype html>

<html lang="en">
<head>
    <script type="module">
        import { cubicBeziersThroughPoints } from './node_modules/cubic-beziers-through-points/browser/index.min.js';

        // define some points (there must be at least 3!)
        const points = [[6.4, 4.8], [15, 5], [1, 4], [10, 4]];
        const cubics = cubicBeziersThroughPoints(points);
        console.log(cubics);  //=> [[[6, 4],[8.982969047258369, 4.461526569343107]...]]]
        // ...
    </script>
</head>

<body>Check the console.</body>

</html>
```

### Bundlers (Webpack, Rollup, ...)

Tree shaking will take place if supported by your bundler.

Webpack will be taken as an example here. 

Since your webpack config file might still use `CommonJS` you must rename 
`webpack.config.js` to `webpack.config.cjs`.

If you are using TypeScript:

Since this is an [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
library you must use [resolve-typescript-plugin](https://www.npmjs.com/package/resolve-typescript-plugin) 
in your `webpack.config.cjs` file.

```cli
npm install --save-dev resolve-typescript-plugin
```

and follow the instructions given at [resolve-typescript-plugin](https://www.npmjs.com/package/resolve-typescript-plugin).

Additionally, follow this [guide](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#how-can-i-make-my-typescript-project-output-esm).


## License
Public Domain and/or WTFPL v. 4.0

DO WHAT THE FUCK YOU WANT TO PUBLIC LICENCE
Version 4.0, July 2019

[2023 Floris Steenkamp]

DO WHAT THE FUCK YOU WANT TO PUBLIC LICENCE
TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION, AND MODIFICATION

0. You just DO WHAT THE FUCK YOU WANT TO.