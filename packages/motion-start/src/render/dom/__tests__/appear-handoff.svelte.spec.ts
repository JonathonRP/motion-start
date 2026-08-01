import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { frame } from '../../../frameloop/index.js';
import { visualElementStore } from '../../store.js';
import { createAppearBootstrap } from '../appear.js';
import type { AppearAnimationPayload } from '../appear-bootstrap.js';
import AppearHandoffFixture from './AppearHandoffFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	document.body.innerHTML = '';
	window.__MotionAppearAnimations?.clear();
	window.__MotionAppearComplete?.clear();
	window.__MotionAppearReady = undefined;
	window.__MotionAppearStartTime = undefined;
	window.MotionCancelOptimisedAnimation = undefined;
	window.MotionCheckAppearSync = undefined;
	window.MotionHandoffAnimation = undefined;
	window.MotionHandoffIsComplete = undefined;
	window.MotionHandoffMarkAsComplete = undefined;
	window.MotionHasOptimisedAnimation = undefined;
	window.MotionIsMounted = undefined;
});

describe('pre-hydration appear handoff', () => {
	it('provides the generated appear id to both the DOM and VisualElement', () => {
		instance = mount(AppearHandoffFixture, { target: document.body });
		flushSync();

		const element = document.querySelector('[data-testid="appear-handoff"]') as HTMLElement;
		const appearId = element.dataset.framerAppearId;

		expect(appearId).toBeTruthy();
		expect(visualElementStore.get(element)?.getProps()['data-framer-appear-id']).toBe(appearId);
	});

	it('hands parser-time animations to Motion using the generated id', async () => {
		let handoffComplete = false;
		const completionStateAtHandoff: boolean[] = [];
		const handoff = vi.fn(() => {
			completionStateAtHandoff.push(handoffComplete);
			return 100;
		});
		const markAsComplete = vi.fn(() => {
			handoffComplete = true;
		});
		window.MotionHandoffAnimation = handoff;
		window.MotionHandoffIsComplete = () => handoffComplete;
		window.MotionHandoffMarkAsComplete = markAsComplete;
		window.MotionHasOptimisedAnimation = () => true;

		instance = mount(AppearHandoffFixture, { target: document.body });
		flushSync();
		await Promise.resolve();
		await Promise.resolve();

		const element = document.querySelector('[data-testid="appear-handoff"]') as HTMLElement;
		const appearId = element.dataset.framerAppearId;

		expect(handoff).toHaveBeenCalledWith(appearId, 'opacity', frame);
		expect(handoff).toHaveBeenCalledWith(appearId, 'x', frame);
		expect(completionStateAtHandoff).toEqual([false, false]);
		expect(markAsComplete).toHaveBeenCalledOnce();
	});

	it('renders exactly one bootstrap script for the element', () => {
		instance = mount(AppearHandoffFixture, { target: document.body });
		flushSync();

		const element = document.querySelector('[data-testid="appear-handoff"]') as HTMLElement;
		const scripts = document.querySelectorAll('script[data-motion-appear]');

		expect(scripts).toHaveLength(1);
		expect(scripts[0]?.previousElementSibling).toBe(element);
	});

	it('serializes deterministically so the server and hydration markup agree', () => {
		const props = {
			appear: true,
			'data-framer-appear-id': 'motion-s1',
			initial: { opacity: 0, x: 20 },
			animate: { opacity: 1, x: 0 },
			transition: { type: 'tween', duration: 0.4 },
		} as const;
		const initial = { opacity: 0, x: 20 };

		const first = createAppearBootstrap({ ...props }, { ...initial });
		const second = createAppearBootstrap({ ...props }, { ...initial });

		expect(first).toBeTruthy();
		expect(second).toBe(first);
	});

	it('omits parser-time transforms when reduced motion is always enabled', () => {
		const html = createAppearBootstrap(
			{
				appear: true,
				'data-framer-appear-id': 'motion-s1',
				initial: { opacity: 0, x: 20 },
				animate: { opacity: 1, x: 0 },
				transition: { type: 'tween', duration: 0.4 },
			},
			{ opacity: 0, x: 20 },
			'always'
		);
		const data = html?.match(/data-motion-appear="([^"]+)"/)?.[1] ?? '';
		const payload = JSON.parse(decodeURIComponent(data)) as AppearAnimationPayload[];

		expect(payload.map((animation) => animation.name)).toEqual(['opacity']);
	});

	it('falls back for variant arrays whose transitions cannot be merged faithfully', () => {
		const html = createAppearBootstrap(
			{
				appear: true,
				'data-framer-appear-id': 'motion-s1',
				initial: 'hidden',
				animate: ['visible', 'active'],
				variants: {
					hidden: { opacity: 0, x: 20 },
					visible: { opacity: 1, transition: { type: 'tween', duration: 1 } },
					active: { x: 0 },
				},
				transition: { type: 'tween', duration: 0.2 },
			},
			{ opacity: 0, x: 20 }
		);

		expect(html).toBeUndefined();
	});
});
