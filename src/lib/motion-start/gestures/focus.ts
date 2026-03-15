/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { Feature } from '../motion/features/Feature';

export class FocusGesture extends Feature<Element> {
	private isActive = false;

	private onFocus() {
		let isFocusVisible = false;

		/**
		 * If this element doesn't match focus-visible then don't
		 * apply whileHover. But, if matches throws that focus-visible
		 * is not a valid selector then in that browser outline styles will be applied
		 * to the element by default and we want to match that behaviour with whileFocus.
		 */
		try {
			isFocusVisible = (this.node.current as Element).matches(':focus-visible');
		} catch {
			isFocusVisible = true;
		}

		if (!isFocusVisible || !this.node.animationState) return;

		this.node.animationState.setActive('whileFocus', true);
		this.isActive = true;
	}

	private onBlur() {
		if (!this.isActive || !this.node.animationState) return;
		this.node.animationState.setActive('whileFocus', false);
		this.isActive = false;
	}

	mount() {
		this.registerHandler('onfocus', () => this.onFocus());
		this.registerHandler('onblur', () => this.onBlur());
	}

	unmount() {
		this.removeHandler('onfocus');
		this.removeHandler('onblur');
	}
}
