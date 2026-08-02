/**
 * Regression test for motion 11.16.6:
 * "More movement values like `height` and `top` are now blocked by reduced motion."
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { VisualElement } from '../../../render/VisualElement.svelte.js';
import { animateTarget } from '../visual-element-target.js';

const animateMotionValue = vi.hoisted(() => vi.fn(() => vi.fn()));

vi.mock('../motion-value.js', () => ({ animateMotionValue }));

function createVisualElement(shouldReduceMotion: boolean) {
	const values = new Map<string, { start: ReturnType<typeof vi.fn>; animation: undefined }>();

	return {
		shouldReduceMotion,
		latestValues: {},
		animationState: undefined,
		getDefaultTransition: () => undefined,
		getValue: (key: string) => {
			if (key === 'willChange') return undefined;

			if (!values.has(key)) {
				values.set(key, { start: vi.fn(), animation: undefined });
			}

			return values.get(key);
		},
	} as unknown as VisualElement<unknown>;
}

function transitionFor(key: string) {
	const call = animateMotionValue.mock.calls.find((args: unknown[]) => args[0] === key);
	expect(call, `expected an animation to be created for "${key}"`).toBeDefined();
	return (call as unknown as unknown[])[3];
}

describe('animateTarget with reduced motion', () => {
	beforeEach(() => {
		animateMotionValue.mockClear();
	});

	test('blocks transforms', () => {
		animateTarget(createVisualElement(true), { x: 100 });

		expect(transitionFor('x')).toEqual({ type: false });
	});

	test('blocks positional values like height, width, top and left', () => {
		animateTarget(createVisualElement(true), { height: 100, width: 100, top: 100, left: 100 });

		for (const key of ['height', 'width', 'top', 'left']) {
			expect(transitionFor(key)).toEqual({ type: false });
		}
	});

	test('does not block non-positional values like opacity', () => {
		animateTarget(createVisualElement(true), { opacity: 0 });

		expect(transitionFor('opacity')).not.toEqual({ type: false });
	});

	test('does not block anything when reduced motion is off', () => {
		animateTarget(createVisualElement(false), { height: 100, x: 100 });

		expect(transitionFor('height')).not.toEqual({ type: false });
		expect(transitionFor('x')).not.toEqual({ type: false });
	});
});
