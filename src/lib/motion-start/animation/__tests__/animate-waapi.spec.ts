/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 * Ported from packages/framer-motion/src/animation/__tests__/animate-waapi.test.ts
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { animate } from '../animate';
import { stagger } from '../utils/stagger';
import { frame } from '../../frameloop';

// Skip in environments without DOM (e.g., Bun test runner)
const hasDom = typeof document !== 'undefined';

// Setup and restore WAAPI mocks
function setupWaapi() {
	if (typeof Element === 'undefined') return;

	/**
	 * This assignment prevents Vitest from complaining about
	 * .animate() being undefined (as it's unsupported in node/happy-dom).
	 */
	Element.prototype.animate = (() => {}) as any;

	vi.spyOn(Element.prototype, 'animate').mockImplementation(
		(_keyframes: Keyframe[] | null | PropertyIndexedKeyframes, _options: KeyframeAnimationOptions | number | undefined) => {
			const animation = {
				cancel: () => {},
				finished: {
					then: (resolve: VoidFunction) => {
						resolve();
						return Promise.resolve();
					},
				},
			} as any;

			setTimeout(() => {
				animation.onfinish?.();
			}, 0);

			return animation;
		}
	);
}

function restoreWaapi() {
	if (typeof Element === 'undefined') return;

	Element.prototype.animate = undefined as any;
	vi.restoreAllMocks();
}

const defaultOptions = {
	delay: -0,
	duration: 300,
	easing: 'ease-out',
	iterations: 1,
	direction: 'normal',
	fill: 'both',
};

async function nextFrame() {
	return new Promise<void>((resolve) => {
		frame.postRender(() => resolve());
	});
}

describe.skipIf(!hasDom)('animate() with WAAPI', () => {
	beforeEach(() => {
		setupWaapi();
	});

	afterEach(() => {
		restoreWaapi();
	});

	test('Can override transition options per-value', async () => {
		const a = document.createElement('div');

		animate(a, { opacity: [0, 1], transform: ['scale(0)', 'scale(1)'] }, { duration: 1, transform: { duration: 2 } });

		await nextFrame();

		expect(a.animate).toHaveBeenCalledWith(
			{ opacity: [0, 1], offset: undefined },
			{ ...defaultOptions, duration: 1000 }
		);

		expect(a.animate).toHaveBeenCalledWith(
			{ transform: ['scale(0)', 'scale(1)'], offset: undefined },
			{ ...defaultOptions, duration: 2000 }
		);
	});

	test('Applies stagger', async () => {
		const a = document.createElement('div');
		const b = document.createElement('div');
		const animation = animate([a, b], { opacity: [0.2, 0.5] }, { delay: stagger(0.2) });

		await animation.then(() => {
			expect(a.animate).toHaveBeenCalled();
			expect(a.animate).toHaveBeenCalledWith(
				{ opacity: [0.2, 0.5], offset: undefined },
				{
					delay: -0,
					duration: 300,
					easing: 'cubic-bezier(0.25, 0.1, 0.35, 1)',
					iterations: 1,
					direction: 'normal',
					fill: 'both',
				}
			);
			expect(b.animate).toHaveBeenCalled();
			expect(b.animate).toHaveBeenCalledWith(
				{ opacity: [0.2, 0.5], offset: undefined },
				{
					delay: 200,
					duration: 300,
					easing: 'cubic-bezier(0.25, 0.1, 0.35, 1)',
					iterations: 1,
					direction: 'normal',
					fill: 'both',
				}
			);
		});
	});

	test('Accepts ease array for multiple keyframes', async () => {
		const a = document.createElement('div');

		animate(a, { opacity: [0.2, 0.5] }, { ease: 'easeIn' });

		await nextFrame();

		expect(a.animate).toHaveBeenCalledWith(
			{ opacity: [0.2, 0.5], offset: undefined },
			{
				delay: -0,
				duration: 300,
				easing: 'ease-in',
				iterations: 1,
				direction: 'normal',
				fill: 'both',
			}
		);

		const b = document.createElement('div');

		animate(b, { opacity: [0.2, 0.5] }, { ease: ['easeIn'] });

		await nextFrame();

		expect(b.animate).toHaveBeenCalledWith(
			{ opacity: [0.2, 0.5], offset: undefined, easing: ['ease-in'] },
			{
				delay: -0,
				duration: 300,
				easing: 'linear',
				iterations: 1,
				direction: 'normal',
				fill: 'both',
			}
		);

		const c = document.createElement('div');

		animate(c, { opacity: [0.2, 0.5, 1] }, { times: [0.2, 0.3, 1], ease: [[0, 1, 2, 3], 'linear'] });

		await nextFrame();

		expect(c.animate).toHaveBeenCalledWith(
			{
				opacity: [0.2, 0.5, 1],
				offset: [0.2, 0.3, 1],
				easing: ['cubic-bezier(0, 1, 2, 3)', 'linear'],
			},
			{
				delay: -0,
				duration: 300,
				easing: 'linear',
				iterations: 1,
				direction: 'normal',
				fill: 'both',
			}
		);
	});

	test('Returns duration correctly', async () => {
		const a = document.createElement('div');

		const animation = animate(a, { opacity: 1 }, { duration: 2, opacity: { duration: 3 } });

		await nextFrame();

		expect(a.animate).toHaveBeenCalledWith(
			{
				opacity: [0, 1],
			},
			{
				delay: -0,
				duration: 3000,
				easing: 'ease-out',
				iterations: 1,
				direction: 'normal',
				fill: 'both',
			}
		);

		expect(animation.duration).toEqual(3);
	});

	test('Can accept timeline sequences', async () => {
		const a = document.createElement('div');
		const b = document.createElement('div');

		animate([[[a, b], { opacity: [0, 1], transform: ['scale(0)', 'scale(1)'] }, { duration: 1, transform: { duration: 2 } }]]);

		await nextFrame();

		expect(a.animate).toHaveBeenCalledWith(
			{
				opacity: [0, 1, 1],
				offset: [0, 0.5, 1],
				easing: ['ease-out', 'ease-out'],
			},
			{ ...defaultOptions, duration: 2000, easing: 'linear' }
		);

		expect(a.animate).toHaveBeenCalledWith(
			{
				transform: ['scale(0)', 'scale(1)'],
				offset: [0, 1],
				easing: ['ease-out', 'ease-out'],
			},
			{ ...defaultOptions, duration: 2000, easing: 'linear' }
		);

		expect(b.animate).toHaveBeenCalledWith(
			{
				opacity: [0, 1, 1],
				offset: [0, 0.5, 1],
				easing: ['ease-out', 'ease-out'],
			},
			{ ...defaultOptions, duration: 2000, easing: 'linear' }
		);

		expect(b.animate).toHaveBeenCalledWith(
			{
				transform: ['scale(0)', 'scale(1)'],
				offset: [0, 1],
				easing: ['ease-out', 'ease-out'],
			},
			{ ...defaultOptions, duration: 2000, easing: 'linear' }
		);
	});
});
