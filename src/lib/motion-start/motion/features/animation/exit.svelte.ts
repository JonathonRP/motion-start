/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { Feature } from '../Feature.svelte';

let id = 0;

export class ExitAnimationFeature extends Feature<unknown> {
	private id: number = id++;

	update() {
		$inspect.trace();
		if (!this.node.presenceContext) return;

		const { isPresent, onExitComplete, id } = this.node.presenceContext;
		const { isPresent: prevIsPresent, id: prevId } = this.node.prevPresenceContext || {};

		$inspect(isPresent, prevIsPresent, id, prevId);

		if (!this.node.animationState || isPresent === prevIsPresent) {
			return;
		}

		const exitAnimation = this.node.animationState.setActive('exit', !isPresent);

		if (onExitComplete && !isPresent) {
			exitAnimation.then(() => onExitComplete(this.id));
		}
	}

	mount() {
		const { register } = this.node.presenceContext || {};

		if (register) {
			this.unmount = register(this.id);
		}
	}

	unmount() {}
}
