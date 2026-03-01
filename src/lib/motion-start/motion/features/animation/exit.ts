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

		const { isPresent, onExitComplete } = this.node.presenceContext;
		const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};

		if (!this.node.animationState || isPresent === prevIsPresent) {
			return;
		}

		const exitAnimation = this.node.animationState.setActive('exit', !isPresent);

		if (onExitComplete && !isPresent) {
			// measurePop is called earlier in VisualElement.update() ($effect.pre,
			// before DOM patch) so the element is still in normal flow at that point.
			exitAnimation.then(() => {
				onExitComplete(this.id);
			});
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
