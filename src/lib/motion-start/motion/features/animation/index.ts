/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { tick } from 'svelte';
import { isAnimationControls } from '../../../animation/utils/is-animation-controls';
import { createAnimationState } from '../../../render/utils/animation-state';
import type { VisualElement } from '../../../render/VisualElement';
import { Feature } from '../Feature';

export class AnimationFeature extends Feature<unknown> {
	unmountControls?: () => void;

	/**
	 * We dynamically generate the AnimationState manager as it contains a reference
	 * to the underlying animation library. We only want to load that if we load this,
	 * so people can optionally code split it out using the `m` component.
	 */
	constructor(node: VisualElement<unknown>) {
		super(node);
		node.animationState ||= createAnimationState(node);
	}

	updateAnimationControlsSubscription() {
		const { animate } = this.node.getProps();
		// TODO: maybe use $effect
		if (isAnimationControls(animate)) {
			tick().then(() => {
				this.unmountControls = animate.subscribe(this.node);
			});
		}
	}

	/**
	 * Subscribe any provided AnimationControls to the component's VisualElement
	 */
	mount() {
		this.updateAnimationControlsSubscription();
	}

	update() {
		const { animate } = this.node.getProps();
		const { animate: prevAnimate } = this.node.prevProps || {};
		if (animate !== prevAnimate) {
			this.updateAnimationControlsSubscription();
		}
	}

	unmount() {
		this.node.animationState!.reset();
		this.unmountControls?.();
	}
}
