/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createRendererMotionComponent, type MotionComponentProps } from '../../motion/index.svelte.js';
import type { DOMMotionComponents } from '../dom/types.js';
import type { CreateVisualElement } from '../types.js';
import type { FeaturePackages } from '../../motion/features/types.js';
import { isSVGComponent } from '../dom/utils/is-svg-component.js';
import { svgMotionConfig } from '../svg/config-motion.js';
import { htmlMotionConfig } from '../html/config-motion.js';
import { createUseRender } from '../dom/use-render.js';
import type { Component } from 'svelte';

export function createMotionComponentFactory(
	preloadedFeatures?: FeaturePackages,
	createVisualElement?: CreateVisualElement<Element>
) {
	function createMotionComponent<TagName extends keyof DOMMotionComponents>(
		Component: TagName,
		options?: { forwardMotionProps?: boolean }
	): DOMMotionComponents[TagName];

	function createMotionComponent<TagName extends string>(
		Component: TagName,
		options?: { forwardMotionProps?: boolean }
	): Component<MotionComponentProps<Record<string, unknown>>>;

	function createMotionComponent<Props extends Record<string, unknown>>(
		Component: Component<Props>,
		options?: { forwardMotionProps?: boolean }
	): Component<MotionComponentProps<Props>>;

	function createMotionComponent(
		Component: string | Component<Record<string, unknown>>,
		{ forwardMotionProps }: { forwardMotionProps?: boolean } = {}
	): Component<Record<string, unknown>> {
		const baseConfig = isSVGComponent(Component as string) ? svgMotionConfig : htmlMotionConfig;

		const config = {
			...baseConfig,
			preloadedFeatures,
			useRender: createUseRender(forwardMotionProps ?? false),
			createVisualElement,
			Component,
		};

		return createRendererMotionComponent(
			config as unknown as Parameters<typeof createRendererMotionComponent>[0]
		) as Component<Record<string, unknown>>;
	}

	return createMotionComponent;
}
