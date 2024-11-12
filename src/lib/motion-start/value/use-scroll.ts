/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { ScrollMotionValues } from './scroll/utils';

/** 
based on framer-motion@4.1.16,
Copyright (c) 2018 Framer B.V.
*/
import { createScrollMotionValues, createScrollUpdater } from './scroll/utils';
import { addDomEvent } from '../events/use-dom-event';
import { tick } from 'svelte';

let viewportScrollValues: ScrollMotionValues;

function getViewportScrollOffsets() {
	return {
		xOffset: window.pageXOffset,
		yOffset: window.pageYOffset,
		xMaxOffset: document.body.clientWidth - window.innerWidth,
		yMaxOffset: document.body.clientHeight - window.innerHeight,
	};
}

let hasListeners = false;

function addEventListeners() {
	hasListeners = true;
	if (typeof window === 'undefined') return;

	const updateScrollValues = createScrollUpdater(viewportScrollValues, getViewportScrollOffsets);

	addDomEvent(window, 'scroll', updateScrollValues, { passive: true });
	addDomEvent(window, 'resize', updateScrollValues);
}

/**
 * Returns MotionValues that update when the viewport scrolls:
 *
 * - `scrollX` — Horizontal scroll distance in pixels.
 * - `scrollY` — Vertical scroll distance in pixels.
 * - `scrollXProgress` — Horizontal scroll progress between `0` and `1`.
 * - `scrollYProgress` — Vertical scroll progress between `0` and `1`.
 *
 * **Warning:** Setting `body` or `html` to `height: 100%` or similar will break the `Progress`
 * values as this breaks the browser's capability to accurately measure the page length.
 *
 * @motion
 *
 * ```jsx
 * export const MyComponent = () => {
 *   const { scrollYProgress } = useViewportScroll()
 *   return <MotionDiv style={{ scaleX: scrollYProgress }} />
 * }
 * ```
 *
 * @public
 */
export function useViewportScroll() {
	/**
	 * Lazy-initialise the viewport scroll values
	 */
	if (!viewportScrollValues) {
		viewportScrollValues = createScrollMotionValues();
	}

	tick().then((_) => {
		!hasListeners && addEventListeners();
	});

	return viewportScrollValues as ScrollMotionValues;
}

/**
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { ScrollMotionValues } from './utils';

/** 
based on framer-motion@4.1.16,
Copyright (c) 2018 Framer B.V.
*/
import { createScrollMotionValues, createScrollUpdater } from './utils';
import { addDomEvent } from '../../events/use-dom-event';

const getElementScrollOffsets =
	(element: {
		scrollLeft: any;
		scrollTop: any;
		scrollWidth: number;
		offsetWidth: number;
		scrollHeight: number;
		offsetHeight: number;
	}) =>
	() => {
		return {
			xOffset: element.scrollLeft,
			yOffset: element.scrollTop,
			xMaxOffset: element.scrollWidth - element.offsetWidth,
			yMaxOffset: element.scrollHeight - element.offsetHeight,
		};
	};

export const useElementScroll = (ref: { current: HTMLElement | null }) => {
	const values = <any>{};

	const setScroll = async () => {
		if (typeof window === 'undefined') return () => {};

		let times = 10;
		while ((!ref || !ref.current) && !values.ref) {
			if (times-- < 1) {
				return () => {};
			}

			await new Promise<void>((r) => setTimeout(() => r(), 200));
		}
		const element = ref && ref.current ? ref : values.ref;

		const updateScrollValues = createScrollUpdater(values, getElementScrollOffsets(element));

		const scrollListener = addDomEvent(element, 'scroll', updateScrollValues, { passive: true });

		const resizeListener = addDomEvent(element, 'resize', updateScrollValues);
		return () => {
			scrollListener && scrollListener();
			resizeListener && resizeListener();
		};
	};
	Object.assign(values, createScrollMotionValues(setScroll));

	return values as ScrollMotionValues;
};

//export { default as UseElementScroll } from './UseElementScroll.svelte';

import type { RefObject } from '../utils/safe-react-types';
import { motionValue } from '.';
import { useConstant } from '../utils/use-constant';
import { useEffect } from 'react';
import { useIsomorphicLayoutEffect } from '../three-entry';
import { warning } from '../utils/errors';
import { scroll } from '../render/dom/scroll';
import type { ScrollInfoOptions } from '../render/dom/scroll/types';

export interface UseScrollOptions extends Omit<ScrollInfoOptions, 'container' | 'target'> {
	container?: RefObject<HTMLElement>;
	target?: RefObject<HTMLElement>;
	layoutEffect?: boolean;
}

function refWarning(name: string, ref?: RefObject<HTMLElement>) {
	warning(
		Boolean(!ref || ref.current),
		`You have defined a ${name} options but the provided ref is not yet hydrated, probably because it's defined higher up the tree. Try calling useScroll() in the same component as the ref, or setting its \`layoutEffect: false\` option.`
	);
}

export function useScroll({ container, target, layoutEffect = true, ...options }: UseScrollOptions = {}) {
	const values = useConstant(createScrollMotionValues);

	const useLifecycleEffect = layoutEffect ? useIsomorphicLayoutEffect : useEffect;

	useLifecycleEffect(() => {
		refWarning('target', target);
		refWarning('container', container);

		return scroll(
			(_progress, { x, y }) => {
				values.scrollX.set(x.current);
				values.scrollXProgress.set(x.progress);
				values.scrollY.set(y.current);
				values.scrollYProgress.set(y.progress);
			},
			{
				...options,
				container: container?.current || undefined,
				target: target?.current || undefined,
			}
		);
	}, [container, target, JSON.stringify(options.offset)]);

	return values;
}
