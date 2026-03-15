/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { Feature } from '../Feature';

let id = 0;

export class ExitAnimationFeature extends Feature<unknown> {
	private id: number = id++;
	private hasRegistered: boolean = false;
	private deregister?: () => void;
	private prevIsPresent?: boolean;

	update() {
		if (!this.node.presenceContext) {
			return;
		}

		// Late registration: if we couldn't register in mount() because context wasn't ready,
		// register now when context becomes available
		if (!this.hasRegistered) {
			const { register } = this.node.presenceContext;
			if (register) {
				this.deregister = register(this.id);
				this.hasRegistered = true;
			}
		}

		const { isPresent, measurePop } = this.node.presenceContext;
		const prevIsPresent = this.prevIsPresent;
		this.prevIsPresent = isPresent;


		if (!this.node.animationState || prevIsPresent === undefined || isPresent === prevIsPresent) {
			return;
		}

		const exitAnimation = this.node.animationState.setActive('exit', !isPresent);

		if (this.node.presenceContext.onExitComplete && !isPresent && measurePop) {
			/**
			 * popLayout: snapshot ALL sibling positions BEFORE injecting position:absolute,
			 * then call didUpdate() AFTER so the FLIP system sees the shifted positions.
			 *
			 * 1. willUpdate() on every node — records each node's current layout box while
			 *    the exiting element is still in normal document flow.
			 * 2. measurePop() — injects `position:absolute` on the exiting element,
			 *    which removes it from flow so siblings shift to their new positions.
			 * 3. didUpdate() — re-measures all nodes, computes the delta from the
			 *    snapshot, and kicks off FLIP animations on the siblings.
			 *
			 * Calling root.willUpdate() alone only snapshots the root node; we must
			 * iterate root.nodes to snapshot every layout-animated sibling.
			 */
			this.node.projection?.root?.nodes?.forEach((node) => { node.willUpdate(); });
			measurePop(this.node.current as HTMLElement | SVGElement);
			this.node.projection?.root?.didUpdate();
			exitAnimation.then(() => {
				this.node.presenceContext?.onExitComplete?.(this.id);
			});
		} else if (this.node.presenceContext.onExitComplete && !isPresent) {
			exitAnimation.then(() => {
				this.node.presenceContext?.onExitComplete?.(this.id);
			});
		}
	}

	mount() {
		const { register } = this.node.presenceContext || {};

		if (register) {
			this.deregister = register(this.id);
			this.hasRegistered = true;
		}
	}

	unmount() {
		this.deregister?.();
	}
}
