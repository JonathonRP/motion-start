/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionProps } from '../types';
import type { CreateVisualElement, VisualElement } from '../../render/types';
import type { VisualState } from './use-visual-state';
import type { Component } from 'svelte';

export type useVisualElement = <Instance, RenderState>(
	Component: string | Component,
	visualState: VisualState<Instance, RenderState>,
	props: MotionProps,
	createVisualElement?: CreateVisualElement<Instance>
) => VisualElement<Instance> | undefined;

export { default as UseVisualElement } from './UseVisualElement.svelte';
