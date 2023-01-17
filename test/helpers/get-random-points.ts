import { squares } from 'squares-rng';


function getRandomPoints(
        seed: number,
        n: number) {

    const seed_ = squares(seed);
    const points: number[][] = [];
    for (let i=0; i<n; i++) {
        points.push([
            squares(seed_ + (i*2) + 0),
            squares(seed_ + (i*2) + 1)
        ]);
    }

    return points;
}


export { getRandomPoints }
