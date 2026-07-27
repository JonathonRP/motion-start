import { flushSync, mount, tick, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FeatureBundle } from '../../../motion/features/types.js';
import LazyMotionFixture from './LazyMotionFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	document.body.innerHTML = '';
});

describe('LazyMotion', () => {
	it('loads an asynchronous feature bundle and publishes its renderer', async () => {
		let resolveBundle!: (bundle: FeatureBundle) => void;
		const renderer = vi.fn() as unknown as FeatureBundle['renderer'];
		const features = vi.fn(
			() =>
				new Promise<FeatureBundle>((resolve) => {
					resolveBundle = resolve;
				}),
		);

		instance = mount(LazyMotionFixture, {
			target: document.body,
			props: { features },
		});
		flushSync();

		expect(features).toHaveBeenCalledTimes(1);
		expect(document.querySelector('[data-testid="lazy-renderer"]')?.textContent).toBe('pending');

		resolveBundle({ renderer });
		await tick();
		await tick();

		expect(document.querySelector('[data-testid="lazy-renderer"]')?.textContent).toBe('loaded');
	});

	it('ignores an asynchronous bundle that resolves after unmount', async () => {
		let resolveBundle!: (bundle: FeatureBundle) => void;
		const features = () =>
			new Promise<FeatureBundle>((resolve) => {
				resolveBundle = resolve;
			});

		instance = mount(LazyMotionFixture, {
			target: document.body,
			props: { features },
		});
		flushSync();

		await unmount(instance);
		instance = undefined;
		resolveBundle({ renderer: vi.fn() as unknown as FeatureBundle['renderer'] });
		await tick();

		expect(document.querySelector('[data-testid="lazy-renderer"]')).toBeNull();
	});
});
