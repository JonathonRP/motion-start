import { describe, expect, it, vi } from 'vitest';
import { ExitAnimationFeature } from '../exit';

describe('ExitAnimationFeature', () => {
	it('does not retrigger exit when prevPresenceContext is already false', async () => {
		const setActive = vi.fn(() => Promise.resolve());
		const onExitComplete = vi.fn();
		const node = {
			presenceContext: { isPresent: false, onExitComplete },
			prevPresenceContext: { isPresent: false },
			animationState: { setActive },
		} as any;

		const feature = new ExitAnimationFeature(node);
		feature.update();

		expect(setActive).not.toHaveBeenCalled();
		expect(onExitComplete).not.toHaveBeenCalled();
	});

	it('starts exit once when presence changes from true to false', async () => {
		const exitAnimation = Promise.resolve();
		const setActive = vi.fn(() => exitAnimation);
		const onExitComplete = vi.fn();
		const node = {
			presenceContext: { isPresent: false, onExitComplete },
			prevPresenceContext: { isPresent: true },
			animationState: { setActive },
		} as any;

		const feature = new ExitAnimationFeature(node);
		feature.update();
		await exitAnimation;

		expect(setActive).toHaveBeenCalledWith('exit', true);
		expect(onExitComplete).toHaveBeenCalledTimes(1);
	});
});
