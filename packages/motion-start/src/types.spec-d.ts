import type { Target, TargetAndTransition } from './types.js';

describe('animation target types', () => {
	it('accepts numeric CSS lengths and SVG geometry keyframes', () => {
		assertType<Target>({ width: 100 });
		assertType<TargetAndTransition>({ r: [30, 33] });
	});
});
