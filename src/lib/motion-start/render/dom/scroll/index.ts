/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { ScrollOptions, OnScroll, OnScrollWithInfo } from './types';
import { scrollInfo } from './track';
import type { GroupPlaybackControls } from '../../../animation/GroupPlaybackControls.svelte';
import { type ProgressTimeline, observeTimeline } from './observe.svelte';
import { supportsScrollTimeline } from './supports';

declare class ScrollTimeline implements ProgressTimeline {
	constructor(options: ScrollOptions);

	currentTime: null | { value: number };

	cancel?: VoidFunction;
}

declare global {
	interface Window {
		ScrollTimeline: ScrollTimeline;
	}
}

function scrollTimelineFallback({ source, container, axis = 'y' }: ScrollOptions) {
	// Support legacy source argument. Deprecate later.
	if (source) container = source;

	// ScrollTimeline records progress as a percentage CSSUnitValue
	const currentTime = { value: 0 };

	const cancel = scrollInfo(
		(info) => {
			currentTime.value = info[axis].progress * 100;
		},
		{ container, axis }
	);

	return { currentTime, cancel };
}

const timelineCache = new Map<Element, { x?: ScrollTimeline; y?: ScrollTimeline }>();

function getTimeline({ source, container = document.documentElement, axis = 'y' }: ScrollOptions = {}): ScrollTimeline {
	// Support legacy source argument. Deprecate later.
	if (source) container = source;

	if (!timelineCache.has(container)) {
		timelineCache.set(container, {});
	}

	const elementCache = timelineCache.get(container)!;

	if (!elementCache[axis]) {
		elementCache[axis] = supportsScrollTimeline()
			? new ScrollTimeline({ source: container, axis })
			: scrollTimelineFallback({ source: container, axis });
	}

	return elementCache[axis]!;
}

/**
 * If the onScroll function has two arguments, it's expecting
 * more specific information about the scroll from scrollInfo.
 */
function isOnScrollWithInfo(onScroll: OnScroll): onScroll is OnScrollWithInfo {
	return onScroll.length === 2;
}

/**
 * Currently, we only support element tracking with `scrollInfo`, though in
 * the future we can also offer ViewTimeline support.
 */
function needsElementTracking(options?: ScrollOptions) {
	return options && (options.target || options.offset);
}

function scrollFunction(onScroll: OnScroll, options: ScrollOptions) {
	if (isOnScrollWithInfo(onScroll) || needsElementTracking(options)) {
		return scrollInfo((info) => {
			onScroll(info[options.axis!].progress, info);
		}, options);
	} else {
		return observeTimeline(onScroll, getTimeline(options));
	}
}

function scrollAnimation(animation: GroupPlaybackControls, options: ScrollOptions) {
	if (needsElementTracking(options)) {
		animation.pause();
		return scrollInfo((info) => {
			animation.time = animation.duration * info[options.axis!].progress;
		}, options);
	} else {
		const timeline = getTimeline(options);

		return animation.attachTimeline(timeline, (valueAnimation) => {
			valueAnimation.pause();

			return observeTimeline((progress) => {
				valueAnimation.time = valueAnimation.duration * progress;
			}, timeline);
		});
	}
}

export function scroll(
	onScroll: OnScroll | GroupPlaybackControls,
	{ axis = 'y', ...options }: ScrollOptions = {}
): VoidFunction {
	const optionsWithDefaults = { axis, ...options };

	return typeof onScroll === 'function'
		? scrollFunction(onScroll, optionsWithDefaults)
		: scrollAnimation(onScroll, optionsWithDefaults);
}
