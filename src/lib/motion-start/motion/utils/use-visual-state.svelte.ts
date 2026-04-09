/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { isAnimationControls } from '../../animation/utils/is-animation-controls.js';
import { type MotionContext, useMotionContext } from '../../context/MotionContext';
import { usePresenceContext, type PresenceContext } from '../../context/PresenceContext.svelte';
import type { ResolvedValues, ScrapeMotionValuesFromProps } from '../../render/types';
import {
	isControllingVariants as checkIsControllingVariants,
	isVariantNode as checkIsVariantNode,
} from '../../render/utils/is-controlling-variants.js';
import { resolveVariantFromProps } from '../../render/utils/resolve-variants.js';
import { resolveMotionValue } from '../../value/utils/resolve-motion-value.js';
import type { MotionProps } from '../types';

export interface VisualState<Instance, RenderState> {
	renderState: RenderState;
	latestValues: ResolvedValues;
	mount?: (instance: Instance) => void;
}
export interface UseVisualStateConfig<Instance, RenderState> {
	scrapeMotionValuesFromProps: ScrapeMotionValuesFromProps;
	createRenderState: () => RenderState;
	onMount?: (props: MotionProps, instance: Instance, visualState: VisualState<Instance, RenderState>) => void;
}
export type makeUseVisualState = <I, RS>(config: UseVisualStateConfig<I, RS>) => UseVisualState<I, RS>;

export type UseVisualState<Instance, RenderState> = (
	props: () => MotionProps,
	isStatic: boolean
) => VisualState<Instance, RenderState>;

function makeState<I, RS>(
	{ scrapeMotionValuesFromProps, createRenderState, onMount }: UseVisualStateConfig<I, RS>,
	props: MotionProps,
	context: MotionContext,
	presenceContext: PresenceContext | null
) {
	const state: VisualState<I, RS> = {
		latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps),
		renderState: createRenderState(),
	};

	if (onMount) {
		state.mount = (instance: I) => onMount(props, instance, state);
	}

	return state;
}

export const makeUseVisualState =
	<I, RS>(config: UseVisualStateConfig<I, RS>): UseVisualState<I, RS> =>
	(props: () => MotionProps, isStatic: boolean): VisualState<I, RS> => {
		const context = useMotionContext();
		const presenceContext = usePresenceContext();
		const make = () => makeState(config, props(), context, presenceContext);

		/**
		 * Mirrors framer-motion's useConstant(make). VisualElement keeps latestValues
		 * by reference and mutates them in place during animation, so recreating the
		 * state on every props change would drop in-flight animated styles.
		 */
		const state = make();

		return isStatic ? make() : state;
	};

function makeLatestValues(
	props: MotionProps,
	context: MotionContext,
	presenceContext: PresenceContext | null,
	scrapeMotionValues: ScrapeMotionValuesFromProps
) {
	const values: ResolvedValues = {};

	const motionValues = scrapeMotionValues(props, {});
	for (const key in motionValues) {
		values[key] = resolveMotionValue(motionValues[key]);
	}

	let { initial, animate } = props;
	const isControllingVariants = checkIsControllingVariants(props);
	const isVariantNode = checkIsVariantNode(props);

	if (context && isVariantNode && !isControllingVariants && props.inherit !== false) {
		if (initial === undefined) initial = context.initial;
		if (animate === undefined) animate = context.animate;
	}

	let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === false : false;

	isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;

	const variantToSet = isInitialAnimationBlocked ? animate : initial;

	if (variantToSet && typeof variantToSet !== 'boolean' && !isAnimationControls(variantToSet)) {
		const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
		list.forEach((definition) => {
			const resolved = resolveVariantFromProps(props, definition);
			if (!resolved) return;

			const { transitionEnd, transition, ...target } = resolved;
			for (const key in target) {
				let valueTarget = target[key as keyof typeof target];

				if (Array.isArray(valueTarget)) {
					// If the initial animation is blocked, initialise from the final keyframe
					// so blocked entrance animations still start at their resolved end state.
					const index = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
					valueTarget = valueTarget[index];
				}

				if (valueTarget !== null) {
					values[key] = valueTarget as string | number;
				}
			}
			for (const key in transitionEnd)
				values[key] = transitionEnd[key as keyof typeof transitionEnd] as string | number;
		});
	}

	return values;
}
