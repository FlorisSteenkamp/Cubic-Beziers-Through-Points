import { expect, assert, use } from 'chai';
import { describe, it } from 'mocha';
import { cubicBeziersThroughPoints } from '../src/index.js';
import { nearly } from './helpers/chai-extend-nearly.js';
import { getRandomPoints } from './helpers/get-random-points.js';

use(nearly);


describe('cubicBeziersThroughPoints', function() {
	it('it should return minimum energy cubic bezier curves through the set of ordered points',
	function() {
		{
            const points = [[6, 4], [15, 5], [1, 4]];
            const r = cubicBeziersThroughPoints(points);
            expect(r).to.be.eql([
				[
					[6, 4],
					[8.982969047258369, 4.461526569343107],
					[14.535636233542062, 2.0174713071770607],
					[15, 5]
				],
			  	[
					[15, 5],
					[15.71975470412481, 9.622860808501496],
					[-1.0472045601713909, 8.206880361705375],
					[1, 4]
				],
			  	[
					[1, 4],
					[1.7292864281700377, 2.5013609228821085],
					[4.352930879386137, 3.745164583116761],
					[6, 4]
				] 
			]);
        }
        {
            const points = getRandomPoints(0,5);
            const r = cubicBeziersThroughPoints(points);
            expect(r).to.be.eql([
				[
					[146427211, 1411582374],
				   	[136485161.2821315, 2444724009.2703714],
				   	[2945549421.4177265, 2277395742.344048],
				   	[2632931865, 3262154975]
				],
				[
					[2632931865, 3262154975],
				    [2475316438.064057, 3758650593.041298],
				    [1380971131.4344594, 3582382666.077883],
				    [1313045850, 4098848229]
				],
				[
					[1313045850, 4098848229],
				    [1190924227.336791, 5027392230.022268],
				    [3780002128.0668902, 4548606966.193193],
				    [4088885195, 3664469588]
				],
				[
					[4088885195, 3664469588],
				    [4298929395.353357, 3063245537.588327],
				    [3988281449.887762, 2327988205.1808395],
				    [3611602311, 1814469217]
				],
				[
					[3611602311, 1814469217],
				    [2923824420.3004293, 876835644.9151025],
				    [157616838.89752293, 248796953.26952314],
				    [146427211, 1411582374]
				] 
			]);
        }
	});
});
