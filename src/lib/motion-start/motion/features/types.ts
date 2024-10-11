/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Component } from 'svelte';
import type { CreateVisualElement, VisualElement } from '../../render/types';
import type { MotionProps, Ref } from '../types';
import type { VisualState } from '../utils/use-visual-state';
/**
 * @public
 */
export interface FeatureProps {
	props: MotionProps;
	visualElement: VisualElement;
	isCustom: any;
}
export type FeatureNames = {
	animation: true;
	exit: true;
	drag: true;
	tap: true;
	focus: true;
	hover: true;
	pan: true;
	layoutAnimation: true;
	measureLayout: true;
};
export type FeatureComponent = Component<FeatureProps>;
/**
 * @public
 */
export interface FeatureDefinition {
	isEnabled: (props: MotionProps) => boolean;
	Component?: FeatureComponent;
}
export interface FeatureComponents {
	animation?: FeatureComponent;
	exit?: FeatureComponent;
	drag?: FeatureComponent;
	tap?: FeatureComponent;
	focus?: FeatureComponent;
	hover?: FeatureComponent;
	pan?: FeatureComponent;
	layoutAnimation?: FeatureComponent;
	measureLayout?: FeatureComponent;
}
export interface FeatureBundle extends FeatureComponents {
	renderer: CreateVisualElement<any>;
}
export type LazyFeatureBundle = () => Promise<FeatureBundle>;
export type FeatureDefinitions = {
	[K in keyof FeatureNames]: FeatureDefinition;
};

export type RenderComponent<Instance, RenderState> = (
	Component: string | Component,
	props: MotionProps,
	ref: Ref<Instance>,
	visualState: VisualState<Instance, RenderState>,
	isStatic: boolean
) => any;
