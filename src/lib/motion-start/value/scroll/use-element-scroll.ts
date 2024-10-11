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
