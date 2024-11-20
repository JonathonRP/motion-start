/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { tick } from 'svelte';
import { isForcedMotionValue } from '../../motion/utils/is-forced-motion-value';
import type { MotionValue } from '../../value';
import { isMotionValue } from '../../value/utils/is-motion-value';
import type { MotionProps } from '../../motion/types';
import type { ResolvedValues } from '../types';
import { buildHTMLStyles } from './utils/build-styles.js';
import { createHtmlRenderState } from './utils/create-render-state.js';
import type { HTMLAttributes } from 'svelte/elements';

export function copyRawValuesOnly(
	target: ResolvedValues,
	source: { [key: string]: string | number | MotionValue },
	props: MotionProps
) {
	for (const key in source) {
		if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
			target[key] = source[key] as string | number;
		}
	}
}

function useInitialMotionValues({ transformTemplate }: MotionProps, visualState: ResolvedValues) {
	const memo = (_visualState: typeof visualState) => {
		const state = createHtmlRenderState();

		buildHTMLStyles(state, _visualState, transformTemplate);

		return Object.assign({}, state.vars, state.style);
	};
	let visualProps = memo(visualState);

	tick().then(() => (visualProps = memo(visualState)));

	return visualProps;
}

function useStyle(props: MotionProps, visualState: ResolvedValues): ResolvedValues {
	const styleProp = props.style || {};
	const style = {};

	/**
	 * Copy non-Motion Values straight into style
	 */
	copyRawValuesOnly(style, styleProp as any, props);

	Object.assign(style, useInitialMotionValues(props, visualState));

	return style;
}

export function useHTMLProps(props: MotionProps & HTMLAttributes<HTMLElement>, visualState: ResolvedValues) {
	// The `any` isn't ideal but it is the type of createElement props argument
	const htmlProps: any = {};
	const style = useStyle(props, visualState);

	if (props.drag && props.dragListener !== false) {
		// Disable the ghost element when a user drags
		htmlProps.draggable = false;

		// Disable text selection
		style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = 'none';

		// Disable scrolling on the draggable direction
		style.touchAction = props.drag === true ? 'none' : `pan-${props.drag === 'x' ? 'y' : 'x'}`;
	}

	if (props.tabindex === undefined && (props.onTap || props.onTapStart || props.whileTap)) {
		htmlProps.tabIndex = 0;
	}

	htmlProps.style = style;

	return htmlProps;
}
