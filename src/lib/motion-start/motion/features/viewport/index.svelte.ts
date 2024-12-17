/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionProps } from '../../types';
import { Feature } from '../Feature.svelte';
import { observeIntersection } from './observers.svelte';

const thresholdNames = {
	some: 0,
	all: 1,
};

export class InViewFeature extends Feature<Element> {
	private hasEnteredView = false;

	private isInView = false;

	private startObserver() {
		this.unmount();

		const { viewport = {} } = this.node.getProps();
		const { root, margin: rootMargin, amount = 'some', once } = viewport;

		const options = {
			root: root ? root.current : undefined,
			rootMargin,
			threshold: typeof amount === 'number' ? amount : thresholdNames[amount],
		};

		const onIntersectionUpdate = (entry: IntersectionObserverEntry) => {
			const { isIntersecting } = entry;

			/**
			 * If there's been no change in the viewport state, early return.
			 */
			if (this.isInView === isIntersecting) return;

			this.isInView = isIntersecting;

			/**
			 * Handle hasEnteredView. If this is only meant to run once, and
			 * element isn't visible, early return. Otherwise set hasEnteredView to true.
			 */
			if (once && !isIntersecting && this.hasEnteredView) {
				return;
			} else if (isIntersecting) {
				this.hasEnteredView = true;
			}

			if (this.node.animationState) {
				this.node.animationState.setActive('whileInView', isIntersecting);
			}

			/**
			 * Use the latest committed props rather than the ones in scope
			 * when this observer is created
			 */
			const { onViewportEnter, onViewportLeave } = this.node.getProps();
			const callback = isIntersecting ? onViewportEnter : onViewportLeave;
			callback && callback(entry);
		};

		return observeIntersection(this.node.current!, options, onIntersectionUpdate);
	}

	mount() {
		this.startObserver();
	}

	update() {
		if (typeof IntersectionObserver === 'undefined') return;

		const { props, prevProps } = this.node;
		const hasOptionsChanged = (['amount', 'margin', 'root'] as const).some(hasViewportOptionChanged(props, prevProps));

		if (hasOptionsChanged) {
			this.startObserver();
		}
	}

	unmount() {}
}

function hasViewportOptionChanged({ viewport = {} }: MotionProps, { viewport: prevViewport = {} }: MotionProps = {}) {
	return (name: keyof typeof viewport) => viewport[name] !== prevViewport[name];
}
