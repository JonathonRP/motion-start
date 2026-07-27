import { flushSync } from 'svelte';
import { describe, expect, test } from 'vitest';
import { frame } from '../../frameloop/frame.js';
import { type MotionValue, motionValue } from '../index.js';
import { useMotionTemplate } from '../use-motion-template.js';

describe('useMotionTemplate', () => {
	test('returns the combined MotionValue directly', async () => {
		let x!: MotionValue<number>;
		let value!: MotionValue<string>;
		const cleanup = $effect.root(() => {
			x = motionValue(10);
			value = useMotionTemplate`translateX(${x}px)`;
		});

		expect(value.get()).toBe('translateX(10px)');
		x.set(20);
		await new Promise<void>((resolve) => frame.postRender(() => resolve()));
		flushSync();
		expect(value.get()).toBe('translateX(20px)');
		cleanup();
	});
});
