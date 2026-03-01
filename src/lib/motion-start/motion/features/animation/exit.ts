/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { Feature } from '../Feature';

let id = 0;

export class ExitAnimationFeature extends Feature<unknown> {
	private id: number = id++;
	private hasRegistered: boolean = false;

	update() {
		if (!this.node.presenceContext) {
			return;
		}

		// Late registration: if we couldn't register in mount() because context wasn't ready,
		// register now when context becomes available
		if (!this.hasRegistered) {
			const { register } = this.node.presenceContext;
			if (register) {
				this.unmount = register(this.id);
				this.hasRegistered = true;
			}
		}

		const { isPresent, onExitComplete, measurePop } = this.node.presenceContext;
		const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};

		if (!this.node.animationState || isPresent === prevIsPresent) {
			return;
		}

		const exitAnimation = this.node.animationState.setActive('exit', !isPresent);

		if (onExitComplete && !isPresent) {
			measurePop?.(this.node.current as HTMLElement | SVGElement);
			exitAnimation.then(() => onExitComplete(this.id));
		}
	}

	mount() {
		const { register } = this.node.presenceContext || {};

		if (register) {
			this.unmount = register(this.id);
			this.hasRegistered = true;
		}
	}

	unmount() {}
}
