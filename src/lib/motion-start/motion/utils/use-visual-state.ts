/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { ResolvedValues, ScrapeMotionValuesFromProps } from '../../render/types';
import type { MotionProps } from '../types';
import { isAnimationControls } from '../../animation/utils/is-animation-controls.js';
import { resolveVariantFromProps } from '../../render/utils/resolve-variants.js';
import {
	isControllingVariants as checkIsControllingVariants,
	isVariantNode as checkIsVariantNode,
} from '../../render/utils/is-controlling-variants.js';
import { resolveMotionValue } from '../../value/utils/resolve-motion-value.js';
import { MotionContext, type MotionContextProps } from '../../context/MotionContext';
import { PresenceContext, type PresenceContextProps } from '../../context/PresenceContext';
import { getContext, tick } from 'svelte';
import { get, type Writable } from 'svelte/store';

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
	props: MotionProps,
	isStatic: boolean
) => VisualState<Instance, RenderState>;

function makeState<I, RS>(
	{ scrapeMotionValuesFromProps, createRenderState, onMount }: UseVisualStateConfig<I, RS>,
	props: MotionProps,
	context: MotionContextProps,
	presenceContext: PresenceContextProps | null
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
	(props: MotionProps, isStatic: boolean, isCustom = false): VisualState<I, RS> => {
		const context = getContext<Writable<MotionContextProps>>(MotionContext) || MotionContext(isCustom);
		const presenceContext = getContext<Writable<PresenceContextProps>>(PresenceContext) || PresenceContext(isCustom);
		const make = () => makeState(config, props, get(context), get(presenceContext));

		let state = make();

		tick().then(() => {
			if (!isStatic) {
				state = make();
			}
		});

		return state;
	};

function makeLatestValues(
	props: MotionProps,
	context: MotionContextProps,
	presenceContext: PresenceContextProps | null,
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
					/**
					 * Take final keyframe if the initial animation is blocked because
					 * we want to initialise at the end of that blocked animation.
					 */
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
