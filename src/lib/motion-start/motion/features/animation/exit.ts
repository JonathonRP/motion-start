/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { Feature } from '../Feature';

let id = 0;

export class ExitAnimationFeature extends Feature<unknown> {
	private id: number = id++;

	update() {
		console.log('update');
		if (!this.node.presenceContext) return;

		const { isPresent, onExitComplete } = this.node.presenceContext;
		const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};

		console.log(isPresent, prevIsPresent);

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
