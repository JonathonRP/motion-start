/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { ResolvedValues, ScrapeMotionValuesFromProps } from '../../render/types';
import type { MotionProps } from '../types';
import { default as UseVisualStateComp } from './UseVisualState.svelte';

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

export const UseVisualState = UseVisualStateComp as typeof UseVisualStateComp;
