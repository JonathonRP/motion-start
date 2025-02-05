/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionProps } from '../types';
import type { VisualState } from '../utils/use-visual-state';
import type { VisualElement } from '../../render/VisualElement';
import type { CreateVisualElement } from '../../render/types';
import type { Feature } from './Feature';
import type MeasureLayout from './layout/MeasureLayout.svelte';
import type { Ref, RefCallBack } from '../../utils/safe-react-types';
import type { Component, Snippet } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

interface FeatureClass<I> {
	new (props: VisualElement<I>): Feature<I>;
}

export type HydratedFeatureDefinition<I> = {
	isEnabled: (props: MotionProps) => boolean;
	Feature: FeatureClass<I>;
	ProjectionNode?: any;
	MeasureLayout?: typeof MeasureLayout;
};

export interface HydratedFeatureDefinitions {
	animation?: HydratedFeatureDefinition<unknown>;
	exit?: HydratedFeatureDefinition<unknown>;
	drag?: HydratedFeatureDefinition<HTMLElement>;
	tap?: HydratedFeatureDefinition<Element>;
	focus?: HydratedFeatureDefinition<Element>;
	hover?: HydratedFeatureDefinition<Element>;
	pan?: HydratedFeatureDefinition<Element>;
	inView?: HydratedFeatureDefinition<Element>;
	layout?: HydratedFeatureDefinition<Element>;
}

export type FeatureDefinition = HydratedFeatureDefinitions[keyof HydratedFeatureDefinitions];

export type FeatureDefinitions = {
	[K in keyof HydratedFeatureDefinitions]: Expand<HydratedFeatureDefinitions[K]>;
};

export type FeaturePackage<T = FeatureDefinition> = {
	[K in keyof T as Exclude<K, 'isEnabled'>]: T[K];
};

export type FeaturePackages = {
	[K in keyof HydratedFeatureDefinitions]: Expand<FeaturePackage<Partial<HydratedFeatureDefinitions[K]>>>;
};

export interface FeatureBundle extends FeaturePackages {
	renderer: CreateVisualElement<any>;
}

export type LazyFeatureBundle = () => Promise<FeatureBundle>;

export type RenderComponent<Instance, RenderState> = Component<{
	Component: string;
	props: MotionProps;
	ref: Ref<Instance>;
	visualState: VisualState<Instance, RenderState>;
	isStatic: boolean;
	visualElement?: VisualElement<Instance>;
}>;
